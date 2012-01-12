require 'jsduck/c_tokenizer'

module JsDuck

  # Wraps CTokenizer in an interface that behaves just like Lexer.
  class CLexer
    def initialize(input)
      @tokens = CTokenizer.tokenize(input)
      @position = 0
    end

    # Checks if next n tokens match the given pattern.
    #
    # Takes list of strings and symbols.  Symbols are compared to
    # token type, while strings to token value.  For example:
    #
    #     look(:ident, "=", :regex)
    #
    def look(*tokens)
      i = @position
      tokens.all? do |t|
        tok = @tokens[i]
        i += 1
        if !tok
          false
        elsif t.instance_of?(Symbol)
          tok[0] == t
        else
          tok[1] == t
        end
      end
    end

    # Returns next token.
    #
    # When full=true, then returns full token as hash,
    # otherwise just returns the value field of token.
    def next(full=false)
      tok = @tokens[@position]
      @position += 1
      full ? expand(tok) : tok[1]
    end

    # True when no more tokens
    def empty?
      !@tokens[@position]
    end

    private

    # Expands token to hash
    def expand(tok)
      t = {:type => tok[0], :value => tok[1]}
      t[:linenr] = tok[2] if tok[2]
      t
    end

  end
end
