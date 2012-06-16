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
//             recursive_common.js
//
// Quick summary: This describes a class for storing boolean phrases in a tree according
//     to operator precedence so that manipulating a phrase is a matter or changing
//     nodes in a tree.
//
// Quick start: 
//	var input = "A&B";	// your boolean phrase
//	var ex = new Expression(input);
//	if (!ex.is_valid())	// nothing is guaranteed if the phrase is not well-formed
//		return "Expression is not well formed.";
//	ex.build_tree();	// *required* build the tree structure
//	ex.make_pretty();	// optional -- puts spaces in the output: "A & B"
//	return ex.get_my_value();	// returns "A & B"
//
// Not so quick summary: Splits phrases according to the lowest precedence binary operator,
//     currently being looked up in recursive_common.js. The root node will contain the string
//     of the entire phrase and all its children; it can have multiple children, i.e., not a
//     binary tree. Each node will have an operator that defines how its children relate to each
//     other.
//       Example: var ex = new Expression("A&(B|C)");
//       ex.get_my_value(); // returns "A&(B|C)"
//       ex.get_child(0).get_my_value(); // returns "A"
//       ex.get_child(1).get_my_value(); // returns "(B|C)"
//       ex.get_operator(); // returns "&"
//       ex.get_child(0).get_operator(); // returns ""
//       ex.get_child(1).get_operator(); // returns "|"
//       ex.get_child(0).get_children_length(); // returns 0;
//       ex.get_child(1).get_children_length(); // returns 2;
//
//     If a node deep in the tree changes, it will be flagged as needing to be updated. This
//     will also flag all of its ancestors as needing to be updated as well. Calling
//     rebuild_flagged_children() will rebuild the phrase for the current node based on its 
//     children. this.get_root_node().rebuild_flagged_children() will rebuild all phrases
//     in the tree if something has changed.
//
// Other notes: 
//
//	function isExpression(input)
//
//	Expression.get_my_value()
//	Expression.set_my_value(input)
//	Expression.set_my_value_from_array(input)
//	Expression.get_parent_expression()
//	Expression.set_parent_expression(input)
//	Expression.get_child(input)
//	Expression.add_child(input)
//	Expression.pop_child()
//	Expression.remove_child(input)
//	Expression.get_children_length()
//	Expression.get_children_values()
//	Expression.get_flag()
//	Expression.get_operator()
//	Expression.set_operator(input)
//	Expression.get_root_node()
//	
//	Expression.apply_function(do_function, oper)
//	Expression.build_tree()
//	Expression.clean_all_children()
//	Expression.clean_flagged_children()
//	Expression.clear_flag()
//	Expression.flag_me()
//	Expression.flag_parent()
//	Expression.make_pretty()
//	Expression.is_well_formed(input)
//	Expression.is_valid()
//
// Changes:
// 2012.05.28 

// checks that an object is an Expression
function isExpression(input)
{	// http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
	return ((input instanceof Expression) || (ex.constructor == Expression) || (ex.constructor.name == "Expression"));
}

var Expression = function (input)
{
	if (!(this instanceof Expression))
	{
		return new Expression(input);
	}

	// constructor
	this.parent_expression = null;	// pointer to parent node
	this.children = [];		// contains array of expression's of all children from a split
	this.my_value = "";		// contains the phrase stored in this node
	this.dirty = false;		// if a child node changes value, the parent needs to be recreated
	this.op_split = "";		// if this is a parent phrase that has children that were split from
					//    an operator, track that here to rebuild the expression later
	this.valid = false;		// track whether or not the expression is well formed (upon creation)
	
	if (this.is_well_formed(input))
	{
		var t = remove_whitespace(input.toString());
		this.my_value = remove_extra_brackets(t);
		this.valid = true;
	}
	else
	{
		return;
	}
	
}

// make a static stack for use when rebuilding the tree
//Expression.stack = [];

////////////////////////////////////////////////////////////////////////////////
// get/set methods for private variables
Expression.prototype.set_my_value = function (input)
{
	while (this.children.length > 0)
		this.children.pop();
	this.my_value = input;
	this.flag_me();
}
Expression.prototype.get_my_value = function ()
{
	return this.my_value;
}
Expression.prototype.set_parent_expression = function (input)
{
	this.parent_expression = input;
}
Expression.prototype.get_parent_expression = function ()
{
	return this.parent_expression;
}
Expression.prototype.get_child = function (input)
{
	if (!isFinite(input))
		return null;
	if (input < this.children.length && input > -1)
		return this.children[input];
	return null;
}
Expression.prototype.get_children_length = function ()
{
	return this.children.length;
}
Expression.prototype.get_flag = function()
{
	return this.dirty;
}
Expression.prototype.get_operator = function ()
{
	return this.op_split;
}
Expression.prototype.set_operator = function (input)
{
	this.op_split = input;
}
Expression.prototype.is_valid = function ()
{
	return this.valid;
}
////////////////////////////////////////////////////////////////////////////////

Expression.prototype.get_root_node = function()
{
	var current_node = this;
	while (current_node.get_parent_expression() != null)
	{
		current_node = current_node.get_parent_expression();
	}
	return current_node;
}
// Send an array of strings to set the current my_value
// will accept an empty array
// warning: should this perform any validation?
Expression.prototype.set_my_value_from_array = function (input)
{
	var new_value = "";
	var op_count = input.length - 1;
	for (i=0; i<input.length; i++)
	{
		new_value += input[i];
		if (op_count > 0)
		{
			new_value += this.get_operator();
			op_count--;
		}
	}
	this.set_my_value(new_value);
	this.flag_me();
}
// appends a child to the end of the children array
// warning: should I check that no circular links are formed?
Expression.prototype.add_child = function (input)
{
	this.children.push(input);
	this.flag_parent();
	return;
}
// removes a child at the input position
Expression.prototype.remove_child = function (input)
{
	if (!isFinite(input))
		return;
	if (input < 0 || input >= this.children.length)
		return;
	
	var before = [];
	var after = [];
	
	before = this.children.slice(0, input);
	after = this.children.slice(input+1, this.children.length);
	
	this.children = before.concat(after);
	
	this.flag_parent();
	return;
}

// removes a child from the beginning of the chilren array
Expression.prototype.pop_child = function()
{
	if (this.children.length > 0)
	{
		this.children.pop();
		this.flag_parent();
	}
}
// returns all the my_value's of each child in an array
Expression.prototype.get_children_values = function ()
{
	var i;
	var child_values = [];
	for (i=0; i<this.children.length; i++)
	{
		child_values[i] = this.children[i].get_my_value();
	}
	return child_values;
}
// sets this dirty flag
Expression.prototype.flag_me = function ()
{
	this.dirty = true;
	this.flag_parent();
}
// sets the parent (and all its ancestors) dirty flag
Expression.prototype.flag_parent = function ()
{
	if (this.get_parent_expression() == null)
		return;
	this.get_parent_expression().flag_me();
}
// clears this dirty flag
Expression.prototype.clear_flag = function ()
{
	this.dirty = false;
}
// puts whitespace around all operators, except ~
// note: this is not flagged afterwards
Expression.prototype.make_pretty = function ()
{
	var input = this.get_my_value();
	input = remove_whitespace(input);
	this.my_value = input.replace(/&/g, " & ").replace(/\^/g, " ^ ").replace(/\|/g, " | ").replace(/>/g, " > ");
}

// rebuilds all expressions, from the current node down
Expression.prototype.clean_all_children = function ()
{
	// going to need to start at the bottom.
	var i;
	var op_count = this.children.length - 1;
	var new_value = "";
	for (i=0; i<this.children.length; i++)
	{
		this.children[i].clean_all_children();
		new_value += this.children[i].get_my_value();
		if (op_count > 0)
		{
			new_value += this.op_split;
			op_count--;
		}
	}
	// nodes without children don't need to be changed
	if (new_value != "")
	{
		// check if parentheses need to be included
		if (this.get_parent_expression() != null)
		{
			var op_compare = op_order_compare_1_to_2(this.get_operator(), this.get_parent_expression().get_operator());
			if (op_compare == OP_ORDER.LOWER)
			{
				new_value = "(" + new_value + ")";
			}
		}
		
		this.my_value = new_value;
	}
	
	// once that is taken care of, reset this flag
	this.clear_flag();	
}

// rebuilds only flagged expressions, from the current node down
Expression.prototype.clean_flagged_children = function ()
{
	// going to need to start at the bottom.
	var i;
	var op_count = this.children.length - 1;
	var new_value = "";
	for (i=0; i<this.children.length; i++)
	{
		if (this.children[i].get_flag())
			this.children[i].clean_flagged_children();
		new_value += this.children[i].get_my_value();
		if (op_count > 0)
		{
			new_value += this.op_split;
			op_count--;
		}
	}
	// nodes without children don't need to be changed
	if (new_value != "")
	{
		// check if parentheses need to be included
		if (this.get_parent_expression() != null)
		{
			var op_compare = op_order_compare_1_to_2(this.get_operator(), this.get_parent_expression().get_operator());
			if (op_compare == OP_ORDER.LOWER)
			{
				new_value = "(" + new_value + ")";
			}
		}
		
		this.my_value = new_value;
	}
	
	// once that is taken care of, reset this flag
	this.clear_flag();	
}
// splits the expression into children based on operators and brackets
Expression.prototype.build_tree = function ()
{
	// hide this function from general reference
	var safe_split = function m_safe_split(input)
	{
		if (!input)
			return null;
		if (input.length < 0)
			return null;
		if (!is_operator(input))
			return null;
		// going to want to wipe out all previous children
		// note that this does not flag the parent
		while (this.children.length > 0)
		{
			this.children.pop();
		}
		
		// split per char (operator)
		var pre = bracket_safe_split(this.my_value, input);
		// might as well sort while we're here
		if (input != ">")
			pre.sort(my_sort);
		// set the split character in the parent
		this.op_split = input[0];
		var i;
		for (i=0; i<pre.length; i++)
		{
			// add each child to the parent
			var expr = new Expression(pre[i]);
			expr.set_parent_expression(this);
			this.add_child(expr);
		}

	} // end internal function
	
	// make sure input is clean
	var input_string = this.get_my_value();
	input_string = remove_extra_brackets(input_string);
	this.set_my_value(input_string);
	
	// find the operators
	var operators = bracket_safe_get_operators(input_string);
	// if no operators were found, this is the end of this branch
	if (operators == null)
	{
		// if this is being rebuilt, make sure there aren't any children
		while (this.children.length > 0)
		{
			this.children.pop();
		}
		return null;
	}
	// split by lowest precedence operator found in the expression
	// (which will add children to this node)
	operators = operation_sort(operators);
	if (operators != null)
	{
		operators.reverse();
		safe_split.call(this,operators[0]);
	}
	// now do the same thing for all the other children
	var j=0;
	for(j=0; j<this.get_children_length(); j++)
	{
		this.get_child(j).build_tree();
	}
	
	return null;
}
// applies a function to all children of an operator.
// Note that any extra arguments that are passed to apply_function will be 
// passed along to do_function
Expression.prototype.apply_function = function(do_function, oper)
{
	if (do_function == null)
		return;
	if (!is_operator(oper))
		return;
	if (this.children.length < 1)
		return;
			
	var i;
	// since I don't want to build up an argument list consisting of arrays of arrays of arrays ...
	// I use .apply() to pass the arguments along
	for(i=0; i<this.children.length; i++)
		this.get_child(i).apply_function.apply(this.get_child(i), arguments);
	
	// call the passed function on the appropriate operator
	if (this.get_operator() == oper)
	{
		// once I'm done tree travelling, I only need the extra arguments.
		// Put into array; pass with apply()
		var other_arguments = [];
		for (i=2; i<arguments.length; i++)
			other_arguments.push(arguments[i]);
		// prepend this expression
		other_arguments.unshift(this);
		do_function.apply(null, other_arguments);
		// the called function is responsible for ensuring
		// the integrity of the passed expression and its children. However, if this node
		// is a child node of a parent and both are being passed to do_function at some point,
		// then the parent node could be using an old my_value after its children
		// change. And that situation can apply to any child/parent node in the entire
		// tree (really only parents of this). So make sure only the latest values are being passed around
		this.get_root_node().clean_flagged_children();
	}

}

// checks an expression to make sure it is well formed
Expression.prototype.is_well_formed = function(input)
{
	if (input == null)
		return false;
	if (input.my_value == "")
		return false;
		
	var state = 0, i, ch;
	var token = new RegExp(/\w/);
	
	var open_count = 0, close_count = 0;
	
	var INITIAL = 0;
	var OPEN_BRACKET = 2;
	var CLOSE_BRACKET = 4;
	var OPERATOR = 6;
	var OP_NOT = 12;
	var TOKEN = 8;
	var TOKEN_WHITESPACE = 10;
	var INVALID = -1;
	
	for (i=0; i<input.length; i++)
	{
		ch = input[i];
		
		if (ch == "(")
		{
			open_count++;
			switch(state)
			{
				case INITIAL:		state = OPEN_BRACKET;	break;
				case OPEN_BRACKET:	state = OPEN_BRACKET;	break;
				case CLOSE_BRACKET:	state = INVALID;	break;
				case OPERATOR:		state = OPEN_BRACKET;	break;
				case OP_NOT:		state = OPEN_BRACKET;	break;
				case TOKEN:		state = OPEN_BRACKET;	break;
				case TOKEN_WHITESPACE:	state = OPEN_BRACKET;	break;
				default:		state = INVALID;	break;
			}
		}
		else if (ch == ")")
		{
			close_count++;
			switch(state)
			{
				case INITIAL:		state = INVALID;	break;
				case OPEN_BRACKET:	state = CLOSE_BRACKET;	break;
				case CLOSE_BRACKET:	state = CLOSE_BRACKET;	break;
				case OPERATOR:		state = INVALID;	break;
				case OP_NOT:		state = INVALID;	break;
				case TOKEN:		state = CLOSE_BRACKET;	break;
				case TOKEN_WHITESPACE:	state = CLOSE_BRACKET;	break;
				default:		state = INVALID;	break;
			}
		}
		// operators
		else if (is_operator(ch))
		{
			switch(state)
			{
				case INITIAL:		state = INVALID;	break;
				case OPEN_BRACKET:	state = INVALID;	break;
				case CLOSE_BRACKET:	state = OPERATOR;	break;
				case OPERATOR:		state = INVALID;	break;
				case OP_NOT:		state = INVALID;	break;
				case TOKEN:		state = OPERATOR;	break;
				case TOKEN_WHITESPACE:	state = OPERATOR;	break;
				default:		state = INVALID;	break;
			}
		}
		// alphanumeric, underscore
		else if (token.test(ch))
		{
			switch(state)
			{
				case INITIAL:		state = TOKEN;		break;
				case OPEN_BRACKET:	state = TOKEN;		break;
				case CLOSE_BRACKET:	state = INVALID;	break;
				case OPERATOR:		state = TOKEN;		break;
				case OP_NOT:		state = TOKEN;		break;
				case TOKEN:		state = TOKEN;		break;
				case TOKEN_WHITESPACE:	state = INVALID;	break;
				default:		state = INVALID;	break;
			}
		}
		// whitespace
		else if (ch == " " || ch == "\r" || ch == "\n")
		{
			// note that this case only matters for separation of tokens;
			// all other states do not care about whitespace
			switch(state)
			{
				case INITIAL:		state = INITIAL;		break;
				case OPEN_BRACKET:	state = OPEN_BRACKET;		break;
				case CLOSE_BRACKET:	state = CLOSE_BRACKET;		break;
				case OPERATOR:		state = OPERATOR;		break;
				case OP_NOT:		state = OP_NOT;			break;
				case TOKEN:		state = TOKEN_WHITESPACE;	break;
				case TOKEN_WHITESPACE:	state = TOKEN_WHITESPACE;	break;
				default:		state = INVALID;		break;
			}
		}
		else if (ch == "~" || ch == "-")
		{
			// double nots (~~) are ok
			switch(state)
			{
				case INITIAL:		state = OP_NOT;		break;
				case OPEN_BRACKET:	state = OP_NOT;		break;
				case CLOSE_BRACKET:	state = INVALID;	break;
				case OPERATOR:		state = OP_NOT;		break;
				case OP_NOT:		state = OP_NOT;		break;
				case TOKEN:		state = INVALID;	break;
				case TOKEN_WHITESPACE:	state = OP_NOT;		break;
				default:		state = INVALID;	break;
			}
		}
		else
		{
			state = INVALID;
		}
		
		if (state == INVALID)
			return false;
		
	}
	
	// check brackets
	if (open_count != close_count)
		return false;
	
	// the only valid characters to end on are close bracket,
	// token, or token whitespace 
	if (state == TOKEN || state == TOKEN_WHITESPACE || state == CLOSE_BRACKET)
		return true;

	return false;
}
