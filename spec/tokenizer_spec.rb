require "jsduck/lexer"
require "jsduck/c_tokenizer"

# Shared tests to ensure that JsDuck::Lexer and JsDuck::CTokenizer
# tokenize input the same way.

shared_examples_for "tokenizer" do

  def lex(source)
    @tokenize.call(source)
  end

  # Identifiers

  it "parses out identifiers" do
    lex(" fo o ").should == [[:ident, "fo"], [:ident, "o"]]
  end

  it "allows _ in identifiers" do
    lex("_foo").should == [[:ident, "_foo"]]
  end

  it "handles $ in identifiers" do
    lex("$fo$o").should == [[:ident, "$fo$o"]]
  end

  it "allows $ as a name of identifier" do
    lex("$ = 3")[0].should == [:ident, "$"]
  end

  it "handles numbers in identifiers" do
    lex("x2").should == [[:ident, "x2"]]
  end

  # Keywords

  it "parses out keywords" do
    lex("if").should == [[:if, :if]]
  end

  # Numbers

  it "parses out number token" do
    lex(" 51").should == [[:number, '51']]
  end

  # Operators

  it "parses out operators" do
    lex(" + . * ").should == [
      [:operator, "+"],
      [:operator, "."],
      [:operator, "*"],
    ]
  end

  # Regular expressions

  it "parses out regex" do
    lex("/.*/").should == [[:regex, "/.*/"]]
  end

  it "parses out regex with modifiers" do
    lex("/123/img").should == [[:regex, "/123/img"]]
  end

  describe "differenciates regex from division" do

    it "when regex after operator" do
      lex("x = /  /; y / 2").should == [
        [:ident, "x"],
        [:operator, "="],
        [:regex, "/  /"],
        [:operator, ";"],
        [:ident, "y"],
        [:operator, "/"],
        [:number, "2"]
      ]
    end

    it "when regex after return" do
      lex("return /foo/.test;").should == [
        [:return, :return],
        [:regex, "/foo/"],
        [:operator, "."],
        [:ident, "test"],
        [:operator, ";"]
      ]
    end

    it "when regex after typeof" do
      lex("typeof /foo/;").should == [
        [:typeof, :typeof],
        [:regex, "/foo/"],
        [:operator, ";"]
      ]
    end

    it "when division after this" do
      lex("this / 3").should == [
        [:this, :this],
        [:operator, "/"],
        [:number, "3"]
      ]
    end
  end

  it "allows escaping inside regex" do
    lex("/ \\/ /").should == [[:regex, "/ \\/ /"]]
  end

  it "allows [/] inside regex" do
    lex("/ [/] /").should == [[:regex, "/ [/] /"]]
  end

  it "allows escaping inside regex [...]" do
    lex("/ [\\]..] /").should == [[:regex, "/ [\\]..] /"]]
  end

  # Strings

  describe "identifies strings" do

    before do
      @d = '"' # double-quote
      @s = "'" # single-quote
      @b = "\\" # backslash
    end

    it "when double-quoted" do
      lex(' "foo" ').should == [[:string, 'foo']]
    end

    it "when single-quoted" do
      lex(" 'foo' ").should == [[:string, "foo"]]
    end

    it "when single-quote inside double-quoted string" do
      lex(@d+@s+@d   + ' "blah"').should == [[:string, @s], [:string, "blah"]]
    end

    it "when double-quote inside single-quoted string" do
      lex(@s+@d+@s   + ' "blah"').should == [[:string, @d], [:string, "blah"]]
    end

    it "when escaped double-quote inside double-quoted string" do
      lex(@d+@b+@d+@d   + ' "blah"').should == [[:string, @b+@d], [:string, "blah"]]
    end

    it "when escaped single-quote inside single-quoted string" do
      lex(@s+@b+@s+@s   + ' "blah"').should == [[:string, @b+@s], [:string, "blah"]]
    end

    it "when newlines escaped inside double-quoted string" do
      lex(@d+"A\\\nB"+@d).should == [[:string, "A\\\nB"]]
    end

    it "when newlines escaped inside single-quoted string" do
      lex(@s+"A\\\nB"+@s).should == [[:string, "A\\\nB"]]
    end
  end

  # Comments

  it "ignores one-line comments" do
    lex("a // foo\n b").should == [[:ident, "a"], [:ident, "b"]]
  end

  it "ignores multi-line comments" do
    lex("a /* foo */ b").should == [[:ident, "a"], [:ident, "b"]]
  end

  it "identifies doc-comments together with line numbers" do
    lex("/** foo */").should == [[:doc_comment, "/** foo */", 1]]
  end

  it "counts line numbers correctly" do
    tokens = lex(<<-EOS)
      foo = {
        bar: foo,
        /**
         * My comment.
         */
    EOS
    tokens.last.last.should == 3
  end

  it "counts line numbers correctly when multiple doc-comments involved" do
    tokens = lex(<<-EOS)
        /** First comment */
        /** Second comment */
        /** Third comment */
    EOS
    tokens[0].last.should == 1
    tokens[1].last.should == 2
    tokens[2].last.should == 3
  end

  # Handling of premature end of input

  describe "handles unfinished" do

    it "single-line comment" do
      lex("// ").should == []
    end

    it "multi-line comment" do
      lex("/* ").should == []
    end

    it "doc-comment" do
      lex("/** ").should == [[:doc_comment, "/** ", 1]]
    end

    it "regex" do
      lex("/[a-z] ").should == [[:regex, "/[a-z] "]]
    end

    it "single-quoted string" do
      lex("' ").should == [[:string, " "]]
    end

    it "double-quoted string" do
      lex('" ').should == [[:string, " "]]
    end
  end

  # Simple test for all-together

  it "tokenizes simple expression" do
    lex("var foo = 8;").should == [
      [:var, :var],
      [:ident, "foo"],
      [:operator, "="],
      [:number, "8"],
      [:operator, ";"]
    ]
  end

end

describe JsDuck::CTokenizer do
  before do
    @tokenize = lambda do |source|
      JsDuck::CTokenizer.tokenize(source)
    end
  end

  it_should_behave_like "tokenizer"
end

describe JsDuck::Lexer do
  before do
    @tokenize = lambda do |source|
      lex = JsDuck::Lexer.new(source)
      tokens = []
      while !lex.empty?
        t = lex.next(true)
        tokens << [t[:type], t[:value]]
        if t[:linenr]
          tokens.last << t[:linenr]
        end
      end
      tokens
    end
  end

  it_should_behave_like "tokenizer"
end
