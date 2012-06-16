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
// Quick summary: a unit test framework for evaluating a function. Takes in input/
//     expected output pairs and compares it to the actual output of a function.
//
// Quick start: 
//     <script>
//     var a_test = new UnitTest("t_boolean_factor", do_the_factor, null, "t_boolean_factor_results", 
//		{ /* extra arguments */
//		load_from_file: true,
//		file_url: "unit_tests/tv_boolean_factor.csv",
//		});
//     </script>
//     <button onclick="load_and_go(a_test)">test</button>
//     <div id="t_boolean_factor_results">Results will go here (test has not been run).</div>
//
// Other notes: 
//
//	UnitTest.set_output(input)
//		summary: sets the div tag to display results
//		input: string
//		output: none
//		error output: none
//	UnitTest.validate()
//		summary: sets is_valid flag to enable running tests
//		input: none
//		output: none
//		error output: none
//
//	function hide_all_results(the_unit_test)
//		summary: hides all elements in results div tag
//		input: UnitTest
//		output: none
//		error output: none
//	function load_and_go(the_unit_test)
//		summary: calls .validate, parse_csv_file, and unit_test
//		input: UnitTest
//		output: none (outputs to div element)
//		error output: none
//	function parse_csv_file(data)
//		summary: reads input from resource
//		input: text from previously loaded remote file
//		output: values[n] = [expected_output, [input1, input2, ...]]
//		error output: none
//	function show_all_results(the_unit_test)
//		summary: shows all elements in results div tag
//		input: UnitTest
//		output: none
//		error output: none
//	function show_only_failed(the_unit_test)
//		summary: shows only tests that fail in results div tag
//		input: UnitTest
//		output: none
//		error output: none
//	function show_only_passed(the_unit_test)
//		summary: shows only tests that pass in results div tag
//		input: UnitTest
//		output: none
//		error output: none
//	function unit_test(the_unit_test)
//		summary: runs the unit test
//		input: UnitTest
//		output: none (outputs to div element)
//		error output: none (outputs to div element or alert)
//
// Changes:
// 2012.06.06
//     -- 100% pass is now bolded, 0% pass is given its own class
// 2012.06.03
//     -- Changed tvalues a bit. It is now expected_output then everything following will
//        be passed to the function.
//     -- Made the extra info CSS class specific for visualizing differences in object types.
// 2012.06.01
//     -- expected value is no longer passed through destringify
// 2012.05.31 
//     -- Added extra info in output (typeof and length) and changed to === compare
// 2012.05.29
//


var UnitTest = function (in_name, in_function, in_values, in_output_id)
{
	if (!(this instanceof UnitTest))
	{
		return new UnitTest(in_name, in_function, in_values, in_output_id);
	}
	
	this.tname = "";		// name of the test
	this.tfunction = null;		// the function to test
	this.tvalues = [];		// the input/output values to test on the function
	this.output_id = "";		// the document element to write innerHTML results to
	
	this.is_valid = false;		// simple checking that this is a proper test object
	
	// set the following by passing an object as part of the new statement
	this.call_on_object = false;	// testing can use function.apply on an object
	this.object_to_call_on = null;  // the object the function will be applied to
	
	this.load_from_file = false;	// load the test values from a file, retrieved with HTTP GET
	this.file_url = "";		// URL of file to be loaded
	
	if (arguments[4])
		for (var n in arguments[4]) 
		{ 
			this[n] = arguments[4][n]; 
		}

	// don't overwrite the main attributes with any random extra values
	this.tname = in_name;
	this.tfunction = in_function;
	this.tvalues = in_values;
	this.output_id = in_output_id;
	this.is_valid = false;
	
	this.validate();	
};

UnitTest.prototype.set_output = function(input)
{
	if (document.getElementById(this.output_id) == null)
		return;
		
	document.getElementById(this.output_id).innerHTML = input;
}
UnitTest.prototype.validate = function()
{
	if (document.getElementById(this.output_id) == null)
	{
		this.is_valid = false;
		return;
	}

	if (this.tname.match(/[^\w]/g))
	{
		this.is_valid = false;
		return;
	}
	if (this.tname.length < 1)
	{
		this.is_valid = false;
		return;
	}
	if (!(this.tfunction instanceof Function))
	{
		this.is_valid = false;
		return;
	}
	if (this.tvalues == null)
	{
		this.is_valid = false;
		return;
	}
	if (this.tvalues.length < 1)
	{
		this.is_valid = false;
		return;
	}
	
	this.is_valid = true;
}

function unit_test(the_unit_test)
{
	if (document.getElementById(the_unit_test.output_id) == null)
	{
		alert("The output with id (" + the_unit_test.output_id + ") could not be found.");
		return;
	}
	if (the_unit_test.tname.match(/[^\w]/g))
	{
		the_unit_test.set_output("The test name can only contain alphanumeric characters.");
		return;
	}
	if (the_unit_test.tname == null || the_unit_test.tname == "")
	{
		the_unit_test.set_output("Could not find valid test name.");
		return;
	}
	if (the_unit_test.tvalues == null)
	{
		the_unit_test.set_output("Unable to find test input and output values.");
		return;
	}
	if (the_unit_test.tfunction == null)
	{
		the_unit_test.set_output("No input function to test was found.");
		return;
	}
	
	var num_tests = the_unit_test.tvalues.length

	var i;
	var good_count = 0;
	var bad_count = 0;
	var actual_output = [];
	var extra_info = [];
	var extra_class = [];
	var the_length;
	var expected_result;
	
	var ut_out;
	
	var start_time = new Date().getTime();

	for (i=0; i<num_tests; i++)
	{
		var test_args = [];
		for (var j=0; j<the_unit_test.tvalues[i][1].length; j++)
			test_args.push(the_unit_test.tvalues[i][1][j]);
			
		if (the_unit_test.call_on_object)
		{
			ut_out = the_unit_test.tfunction.apply(the_unit_test.object_to_call_on, test_args);
		}
		else
		{
			ut_out = the_unit_test.tfunction.apply(null, test_args);
		}
		
		expected_result = the_unit_test.tvalues[i][0];
		
		if (ut_out === expected_result || objects_hold_same_values(ut_out, expected_result))
		{
			good_count++;
			// result type: 1 good, 0 bad
			actual_output.push(1);
		}
		else
		{
			bad_count++;
			// result type: 1 good, 0 bad
			actual_output.push(0);
		}
		// filler
		extra_info.push(0); 
		extra_class.push(0);
		
		// input
		the_length = test_args == null ? 0 : test_args.length;
		if (the_length == 1)
		{
			if (typeof(test_args[0]) == "string")
			    actual_output.push("\"" + stringify(test_args[0]) + "\"");
			else
			    actual_output.push(stringify(test_args[0]));
			var inner_length = (test_args[0] == null ? 0 : test_args[0].length);
			extra_info.push("[" + typeof(test_args[0]) + "]<br>length: " + inner_length);
			extra_class.push(typeof(test_args[0]));
		}
		else
		{
			if (typeof(test_args) == "string")
			    actual_output.push("\"" + stringify(test_args) + "\"");
			else
			    actual_output.push(stringify(test_args));
			extra_info.push("[" + typeof(test_args) + "]<br>length: " + the_length);
			extra_class.push(typeof(test_args));
		}
        
		// what it's supposed to be
		the_length = expected_result == null ? 0 : expected_result.length;
		if (typeof(expected_result) == "string")
		    actual_output.push("\"" + stringify(expected_result) + "\"");
		else
		    actual_output.push(stringify(expected_result));
		extra_info.push("[" + typeof(expected_result) + "]<br>length: " + the_length);
		extra_class.push(typeof(expected_result));
        
		// what the output actually is
		the_length = ut_out == null ? 0 : ut_out.length;
		if (typeof(ut_out) == "string")
		    actual_output.push("\"" + stringify(ut_out) + "\"");
		else
		    actual_output.push(stringify(ut_out));
		extra_info.push("[" + typeof(ut_out) + "]<br>length: " + the_length);
		extra_class.push(typeof(ut_out));

	}
	
	var end_time = new Date().getTime();
	var total_time = end_time - start_time;
	
	var pass_percent = 0;
	var fail_percent = 0;
	if (num_tests > 0)
	{
		pass_percent = Math.floor(good_count * 10000 / num_tests)/100;
		fail_percent = Math.floor(bad_count * 10000 / num_tests)/100;
	}

	var result_text = "";
	
	result_text += "Total tests run: " + num_tests + "<br>";
	result_text += "Successful tests: " + good_count + " (";
	 
	if (pass_percent == 100)
		result_text += "<b>" + pass_percent + "</b>";
	else
		result_text += pass_percent;
	result_text += "%)<br>";
		
	if (bad_count > 0)
		result_text += "<div class=\"failed_test_warning\">";
	result_text += "Failed tests: " + bad_count + " (" + fail_percent + "%)<br>";
	if (bad_count > 0)
		result_text += "</div>";
		
	result_text += "Run time: " + total_time + " ms<br>";
	result_text += "<p>";
	result_text += "<table class=\"index_table\">";
	result_text += "<tr>";
	result_text += "<th>&nbsp;</th>";
	result_text += "<th>input</th>";
	result_text += "<th>&nbsp;</th>"; // extra info 1
	result_text += "<th>expected<br>output</th>";
	result_text += "<th>&nbsp;</th>"; // extra info 2
	result_text += "<th>actual<br>output</th>";
	result_text += "<th>&nbsp;</th>"; // extra info 3
	result_text += "</tr>";
	for (i=0; i<actual_output.length/4; i++)
	{
		result_text += "<tr ";
		if (actual_output[i*4] == 1)
			result_text += "class=\"passed_result\" id=\"" + the_unit_test.tname + "_passed_result\">";
		else
			result_text += "class=\"failed_result\" id=\"" + the_unit_test.tname + "_failed_result\">";
			
		result_text += "<td class=\"index_table\">" + (i+1) + ")</td>";
		
		result_text += "<td class=\"index_table\">" + actual_output[i*4 + 1] + "</td>";
		result_text += "<td class=\"index_table_extra_" + extra_class[i*4 + 1] + "\">" + extra_info[i*4 + 1] + "</td>";
		
		result_text += "<td class=\"index_table\">" + actual_output[i*4 + 2] + "</td>";
		result_text += "<td class=\"index_table_extra_" + extra_class[i*4 + 2] + "\">" + extra_info[i*4 + 2] + "</td>";
		
		result_text += "<td class=\"index_table\">" + actual_output[i*4 + 3] + "</td>";
		result_text += "<td class=\"index_table_extra_" + extra_class[i*4 + 3] + "\">" + extra_info[i*4 + 3] + "</td>";
		result_text += "</tr>";
	}
	result_text += "</table>";

	the_unit_test.set_output(result_text);

	// free memory
	if (the_unit_test.load_from_file == true)
		the_unit_test.tvalues = [];

}

////////////////////////////////////////////////////////////////////////////////
// convenience functions
////////////////////////////////////////////////////////////////////////////////

// parses out a colon seperated value file -- columns, separated by ::
// the first column is the expected output, the remaining columns are additional values to store
// Each input item is passed through destringify.
// The result is returned as:
// values[0] = [expected_output, [input1, input2, ...]]
// values[0][0] = expected_output
// values[0][1][0] = input1
// values[0][1][1] = input2

function parse_csv_file(data)
{
	if (data == null)
		return null;
		
	//replace UNIX new lines
	data = data.replace (/\r\n/g, "\n");
	//replace MAC new lines
	data = data.replace (/\r/g, "\n");
	//split into rows
	var rows = data.split("\n");
	// create array which will hold our data:
	var out = [];
	var t;

	// loop through all rows
	for (var i = 0; i < rows.length; i++)
	{
	// this line helps to skip empty rows
	// make a comment line by starting it with #
	if (rows[i] && rows[i][0] != "#") {                    
		// our columns are separated by double colons
		var column = rows[i].split("::"); 
		 
		var next_line = [];
		
		var first_col = "";
		var other_cols = [];
		
		first_col = destringify(column[0]);
		
		for (var j = 1; j < column.length; j++)
		{
			// do some un-stringification
			t = column[j];
			other_cols.push(destringify(t));
			
		}
		
		next_line.push(first_col);
		next_line.push(other_cols);
		
		out.push(next_line);
	}
	}
	
	return out;
	// 
	
}

function load_and_go(the_unit_test)
{
	if (!(the_unit_test instanceof UnitTest))
		return;
	
	if (the_unit_test.load_from_file == true)
	{
		// make sure file can be loaded
		if (!http_exists(the_unit_test.file_url))
		{
			the_unit_test.set_output("Error: test values file could not be found on server.");
			return;
		}
		
		the_unit_test.tvalues = parse_csv_file(http_get(the_unit_test.file_url));
	}
	the_unit_test.validate();
	unit_test(the_unit_test);
}

function hide_all_results(the_unit_test)
{
	if (the_unit_test == null)
		return;
	if (the_unit_test.tname == null || the_unit_test.tname.length < 1)
		return;
	visibility_on_exact_id("tr", the_unit_test.tname + "_passed_result", "hidden");
	visibility_on_exact_id("tr", the_unit_test.tname + "_failed_result", "hidden");
}

function show_all_results(the_unit_test)
{
	if (the_unit_test == null)
		return;
	if (the_unit_test.tname == null || the_unit_test.tname.length < 1)
		return;
	visibility_on_exact_id("tr", the_unit_test.tname + "_passed_result", "visible");
	visibility_on_exact_id("tr", the_unit_test.tname + "_failed_result", "visible");
}

function show_only_passed(the_unit_test)
{
	if (the_unit_test == null)
		return;
	if (the_unit_test.tname == null || the_unit_test.tname.length < 1)
		return;
	visibility_on_exact_id("tr", the_unit_test.tname + "_passed_result", "visible");
	visibility_on_exact_id("tr", the_unit_test.tname + "_failed_result", "hidden");
}

function show_only_failed(the_unit_test)
{
	if (the_unit_test == null)
		return;
	if (the_unit_test.tname == null || the_unit_test.tname.length < 1)
		return;
	visibility_on_exact_id("tr", the_unit_test.tname + "_passed_result", "hidden");
	visibility_on_exact_id("tr", the_unit_test.tname + "_failed_result", "visible");
}
