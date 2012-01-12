require "jsduck/lexer"

describe "passing StringScanner to JsDuck::Lexer" do
  before do
    @scanner = StringScanner.new("5 + 5")
    @lex = JsDuck::Lexer.new(@scanner)
  end

  it "uses that StringScanner for parsing" do
    @lex.look(:number).should == true
  end

  it "doesn't advance the scan pointer when nothing done" do
    @scanner.rest.should == "5 + 5"
  end

  it "#look doesn't advance the scan pointer" do
    @lex.look(:number)
    @scanner.rest.should == "5 + 5"
  end

  it "#empty? doesn't advance the scan pointer" do
    @lex.empty?
    @scanner.rest.should == "5 + 5"
  end

  it "#next advances the scan pointer only until the end of token (excluding whitespace after token)" do
    @lex.next
    @scanner.rest.should == " + 5"
  end
end
