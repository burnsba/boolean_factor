function get_test_values() {
return [
"A", "A",
"|A", "|A",
"^A", "^A",
"&A", "&A",
"A|", "A|",
"A^", "A^",
"A&", "A&",
"|A|", "|A|",
"^A^", "^A^",
"&A&", "&A&",
"|A^", "|A^",
"|A&", "|A&",
"&A^", "&A^",
"^A|", "^A|",
"&A|", "&A|",
"^A&", "^A&",
"(A)", "A",
"|(A)", "|A",
"^(A)", "^A",
"&(A)", "&A",
"(A)|", "A|",
"(A)^", "A^",
"(A)&", "A&",
"|(A)|", "|A|",
"^(A)^", "^A^",
"&(A)&", "&A&",
"|(A)^", "|A^",
"|(A)&", "|A&",
"&(A)^", "&A^",
"^(A)|", "^A|",
"&(A)|", "&A|",
"^(A)&", "^A&",
"(A)|(B)", "A|B",
"|(A)|(B)", "|A|B",
"^(A)|(B)", "^A|B",
"&(A)|(B)", "&A|B",
"(A)|(B)|", "A|B|",
"(A)|(B)^", "A|B^",
"(A)|(B)&", "A|B&",
"|(A)|(B)|", "|A|B|",
"^(A)|(B)^", "^A|B^",
"&(A)|(B)&", "&A|B&",
"|(A)|(B)^", "|A|B^",
"|(A)|(B)&", "|A|B&",
"&(A)|(B)^", "&A|B^",
"^(A)|(B)|", "^A|B|",
"&(A)|(B)|", "&A|B|",
"^(A)|(B)&", "^A|B&",
"(A)^(B)", "A^B",
"|(A)^(B)", "|A^B",
"^(A)^(B)", "^A^B",
"&(A)^(B)", "&A^B",
"(A)^(B)|", "A^B|",
"(A)^(B)^", "A^B^",
"(A)^(B)&", "A^B&",
"|(A)^(B)|", "|A^B|",
"^(A)^(B)^", "^A^B^",
"&(A)^(B)&", "&A^B&",
"|(A)^(B)^", "|A^B^",
"|(A)^(B)&", "|A^B&",
"&(A)^(B)^", "&A^B^",
"^(A)^(B)|", "^A^B|",
"&(A)^(B)|", "&A^B|",
"^(A)^(B)&", "^A^B&",
"(A)&(B)", "A&B",
"|(A)&(B)", "|A&B",
"^(A)&(B)", "^A&B",
"&(A)&(B)", "&A&B",
"(A)&(B)|", "A&B|",
"(A)&(B)^", "A&B^",
"(A)&(B)&", "A&B&",
"|(A)&(B)|", "|A&B|",
"^(A)&(B)^", "^A&B^",
"&(A)&(B)&", "&A&B&",
"|(A)&(B)^", "|A&B^",
"|(A)&(B)&", "|A&B&",
"&(A)&(B)^", "&A&B^",
"^(A)&(B)|", "^A&B|",
"&(A)&(B)|", "&A&B|",
"^(A)&(B)&", "^A&B&",
"(A|B)", "A|B",
"|(A|B)", "|A|B",
"^(A|B)", "^(A|B)",
"&(A|B)", "&(A|B)",
"(A|B)|", "A|B|",
"(A|B)^", "(A|B)^",
"(A|B)&", "(A|B)&",
"|(A|B)|", "|A|B|",
"^(A|B)^", "^(A|B)^",
"&(A|B)&", "&(A|B)&",
"|(A|B)^", "|(A|B)^",
"|(A|B)&", "|(A|B)&",
"&(A|B)^", "&(A|B)^",
"^(A|B)|", "^(A|B)|",
"&(A|B)|", "&(A|B)|",
"^(A|B)&", "^(A|B)&",
"(A^B)", "A^B",
"|(A^B)", "|A^B",
"^(A^B)", "^A^B",
"&(A^B)", "&(A^B)",
"(A^B)|", "A^B|",
"(A^B)^", "A^B^",
"(A^B)&", "(A^B)&",
"|(A^B)|", "|A^B|",
"^(A^B)^", "^A^B^",
"&(A^B)&", "&(A^B)&",
"|(A^B)^", "|A^B^",
"|(A^B)&", "|(A^B)&",
"&(A^B)^", "&(A^B)^",
"^(A^B)|", "^A^B|",
"&(A^B)|", "&(A^B)|",
"^(A^B)&", "^(A^B)&",
"(A&B)", "A&B",
"|(A&B)", "|A&B",
"^(A&B)", "^A&B",
"&(A&B)", "&A&B",
"(A&B)|", "A&B|",
"(A&B)^", "A&B^",
"(A&B)&", "A&B&",
"|(A&B)|", "|A&B|",
"^(A&B)^", "^A&B^",
"&(A&B)&", "&A&B&",
"|(A&B)^", "|A&B^",
"|(A&B)&", "|A&B&",
"&(A&B)^", "&A&B^",
"^(A&B)|", "^A&B|",
"&(A&B)|", "&A&B|",
"^(A&B)&", "^A&B&",
"(A|B)|(A|B)", "A|B",
"|(A|B)|(A|B)", "|A|B",
"^(A|B)|(A|B)", "^(A|B)|A|B",
"&(A|B)|(A|B)", "&(A|B)|A|B",
"(A|B)|(A|B)|", "A|B|",
"(A|B)|(A|B)^", "A|B|(A|B)^",
"(A|B)|(A|B)&", "A|B|(A|B)&",
"|(A|B)|(A|B)|", "|A|B|",
"^(A|B)|(A|B)^", "^(A|B)|(A|B)^",
"&(A|B)|(A|B)&", "&(A|B)|(A|B)&",
"|(A|B)|(A|B)^", "|A|B|(A|B)^",
"|(A|B)|(A|B)&", "|A|B|(A|B)&",
"&(A|B)|(A|B)^", "&(A|B)|(A|B)^",
"^(A|B)|(A|B)|", "^(A|B)|A|B|",
"&(A|B)|(A|B)|", "&(A|B)|A|B|",
"^(A|B)|(A|B)&", "^(A|B)|(A|B)&",
"(A|B)|(C|D)", "A|B|C|D",
"|(A|B)|(C|D)", "|A|B|C|D",
"^(A|B)|(C|D)", "^(A|B)|C|D",
"&(A|B)|(C|D)", "&(A|B)|C|D",
"(A|B)|(C|D)|", "A|B|C|D|",
"(A|B)|(C|D)^", "A|B|(C|D)^",
"(A|B)|(C|D)&", "A|B|(C|D)&",
"|(A|B)|(C|D)|", "|A|B|C|D|",
"^(A|B)|(C|D)^", "^(A|B)|(C|D)^",
"&(A|B)|(C|D)&", "&(A|B)|(C|D)&",
"|(A|B)|(C|D)^", "|A|B|(C|D)^",
"|(A|B)|(C|D)&", "|A|B|(C|D)&",
"&(A|B)|(C|D)^", "&(A|B)|(C|D)^",
"^(A|B)|(C|D)|", "^(A|B)|C|D|",
"&(A|B)|(C|D)|", "&(A|B)|C|D|",
"^(A|B)|(C|D)&", "^(A|B)|(C|D)&",
"(A|B)^(A|B)", "0",
"|(A|B)^(A|B)", "|0",
"^(A|B)^(A|B)", "^0",
"&(A|B)^(A|B)", "&(A|B)^(A|B)",
"(A|B)^(A|B)|", "0|",
"(A|B)^(A|B)^", "0^",
"(A|B)^(A|B)&", "(A|B)^(A|B)&",
"|(A|B)^(A|B)|", "|",
"^(A|B)^(A|B)^", "^",
"&(A|B)^(A|B)&", "&(A|B)^(A|B)&",
"|(A|B)^(A|B)^", "|0^",
"|(A|B)^(A|B)&", "|(A|B)^(A|B)&",
"&(A|B)^(A|B)^", "&(A|B)^(A|B)^",
"^(A|B)^(A|B)|", "^0|",
"&(A|B)^(A|B)|", "&(A|B)^(A|B)|",
"^(A|B)^(A|B)&", "^(A|B)^(A|B)&",
"(A|B)^(C|D)", "(A|B)^(C|D)",
"|(A|B)^(C|D)", "|(A|B)^(C|D)",
"^(A|B)^(C|D)", "^(A|B)^(C|D)",
"&(A|B)^(C|D)", "&(A|B)^(C|D)",
"(A|B)^(C|D)|", "(A|B)^(C|D)|",
"(A|B)^(C|D)^", "(A|B)^(C|D)^",
"(A|B)^(C|D)&", "(A|B)^(C|D)&",
"|(A|B)^(C|D)|", "|(A|B)^(C|D)|",
"^(A|B)^(C|D)^", "^(A|B)^(C|D)^",
"&(A|B)^(C|D)&", "&(A|B)^(C|D)&",
"|(A|B)^(C|D)^", "|(A|B)^(C|D)^",
"|(A|B)^(C|D)&", "|(A|B)^(C|D)&",
"&(A|B)^(C|D)^", "&(A|B)^(C|D)^",
"^(A|B)^(C|D)|", "^(A|B)^(C|D)|",
"&(A|B)^(C|D)|", "&(A|B)^(C|D)|",
"^(A|B)^(C|D)&", "^(A|B)^(C|D)&",
"(A|B)&(A|B)", "A|B",
"|(A|B)&(A|B)", "|A|B",
"^(A|B)&(A|B)", "^(A|B)",
"&(A|B)&(A|B)", "&(A|B)",
"(A|B)&(A|B)|", "A|B|",
"(A|B)&(A|B)^", "(A|B)^",
"(A|B)&(A|B)&", "(A|B)&",
"|(A|B)&(A|B)|", "|A|B|",
"^(A|B)&(A|B)^", "^(A|B)^",
"&(A|B)&(A|B)&", "&(A|B)&",
"|(A|B)&(A|B)^", "|(A|B)^",
"|(A|B)&(A|B)&", "|(A|B)&",
"&(A|B)&(A|B)^", "&(A|B)^",
"^(A|B)&(A|B)|", "^(A|B)|",
"&(A|B)&(A|B)|", "&(A|B)|",
"^(A|B)&(A|B)&", "^(A|B)&",
"(A|B)&(C|D)", "(A|B)&(C|D)",
"|(A|B)&(C|D)", "|(A|B)&(C|D)",
"^(A|B)&(C|D)", "^(A|B)&(C|D)",
"&(A|B)&(C|D)", "&(A|B)&(C|D)",
"(A|B)&(C|D)|", "(A|B)&(C|D)|",
"(A|B)&(C|D)^", "(A|B)&(C|D)^",
"(A|B)&(C|D)&", "(A|B)&(C|D)&",
"|(A|B)&(C|D)|", "|(A|B)&(C|D)|",
"^(A|B)&(C|D)^", "^(A|B)&(C|D)^",
"&(A|B)&(C|D)&", "&(A|B)&(C|D)&",
"|(A|B)&(C|D)^", "|(A|B)&(C|D)^",
"|(A|B)&(C|D)&", "|(A|B)&(C|D)&",
"&(A|B)&(C|D)^", "&(A|B)&(C|D)^",
"^(A|B)&(C|D)|", "^(A|B)&(C|D)|",
"&(A|B)&(C|D)|", "&(A|B)&(C|D)|",
"^(A|B)&(C|D)&", "^(A|B)&(C|D)&",
"(A^B)|(A^B)", "A^B",
"|(A^B)|(A^B)", "|A^B",
"^(A^B)|(A^B)", "^A^B|A^B",
"&(A^B)|(A^B)", "&(A^B)|A^B",
"(A^B)|(A^B)|", "A^B|",
"(A^B)|(A^B)^", "A^B|A^B^",
"(A^B)|(A^B)&", "A^B|(A^B)&",
"|(A^B)|(A^B)|", "|A^B|",
"^(A^B)|(A^B)^", "^A^B|A^B^",
"&(A^B)|(A^B)&", "&(A^B)|(A^B)&",
"|(A^B)|(A^B)^", "|A^B|A^B^",
"|(A^B)|(A^B)&", "|A^B|(A^B)&",
"&(A^B)|(A^B)^", "&(A^B)|A^B^",
"^(A^B)|(A^B)|", "^A^B|A^B|",
"&(A^B)|(A^B)|", "&(A^B)|A^B|",
"^(A^B)|(A^B)&", "^A^B|(A^B)&",
"(A^B)|(C^D)", "A^B|C^D",
"|(A^B)|(C^D)", "|A^B|C^D",
"^(A^B)|(C^D)", "^A^B|C^D",
"&(A^B)|(C^D)", "&(A^B)|C^D",
"(A^B)|(C^D)|", "A^B|C^D|",
"(A^B)|(C^D)^", "A^B|C^D^",
"(A^B)|(C^D)&", "A^B|(C^D)&",
"|(A^B)|(C^D)|", "|A^B|C^D|",
"^(A^B)|(C^D)^", "^A^B|C^D^",
"&(A^B)|(C^D)&", "&(A^B)|(C^D)&",
"|(A^B)|(C^D)^", "|A^B|C^D^",
"|(A^B)|(C^D)&", "|A^B|(C^D)&",
"&(A^B)|(C^D)^", "&(A^B)|C^D^",
"^(A^B)|(C^D)|", "^A^B|C^D|",
"&(A^B)|(C^D)|", "&(A^B)|C^D|",
"^(A^B)|(C^D)&", "^A^B|(C^D)&",
"(A^B)^(A^B)", "0",
"|(A^B)^(A^B)", "|0",
"^(A^B)^(A^B)", "^0",
"&(A^B)^(A^B)", "&(A^B)^A^B",
"(A^B)^(A^B)|", "0|",
"(A^B)^(A^B)^", "0^",
"(A^B)^(A^B)&", "A^B^(A^B)&",
"|(A^B)^(A^B)|", "|",
"^(A^B)^(A^B)^", "^",
"&(A^B)^(A^B)&", "&(A^B)^(A^B)&",
"|(A^B)^(A^B)^", "|0^",
"|(A^B)^(A^B)&", "|A^B^(A^B)&",
"&(A^B)^(A^B)^", "&(A^B)^A^B^",
"^(A^B)^(A^B)|", "^0|",
"&(A^B)^(A^B)|", "&(A^B)^A^B|",
"^(A^B)^(A^B)&", "^A^B^(A^B)&",
"(A^B)^(C^D)", "A^B^C^D",
"|(A^B)^(C^D)", "|A^B^C^D",
"^(A^B)^(C^D)", "^A^B^C^D",
"&(A^B)^(C^D)", "&(A^B)^C^D",
"(A^B)^(C^D)|", "A^B^C^D|",
"(A^B)^(C^D)^", "A^B^C^D^",
"(A^B)^(C^D)&", "A^B^(C^D)&",
"|(A^B)^(C^D)|", "|A^B^C^D|",
"^(A^B)^(C^D)^", "^A^B^C^D^",
"&(A^B)^(C^D)&", "&(A^B)^(C^D)&",
"|(A^B)^(C^D)^", "|A^B^C^D^",
"|(A^B)^(C^D)&", "|A^B^(C^D)&",
"&(A^B)^(C^D)^", "&(A^B)^C^D^",
"^(A^B)^(C^D)|", "^A^B^C^D|",
"&(A^B)^(C^D)|", "&(A^B)^C^D|",
"^(A^B)^(C^D)&", "^A^B^(C^D)&",
"(A^B)&(A^B)", "A^B",
"|(A^B)&(A^B)", "|A^B",
"^(A^B)&(A^B)", "^A^B",
"&(A^B)&(A^B)", "&(A^B)",
"(A^B)&(A^B)|", "A^B|",
"(A^B)&(A^B)^", "A^B^",
"(A^B)&(A^B)&", "(A^B)&",
"|(A^B)&(A^B)|", "|A^B|",
"^(A^B)&(A^B)^", "^A^B^",
"&(A^B)&(A^B)&", "&(A^B)&",
"|(A^B)&(A^B)^", "|A^B^",
"|(A^B)&(A^B)&", "|(A^B)&",
"&(A^B)&(A^B)^", "&(A^B)^",
"^(A^B)&(A^B)|", "^A^B|",
"&(A^B)&(A^B)|", "&(A^B)|",
"^(A^B)&(A^B)&", "^(A^B)&",
"(A^B)&(C^D)", "(A^B)&(C^D)",
"|(A^B)&(C^D)", "|(A^B)&(C^D)",
"^(A^B)&(C^D)", "^(A^B)&(C^D)",
"&(A^B)&(C^D)", "&(A^B)&(C^D)",
"(A^B)&(C^D)|", "(A^B)&(C^D)|",
"(A^B)&(C^D)^", "(A^B)&(C^D)^",
"(A^B)&(C^D)&", "(A^B)&(C^D)&",
"|(A^B)&(C^D)|", "|(A^B)&(C^D)|",
"^(A^B)&(C^D)^", "^(A^B)&(C^D)^",
"&(A^B)&(C^D)&", "&(A^B)&(C^D)&",
"|(A^B)&(C^D)^", "|(A^B)&(C^D)^",
"|(A^B)&(C^D)&", "|(A^B)&(C^D)&",
"&(A^B)&(C^D)^", "&(A^B)&(C^D)^",
"^(A^B)&(C^D)|", "^(A^B)&(C^D)|",
"&(A^B)&(C^D)|", "&(A^B)&(C^D)|",
"^(A^B)&(C^D)&", "^(A^B)&(C^D)&",
"(A&B)|(A&B)", "A&B",
"|(A&B)|(A&B)", "|A&B",
"^(A&B)|(A&B)", "^A&B|A&B",
"&(A&B)|(A&B)", "&A&B|A&B",
"(A&B)|(A&B)|", "A&B|",
"(A&B)|(A&B)^", "A&B|A&B^",
"(A&B)|(A&B)&", "A&B|A&B&",
"|(A&B)|(A&B)|", "|A&B|",
"^(A&B)|(A&B)^", "^A&B|A&B^",
"&(A&B)|(A&B)&", "&A&B|A&B&",
"|(A&B)|(A&B)^", "|A&B|A&B^",
"|(A&B)|(A&B)&", "|A&B|A&B&",
"&(A&B)|(A&B)^", "&A&B|A&B^",
"^(A&B)|(A&B)|", "^A&B|A&B|",
"&(A&B)|(A&B)|", "&A&B|A&B|",
"^(A&B)|(A&B)&", "^A&B|A&B&",
"(A&B)|(C&D)", "A&B|C&D",
"|(A&B)|(C&D)", "|A&B|C&D",
"^(A&B)|(C&D)", "^A&B|C&D",
"&(A&B)|(C&D)", "&A&B|C&D",
"(A&B)|(C&D)|", "A&B|C&D|",
"(A&B)|(C&D)^", "A&B|C&D^",
"(A&B)|(C&D)&", "A&B|C&D&",
"|(A&B)|(C&D)|", "|A&B|C&D|",
"^(A&B)|(C&D)^", "^A&B|C&D^",
"&(A&B)|(C&D)&", "&A&B|C&D&",
"|(A&B)|(C&D)^", "|A&B|C&D^",
"|(A&B)|(C&D)&", "|A&B|C&D&",
"&(A&B)|(C&D)^", "&A&B|C&D^",
"^(A&B)|(C&D)|", "^A&B|C&D|",
"&(A&B)|(C&D)|", "&A&B|C&D|",
"^(A&B)|(C&D)&", "^A&B|C&D&",
"(A&B)^(A&B)", "0",
"|(A&B)^(A&B)", "|0",
"^(A&B)^(A&B)", "^0",
"&(A&B)^(A&B)", "&A&B^A&B",
"(A&B)^(A&B)|", "0|",
"(A&B)^(A&B)^" , "0^",
"(A&B)^(A&B)&", "A&B^A&B&",
"|(A&B)^(A&B)|", "|",
"^(A&B)^(A&B)^", "^",
"&(A&B)^(A&B)&", "&A&B^A&B&",
"|(A&B)^(A&B)^", "|0^",
"|(A&B)^(A&B)&", "|A&B^A&B&",
"&(A&B)^(A&B)^", "&A&B^A&B^",
"^(A&B)^(A&B)|", "^0|",
"&(A&B)^(A&B)|", "&A&B^A&B|",
"^(A&B)^(A&B)&", "^A&B^A&B&",
"(A&B)^(C&D)", "A&B^C&D",
"|(A&B)^(C&D)", "|A&B^C&D",
"^(A&B)^(C&D)", "^A&B^C&D",
"&(A&B)^(C&D)", "&A&B^C&D",
"(A&B)^(C&D)|", "A&B^C&D|",
"(A&B)^(C&D)^", "A&B^C&D^",
"(A&B)^(C&D)&", "A&B^C&D&",
"|(A&B)^(C&D)|", "|A&B^C&D|",
"^(A&B)^(C&D)^", "^A&B^C&D^",
"&(A&B)^(C&D)&", "&A&B^C&D&",
"|(A&B)^(C&D)^", "|A&B^C&D^",
"|(A&B)^(C&D)&", "|A&B^C&D&",
"&(A&B)^(C&D)^", "&A&B^C&D^",
"^(A&B)^(C&D)|", "^A&B^C&D|",
"&(A&B)^(C&D)|", "&A&B^C&D|",
"^(A&B)^(C&D)&", "^A&B^C&D&",
"(A&B)&(A&B)", "A&B",
"|(A&B)&(A&B)", "|A&B",
"^(A&B)&(A&B)", "^A&B",
"&(A&B)&(A&B)", "&A&B",
"(A&B)&(A&B)|", "A&B|",
"(A&B)&(A&B)^", "A&B^",
"(A&B)&(A&B)&", "A&B&",
"|(A&B)&(A&B)|", "|A&B|",
"^(A&B)&(A&B)^", "^A&B^",
"&(A&B)&(A&B)&", "&A&B&",
"|(A&B)&(A&B)^", "|A&B^",
"|(A&B)&(A&B)&", "|A&B&",
"&(A&B)&(A&B)^", "&A&B^",
"^(A&B)&(A&B)|", "^A&B|",
"&(A&B)&(A&B)|", "&A&B|",
"^(A&B)&(A&B)&", "^A&B&",
"(A&B)&(C&D)", "A&B&C&D",
"|(A&B)&(C&D)", "|A&B&C&D",
"^(A&B)&(C&D)", "^A&B&C&D",
"&(A&B)&(C&D)", "&A&B&C&D",
"(A&B)&(C&D)|", "A&B&C&D|",
"(A&B)&(C&D)^", "A&B&C&D^",
"(A&B)&(C&D)&", "A&B&C&D&",
"|(A&B)&(C&D)|", "|A&B&C&D|",
"^(A&B)&(C&D)^", "^A&B&C&D^",
"&(A&B)&(C&D)&", "&A&B&C&D&",
"|(A&B)&(C&D)^", "|A&B&C&D^",
"|(A&B)&(C&D)&", "|A&B&C&D&",
"&(A&B)&(C&D)^", "&A&B&C&D^",
"^(A&B)&(C&D)|", "^A&B&C&D|",
"&(A&B)&(C&D)|", "&A&B&C&D|",
"^(A&B)&(C&D)&", "^A&B&C&D&",
"((A))", "A",
"(((A)))", "A",
"((((A))))", "A",
"(((((A)))))", "A",
"((A|B)|(A|B))", "A|B",
"(((A|B))|((A|B)))", "A|B",
"((A|B))|((A|B))", "A|B",
"(((A|B))|((A|B)))", "A|B",
"A|(A|B|(A|B|(A|B)))", "A|B",
"A|(B|(C|(D)))", "A|B|C|D",
"A|(B|C)&(B|(C|D))", "A|(B|C)&(B|C|D)",
"((((A|B)))|(((A|B))))", "A|B",
"(A|B|C|D)|(A|B|C|D)", "A|B|C|D",
"((A|B)|(C|D))|((A|B)|(C|D))", "A|B|C|D",
"(A|(B|C)|D)|(A|(B|C)|D)", "A|B|C|D",
"(A|B|(C|D))|(A|B|(C|D))", "A|B|C|D",
"((A))", "A",
"|((A))", "|A",
"((A))|", "A|",
"|((A))|", "|A|",
"^((A))", "^A",
"((A))^", "A^",
"^((A))^", "^A^",
"&((A))", "&A",
"((A))&", "A&",
"&((A))&", "&A&",
"|((A))^", "|A^",
"|((A))&", "|A&",
"^((A))|", "^A|",
"^((A))&", "^A&",
"&((A))|", "&A|",
"&((A))^", "&A^",
"((A)|(B))", "A|B",
"((A)^(B))", "A^B",
"((A)&(B))", "A&B",
"|((A)|(B))", "|A|B",
"|((A)^(B))", "|A^B",
"|((A)&(B))", "|A&B",
"((A)|(B))|", "A|B|",
"((A)^(B))|", "A^B|",
"((A)&(B))|", "A&B|",
"|((A)|(B))|", "|A|B|",
"|((A)^(B))|", "|A^B|",
"|((A)&(B))|", "|A&B|",
"^((A)|(B))", "^(A|B)",
"^((A)^(B))", "^A^B",
"^((A)&(B))", "^A&B",
"((A)|(B))^", "(A|B)^",
"((A)^(B))^", "A^B^",
"((A)&(B))^", "A&B^",
"^((A)|(B))^", "^(A|B)^",
"^((A)^(B))^", "^A^B^",
"^((A)&(B))^", "^A&B^",
"&((A)|(B))", "&(A|B)",
"&((A)^(B))", "&(A^B)",
"&((A)&(B))", "&A&B",
"((A)|(B))&", "(A|B)&",
"((A)^(B))&", "(A^B)&",
"((A)&(B))&", "A&B&",
"&((A)|(B))&", "&(A|B)&",
"&((A)^(B))&", "&(A^B)&",
"&((A)&(B))&", "&A&B&",
"|((A)|(B))^", "|(A|B)^",
"|((A)^(B))^", "|A^B^",
"|((A)&(B))^", "|A&B^",
"|((A)|(B))&", "|(A|B)&",
"|((A)^(B))&", "|(A^B)&",
"|((A)&(B))&", "|A&B&",
"^((A)|(B))|", "^(A|B)|",
"^((A)^(B))|", "^A^B|",
"^((A)&(B))|", "^A&B|",
"^((A)|(B))|", "^(A|B)|",
"^((A)^(B))|", "^A^B|",
"^((A)&(B))|", "^A&B|",
"&((A)|(B))|", "&(A|B)|",
"&((A)^(B))|", "&(A^B)|",
"&((A)&(B))|", "&A&B|",
"&((A)|(B))^", "&(A|B)^",
"&((A)^(B))^", "&(A^B)^",
"&((A)&(B))^", "&A&B^",
"((A))|((B))", "A|B",
"|((A))|((B))", "|A|B",
"((A))|((B))|", "A|B|",
"|((A))|((B))|", "|A|B|",
"^((A))|((B))", "^A|B",
"((A))|((B))^", "A|B^",
"^((A))|((B))^", "^A|B^",
"&((A))|((B))", "&A|B",
"((A))|((B))&", "A|B&",
"&((A))|((B))&", "&A|B&",
"|((A))|((B))^", "|A|B^",
"|((A))|((B))&", "|A|B&",
"^((A))|((B))|", "^A|B|",
"^((A))|((B))&", "^A|B&",
"&((A))|((B))|", "&A|B|",
"&((A))|((B))^", "&A|B^",
"((A))^((B))", "A^B",
"|((A))^((B))", "|A^B",
"((A))^((B))|", "A^B|",
"|((A))^((B))|", "|A^B|",
"^((A))^((B))", "^A^B",
"((A))^((B))^", "A^B^",
"^((A))^((B))^", "^A^B^",
"&((A))^((B))", "&A^B",
"((A))^((B))&", "A^B&",
"&((A))^((B))&", "&A^B&",
"|((A))^((B))^", "|A^B^",
"|((A))^((B))&", "|A^B&",
"^((A))^((B))|", "^A^B|",
"^((A))^((B))&", "^A^B&",
"&((A))^((B))|", "&A^B|",
"&((A))^((B))^", "&A^B^",
"((A))&((B))", "A&B",
"|((A))&((B))", "|A&B",
"((A))&((B))|", "A&B|",
"|((A))&((B))|", "|A&B|",
"^((A))&((B))", "^A&B",
"((A))&((B))^", "A&B^",
"^((A))&((B))^", "^A&B^",
"&((A))&((B))", "&A&B",
"((A))&((B))&", "A&B&",
"&((A))&((B))&", "&A&B&",
"|((A))&((B))^", "|A&B^",
"|((A))&((B))&", "|A&B&",
"^((A))&((B))|", "^A&B|",
"^((A))&((B))&", "^A&B&",
"&((A))&((B))|", "&A&B|",
"&((A))&((B))^", "&A&B^",
"((A|B))", "A|B",
"|((A|B))", "|A|B",
"((A|B))|", "A|B|",
"|((A|B))|", "|A|B|",
"^((A|B))", "^(A|B)",
"((A|B))^", "(A|B)^",
"^((A|B))^", "^(A|B)^",
"&((A|B))", "&(A|B)",
"((A|B))&", "(A|B)&",
"&((A|B))&", "&(A|B)&",
"|((A|B))^", "|(A|B)^",
"|((A|B))&", "|(A|B)&",
"^((A|B))|", "^(A|B)|",
"^((A|B))&", "^(A|B)&",
"&((A|B))|", "&(A|B)|",
"&((A|B))^", "&(A|B)^",
"((A^B))", "A^B",
"|((A^B))", "|A^B",
"((A^B))|", "A^B|",
"|((A^B))|", "|A^B|",
"^((A^B))", "^A^B",
"((A^B))^", "A^B^",
"^((A^B))^", "^A^B^",
"&((A^B))", "&(A^B)",
"((A^B))&", "(A^B)&",
"&((A^B))&", "&(A^B)&",
"|((A^B))^", "|A^B^",
"|((A^B))&", "|(A^B)&",
"^((A^B))|", "^A^B|",
"^((A^B))&", "^(A^B)&",
"&((A^B))|", "&(A^B)|",
"&((A^B))^", "&(A^B)^",
"((A&B))", "A&B",
"|((A&B))", "|A&B",
"((A&B))|", "A&B|",
"|((A&B))|", "|A&B|",
"^((A&B))", "^A&B",
"((A&B))^", "A&B^",
"^((A&B))^", "^A&B^",
"&((A&B))", "&A&B",
"((A&B))&", "A&B&",
"&((A&B))&", "&A&B&",
"|((A&B))^", "|A&B^",
"|((A&B))&", "|A&B&",
"^((A&B))|", "^A&B|",
"^((A&B))&", "^A&B&",
"&((A&B))|", "&A&B|",
"&((A&B))^", "&A&B^",
"A|(A|(A|(A)))", "A",
"A|(A|(A^(A)))", "A",
"A|(A|(A&(A)))", "A",
"A|(A^(A|(A)))", "A",
"A|(A^(A^(A)))", "A",
"A|(A^(A&(A)))", "A",
"A|(A&(A|(A)))", "A",
"A|(A&(A^(A)))", "A",
"A|(A&(A&(A)))", "A",
"A^(A|(A|(A)))", "0",
"A^(A|(A^(A)))", "0",
"A^(A|(A&(A)))", "0",
"A^(A^(A|(A)))", "A",
"A^(A^(A^(A)))", "0",
"A^(A^(A&(A)))", "A",
"A^(A&(A|(A)))", "0",
"A^(A&(A^(A)))", "A",
"A^(A&(A&(A)))", "0",
"A&(A|(A|(A)))", "A",
"A&(A|(A^(A)))", "A",
"A&(A|(A&(A)))", "A",
"A&(A^(A|(A)))", "0",
"A&(A^(A^(A)))", "A",
"A&(A^(A&(A)))", "0",
"A&(A&(A|(A)))", "A",
"A&(A&(A^(A)))", "0",
"A&(A&(A&(A)))", "A",
"A|(B|(A|(B)))", "A|B",
"A|(B|(A^(B)))", "A|A^B|B",
"A|(B|(A&(B)))", "A|A&B|B",
"A|(B^(A|(B)))", "A|B^(A|B)",
"A|(B^(A^(B)))", "A",
"A|(B^(A&(B)))", "A|A&B^B",
"A|(B&(A|(B)))", "A|B&(A|B)",
"A|(B&(A^(B)))", "A|B&(A^B)",
"A|(B&(A&(B)))", "A|A&B",
"A^(B|(A|(B)))", "A^(A|B)",
"A^(B|(A^(B)))", "A^(A^B|B)",
"A^(B|(A&(B)))", "A^(A&B|B)",
"A^(B^(A|(B)))", "A^B^(A|B)",
"A^(B^(A^(B)))", "0",
"A^(B^(A&(B)))", "A^A&B^B",
"A^(B&(A|(B)))", "A^B&(A|B)",
"A^(B&(A^(B)))", "A^B&(A^B)",
"A^(B&(A&(B)))", "A^A&B",
"A&(B|(A|(B)))", "A&(A|B)",
"A&(B|(A^(B)))", "A&(A^B|B)",
"A&(B|(A&(B)))", "A&(A&B|B)",
"A&(B^(A|(B)))", "A&(B^(A|B))",
"A&(B^(A^(B)))", "A",
"A&(B^(A&(B)))", "A&(A&B^B)",
"A&(B&(A|(B)))", "A&B&(A|B)",
"A&(B&(A^(B)))", "A&B&(A^B)",
"A&(B&(A&(B)))", "A&B",
"((A|B)|(C|D))", "A|B|C|D",
"((A|B)|(C^D))", "A|B|C^D",
"((A|B)|(C&D))", "A|B|C&D",
"((A|B)^(C|D))", "(A|B)^(C|D)",
"((A|B)^(C^D))", "(A|B)^C^D",
"((A|B)^(C&D))", "(A|B)^C&D",
"((A|B)&(C|D))", "(A|B)&(C|D)",
"((A|B)&(C^D))", "(A|B)&(C^D)",
"((A|B)&(C&D))", "(A|B)&C&D",
"((A^B)|(C|D))", "A^B|C|D",
"((A^B)|(C^D))", "A^B|C^D",
"((A^B)|(C&D))", "A^B|C&D",
"((A^B)^(C|D))", "A^B^(C|D)",
"((A^B)^(C^D))", "A^B^C^D",
"((A^B)^(C&D))", "A^B^C&D",
"((A^B)&(C|D))", "(A^B)&(C|D)",
"((A^B)&(C^D))", "(A^B)&(C^D)",
"((A^B)&(C&D))", "(A^B)&C&D",
"((A&B)|(C|D))", "A&B|C|D",
"((A&B)|(C^D))", "A&B|C^D",
"((A&B)|(C&D))", "A&B|C&D",
"((A&B)^(C|D))", "A&B^(C|D)",
"((A&B)^(C^D))", "A&B^C^D",
"((A&B)^(C&D))", "A&B^C&D",
"((A&B)&(C|D))", "A&B&(C|D)",
"((A&B)&(C^D))", "A&B&(C^D)",
"((A&B)&(C&D))", "A&B&C&D",
"A|(B|(C|(D)))", "A|B|C|D",
"A|(B|(C^(D)))", "A|B|C^D",
"A|(B|(C&(D)))", "A|B|C&D",
"A|(B^(C|(D)))", "A|B^(C|D)",
"A|(B^(C^(D)))", "A|B^C^D",
"A|(B^(C&(D)))", "A|B^C&D",
"A|(B&(C|(D)))", "A|B&(C|D)",
"A|(B&(C^(D)))", "A|B&(C^D)",
"A|(B&(C&(D)))", "A|B&C&D",
"A^(B|(C|(D)))", "A^(B|C|D)",
"A^(B|(C^(D)))", "A^(B|C^D)",
"A^(B|(C&(D)))", "A^(B|C&D)",
"A^(B^(C|(D)))", "A^B^(C|D)",
"A^(B^(C^(D)))", "A^B^C^D",
"A^(B^(C&(D)))", "A^B^C&D",
"A^(B&(C|(D)))", "A^B&(C|D)",
"A^(B&(C^(D)))", "A^B&(C^D)",
"A^(B&(C&(D)))", "A^B&C&D",
"A&(B|(C|(D)))", "A&(B|C|D)",
"A&(B|(C^(D)))", "A&(B|C^D)",
"A&(B|(C&(D)))", "A&(B|C&D)",
"A&(B^(C|(D)))", "A&(B^(C|D))",
"A&(B^(C^(D)))", "A&(B^C^D)",
"A&(B^(C&(D)))", "A&(B^C&D)",
"A&(B&(C|(D)))", "A&B&(C|D)",
"A&(B&(C^(D)))", "A&B&(C^D)",
"A&(B&(C&(D)))", "A&B&C&D"
];
}