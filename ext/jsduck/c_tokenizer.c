#include "ruby.h"

VALUE SYM_TYPE;
VALUE SYM_VALUE;

VALUE SYM_IDENT;
VALUE SYM_STRING;
VALUE SYM_NUMBER;
VALUE SYM_OPERATOR;
VALUE SYM_DOC_COMMENT;

// Creates Ruby Hash: { :type => <type>, :value => <value> }
VALUE make_token(VALUE type, VALUE value) {
    VALUE tok = rb_hash_new();
    rb_hash_aset(tok, SYM_TYPE, type);
    rb_hash_aset(tok, SYM_VALUE, value);
    return tok;
}

// Returns the length of JavaScript string literal starting at position `start`.
int string_length(char* input, int start) {
    int quote = input[start]; // detect if it's single- or double-quoted string
    int i = start + 1; // skip initial quote
    int c = input[i];
    // scan until closing quote
    while (c && c != quote) {
        // skip any escaped char
        if (c == '\\') ++i;
        // pick next char
        c = input[++i];
    }
    // when string doesn't end with 0 byte add 1 for end quote
    return i - start + (c ? 1 : 0);
}

// Returns the length of JavaScript identifier starting at position `start`.
int ident_length(char* input, int start) {
    int i = start + 1; // skip initial char, which we already know is OK
    int c = input[i];
    // scan while ident characters
    while (c>='a' && c<='z' || c>='A' && c<='Z' ||c>='0' && c<='9' || c == '_' || c == '$') {
        c = input[++i];
    }
    return i - start;
}

// Returns the length of JavaScript number starting at position `start`.
int number_length(char* input, int start) {
    int i = start + 1; // skip initial char, which we already know is OK
    int c = input[i];
    char dot = '.';
    // scan while number characters
    while (c >= '0' && c <= '9' || c == dot) {
        // after first decimal separator, allow no more.
        if (c == '.') dot = '0';
        c = input[++i];
    }
    return i - start;
}

// Returns the length of JavaScript block-comment starting at position `start`.
int block_comment_length(char* input, int start) {
    int i = start + 2; // skip initial two chars, which we already know they are '/*'
    int c = input[i];
    // scan until '*/'
    while (c && !(c == '*' && input[i+1] == '/')) {
        c = input[++i];
    }
    // when string doesn't end with 0 byte add 2 for end bytes: '*/'
    return i - start + (c ? 2 : 0);
}

// Returns the length of JavaScript line-comment starting at position `start`.
int line_comment_length(char* input, int start) {
    int i = start + 2; // skip initial two chars, which we already know they are '//'
    int c = input[i];
    // scan until '*/'
    while (c && c != '\n') {
        c = input[++i];
    }
    // when string doesn't end with 0 byte add 1 for ending newline
    return i - start + (c ? 1 : 0);
}

VALUE tokenize(VALUE self, VALUE js) {
    char* input = RSTRING_PTR(js);
    VALUE tokens = rb_ary_new();

    // access keywords Hash
    VALUE keywords_map = rb_const_get(self, rb_intern("KEYWORDS_MAP"));
    // used for storing lengths of tokens
    int len;

    int i = 0;
    char c = input[i];

    while (c) {
        if (c>='a' && c<='z' || c>='A' && c<='Z' || c == '_' || c == '$') {
            // add keyword or ident token.
            len = ident_length(input, i);
            VALUE str = rb_str_new(input+i, len);
            VALUE kw = rb_hash_aref(keywords_map, str);
            if (kw == Qnil) {
                rb_ary_push(tokens, make_token(SYM_IDENT, str));
            }
            else {
                rb_ary_push(tokens, make_token(kw, kw));
            }
            i += len - 1;
        }
        else if (c >= '0' && c <= '9') {
            // add number token
            len = number_length(input, i);
            rb_ary_push(tokens, make_token(SYM_NUMBER, rb_str_new(input+i, len)));
            i += len - 1;
        }
        else if (c == '"' || c == '\'') {
            // add string token (exclude quotes from :value)
            len = string_length(input, i);
            int adjust = (input[i+len-1] == '"' || input[i+len-1] == '\'') ? 2 : 1;
            rb_ary_push(tokens, make_token(SYM_STRING, rb_str_new(input+i+1, len-adjust)));
            i += len - 1;
        }
        else if (c == '/') {
            // Several things begin with dash:
            // - comments, regexes, division-operators
            char c2 = input[i+1];
            if (c2 == '*') {
                if (input[i+2] == '*') {
                    // add doc-comment token
                    len = block_comment_length(input, i);
                    rb_ary_push(tokens, make_token(SYM_DOC_COMMENT, rb_str_new(input+i, len)));
                    i += len - 1;
                }
                else {
                    // skip block-comment
                    i += block_comment_length(input, i) - 1;
                }
            }
            else if (c2 == '/') {
                // line comment
                i += line_comment_length(input, i) - 1;
            }
            else {
                // regex or division
            }
        }
        else if (c == ' ' || c == '\n' || c == '\r' || c == '\t') {
            // skip whitespace
        }
        else {
            // add operator token
            rb_ary_push(tokens, make_token(SYM_OPERATOR, rb_str_new(&c, 1)));
        }

        // move to next char
        c = input[++i];
    }

	return tokens;
}

void Init_c_tokenizer() {
    // Initialize symbols
	SYM_TYPE = ID2SYM(rb_intern("type"));
	SYM_VALUE = ID2SYM(rb_intern("value"));

	SYM_IDENT = ID2SYM(rb_intern("ident"));
	SYM_STRING = ID2SYM(rb_intern("string"));
	SYM_NUMBER = ID2SYM(rb_intern("number"));
	SYM_OPERATOR = ID2SYM(rb_intern("operator"));
	SYM_DOC_COMMENT = ID2SYM(rb_intern("doc_comment"));

	VALUE JsDuck = rb_define_module("JsDuck");
	VALUE CTokenizer = rb_define_class_under(JsDuck, "CTokenizer", rb_cObject);
	rb_define_singleton_method(CTokenizer, "tokenize", tokenize, 1);

    // build lookup table for keywords
    VALUE keywords_map = rb_hash_new();
    rb_hash_aset(keywords_map, rb_str_new2("break"),      ID2SYM(rb_intern("break")));
    rb_hash_aset(keywords_map, rb_str_new2("case"),       ID2SYM(rb_intern("case")));
    rb_hash_aset(keywords_map, rb_str_new2("catch"),      ID2SYM(rb_intern("catch")));
    rb_hash_aset(keywords_map, rb_str_new2("continue"),   ID2SYM(rb_intern("continue")));
    rb_hash_aset(keywords_map, rb_str_new2("default"),    ID2SYM(rb_intern("default")));
    rb_hash_aset(keywords_map, rb_str_new2("delete"),     ID2SYM(rb_intern("delete")));
    rb_hash_aset(keywords_map, rb_str_new2("do"),         ID2SYM(rb_intern("do")));
    rb_hash_aset(keywords_map, rb_str_new2("else"),       ID2SYM(rb_intern("else")));
    rb_hash_aset(keywords_map, rb_str_new2("finally"),    ID2SYM(rb_intern("finally")));
    rb_hash_aset(keywords_map, rb_str_new2("for"),        ID2SYM(rb_intern("for")));
    rb_hash_aset(keywords_map, rb_str_new2("function"),   ID2SYM(rb_intern("function")));
    rb_hash_aset(keywords_map, rb_str_new2("if"),         ID2SYM(rb_intern("if")));
    rb_hash_aset(keywords_map, rb_str_new2("in"),         ID2SYM(rb_intern("in")));
    rb_hash_aset(keywords_map, rb_str_new2("instanceof"), ID2SYM(rb_intern("instanceof")));
    rb_hash_aset(keywords_map, rb_str_new2("new"),        ID2SYM(rb_intern("new")));
    rb_hash_aset(keywords_map, rb_str_new2("return"),     ID2SYM(rb_intern("return")));
    rb_hash_aset(keywords_map, rb_str_new2("switch"),     ID2SYM(rb_intern("switch")));
    rb_hash_aset(keywords_map, rb_str_new2("this"),       ID2SYM(rb_intern("this")));
    rb_hash_aset(keywords_map, rb_str_new2("throw"),      ID2SYM(rb_intern("throw")));
    rb_hash_aset(keywords_map, rb_str_new2("try"),        ID2SYM(rb_intern("try")));
    rb_hash_aset(keywords_map, rb_str_new2("typeof"),     ID2SYM(rb_intern("typeof")));
    rb_hash_aset(keywords_map, rb_str_new2("var"),        ID2SYM(rb_intern("var")));
    rb_hash_aset(keywords_map, rb_str_new2("void"),       ID2SYM(rb_intern("void")));
    rb_hash_aset(keywords_map, rb_str_new2("while"),      ID2SYM(rb_intern("while")));
    rb_hash_aset(keywords_map, rb_str_new2("with"),       ID2SYM(rb_intern("with")));
    rb_define_const(CTokenizer, "KEYWORDS_MAP", keywords_map);
}

