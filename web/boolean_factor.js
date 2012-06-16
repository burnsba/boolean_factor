////////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2012 Ben Burns
// benjaminaburns@gmail.com 
//
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the "Software"), to deal 
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////
//
// Depends on: expression.js (helper_functions.js, recursive_common.js)
//             helper_functions.js
//             recursive_common.js
//
// Quick summary: this file has a few functions that deal with simplifying boolean 32-bit
//     phrases. See the BF object below or the html file for a list of identities supported.
//
// Quick start: call do_the_factor with a phrase to be simplified; returns the result as a string
//
// Other notes: 1-bit numbers could be supported by changing MAX_TRUE to 0x1, and writing
//     code for A^1=~A
//     -- Simplification will probably fail when applying one of the below rules 
//	  and it splits the expression over an operator	of similar precendece. For 
//	  example, "A | A ^ B = A | B" generally works, except when the "A" part 
//	  contains more "|" operators. Example: "A is X | Z, B is Y -> 
//	  (X | Z) | Y ^ (X | Z)" does not currently get simplified.
//     -- Some expressions are equivalent, but will give different results 
//	  depending on which token comes first lexicographically. The following are 
//	  expressions which fall in this cataegory:
//	  ~A & ~B | A & B = ~A ^ B = A ^ ~B
//	  ~(A ^ B) = ~A ^ B = A ^ ~B
//
// Changes:
// 2012.06.15 
//     -- Added several more simplifications; added some unit tests
// 2012.06.14
//     -- rrotate_32 uses unsigned right shift now
// 2012.06.05
//     -- Entirely changed how two tiered expressions are simplified (e.g., A|A&B=A).
//        Some set functions are now used (intersect, union, xor) which means phrases
//        with more than four variables can now be simplified. E.g., 
//        A&B&C|A&B&C&D&E&F&G&H = A&B&C
//     -- Can also undistribute constants over AND to simplify.
// 2012.06.03
//     -- Added support for simplifing phrases with known values, e.g., '3^7' = 4
// 2012.06.02
//    -- Changed distribute_over and how it handles ROT
// 2012.05.28 
//    -- Added function distribute_over to expand phrases such as A&(B|C) to A&B | A&C
//    -- Should work over OR, but that's untested

var MAX_TRUE = ("0xffffffff").toString(32);

// for telling the functions below what to do
var BF =  {
	/* Only children of an operator */
	SIMPLIFY_B_AND_ID: {		/* simplify bitwise AND identidies */
		N: 5,
		OP: ["&"]
	},
	SIMPLIFY_B_XOR_ID: {		/* simplify bitwise XOR identidies */
		N: 10,
		OP: ["^"]
	},
	SIMPLIFY_B_OR_ID: {		/* simplify bitwise OR identidies */
		N: 15,
		OP: ["|"]
	},
	SIMPLIFY_B_ROT_ID: {		/* simplify bitwise ROT identidies */
		N: 20,
		OP: [">"]
	},
	// warning! not implemented
	SIMPLIFY_NOT: {			/* ~(~A) = A */
		N: 25,
		/* not a binary operator */
		OP: [""]
	},
	
	/* Look at children and grandchildren */
	SIMPLIFY_B_XOR: {		/* A&~B | ~A&B = A^B */
		N: 105,			/* ~A&~B | A&B = ~A&B */
		OP: ["|", "&"]
	},
	SIMPLIFY_B1_a: {		/* A&B | A&~B = A */
		N: 110,
		OP: ["|", "&"]
	},
	SIMPLIFY_B1_b: {		/* (A|B) & (A|~B) = A */
		N: 112,
		OP: ["&", "|"]
	},
	SIMPLIFY_B1_c: {		/* A & B ^ A & ~B = A */
		N: 113,
		OP: ["^", "&"]
	},
	SIMPLIFY_B2_a: {		/* A | A&B = A */
		N: 114,
		OP: ["|", "&"]
	},
	SIMPLIFY_B2_b: {		/* A & (A|B) = A */
		N: 116,
		OP: ["&", "|"]
	},
	SIMPLIFY_B3_a: {		/* A | ~A&B = A|B */
		N: 118,			/* ~A | A&B = ~A|B */
		OP: ["|", "&"]
	},
	// not necessary
	SIMPLIFY_B3_b: {		/* A & (~A|B) = A&B */
		N: 120,			/* ~A & (A|B) = ~A&B */
		OP: ["&", "|"]
	},
	// not necessary
	SIMPLIFY_B3_c: {		/* A & (~A ^ B) = A & B */
		N: 124,
		OP: ["&", "^"]
	},
	SIMPLIFY_B4_a: {		/* A ^ A & B = A & ~B */
		N: 150,
		OP: ["^", "&"]
	},
	SIMPLIFY_B4_b: {		/* A ^ A & ~B = A & B */
		N: 152,
		OP: ["^", "&"]
	},
	// special case of SIMPLIFY_B3
	SIMPLIFY_B5: {			/* A ^ ~A & B = A | B */
		N: 154,
		OP: ["^", "&"]
	},
	SIMPLIFY_B6: {			/* A | A ^ B = A | B */
		N: 156,
		OP: ["|", "^"]
	},
	
	DISTRIBUTE_AND: {		/* (A|B)&C = A&C | B&C */
		N: 205,			/* (A^B)&C = A&C ^ B&C */
		OP: ["&"]
	},
	// warning! not fully implemented
	DISTRIBUTE_ROT: {		/* (A&B)>C = A>C & B>C */
		N: 220,			/* (A^B)>C = A>C ^ B>C */
		OP: [">"]		/* (A|B)>C = A>C | B>C */
	},
	// warning! not implemented
	DISTRIBUTE_NOT: {		/* ~(A&B) = ~A | ~B */
		N: 225,			/* ~(A|B) = ~A & ~B */
					/* ~(A^B) = ~A ^ B */
					/* ~(A>B) = ~A > B */
		/* not a binary operator */
		OP: [""]
	},
	// warning! not implemented
	UNDISTRIBUTE_AND: {		/* A&C | B&C = (A|B)&C */
		N: 255,			/* A&C ^ B&C = (A^B)&C */
		OP: ["&"]
	},
	
	MATH_UNDISTRIBUTE_AND_a: {	/* X&C ^ Y&C = Z&C */
		N: 305,			/* where X,Y are known */
		OP: ["^", "&"]
	},
	MATH_UNDISTRIBUTE_AND_b: {	/* X&C | Y&C = Z&C */
		N: 307,			/* where X,Y are known */
		OP: ["|", "&"]
	},
	
	
	// not used
	SIMPLIFY_B_ALL: 999
}

// wrapper function for the simplification functions below.
// call with a text string, e.g. do_the_factor("A&B")
// and will return the result as a string
function do_the_factor(input)
{
	var ex = new Expression(input);
	if (!ex.is_valid())
		return "Expression is not well formed.";
		
	ex.build_tree();
	
	//ex.clean_flagged_children();
	
	ex.apply_function(boolean_factor, BF.SIMPLIFY_B_AND_ID.OP[0], BF.SIMPLIFY_B_AND_ID);
	ex.apply_function(boolean_factor, BF.SIMPLIFY_B_XOR_ID.OP[0], BF.SIMPLIFY_B_XOR_ID);
	ex.apply_function(boolean_factor, BF.SIMPLIFY_B_OR_ID.OP[0], BF.SIMPLIFY_B_OR_ID);
	ex.apply_function(boolean_factor, BF.SIMPLIFY_B_ROT_ID.OP[0], BF.SIMPLIFY_B_ROT_ID);
	
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B_XOR.OP[0], BF.SIMPLIFY_B_XOR);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B1_a.OP[0], BF.SIMPLIFY_B1_a);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B1_b.OP[0], BF.SIMPLIFY_B1_b);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B1_c.OP[0], BF.SIMPLIFY_B1_c);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B2_a.OP[0], BF.SIMPLIFY_B2_a);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B2_b.OP[0], BF.SIMPLIFY_B2_b);
	// redundant
	//ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B3_a.OP[0], BF.SIMPLIFY_B3_a);
	//ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B3_b.OP[0], BF.SIMPLIFY_B3_b);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B3_c.OP[0], BF.SIMPLIFY_B3_c);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B4_a.OP[0], BF.SIMPLIFY_B4_a);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B4_b.OP[0], BF.SIMPLIFY_B4_b);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B5.OP[0], BF.SIMPLIFY_B5);
	ex.apply_function(boolean_factor_two, BF.SIMPLIFY_B6.OP[0], BF.SIMPLIFY_B6);

	ex.apply_function(distribute_over, BF.DISTRIBUTE_AND.OP[0], BF.DISTRIBUTE_AND);
	ex.apply_function(distribute_over, BF.DISTRIBUTE_ROT.OP[0], BF.DISTRIBUTE_ROT);
	
	ex.apply_function(boolean_factor_two, BF.MATH_UNDISTRIBUTE_AND_a.OP[0], BF.MATH_UNDISTRIBUTE_AND_a);
	ex.apply_function(boolean_factor_two, BF.MATH_UNDISTRIBUTE_AND_b.OP[0], BF.MATH_UNDISTRIBUTE_AND_b);
	
	ex.make_pretty();

	return ex.get_my_value();
}
	
// This function takes an input expression and attempts to simplify based on what_to_do
// (see the object BF).
// This function does _not_ check to see that the parent expression is of the apprpriate operator,
// so, for example, it is possible to call this function to check for XOR identities on a phrase
// such as A&A which in this case would return "0".
// If the input expression is changed, this is rebuilt and all parents are flagged.
// The entire expression tree is _not_ rebuilt.
// This function handles expressions of the form A⊛B⊛C ... n
// where:
// -- ⊛ is a binary operator. 
// -- A,B,C ... n are treated as single tokens, e.g. A=(x1&x2^x3) or B=~x1
function boolean_factor(input, what_to_do)
{
	// (hide this from general use)
	// Removes duplicates of the specified input phrase from this until 
	// there is only one copy of input left
	var remove_somethings = function m_remove_somethings(input)
	{
		var before = [];
		var after = [];
		// note: don't turn an array containing only "0" into ""
		while(this.indexOf(input) > -1 && this.length > 1)
		{
			var pos = this.indexOf(input);
			before = this.slice(0, pos);
			after = this.slice(pos+1, this.length);
			
			// rebuild this
			while(this.length>0)
				this.pop();
			while(before.length>0)
				this.push(before.pop());
			while(after.length>0)
				this.push(after.pop());
		}
	} // end internal function
	
	if (input == null)
		return;
	if (!isExpression(input))
		return;
	// can't simplify only one token
	if (input.get_children_length() < 2)
		return;
	
	var i;
	// store all children my_value's
	var child_values = input.get_children_values();
	// log this for doing a quick check for changes later
	var start_count = input.get_children_length();
	
	// begin simplification process	
	
	// note: inside each what_to_do, the cases are handled in different
	// orders. This is done to reduce the number of times the parent
	// function has to be called before the expression is in the most
	// reduced format.
	
	// AND identities
	if (what_to_do == BF.SIMPLIFY_B_AND_ID)
	{
		do {
		// A & ~A = 0
		child_values = replace_token_and_negative_with_x(child_values, "0");
		// A & 0 = 0
		if (child_values.indexOf("0") > -1 || child_values.indexOf("0x0") > -1)
		{
			child_values = ["0"];
			break;
		}
		// A & A = A
		child_values = get_unique_tokens(child_values);
		// A & 1 = A
		remove_somethings.call(child_values, MAX_TRUE);
		// simplify known values
		child_values = do_math(child_values, what_to_do);
		} while(false);
	}
	// XOR identities
	else if (what_to_do == BF.SIMPLIFY_B_XOR_ID)
	{
		// A ^ 0 = A
		remove_somethings.call(child_values, "0");
		// A ^ A = 0
		child_values = xor_factor(child_values);
		// A ^ ~A = 1 (MAX_TRUE)
		// only call this after the above
		child_values = replace_token_and_negative_with_x(child_values, MAX_TRUE);
		// A ^ 1 = ~A
			// doesn't really work for 32 bit numbers (array of 32 1-bit numbers) ... right?
		// simplify known values
		child_values = do_math(child_values, what_to_do);
	}
	// OR identities
	else if (what_to_do == BF.SIMPLIFY_B_OR_ID)
	{
		do {
		// A | ~A = 1 (MAX_TRUE)
		child_values = replace_token_and_negative_with_x(child_values, MAX_TRUE);
		// A | 1 = 1 (MAX_TRUE)
		if (child_values.indexOf(MAX_TRUE) > -1)
		{
			child_values = [MAX_TRUE];
			break;
		}
		// A | 0 = A
		remove_somethings.call(child_values, "0");
		// A | A = A
		child_values = get_unique_tokens(child_values);
		// simplify known values
		child_values = do_math(child_values, what_to_do);
		} while (false);
	}
	// (A > X) > Y = A > (X+Y%32) where X and Y are known
	else if (what_to_do == BF.SIMPLIFY_B_ROT_ID)
	{
		child_values = rot_factor(child_values);
		// simplify known values
		child_values = do_math(child_values, what_to_do);
	}
	
	// end simplification process
				
	// if there are the same number of tokens as we started with, don't do anything else
	if (child_values.length == start_count)
		return;
	
	// looks like this my_value needs to be rebuilt
	input.set_my_value_from_array(child_values);
	input.set_operator("");
	input.build_tree();
}

// This function takes an input expression and attempts to simplify based on what_to_do
// (see the object BF).
// This function does _not_ check to see that the parent expression is of the apprpriate operator,
// so, for example, it is possible to call this function to check for XOR identities on a phrase
// such as "A&A" which in this case would return "0".
// If the input expression is changed, this is rebuilt and all parents are flagged.
// The entire expression tree is _not_ rebuilt.
// This function handles expressions of the form A⊛B⊡C⊛D
// where:
// -- ⊛ is a binary operator. 
// -- ⊡ is a lower precedent binary operator
// -- A,B,C,D are treated as single tokens, e.g. A=(x1&x2^x3) or B=~x1
// ---- D is optional
// ---- Both A⊛B⊡C and A⊡B⊛C are acceptable
function boolean_factor_two(input, what_to_do)
{
	if (input == null)
		return;
	if (!isExpression(input))
		return;
	// can't simplify only one token
	if (input.get_children_length() < 2)
		return;

	var i, j, num_grandchildren;
	var position, compare_to_position;

	// will store all children my_value's
	var child_values = [];
	// will be the child values of the item being compared to
	var comp_child_values = [];

	var new_value = "";
	var op_count = 0;

	// Since it's possible for children to change during this loop, look
	// up the number of children each time.
	for (position=0; position<input.get_children_length(); position++)
	{
		child_values = [];
		// more than one child
		if (input.get_child(position).get_children_length() > 1)
		{
			// check if this is a complex expression, or something to split
			if (input.get_child(position).get_operator() != what_to_do.OP[1])
				child_values.push(input.get_child(position).get_my_value());
			else
				child_values = input.get_child(position).get_children_values();
		}
		else
		{
			// only one child
			child_values.push(input.get_child(position).get_my_value());
		}

		// going to need to compare each child to every single child after it
		for (compare_to_position=position+1; compare_to_position<input.get_children_length(); compare_to_position++)
		{
			comp_child_values = [];
			// more than one child
			if (input.get_child(compare_to_position).get_children_length() > 1)
			{
				// check if this is a complex expression, or something to split
				if (input.get_child(compare_to_position).get_operator() != what_to_do.OP[1])
					comp_child_values.push(input.get_child(compare_to_position).get_my_value());
				else
					comp_child_values = input.get_child(compare_to_position).get_children_values();
			}
			else
			{
				// only one child
				comp_child_values.push(input.get_child(compare_to_position).get_my_value());
			}

			new_value = "";	

			// ~A&B | A&~B = A^B 
			// ~A&~B | A&B = ~A^B
			if (what_to_do == BF.SIMPLIFY_B_XOR)
			{
				// will take exactly four items, two on each side of the "|"
				if (!(child_values.length == comp_child_values.length))
					continue;
				if (!(child_values.length == 2))
					continue;
				var arr_not = array_make_not(child_values);
				arr_not.sort(my_sort);
				// check that this is xor
				if (!(s_array_op(arr_not, comp_child_values, "x", my_sort).length == 0))
					continue;

				new_value = child_values[1] + "^" + comp_child_values[0];
			}
			/* A&B | A&~B = A */
			/* (A|B) & (A|~B) = A */
			/* A & B ^ A & ~B = A */
			else if (what_to_do == BF.SIMPLIFY_B1_a || what_to_do == BF.SIMPLIFY_B1_b || what_to_do == BF.SIMPLIFY_B1_c)
			{
				if (!(child_values.length == comp_child_values.length))
					continue;
				// A part
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (!(inter.length > 0))
					continue;

				// B part (or ~B)
				var else_1 = s_array_op(inter, child_values, "x", my_sort);
				// ~B part (or B)
				var else_2 = s_array_op(inter, comp_child_values, "x", my_sort);

				// make sure this expression is of the form
				// A ⊛ B ⊡ A ⊛ ~B
				if (!(are_compliments(else_1[0], else_2[0])))
					continue;
				if (!(else_1.length == 1 && else_1.length == else_2.length))
					continue;
				if (!(child_values.length == comp_child_values.length))
					continue;

				// copy to result from A
				for (var k=0; k<inter.length; k++)
				{
					new_value += inter[k];
					if (k < inter.length - 1)
					{
						new_value += what_to_do.OP[1];
					}
				}
			}
			/* A | A&B = A */
			/* A & (A|B) = A */
			else if (what_to_do == BF.SIMPLIFY_B2_a || what_to_do == BF.SIMPLIFY_B2_b)
			{
				// A part
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (inter.length == 0)
					continue;
				// nothing part (or B)
				var else_1 = s_array_op(inter, child_values, "x", my_sort);
				// B part (or nothing)
				var else_2 = s_array_op(inter, comp_child_values, "x", my_sort);

				// either B or the nothing part must be length zero
				if (! ((else_1.length == 0 && else_2.length > 0) ||
							(else_1.length > 0 && else_2.length == 0)))
					continue;

				for (var k=0; k<inter.length; k++)
				{
					new_value += inter[k];
					if (k < inter.length - 1)
					{
						new_value += what_to_do.OP[1];
					}
				}
			}
			/* A | A ^ B = A | B */
			else if (what_to_do == BF.SIMPLIFY_B6)
			{
				// A part
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (inter.length == 0)
					continue;
				// nothing part (or B)
				var else_1 = s_array_op(inter, child_values, "x", my_sort);
				// B part (or nothing)
				var else_2 = s_array_op(inter, comp_child_values, "x", my_sort);

				// one of B part or nothing part must be length zero
				if (! ((else_1.length == 0 && else_2.length > 0) ||
							(else_1.length > 0 && else_2.length == 0)))
					continue;

				// A Part
				for (var k=0; k<inter.length; k++)
				{
					new_value += inter[k];
					if (k < inter.length - 1)
					{
						new_value += what_to_do.OP[0];
					}
				}
				new_value += what_to_do.OP[0];
				// B part
				var the_else;
				if (else_1.length > 0)
					the_else = else_1;
				else
					the_else = else_2;
				for (var k=0; k<the_else.length; k++)
				{
					new_value += the_else[k];
					if (k < the_else.length - 1)
					{
						new_value += what_to_do.OP[0];
					}
				}
			}
			/* A | ~A&B = A|B */
			/* A & (~A|B) = A&B */
			/* A & (~A ^ B) = A & B */
			// special case:
			/* A ^ ~A & B = A | B */
			else if (what_to_do == BF.SIMPLIFY_B3_a || what_to_do == BF.SIMPLIFY_B3_b || what_to_do == BF.SIMPLIFY_B3_c 
				|| what_to_do == BF.SIMPLIFY_B5)
			{
				// should be empty
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (inter.length > 0)
					continue;

				// need exactly one B
				if (!(child_values.length == 1 || comp_child_values.length == 1))
					continue;
				if (child_values.length == comp_child_values.length)
					continue;

				// find the A part (shorter)
				var shorter = child_values.length > comp_child_values.length ? comp_child_values : child_values;
				var longer = child_values.length > comp_child_values.length ? child_values : comp_child_values;

				// find the compliment of the shorter part
				var t_1 = [];
				t_1[0] = make_not(shorter[0]);
				// and it should be found in the longer part
				if (!(s_array_1_is_subset_of_2(t_1, longer)))
					continue;

				var the_else = s_array_op(t_1, longer, "x", my_sort);
				
				// make the A part contain no ~
				// and do it safely
				shorter = s_array_op(get_not_tokens_clean(shorter), get_tokens_less_nots(shorter), "u", my_sort);

				new_value += shorter;
				if (what_to_do == BF.SIMPLIFY_B5)
					new_value += "|"; 
				else
					new_value += what_to_do.OP[0];
				// use brackets just to be safe; will be fixed soon enough
				new_value += "(";
				for (var k=0; k<the_else.length; k++)
				{
					new_value += the_else[k];
					if (k < the_else.length - 1)
					{
						new_value += what_to_do.OP[1];
					}
				}
				new_value += ")";
			}
			/* A ^ A & B = A & ~B */
			/* A ^ A & ~B = A & B */
			else if (what_to_do == BF.SIMPLIFY_B4_a || what_to_do == BF.SIMPLIFY_B4_b)
			{
				// A part
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (inter.length == 0)
					continue;
				// nothing part (or B)
				var else_1 = s_array_op(inter, child_values, "x", my_sort);
				// B part (or nothing)
				var else_2 = s_array_op(inter, comp_child_values, "x", my_sort);
				// one of B part or nothing part must be length zero
				if (! ((else_1.length == 0 && else_2.length > 0) ||
							(else_1.length > 0 && else_2.length == 0)))
					continue;

				// append A part
				for (var k=0; k<inter.length; k++)
				{
					new_value += inter[k];
					if (k < inter.length - 1)
						new_value += what_to_do.OP[1];
				}
				// append B part
				var the_else;
				if (else_1.length > 0)
					the_else = else_1;
				else
					the_else = else_2;
				new_value += what_to_do.OP[1];
				new_value += "~(";
				for (var k=0; k<the_else.length; k++)
				{
					new_value += the_else[k];
					if (k < the_else.length - 1)
						new_value += what_to_do.OP[1];
				}
				new_value += ")";
			}
			/* X&C | Y&C = Z&C where Z=X|Y */
			/* X&C ^ Y&C = Z&C where Z=X^Y */
			else if (what_to_do == BF.MATH_UNDISTRIBUTE_AND_a || what_to_do == BF.MATH_UNDISTRIBUTE_AND_b)
			{
				// the C part
				var inter = s_array_op(child_values, comp_child_values, "i", my_sort);
				if (inter.length < 1)
					return;
				inter.sort(my_sort);

				// the X part
				var left_side = s_array_op(child_values, inter, "x", my_sort);
				// the Y part
				var right_side = s_array_op(comp_child_values, inter, "x", my_sort);
				var the_numbers = [];

				// make sure there is an X and Y part
				var undis = left_side.length > 0 && right_side.length > 0;
				if (!undis)
					continue;
				if (undis)
				{
					var t;
					for (var i=0; i<left_side.length; i++)
					{
						// add in the next number, or quit if it's not a number
						t = str_to_number(left_side[i]);
						if (!isNaN(t))
							the_numbers.push(t);
						else
						{
							undis = false;
							break;
						}
					}
				}
				if (!undis)
					continue;
				if (undis)
				{
					var t;
					for (var i=0; i<right_side.length; i++)
					{
						// add in the next number, or quit if it's not a number
						t = str_to_number(right_side[i]);
						if (!isNaN(t))
							the_numbers.push(t);
						else
						{
							undis = false;
							break;
						}
					}
				}
				if (!undis)
					continue;

				// math out those numbers
				var num_result = do_math(the_numbers, what_to_do);

				new_value += num_result[0] + what_to_do.OP[1];
				// minus two since already added the numeric result
				op_count = inter.length - 1;
				for (var k=0; k<inter.length; k++)
				{
					new_value += inter[k];
					if (op_count > 0)
					{
						new_value += what_to_do.OP[1];
						op_count--;
					}
				}
			}

			// anything change?
			if (new_value == "")
				continue;

			// find which child to remove
			var right_most = position > compare_to_position ? position : compare_to_position;
			var left_most = position > compare_to_position ? compare_to_position : position;
			// get rid of that second child
			input.remove_child(right_most);
			// and rebuild!
			input.get_child(left_most).set_my_value(new_value);
			input.get_child(left_most).set_operator("");
			input.get_child(left_most).build_tree();
			
		}
	}
}

// this function will take an input array of tokens and attempt to simplify values that
// are known. Returns the result as an array
// examples: (for &) ["0x7", "A", "0x4"] => ["0x4", "A"]
function do_math(input, what_to_do)
{
	if (input == null)
		return [];
	if (!isArray(input))
		return [];
	if (input.length == 0)
		return [];
	if (input.length == 1)
		return input;

	var out = [];
	var math_func; // will be the math function A&B or similar
	var final_num = 0;

	// special case
	if (what_to_do == BF.SIMPLIFY_B_ROT_ID)
	{
		var p1 = str_to_number(input[0]);
		var p2 = make_32_clean(str_to_number(input[1]));
		var start_index = 0;

		// both p1 and p2 are numbers
		if (!isNaN(p1) && !isNaN(p2))
		{
			out.push("0x" + rrotate_32(p1, p2).toString(16));
			start_index = 2;
		}
		for (var i=start_index; i<input.length; i++)
			out.push(input[i]);
		return out;
	}

	// set up the starting conditions or return
	switch(what_to_do)
	{
		case (BF.SIMPLIFY_B_AND_ID):
		case (BF.MATH_UNDISTRIBUTE_AND_a):
		case (BF.MATH_UNDISTRIBUTE_AND_b):		// fallthrough
			final_num = MAX_TRUE;
			math_func = function(a,b) { return (a&b)>>>0; };
			break;
		case (BF.SIMPLIFY_B_XOR_ID):
			final_num = 0; 
			math_func = function(a,b) { return (a^b)>>>0; };
			break;
		case (BF.SIMPLIFY_B_OR_ID):
			final_num = 0;
			math_func = function(a,b) { return (a|b)>>>0; };
			break;
		default:
			return input;
	}

	// math it all out
	var use_final_num = false;
	var this_in = "";
	for (var i=0; i<input.length; i++)
	{
		this_in = str_to_number(input[i]);
		if (isNaN(this_in))
			out.push(input[i]);
		else
		{	
			use_final_num = true;
			final_num = math_func(final_num, this_in);
		}
	}
	if (use_final_num)
	{
		if (final_num != 0)
			out.push("0x" + final_num.toString(16));
		else 
			out.push("0");
	}

	return out;
}

// attempts to expand phrases such as: A&(B|C) = A&B | A&C
// note that this should work for distributing over OR, by changing the "what_to_do != ..."
// line below, but that is not tested
function distribute_over(input, what_to_do)
{
	if (input == null)
		return;
	if (!isExpression(input))
		return;
	// can't simplify only one token
	if (input.get_children_length() < 2)
		return;
	if (what_to_do != BF.DISTRIBUTE_AND && 
		what_to_do != BF.DISTRIBUTE_ROT)
		return;
	
	if (what_to_do == BF.DISTRIBUTE_ROT)
		return m_distribute_rot(input, what_to_do);

	var i = -1, num_children = 0, num_grandchildren = 0;
	var distribute_to = 0, op_count = 0;
	var append_phrase = "";
	var new_value = "";
	
	num_children = input.get_children_length();
	
	// find the first node with children
	for (i=0; i<num_children; i++)
	{
		if (input.get_child(i).get_children_length() > 0)
		{
			var op_comp = op_order_compare_1_to_2(what_to_do.OP[0], input.get_child(i).get_operator());
			if (op_comp == OP_ORDER.HIGHER || op_comp == OP_ORDER.EQUAL)
				break;
		}
	}
	// if none are found, return
	if (i == -1 || i >= num_children)
		return;
		
	distribute_to = i;

	// otherwise, there are three posibilities
	// 1) the first node has children. All following nodes will form one string to fold into the first
	// 2) the last node has children. All previous nodes will form one string to fold into the first
	// 3) a node in the middle has children. All nodes before and all nodes after will form one string to fold into the first
	
	// -2 since we're down one child
	op_count = num_children - 2;
	for (i=0; i<num_children; i++)
	{
		if (i == distribute_to)
			continue;
		append_phrase += input.get_child(i).get_my_value();
		if (op_count)
		{
			append_phrase += input.get_operator();
			op_count--;
		}
	}
	
	// now create the new phrase by adding append_phrase to each of distribute_to's children
	num_grandchildren = input.get_child(distribute_to).get_children_length();
	op_count = num_grandchildren - 1;
	for (i=0; i<num_grandchildren; i++)
	{
		new_value += "(";
		new_value += input.get_child(distribute_to).get_child(i).get_my_value();
		new_value += input.get_operator();
		new_value += append_phrase;
		new_value += ")";
		if (op_count)
		{
			new_value += input.get_child(distribute_to).get_operator();
			op_count--;
		}
			
	}
	// hey, we're done.
	input.set_my_value(new_value);
	input.set_operator("");
	input.build_tree();
}


// since rotate is not exactly a binary function in the same manner than &^| are,
// take care of distribution here.
// this should only ever be called by distribute_over
function m_distribute_rot(input, what_to_do)
{
	if (input == null)
		return;
	if (!isExpression(input))
		return;
	if (what_to_do != BF.DISTRIBUTE_ROT)
		return;
		
	var i = -1, num_children = 0, num_grandchildren = 0;
	var distribute_to = 0, op_count = 0;
	var append_phrase = "";
	var new_value = "";
	
	num_children = input.get_children_length();
	
	// don't bother trying to make this work correctly for
	// complex situations
	if (num_children > 2)
		return;
	
	// find the first node with children
	// start from the end, but not the last node
	for (i=num_children-2; i>-1; i--)
	{
		if (input.get_child(i).get_children_length() > 0)
		{
			var op_comp = op_order_compare_1_to_2(what_to_do.OP[0], input.get_child(i).get_operator());
			if (op_comp == OP_ORDER.HIGHER || op_comp == OP_ORDER.EQUAL)
				break;
		}
	}
	// if none are found, return
	if (i == -1)
		return;
		
	distribute_to = i;

	// otherwise, there are three posibilities
	// 1) the first node has children. All following nodes will form one string to fold into the first
	// 2) the last node has children. All previous nodes will form one string to fold into the first
	// 3) a node in the middle has children. All nodes before and all nodes after will form one string to fold into the first
	
	// -2 since we're down one child
	op_count = num_children - 2;
	for (i=0; i<num_children; i++)
	{
		if (i == distribute_to)
			continue;
		append_phrase += input.get_child(i).get_my_value();
		if (op_count)
		{
			append_phrase += input.get_operator();
			op_count--;
		}
	}
	
	// now create the new phrase by adding append_phrase to each of distribute_to's children
	num_grandchildren = input.get_child(distribute_to).get_children_length();
	op_count = num_grandchildren - 1;
	for (i=0; i<num_grandchildren; i++)
	{
		new_value += "((";
		new_value += input.get_child(distribute_to).get_child(i).get_my_value();
		new_value += ")";
		new_value += input.get_operator();
		new_value += append_phrase;
		new_value += ")";
		if (op_count)
		{
			new_value += input.get_child(distribute_to).get_operator();
			op_count--;
		}
			
	}
	// hey, we're done.
	input.set_my_value(new_value);
	input.set_operator("");
	input.build_tree();
}

// rotates right a number, and returns the output
// it's up to the calling function to pass reasonable
// values 
function rrotate_32(input, count)
{
	if (typeof(input) != "number")
		return NaN;
	if (typeof(count) != "number")	
		return NaN;

	// the >>> 0 chops the sign bit
	return ((input >>> count) | (input << (32 - count))) >>> 0;
}
