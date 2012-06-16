#!/usr/bin/perl -wT
################################################################################
# Copyright (C) 2012 Ben Burns
# benjaminaburns@gmail.com 
#
# Permission is hereby granted, free of charge, to any person obtaining a copy 
# of this software and associated documentation files (the "Software"), to deal 
# in the Software without restriction, including without limitation the rights 
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
# copies of the Software, and to permit persons to whom the Software is 
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in 
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
# DEALINGS IN THE SOFTWARE.
#
################################################################################
use CGI::Carp qw(warningsToBrowser fatalsToBrowser);
use strict;
print "Content-type: text/html\n\n";

my $script_name = "UnitTest perl script/html generator 2012.06.09";

my $test_file_prefix = "../web/";
my $test_values_prefix = "../web/unit_tests/";

##### do stuff

my $file_to_test = &get_value_from_query("filename");
my @include_files = &get_all_values_from_query("i");
my $header_to_write = "";
my $body_to_write = "";

# keep the test file in the correct directory
$file_to_test =~ s/..\///g;

# fail on file not found
if ($file_to_test eq "")
{
	$body_to_write .= "Error: Could not find filename in query string.";
	&write_html($header_to_write, $body_to_write);
	exit;
}
# fail on file does not exist
unless (-e $test_file_prefix . $file_to_test)
{
	$body_to_write .= "Error: The test file could not be found in the test directory.\n<p>";
	$body_to_write .= "Test file: $file_to_test\n<p>";
	&write_html($header_to_write, $body_to_write);
	exit;
}
# check that each include file exists
foreach my $t (@include_files)
{
	$t =~ s/..\///g;
	unless (-e $test_file_prefix . $t)
	{
		$body_to_write .= "Error: The include file could not be found in the test directory.\n<p>";
		$body_to_write .= "Include file: $t\n<p>";
		&write_html($header_to_write, $body_to_write);
		exit;
	}	
	$header_to_write .= "<script type=\"text/javascript\" src=\"" . $test_file_prefix . $t ."\"></script>\n";
}

# open the test file and get the list of functions
open my $fh, $test_file_prefix . $file_to_test or die "error opening file $file_to_test: $!";
my @function_names = sort grep /^(function)(.*)(\))(.*)$/, <$fh>;
close($fh);

# remove everything except the function name
for (@function_names)
{
	s/function//g;
	s/ //g;
	s/\(.*$//g;
	s/[\r\n]+//g;
	
}

# write the javascript header now
if (@function_names > 0)
{
	$header_to_write .= "<script type=\"text/javascript\">\n";

	# add all the test variables
	foreach my $t (@function_names)
	{
		$header_to_write .= "\ttest_" . $t . " = new UnitTest(\"t_" . $t . "\", " . $t . ", null, \"t_" . $t . "_results\", \n";
		$header_to_write .= "\t\t{ /* extra arguments */\n";
		$header_to_write .= "\t\tload_from_file: true,\n";
		$header_to_write .= "\t\tfile_url: \"" . $test_values_prefix . "tv_" . $t . ".csv\",\n";
		$header_to_write .= "\t\t});\n";
	}
	
	$header_to_write .= "\n\tvar timer_ref = null;\n";
	$header_to_write .= "\tvar test_count = 0;\n\n";
	
	# write a function to run all tests
	$header_to_write .= "function next_test_all()\n";
	$header_to_write .= "{\n";
	$header_to_write .= "\tclearTimeout(timer_ref);\n";
	$header_to_write .= "\tif (test_count > " . @function_names . ")\n";
	$header_to_write .= "\t{\n";
	$header_to_write .= "\t\tdocument.getElementById(\"test_all_status\").innerHTML = \"done\";\n";
	$header_to_write .= "\t\treturn;\n";
	$header_to_write .= "\t}\n";
	$header_to_write .= "\tdocument.getElementById(\"test_all_status\").innerHTML = \"running test \" + test_count + \" of " . @function_names . "\";\n";

	$header_to_write .= "\tswitch(test_count)\n";
	$header_to_write .= "\t{\n";

	my $count = 0;
	foreach my $t (@function_names)
	{
		$header_to_write .= "\t\tcase " . $count . ":\n";
		$header_to_write .= "\t\t\tload_and_go(test_" . $t . ");\n";
		$header_to_write .= "\t\tbreak;\n";
		$count = $count + 1;
	}
	$header_to_write .= "\t\tdefault:\n";
	$header_to_write .= "\t\tbreak;\n";
	$header_to_write .= "\t}\n";

	$header_to_write .= "\ttimer_ref = setTimeout(\"next_test_all()\",1000);\n";
	$header_to_write .= "\ttest_count = test_count + 1;\n";
	$header_to_write .= "\treturn;\n";
	$header_to_write .= "}\n";

	# write a function to cancel running all tests
	$header_to_write .= "function cancel_test_all()\n";
	$header_to_write .= "{\n";
	$header_to_write .= "clearTimeout(timer_ref);\n";
	$header_to_write .= "}\n";

	$header_to_write .= "</script>\n";
}

# done with the header, onto the body

if (@function_names > 0)
{
	$body_to_write .= "\t<button onclick=\"next_test_all()\">run all tests on page</button>  \n";
	$body_to_write .= "\t<button onclick=\"cancel_test_all()\">cancel running tests</button><p>\n";
	$body_to_write .= "\t<div id=\"test_all_status\"></div><p>\n";

	$body_to_write .= "\t<table class=\"unit_test_table\">\n";

	my $even_count = 0;

	foreach my $t (@function_names)
	{
		if ($even_count == 1)
		{
			$body_to_write .= "\t<tr class=\"unit_test_even_row\"><td>\n";
			$even_count = 0;
		}
		else
		{
			$body_to_write .= "\t<tr class=\"unit_test_odd_row\"><td>\n";
			$even_count = 1;
		}

		$body_to_write .= "\t\t<p>\n";
		$body_to_write .= "\t\ttest: t_" . $t . "<br>\n";
		$body_to_write .= "\t\tfile url: <a href=\"" . $test_values_prefix . "tv_" . $t . ".csv\">";
		$body_to_write .= $test_values_prefix . "tv_" . $t . ".csv</a>\n";
		$body_to_write .= "\t\t<p>\n";

		$body_to_write .= "\t\t<button onclick=\"load_and_go(test_" . $t . ")\">test</button><p>\n";
		$body_to_write .= "\t\t<button onclick=\"show_all_results(test_" . $t . ")\">Show all</button>\n";
		$body_to_write .= "\t\t<button onclick=\"hide_all_results(test_" . $t . ")\">Hide all</button>\n";
		$body_to_write .= "\t\t<button onclick=\"show_only_passed(test_" . $t . ")\">only show passed</button>\n";
		$body_to_write .= "\t\t<button onclick=\"show_only_failed(test_" . $t . ")\">only show failed</button>\n";
		$body_to_write .= "\t\t<div id=\"t_" . $t . "_results\">Results will go here (test has not been run).</div>\n";

		$body_to_write .= "\t</td></tr>\n";
	}

	$body_to_write .= "\t</table>\n";
}

# done
&write_html($header_to_write, $body_to_write);

################################################################################

sub write_html
{
	print "<html>\n<head>\n";
	print "<title>UnitTest</title>\n";
	print "<link href=\"" . $test_file_prefix . "my_style.css\" rel=\"stylesheet\" type=\"text/css\">\n";
	print "<link href=\"" . $test_values_prefix . "unit_test.css\" rel=\"stylesheet\" type=\"text/css\">\n";
	
	# need to include this file, and unit test framework
	print "<script type=\"text/javascript\" src=\"" . $test_file_prefix . $file_to_test . "\"></script>\n\n";
	print "<script type=\"text/javascript\" src=\"" . $test_file_prefix . "unit_test.js\"></script>\n\n";
	print $_[0];
	print "</head>\n\n";
	print "<body>\n";
	print "\t<a href=\"/web/index.html\">back to index</a>\n";
	print "\t<p>\n";

	print $_[1];
	
	print "\t<p>\n$script_name\n<p>";

	print "\n</body></html>";
}

sub get_value_from_query
{
	my $output = "";
	
	#get query string
	my $query = $ENV{QUERY_STRING};
	my @tokens = split('&', $query);

	#debug
	#print "<p>query: \"$query\"<p>";

	#search through query string by &
	FIND_VALUE:
	foreach my $t (@tokens)
	{
		my $left_side;
		my $right_side;
		# search through each of these by =
		my @t2 = split("=", $t);
	
		$left_side = $t2[0];
		# make sure right side exists
		if (@t2 > 0)
		{
			$right_side = $t2[1];
		}
		else
		{
			$right_side = "";
		}
	
		# found the value, and it's not empty
		if ($left_side eq $_[0] && $right_side ne "")
		{
			$output = $right_side;
			last FIND_VALUE;
		}
	}
	return $output;
}

sub get_all_values_from_query
{
	my @output;
	
	#get query string
	my $query = $ENV{QUERY_STRING};
	my @tokens = split('&', $query);

	#search through query string by &
	foreach my $t (@tokens)
	{
		my $left_side;
		my $right_side;
		# search through each of these by =
		my @t2 = split("=", $t);
	
		$left_side = $t2[0];
		# make sure right side exists
		if (@t2 > 0)
		{
			$right_side = $t2[1];
		}
		else
		{
			$right_side = "";
		}
	
		# use empty values
		if ($left_side eq $_[0])
		{
			push(@output, $right_side);
		}
	}
	return @output;
}

#EOF
