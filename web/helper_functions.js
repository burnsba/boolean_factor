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
// Depends on: none
//
// Quick summary: a few generic functions that could apply to any project
//
// Quick start: 
//
// Other notes: 
//
//     function arr_remove_at(input, index)
//		summary: removes element at index from an array and returns the result
//		input: array, number
//		output: array
//		error output: []
//     function character_count(input, to_find)
//		summary: counts number of times character appears in string
//		input: string (one character)
//		output: number
//		error output: 0
//     function destringify (input)
//		summary: attempts to taken a string and create an object
//		input: string
//		output: varies
//		error output: input
//     function get_elements_by_id(tag_name, id_name)
//		summary: returns all allements that match an id and tag name
//		input: string, string
//		output: array
//		error output: none
//     function get_unique_tokens(arr)
//		summary: returns an array of unique values
//		input: array
//		output: array
//		error output: []
//     function http_exists(file) 
//		summary: checks if a file exists on the server
//		input: string
//		output: bool
//		error output: none
//     function http_get(file) 
//		summary: retrieves a remote file and returns the contents
//		input: string
//		output: string
//		error output: none
//     function isArray(a)
//		summary: returns whether a is an array
//		input: array
//		output: bool
//		error output: none
//     function match_elements_by_prefix(tag_name, id_string)
//		summary: returns all allements that match have an id starting with some string
//		input: string, string
//		output: array
//		error output: none
//     function objects_hold_same_values(o1, o2)
//		summary: iterates over an object and compares members
//		input: object, object
//		output: bool
//		error output: false
//     function remove_whitespace(input)
//		summary: removes all whitespace from input
//		input: string
//		output: string
//		error output: ""
//     function s_array_1_is_subset_of_2(arr1, arr2, sort_function)
//		summary: checks if all items in sorted arr1 can be found in sorted arr2
//		input: array, array, (optional) function
//		output: bool
//		error output: false
//     function s_array_op(arr1, arr2, what_to_do, sort_function)
//		summary: intersect, union, xor on two sorted arrays
//		input: array, array, "i"|"u"|"x", (optional) function
//		output: array
//		error output: []
//     function str_to_number(input)
//		summary: attempts to convert hex/decimal text to a number
//		input: string
//		output: number
//		error output: NaN
//     function stringify (input)
//		summary: takes an input value and turns it into a simple string
//		input: anything
//		output: string
//		error output: "ERROR"
//     function visibility_on_exact_id(tag_name, id_name, vis)
//		summary: shows/hides all elements that match a tagname and id
//		input: string, string, "visible"|"hidden"
//		output: none
//		error output: none
//     function visibility_on_partial_id(tag_name, id_name, vis)
//		summary: shows/hides all elements that match a tagname and finds
//			elements that start with id_name (e.g. "log_" etc.)
//		input: string, string, "visible"|"hidden"
//		output: none
//		error output: none
//
// Changes:
// 2012.06.10
//     -- Added unit tests for s_array_1_is_subset_of_2, s_array_op, isArray
//        and arr_remove_at
// 2012.06.07 
//     -- Added http_exists
// 2012.06.05
//     -- Added s_array_1_is_subset_of_2
// 2012.06.03
//     -- Changed the parse CSV functino to be output first, followed by
//        any input parameters.
//     -- Added s_array_op, isArray functions.
// 2012.06.02
//     -- Added str_to_number and unit tests; added arr_remove_at
// 2012.06.01
//     -- Cleaned up the functions in this file and added better descriptions
//        of what each function does.
//     -- Added unit tests for the functions stringify, destringify, remove_whitespace,
//        and get_unique_tokens.
// 2012.05.31 
//     -- Added stringify and destringify functions.
// 2012.05.29
//


// Returns the input array, less the index passed to remove.
// If nothing is removed, the input is returned.
// example:
// arr=["A", "B", "C"]; remove_at(arr, 1) => ["A", "C"]
function arr_remove_at(input, index)
{
	if (!input)
		return [];
	if (!isArray(input))
		return [];
	
	if (typeof(index) != "number")
		return input;
	if (index < 0 || index >= input.length)
		return input;
		
	var before = [];
	var after = [];
	
	before = input.slice(0, index);
	after = input.slice(index+1, input.length);
	
	return before.concat(after);
}

// returns the number of times a character appears in a string
// Returns 0 if the character is not found.
function character_count(input, to_find)
{
	if (input == null)
		return 0;
	if (typeof(input) != "string")
		return 0;
	if (input.length < 0)
		return 0;
	if (to_find == null)
		return 0;
	if (to_find.length != 1)
		return 0;
		
	var count = -1;
	
	var i;
	for (i=0; i<input.length; i++)
		if (input[i] == to_find[0])
			count++;
	// started counting at -1, so fix 
		count ++;
	return count;
}

// Takes an input string and processes. If it looks like the string contains a valid object,
// that object is returned. Strings beginning with "0x" are converted from hex. Phrases
// such as "nan" or "INFINITY" will return NaN and Infinity respectively. Boolean values
// and null are also converted from text. Several permutations of back slash followed by
// "n" will return a new line character. Two double quotes ("\"\"") or an empty phrase ("") 
// return an empty phrase. Otherwise, the input string is returned.
// examples:
// "99" => 99
// "[\"A\", \"B\"]" => ["A", "B"]
function destringify (input)
{
	if (input instanceof Array)
		return input;
	if (input instanceof Number)
		return input;
		
	if (input)
	{
		if (input == "\n" || input == "\\n" || input == "\"\n\"" || input == "\"\\\n\"" || input == "\"\\\\n\"" || input == "\"\\n\"")
			return "\n";
		
		if ((input[0] == '"' || input[0] == "'") &&
		    (input[input.length - 1] == '"' || input[input.length - 1] == "'"))
		{
			return input.substring(1, input.length-1);
		}
	}
		
	if (input === 0)
		return 0;
	else if (input === "" || input == "\"\"")
		return "";
	else if (input === "null" || input === null)
		return null; 
	else if (parseFloat(input) != NaN && isFinite(parseFloat(input)) && !isNaN(input))
	{
		if (input.toString().length > 1)
		{
			if (input.toString()[0] == "0" && input.toString()[1].toLowerCase() == "x")
			return parseInt(input, 16);
		}
		return parseFloat(input);
	}
	else if (input.toString().toLowerCase() == "nan")
		return NaN;
	else if (input.toString().toLowerCase() == "infinity")
		return Infinity;
	else if (input.toString().toLowerCase() == "true")
		return true;
	else if (input.toString().toLowerCase() == "false")
		return false;
	else if (input[0] == "[" && input[input.length-1] == "]")
	{
		var t = [];
		var t2 = input.substring(1, input.length-1);
		if (t2.length == 0)
			return [];
		t2 = t2.replace(/ ,/g, ",").replace(/, /g, ",");
		if (character_count(t2, ",") == 0)
		{
			t.push(destringify(t2));
			return t;
		}
		t2 = t2.split(",");
		if (t2.length < 1)
			return [];
		if (t2.length == 1)
		{
			t.push(destringify(t2));
			return t;
		}
		for (var i = 0; i<t2.length; i++)
			t[i] = destringify(t2[i]);
		return t;
	}
	
	else if (character_count(input, "\"") > 0 || character_count(input, "'") > 0)
	{
		//return input.replace(/\"/g, "").replace(/'/g, "");
		return input;
	}
	else
		return input;//"Error converting from string.";
	// no longer used: JSON.parse(input);
	// and eval(input);
}

// returns all allements that match an id and tag name
function get_elements_by_id(tag_name, id_name)
{
	var matches = [];
	var elems = document.getElementsByTagName(tag_name);
	for (var i=0; i<elems.length; i++) {
		if (elems[i].id == id_name)
			matches.push(elems[i]);
	}
	return matches;
}

// iterates through an array, and returns an array of unique values.
// If a non-array is passed as input, and empty array is returned.
function get_unique_tokens(arr)
{
	if (arr == null)
		return [];
	if (arr.length < 1)
		return []
	if (!isArray(arr))
		return [];
	var i,
	len=arr.length;
	
	var unique_tokens = [];
	var o = {};
	
	// find the unique tokens in the input array
	for(i=0; i<len; i++)
		o[arr[i]] = arr[i];
	for(i in o)
		unique_tokens.push(o[i]);
	
	return unique_tokens;
}

// Loads a file over http
function http_get(file) 
{
	if (window.XMLHttpRequest) 
	{
		// IE7+, Firefox, Chrome, Opera, Safari
		var request = new XMLHttpRequest();
	}
	else 
	{
		// code for IE6, IE5
		var request = new ActiveXObject('Microsoft.XMLHTTP');
	}
	// load
	request.open('GET', file, false);
	request.send();
	return request.responseText;
}

// checks if a file exists on the server
function http_exists(file)
{
	if (window.XMLHttpRequest) 
	{
		// IE7+, Firefox, Chrome, Opera, Safari
		var request = new XMLHttpRequest();
	}
	else 
	{
		// code for IE6, IE5
		var request = new ActiveXObject('Microsoft.XMLHTTP');
	}
	// load
	request.open('HEAD', file, false);
	request.send();
	return request.status != 404;
}

// since typeof will return "object", here's how to check for arrays
function isArray(a)
{
	//http://studiokoi.com/blog/article/typechecking_arrays_in_javascript
	return Object.prototype.toString.apply(a) === '[object Array]';
}

// returns all allements that match have an id starting with some string
// example: match_elements_by_prefix("tr", "log_")
function match_elements_by_prefix(tag_name, id_string)
{
	var matches = [];
	var elems = document.getElementsByTagName(tag_name);
	for (var i=0; i<elems.length; i++) {
		if (elems[i].id.indexOf(id_string) == 0)
			matches.push(elems[i]);
	}
	return matches;
}

// compares two things (ideally objects) to see if they hold
// the same values. This is used to check if two objects
// are the same but don't point to the same item in memory.
function objects_hold_same_values(o1, o2)
{
	if (typeof(o1) != typeof(o2))
		return false;
		
	switch (typeof(o1))
	{
		case "number":
			if (isNaN(o1) && isNaN(o2))
				return true;
			return o1 == o2;
		break;
		case "boolean":
			return o1 == o2;
		break;
		case "string": 
			if (o1 != null && o2 != null && o1.length != o2.length)
				return false;
			return o1 == o2;
		break;
		case "object": /* also, arrays */
			if (o1 != null && o2 != null && o1.length != o2.length)
				return false;
			var i;
			for (i in o1)
			{
				if(!objects_hold_same_values(o1[i], o2[i]))
				return false;
			}
		break;
		default:
			return o1 == o2;
		break;
	}

	return true;
}

// this function strips all whitespace characters from the input and returns the 
// result in a new variable
function remove_whitespace(input)
{
	try
	{
		if (input == null ||typeof(input) != "string")
			return "";
		return input.replace(/\s/g, '');
	}
	catch (err)
	{
		return "";
	}
}

// sorted array operation
// pass two sorted arrays, and an optional sort function, and returns:
// what_to_do == "i" (intersection)
//	an array of the intersection of the two inputs
// what_to_do == "u" (union)
//	an array of the union of the two inputs
// what_to_do == "x" (exclusive or)
//	an array of items found in one or the other, but not both inputs
function s_array_op(arr1, arr2, what_to_do, sort_function)
{
	// http://stackoverflow.com/questions/10866756/fast-intersection-of-two-sorted-integer-arrays
	
	if (!isArray(arr1) || !isArray(arr2))
		return [];
	// need at least one to be be longer than zero
	if (arr1.length == 0 && arr2.length == 0)
		return [];
		
	// intersection check that both are longer than zero
	if (what_to_do == "i" && (arr1.length == 0 || arr2.length == 0))
		return [];
		
	// counters
	var i=0, j=0;
	// values
	var a=0, b=0;
	
	var out = [];
	
	// comparison function
	var the_compare;
	if (typeof(sort_function) != "function")
		the_compare = function(a1,b1) { return [a1,b1].sort()[0] == a1 ? -1 : 1; };
	else
		the_compare = sort_function;
	// push functions
	var eq_push;
	var lt_push;
	var gte_push;
	
	switch(what_to_do)
	{
		case "i":
			eq_push = function(in1) { return out.push(in1); };
			lt_push = function() { return; };
			gte_push = function() { return; };
		break;
		case "u":
			eq_push = function(in1) { return out.push(in1); };
			lt_push = function(in1) { return out.push(in1); };
			gte_push = function(in1) { return out.push(in1); };
		break;
		case "x":
			eq_push = function() { return; };
			lt_push = function(in1) { return out.push(in1); };
			gte_push = function(in1) { return out.push(in1); };
		break;
		default:
			return [];
	}
	
	// the continues should speed up execution ...
	while (i < arr1.length && j < arr2.length)
	{
		a = arr1[i];
		b = arr2[j];
		
		if (a === b)
		{
			eq_push(a);
			i++;
			j++;
			continue;
		}
		// a < b
		else if (the_compare(a,b) == -1)
		{
			lt_push(a);
			i++;
			continue;
		}
		else
		{
			gte_push(b);
			j++;
			continue;
		}
	}
	
	if (what_to_do == "u" || what_to_do == "x")
	{
		// add any remainders
		for (; i<arr1.length; i++)
			out.push(arr1[i]);
		for (; j<arr2.length; j++)
			out.push(arr2[j]);
	}
	
	return out;
}

// compares all the items of sorted arr1, and returns true if they are all
// found in sorted arr2. This will occasionally give false failures if 
// comparing NaN to NaN, or objects that hold the same values but do
// not point to the same location in memory. Does not check values
// of children arrays. Also, the null set [] is always contained
// in any array arr2.
// if the arrays hold the same values, returns true.
function s_array_1_is_subset_of_2(arr1, arr2, sort_function)
{
	if (!isArray(arr1) || !isArray(arr2))
		return false;
	// easy case
	if (arr1.length > arr2.length)
		return false;
		
	// counters
	var i=0, j=0;
	// values
	var a=0, b=0;
	
	// comparison function
	var the_compare;
	if (typeof(sort_function) != "function")
		//the_compare = function(a1,b1) { return a1 < b1 ? -1 : (a1 > b1 ? 1 : 0); };
		the_compare = function(a1,b1) { return [a1,b1].sort()[0] == a1 ? -1 : 1; };
	else
		the_compare = sort_function;
	
	// the continues should speed up execution ...
	while (i < arr1.length && j < arr2.length)
	{
		a = arr1[i];
		b = arr2[j];
		
		if (a === b)
		{
			i++;
			j++;
			continue;
		}
		// a < b
		else if (the_compare(a,b) == -1)
		{
			return false;
		}
		else
		{
			j++;
			continue;
		}
	}

	if (i == arr1.length)
		return true;
	
	return false;
}

// Takes an input string and attempts to convert it to a number.
// Checks for hex numbers "0x..."
// If the input is a number, it will be returned.
// returns NaN on failure
function str_to_number(input)
{
	if (typeof(input) == "number")
		return input;
	if (typeof(input) != "string")
		return NaN;
	if (!input)
		return NaN;

	// I believe the following commented line does more checks than it needs to
	//if (parseFloat(input) != NaN && isFinite(parseFloat(input)) && !isNaN(input))
	if (!isNaN(parseFloat(input)) && isFinite(input))
	{	
		var i_s = input.toString();
		if (i_s.length > 1)
		{
			if (i_s[0] == "0" && i_s[1].toLowerCase() == "x")
			return parseInt(input, 16);
		}
		return parseFloat(input);
	}
	
	//special case failure 
	if (input.toString().toLowerCase() == "infinity")
		return Infinity;
	
	return NaN;
}

// Takes an input item and processes it, attempting to turn the input into a string.
// If the input is already a string, nothing happens.
// examples:
// null => "null"
// ["A", "B"] => "[\"A\", \"B\"]"
// "string" => "string"
// 44 => "44"
function stringify (input)
{
	if (input instanceof String || typeof(input) == "string")
	{
		if (input == "\n" || input == "\\n" || input == "\"\n\"" || input == "\"\\\n\"" || input == "\"\\\\n\"")
			return "\\n";
		return input;
	}

	if (input === 0)
		return "0";
	else if (input === null)
		return "null";
	else if (input instanceof Array)
	{
		var out = "[";
		for (var i=0; i<input.length; i++)
		{
			out += stringify(input[i]);
			if (i < input.length - 1)
				out += ", ";
		}
		out += "]";
			return out;
	}
	else if (input === "\n")
		return "\"\\n\"";
	else if (input === "")
		return "\"\"";
	else if (input === true)
		return "true";
	else if (input === false)
		return "false";
	else if (typeof input == "number")
		return input.toString();

	else
		return "ERROR";// "\"" + input + "\"";
}

// shows/hides all elements that match a tagname and id
function visibility_on_exact_id(tag_name, id_name, vis)
{
	if (vis != "hidden" && vis != "visible")
		return;
	var elems = get_elements_by_id(tag_name, id_name);
	if (elems.length < 1)
		return;
	var i
	for (i=0; i<elems.length; i++)
	{
		if (vis == "hidden")
			//elems[i].style.visibility = vis;
			elems[i].style.display = "none";
		else
			elems[i].style.display = "";
	}
}

// shows/hides all elements that match a tagname and finds
// elements that start with id_name (e.g. "log_" etc.)
function visibility_on_partial_id(tag_name, id_name, vis)
{
	if (vis != "hidden" && vis != "visible")
		return;
	var elems = match_elements_by_prefix(tag_name, id_name);
	if (elems.length < 1)
		return;
	var i
	for (i=0; i<elems.length; i++)
	{
		if (vis == "hidden")
			//elems[i].style.visibility = vis;
			elems[i].style.display = "none";
		else
			elems[i].style.display = "";
	}
}
