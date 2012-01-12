require "jsduck/lexer"
require "jsduck/c_lexer"

# Shared tests to ensure that JsDuck::Lexer and JsDuck::CLexer behave
# the same way.

shared_examples_for "lexer" do

  def lexer(input)
    @lexer_class.new(input)
  end

  describe "empty?" do
    it "is true when no tokens" do
      lexer("").empty?.should == true
    end

    it "is false when there are tokens" do
      lexer(";").empty?.should == false
    end
  end

  describe "next()" do
    it "gives value of next token" do
      lexer("var x;").next.should == :var
    end

    it "gives value of the n-th token when called n times" do
      lex = lexer("var x;")
      lex.next
      lex.next
      lex.next.should == ";"
    end
  end

  describe "next(true)" do
    it "gives full next token" do
      tok = lexer(";").next(true)
      tok[:type].should == :operator
      tok[:value].should == ";"
    end
  end

  describe "look()" do
    it "is true when all params match" do
      lexer("var x = 10;").look(:var, "x", "=").should == true
    end

    it "is false when at least one param doesn't match" do
      lexer("var x = 10;").look(:var, "y", "=").should == false
    end

    it "is false when not enough tokens" do
      lexer(";").look(";", :var).should == false
    end
  end

end

describe JsDuck::CLexer do
  before do
    @lexer_class = JsDuck::CLexer
  end

  it_should_behave_like "lexer"
end

describe JsDuck::Lexer do
  before do
    @lexer_class = JsDuck::Lexer
  end

  it_should_behave_like "lexer"
end
