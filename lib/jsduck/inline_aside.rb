require 'cgi'
require 'jsduck/logger'

module JsDuck

  # Implementation of inline tag {@aside}
  class InlineAside
    def initialize(assets)
      @assets = assets
      @tpl = <<-EOHTML
        <div class='aside %t'>
          <h4>%h</h4>
          <p><a href='%u'><img src='%i' alt=''> %a</a></p>
        </div>
      EOHTML

      @re = /\{@aside\s+(\w+)\s+(\S.*?)?\}/m

      @allowed_types = {
        "guide" => true,
        "video" => true,
        "example" => true,
      }
    end

    # Takes StringScanner instance.
    #
    # Looks for inline tag at the current scan pointer position, when
    # found, moves scan pointer forward and performs the apporpriate
    # replacement.
    def replace(input)
      if input.check(@re)
        input.scan(@re).sub(@re) { apply_tpl($1, $2) }
      else
        false
      end
    end

    # applies the image template
    def apply_tpl(type, name)
      assets_group = get_assets_group(type)
      unless assets_group
        return warn("Unknown {@aside} type: #{type}")
      end

      asset = assets_group[name]
      unless asset
        return warn("Unknown {@aside} name: #{type} #{name}")
      end

      @tpl.gsub(/(%\w)/) do
        case $1
        when '%t' # Type
          type
        when '%h' # Heading
          type.capitalize
        when '%u' # URL
          "#!/#{type}/#{name}"
        when '%a' # Title
          CGI.escapeHTML(asset["title"] || "")
        when '%i' # Icon URL
          assets_group.icon_url(asset)
        else
          $1
        end
      end
    end

    def get_assets_group(type)
      case type
      when "guide" then @assets.guides
      when "video" then @assets.videos
      when "example" then @assets.examples
      else nil
      end
    end

    def warn(msg)
      JsDuck::Logger.instance.warn(:aside, msg)
      false
    end
  end

end
