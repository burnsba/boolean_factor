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
// Depends on: helper_functions.js
//
// Quick summary: a few functions that are useful for bitwise expression manipulation
//
// Quick start:
//
// Other notes: 
//
//	var OP_ORDER
//		summary: helper object to deal with precedence
//	var my_sort
//		summary: helper function to call with .sort to deal with 
//			numbers, tokens, ~tokens, and bracket expressions
//
//	function are_compliments(input_a, input_b)
//		summary: safely checks whether the inputs are phrases that differ by 
//			only a not sign, or not sign and brackets
//		input: string, string
//		output: bool
//		error output: false
//	function are_negatives(input_a, input_b)
//		summary: safely checks whether the inputs are phrases that differ by 
//			only a minus sign, or minus sign and brackets
//		input: string, string
//		output: bool
//		error output: false
//      function array_make_not(input)
//		summary: applies the make_not function to each item in an array
//		input: array
//		output: array
//		error output: []
//	function bracket_safe_get_operators(input)
//		summary: returns operators outside the outermost brackets
//		input: string
//		output: array
//		error output: ""
//	function bracket_safe_split(input, split_char)
//		summary: takes the input string and splits it according to the split character
//			but only over the outermost brackets
//		input: string, string (one character)
//		output: string
//		error output: ""
//	function get_not_tokens(input)
//		summary: returns tokens that are negated
//		input: array
//		output: array
//		error output: [] 
//	function get_not_tokens_clean(input)
//		summary: returns tokens that are negated, less the not sign
//		input: array
//		output: array
//		error output: []
//      function get_tokens_clean(input)
//		summary: returns all tokens and unsafely removes all not signs
//		input: array
//		output: array
//		error output: array
//	function get_tokens_less_nots(input)
//		summary: returns all tokens that do not have a not sign in front
//		input: array
//		output: array
//		error output: []
//	function get_unique_boolean_operators(input)
//		summary: returns unique operators from OP_ORDER found in input
//		input: string
//		output: array
//		error output: []
//	function get_unique_boolean_tokens(input)
//		summary: returns whitespace separated tokens from a string
//		input: string
//		output: array
//		error output: array 
//	function has_binary_operators(input)
//		summary: returns whether operators from OP_ORDER are found in input
//		input: string
//		output: bool
//		error output: false
//	function is_operator(input)
//		summary: returns whether the input is found in OP_ORDER
//		input: string (one character)
//		output: bool
//		error output: false
//	function function make_32_clean(input)
//		summary: places a number between 0 and 31
//		input: number
//		output: number
//		error output: NaN
//      function make_not(input)
//		summary: prepends a not sign (safely) to input
//		input: string
//		output: string
//		error output: input
//	function m_safe_for_not(input)
//		summary: checks that complex expressions are bracketed
//		input: array
//		output: bool
//		error output: false
//	function op_order_compare_1_to_2(op_1, op_2)
//		summary: determines if the operators are higher, lower, or equal precedence
//		input: string (one character), string (one character)
//		output: OP_ORDER
//		error output: OP_ORDER
//	function operation_sort(input)
//		summary: returns the unique operators found from OP_ORDER in the input,
//			in order of precendence
//		input: string
//		output: array
//		error output: [] 
//	function remove_extra_brackets(input)
//		summary: safely removes unnecessary brackets per operation precendence in OP_ORDER
//		input: string
//		output: string
//		error output: ""
//	function replace_token_and_negative_with_x(input, replace_with)
//		summary: replaces all "X", "~X" pairs in input with replace_with
//		input: array, string
//		output: array
//		error output: array
//	function rot_factor(input)
//		summary: simplifies rotation phrases
//		input: array
//		output: array
//		error output: []
//	function xor_factor(input)
//		summary: filters out items from the input array that appear an even number
//			of times
//		input: array
//		output: array
//		error output: ["0"]
//
// Changes:
// 2012.06.10
//     -- Added unit tests for are_compliments, are_negatives and bracket_safe_split
// 2012.06.06
// 2012.06.05
//     -- Added get_not_tokens_clean, make_not, array_make_not
// 2012.06.02
//     -- Added rot_factor and unit tests. 
// 2012.06.01
//     -- Cleaned up the functions in this file and added better descriptions
//        of what each function does.
//     -- Added unit tests for the functions get_unique_boolean_tokens, 
//        get_unique_boolean_operators, has_binary_operators, is_operator,
//        operation_sort, xor_factor, m_safe_for_not, get_not_tokens,
//        get_not_tokens_clean, get_tokens_less_nots, bracket_safe_get_operators,
//        and remove_extra_brackets.
// 2012.05.30
//     -- refactoring

// (binary) operator order precedence
var OP_ORDER = {
	HIGHER: 2,
	EQUAL: 1,
	LOWER: 0,
	ERROR: -1,
	OPERATORS: [">", "&", "^", "|"], /* highest to lowest */
	ROPERATORS: ["|", "^", "&", ">"] /* lowest to highest */
}

// this is a helper function to be passed to the .sort() method
// it will put tokens in order such that:
// 1) normal javascript sorting is used unless the first two characters are a ~ or (
// 2) A token and its compliment are always next to each other
// 3) The compliment always comes after the token
// 4) Brackets are always sorted last
// 5) Both 2) and 3) apply to bracket phrases
var my_sort = function (a,b) 
{ 
	if (a == null && b == null)
		return 0;
	if (a == null)
		return 1;
	if (b == null)
		return -1;
	
	/* http://www.sitepoint.com/sophisticated-sorting-in-javascript/ */

	var x = a.toString().toLowerCase(), y = b.toString().toLowerCase(); 
	
	if (x[0] == "~" && y[0] != "~")
	{
		var xn = x.substring(1, x.length); // x not
		if (xn[0] == "(" && y[0] != "(")
		{
			var xnb = xn.substring(1, xn.length);	// x not bracket
			return xnb < y ? 1 : (xnb > y ? 1 : 0); 
		}
		else if (y[0] == "(" && xn[0] != "(")
		{
			var yb = y.substring(1, y.length);	// y bracket
			return xn < yb ? -1 : (xn > yb ? -1 : 0); 
		}
		return xn < y ? -1 : (xn > y ? 1 : 1); 
	}
	else if (y[0] == "~" && x[0] != "~")
	{
		var yn = y.substring(1, y.length);	// y not
		if (x[0] == "(" && yn[0] != "(")
		{
			var xb = x.substring(1, x.length);	// x bracket
			return xb < yn ? 1 : (xb > yn ? 1 : 0); 
		}
		else if (yn[0] == "(" && x[0] != "(")
		{
			var ynb = yn.substring(1, yn.length);	// y not bracket
			return x < ynb ? -1 : (x > ynb ? -1 : 0); 
		}
		return x < yn ? -1 : (x > yn ? 1 : -1); 
	}
	else if (x[0] == "(" && y[0] != "(")
	{
		var xb = x.substring(1, x.length);	// x bracket
		return xb < y ? 1 : (xb > y ? 1 : 0); 
	}
	else if (y[0] == "(" && x[0] != "(")
	{
		var yn = y.substring(1, y.length);	// y not bracket
		return x < yn ? -1 : (x > yn ? -1 : 0); 
	}
	
	// put numbers in order
	var c = str_to_number(a), d = str_to_number(b);
	if (!isNaN(c) && !isNaN(d))
	{
		return c < d ? -1 : (c > d ? 1 : 0); 
	}
	
	// warning: the following is no longer true:
	//// numbers need to come after other tokens for rotate right
	//if (isFinite(x) && !isFinite(y))
	//	return 1;
	//else if (isFinite(y) && !isFinite(x))
	//	return -1;
	
	// otherwise do the "normal" sort thing
	return x < y ? -1 : (x > y ? 1 : 0); 	
}

// determines if two tokens are the same except that one
// is preceded by a ~ character
function are_compliments(input_a, input_b)
{
	if (input_a == null || input_b == null)
		return false;
	if (typeof(input_a) != "string" || typeof(input_b) != "string")
		return false;
	if (input_a[0] == "~" && m_safe_for_not(input_a))
		return remove_extra_brackets(input_b) == remove_extra_brackets(input_a.substring(1, input_a.length));
	else if (input_b[0] == "~" && m_safe_for_not(input_b))
		return remove_extra_brackets(input_a) == remove_extra_brackets(input_b.substring(1, input_b.length));
	return false;
}


// determines if two tokens are the same except that one
// is preceded by a minus sign
function are_negatives(input_a, input_b)
{
	if (input_a == null || input_b == null)
		return false;
	if (typeof(input_a) != "string" || typeof(input_b) != "string")
		return false;
	if (input_a[0] == "-" && m_safe_for_not(input_a))
		return remove_extra_brackets(input_b) == remove_extra_brackets(input_a.substring(1, input_a.length));
	else if (input_b[0] == "-" && m_safe_for_not(input_b))
		return remove_extra_brackets(input_a) == remove_extra_brackets(input_b.substring(1, input_b.length));
	return false;
}

// applies the make_not function to each item in an array 
// (or returns an empty array):
//// takes an input string, and safely puts a ~ in front of the symbol. 
//// If there is already a ~, it is removed. Or returns the input.
function array_make_not(input)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
		
	var out = [], i;
	for (i=0; i<input.length; i++)
	{
		out.push(make_not(input[i]));
	}
	return out;
}

// takes an input string and returns all operators found
// but only over the outermost brackets
// examples: 
// "A | B" => ["|"]
// "A | B & (C|D)" => ["|", "&"]
// "(A | B) ^ C" => ["^"]
// "(A | B)" => [""]
function bracket_safe_get_operators(input)
{
	if (input == null)
		return [];
	if (input.length < 1)
		return [];
	if (has_binary_operators(input) == false)
		return [];
	
	var out = [];
	var position = 0;
	var open_bracket = 0;
	
	for (position=0; position<input.length; position++)
	{
		if (input[position] == "(")
			open_bracket++;
		else if (input[position] == ")")
			open_bracket--;

		if (open_bracket == 0)
			out.push(input[position]);
	}
	// need to remove multiple operators since the sort function does not
	out = get_unique_tokens(out);
	// operation_sort will place only the operators in an array
	// and sort that based on precedence; returns null on no 
	// operators found
	return operation_sort(out);
}

// takes an input string and splits it according to the split character
// but only over the outermost brackets
// examples: 
// "A | B | C" -> ["A","B","C"]
// "A | B&(C|D)" => ["A", "B&(C|D)"]
// "(C|D)" => ["C", "D"]
function bracket_safe_split(input, split_char)
{
	if (input == null)
		return "";
	if (typeof(input) != "string")
		return "";
	if (typeof(split_char) != "string")
		return input;
	if (split_char == null)
		return input;
	if (split_char.length < 1)
		return input;
		
	var out = [];
	var out_count = 0;
	var position = 0;
	var last_position = position;
	var open_bracket = 0;
	
	for (position=0; position<input.length; position++)
	{
		if (input[position] == "(")
		{
			open_bracket++;
		}
		else if (input[position] == ")")
		{
			open_bracket--;
		}
		else if (input[position] == split_char[0])
		{
			if (open_bracket == 0)
			{
				out[out_count] = input.substring(last_position, position);
				out_count++;
				last_position = position + 1;
			}
		}
	}
	
	if (last_position <= input.length)
		out[out_count] = input.substring(last_position, input.length);
	
	return out;
}

// takes an input array and returns the tokens that are negated
// example: ["A", "~B", "C", "~D", "~E&F", "~(G&H)"] => ["~B", "~D", "~(G&H)]
function get_not_tokens(input)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
		
	var out = [], i;
	for (i=0; i<input.length; i++)
	{
		if (input[i][0] == "~" && m_safe_for_not(input[i]))
			out.push(input[i]);
	}
	return out;
}

// takes an input array and returns the tokens that are negated
// less the not sign
// example: ["A", "~B", "C", "~D", "~E&F", "~(G&H)"] => ["B", "D", "(G&H)"]
function get_not_tokens_clean(input)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
		
	var out = [], i;
	for (i=0; i<input.length; i++)
	{
		if (input[i][0] == "~" && m_safe_for_not(input[i]))
			out.push(input[i].substring(1, input[i].length));
	}
	return out;
}

// returns all the tokens and removes not symbols
// this does no safety checking.
// example: ["A", "~B", "C", "~D", "~E&F", "~(G&H)"] => ["A", "B", "C", "D", "E&F", "(G&H)"]
function get_tokens_clean(input)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
		
	var out = [], i;
	for (i=0; i<input.length; i++)
	{
		if (input[i][0] == "~")
			out.push(input[i].substring(1, input[i].length));
		else
			out.push(input[i]);
	}
	return out;
}

// returns all the tokens that are not negated
// example: ["A", "~B", "C", "~D", "~E&F", "~(G&H)"] => ["A", "C"]
function get_tokens_less_nots(input)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
		
	var out = [], i;
	for (i=0; i<input.length; i++)
	{
		if (input[i][0] != "~")
			out.push(input[i]);
	}
	return out;
}

// returns all the boolean operators in a string (ignores brackets)
// also ignores objects, which arrays will sometimes pretend to be.
// returns an array, possibly empty, of the results.
function get_unique_boolean_operators(input)
{
	// note that because of the change to operation sort
	// only unique values are returned.
	return operation_sort(input);
}

// returns all the boolean variables in a string (ignores brackets)
// also ignores objects, which arrays will sometimes pretend to be.
// returns an array, possibly empty, of the results.
function get_unique_boolean_tokens(input)
{
	if (!input)
		return [];

	if (typeof(input) == "string")
	{
		var tokens = [];
		tokens = input.match(/[\w]+/g);
		return get_unique_tokens(tokens);
	}

	return [];
}

// warning: is > a binary operator?
// returns true if a binary operator is found in the input phrase,
// otherwise returns false (ignores brackets)
function has_binary_operators(input)
{
	if (input == null)
		return false;
	if (input.length < 0)
		return false;
	if (typeof(input) != "string")
		return false;
		
	var i = 0;
	for (i=0; i<OP_ORDER.OPERATORS.length; i++)
	{
		if (input.indexOf(OP_ORDER.OPERATORS[i]) > -1)
			return true;
	}

	return false;
}

// checks if input is in the list of known operators and returns true if found
// otherwise, returns false
function is_operator(input)
{
	if (OP_ORDER.OPERATORS.indexOf(input) > -1)
		return true;
	return false;
}

// takes an input number and places it between 0 and 31
// examples: 4 => 4, 31 => 31, 32 => 0, 33 => 1
// -1 => 31, -2 => 30, etc.
function make_32_clean(input)
{
	if (typeof(input) != "number")
		return NaN;

	// check for no change
	if (input >= 0 && input < 32)
		return input;
	// make positive
	while (input < 0)
		input += 32;
	// it was either negative, or larger than 32, so fix
	return input % 32;
}

// takes an input string, and safely puts a ~ in front of the symbol. 
// If there is already a ~, it is removed. Or returns the input.
function make_not(input)
{
	if (!input)
		return input;
	if (typeof(input) != "string")
		return input;

	// no ~, safe to ~
	if (input[0] != "~" && m_safe_for_not(input))
		return "~" + input;
	// already ~, safe to ~
	else if (input[0] == "~" && m_safe_for_not(input))
		return remove_extra_brackets(input.substring(1, input.length));
	// no ~, not safe to ~
	else if (input[0] != "~" && !m_safe_for_not(input))
		return "~(" + input + ")";
	// already ~, not safe to ~
	else if (input[0] == "~" && !m_safe_for_not(input))
		return "~(" + input + ")";

	else
		return input;
}

// helper function for dealing with strings that have a ~ sign
// if this is a simple phrase "~A" returns true. If this phrase
// will cause problems when searching for a simple compliment 
// such as "~A&B" return false. Unless this is a bracketed 
// expression, such as "~(A&B)", then return true.
// also works on minus signs.
function m_safe_for_not(input)
{
	if (typeof(input) != "string")
		return false;
	if (input.length < 1)
		return false;

	if (has_binary_operators(input) == false)
		return true;
	var i;
	for(i=0; i<input.length; i++)
	{
		if (is_operator(input[i]))
			return false;
		else if (input[i] == "(")
			return true;
	}
}

// compares two operators and returns:
// OP_ORDER.HIGHER if the first is higher precedence than the second
// OP_ORDER.EQUAL if the first is equal in precedence to the second
// OP_ORDER.LOWER if the first is lower in precedence than the second
// OP_ORDER.ERROR if either input is not an operator
function op_order_compare_1_to_2(op_1, op_2)
{
	if (!(is_operator(op_1)))
		return OP_ORDER.ERROR;
	if (!(is_operator(op_2)))
		return OP_ORDER.ERROR;
		
	// higher precedence is lower
	return OP_ORDER.OPERATORS.indexOf(op_1) < OP_ORDER.OPERATORS.indexOf(op_2) ? OP_ORDER.HIGHER :
		(OP_ORDER.OPERATORS.indexOf(op_1) > OP_ORDER.OPERATORS.indexOf(op_2) ? OP_ORDER.LOWER : OP_ORDER.EQUAL);
}

// sorts the found operators in order of precedence, and returns the result
// in a possibly-empty array.
function operation_sort(input)
{
	if (input == null)
		return [];
	if (input.length < 1)
		return [];
	var i = 0;
	var out = [];
	for (i=0; i<OP_ORDER.OPERATORS.length; i++)
	{
		if (input.indexOf(OP_ORDER.OPERATORS[i]) > -1)
			out.push(OP_ORDER.OPERATORS[i]);
	}

	if (out.length > 0)
		return out;
	else
		return [];
}

// attempts to remove unnecessary brackets
// e.g. (A) = A, (A&B)|C = A&B|C, etc.
function remove_extra_brackets(input)
{
	// for debugging
	//if (input == "(A)|(B)")
	//{
	//	var aaaaa = 0;
	//}
	
	if (input == null)
		return "";
	if (typeof(input) != "string")
		return "";
	if (input.length < 1)
		return "";
	
	var before_phrase = "";
	var current_phrase = "";
	var after_phrase = "";
	
	var position = 0;
	var i;
	
	var current_paren = -1;
	current_paren = input.indexOf("(");
	if (current_paren == -1)
		return input;
	if (current_paren + 1 > input.length)
		return input;

	var output = input;
	///*for debugging: */var safety = 0;
	var chopped_brackets_last_time = false;
	while (position < output.length)
	{
		// for debugging:
		//safety++;
		//if (safety>500)	return;
		
		// since i'm referencing the ouput, which can change if I'm chopping
		// brackets, I need to take into account how my position counter got
		// moved
		if (chopped_brackets_last_time)
		{
			chopped_brackets_last_time = false;
			position -= 2;
		}
		
		var bracket_count = 0;
		var found_a_bracket = false;
		// need to track whether or not a not sign precedes a bracket. In that case,
		// don't pull out the bracketed phrase.
		var pending_negation = false;
		// find the position of the next bracket phrase
		// using a simple stack to keep track of depth
		// need to make sure a bracket was found AND stack is empty before breaking
		for (; position<output.length; position++)
		{
			if (output[position] == "~")
				pending_negation = true;
			else if (output[position] == "(" && pending_negation == false)
			{
				// do not reset pending_negation
				bracket_count++;
				if (found_a_bracket == false)
				{
					current_paren = position;
					found_a_bracket=true;
				}
			}
			else if (output[position] == "(" && pending_negation)
			{
				bracket_count++;
			}
			else if (output[position] == ")")
			{
				bracket_count--;
				pending_negation = false;
			}
			else if (output[position] == " ")
			{
				// do not reset pending_negation
			}
			else
			{
				pending_negation = false;
			}
				
			if (bracket_count == 0 && found_a_bracket && pending_negation == false)
				break;
		}
		
		// it's posisble there is extra text after the last set of parentheses
		// in that case, don't process it (below)
		if (position >= output.length)
			return output;
		
		before_phrase = output.substring(0, current_paren);
		current_phrase = output.substring(current_paren, position+1);
		after_phrase = output.substring(position+1, output.length);

		var unique_tokens = get_unique_boolean_tokens(current_phrase);
		// if there's only one item inside the brackets, just use that
		// (A) = A
		// but only if there is no operations
		var current_operators = get_unique_boolean_operators(current_phrase);
		
		if (unique_tokens.length == 1 && current_operators.length == 0)
		{
			current_phrase = unique_tokens[0];
			chopped_brackets_last_time = true;
		}
		else
		{
			// there is more than one token in this phrase. 
			// See what operations occur inside this phrase	
			
			// sort in order of operation
			current_operators = operation_sort(current_operators);
			current_operators.reverse();
			// make sure there are operators
			if (current_operators.length > 0)
			{
		
				var drop_left = false;
				var drop_right = false;
				var left_op = "";
				var right_op = "";
			
				// find the nearest operator before and after the current phrase
				if (before_phrase.length > 0)
					for(i=before_phrase.length; i>-1; i--)
						if (is_operator(before_phrase[i]))
						{
							left_op = before_phrase[i];
							break;
						}
				if (after_phrase.length > 0)
					for(i=0; i<after_phrase.length; i++)
						if (is_operator(after_phrase[i]))
						{
							right_op = after_phrase[i];
							break;
						}
				// compare the operators around the phrase to what's inside
				// if the operators outside are lower priority or non-existant, then
				// it will be safe to drop the brackets
				if (left_op != "")
				{
					var op_compare = OP_ORDER.ERROR;
					op_compare = op_order_compare_1_to_2(current_operators[0], left_op);
					if (op_compare == OP_ORDER.HIGHER || op_compare == OP_ORDER.EQUAL)
						drop_left = true;
				}
				else
					drop_left = true;
				if (right_op != "")
				{
					var op_compare = OP_ORDER.ERROR;
					op_compare = op_order_compare_1_to_2(current_operators[0], right_op);
					if (op_compare == OP_ORDER.HIGHER || op_compare == OP_ORDER.EQUAL)
						drop_right = true;
				}
				else
					drop_right = true;
				// if both sides are safe, chop the brackets
				if (drop_left && drop_right)
				{
					current_phrase = current_phrase.substring(1, current_phrase.length - 1);
					chopped_brackets_last_time = true;
				}
		
			}
		}
		// if the for loop broke before, make sure to advance to the next character
		position++;
		output = before_phrase + current_phrase + after_phrase;
	}

	// not sure if this is ever reached...
	return output;
}

// helper function to replace token,~token pairs with another value
// pass input as both parameters to replace the pairs with the non-negated value
// does not replace duplicate input values. The negated token is removed, and the
// positive token has it's value replaced.
// examples: arr = ["A", "B", "~A", "C"]
// call ... (arr, 0) => ["0", "B", "C"]
// call ... (arr, arr) => ["A", "B", "C"]
function replace_token_and_negative_with_x(input, replace_with)
{
	if (!isArray(input))
		return [];
		
	var out=[], i;	
	var clean_not_tokens = get_not_tokens_clean(input);
	var replace_with_input = false;
	
	if (clean_not_tokens.length < 1)
		return input;
		
	if (input == replace_with)
		replace_with_input = true;
	
	// iterate through all the input tokens
	for (i=0; i<input.length; i++)
	{
		// check if this is a regular token
		if (input[i][0] != "~")
		{
			// then see if the negative is in the input
			if (clean_not_tokens.indexOf(input[i]) > -1)
			{
				if (replace_with_input)
					out.push(input[i]);
				else
					out.push(replace_with);
			}
			else
				out.push(input[i]);
		}
		// this is a negated token. See if the compliment exists
		else 
		{
			// compliment
			var t = input[i].substring(1, input[i].length);
			if (m_safe_for_not(t) && input.indexOf(t) > -1)
			{
				// do nothing (handled above)
			}
			// no positive exists
			else
				out.push(input[i]);
		}
	}
	
	if (out.length < 1)
		out = ["0"];
	return out;	
}

// takes an input array of tokens that form a right rotated expression,
// and attempts to simplify. Assumes all indices are separated by
// a rotate operator
// example array: "A > 4 > 7" = ["A", "4", "7"]
// example: ["A", "4", "7"] => ["A", 11]
function rot_factor(input)
{
	if (input == null)
		return [];
	if (!isArray(input))
		return [];
	if (input.length == 0)
		return [];

	// return value
	var out = [];
	var last_output = "";
	var this_input = "";
	var i;

	out.push(input[0]);
	// check that it makes sense to continue
	if (str_to_number(input[0]) == 0)
		return out;

	for (i=1; i<input.length; i++)
	{
		this_input = make_32_clean(str_to_number(input[i]));
		
		// always append if this_input is not a number
		if (isNaN(this_input))
		{
			// append the running sum total, but only if it's not zero
			if (isNaN(str_to_number(last_output)) == false)
				if (last_output != 0)
					out.push(last_output);
			out.push(input[i]);
			last_output = input[i];
			continue;
		}
		// else this_input is a number
		if (isNaN(str_to_number(last_output)))
		{
			last_output = this_input;
			this_input = "";
			continue;
		}
		// else last_output was a number and this_input is a number
		last_output = parseInt(last_output) + parseInt(this_input);
		// make clean for fewer calculations above
		last_output = make_32_clean(last_output);
		this_input = "";
	}
	// don't append again for only one item;
	// only append if a running sum has been going
	// don't append if the sum is zero
	if (i > 1 && this_input === "" && make_32_clean(last_output) != 0)
		out.push(make_32_clean(last_output));

	if (out.length < 1)
		out = ["0"];
	return out;
}

// Removes all items that appear an even number of times
// in an input array and returns the rest. Will accept
// strings and look at each character.
function xor_factor(input)
{
	if (!input)
		return ["0"];
	if (input.length == 1)
		return input;
	// http://stackoverflow.com/questions/5667888/counting-occurences-of-javascript-array-elements
	var counts = {};
	var out = [];
	// counts the number of times an item shows up in the input
	for(var i = 0; i< input.length; i++) {
		var num = input[i];
		counts[num] = counts[num] ? counts[num]+1 : 1;
	}
	for (var i in counts)
	{
		// only shows up an odd number of times
		if (counts[i] & 0x01) 
			out.push(i);
	}
	// if the input got reduced to nothing, make it "0"
	if (out.length < 1) 
		out = ["0"];
	return out;
}
