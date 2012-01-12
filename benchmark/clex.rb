# Script for benchmarking the lexer.
#
# Takes bunch of filenames as arguments and runs them all through lexer.
#
$:.unshift File.dirname(File.dirname(__FILE__)) + "/lib"
require 'jsduck/c_lexer'

ARGV.each do |fname|
  lex = JsDuck::CLexer.new(IO.read(fname))
  while !lex.empty?
    lex.next
  end
end

