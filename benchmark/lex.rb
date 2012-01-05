# Script for benchmarking the lexer.
#
# Takes bunch of filenames as arguments and runs them all through lexer.
#
$:.unshift File.dirname(File.dirname(__FILE__)) + "/lib"
require 'jsduck/lexer'

ARGV.each do |fname|
  lex = JsDuck::Lexer.new(IO.read(fname))
  while !lex.empty?
    lex.next
  end
end

