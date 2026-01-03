class Annotator
  # Simple annotate: find exact keyword tokens and wrap based on style
  def self.annotate(text, keywords, style)
    return text if keywords.nil? || keywords.empty?
    kw_set = keywords.map(&:to_s).uniq
    case style
    when 'inline'
      annotate_inline(text, kw_set)
    when 'block'
      annotate_block(text, kw_set)
    when 'color'
      annotate_color(text, kw_set)
    when 'side-by-side'
      annotate_side_by_side(text, kw_set)
    else
      annotate_inline(text, kw_set)
    end
  end

  def self.generate_ruby_script(keywords, style)
    template = File.read(File.join(__dir__, 'templates', 'script_template.rb'))
    template.gsub('%%KEYWORDS%%', keywords.map{|k| k.inspect}.join(', '))
            .gsub('%%STYLE%%', style.to_s)
  end

  private

  def self.tokenize(text)
    text.split(/(\\b)/)
  end

  def self.annotate_inline(text, keywords)
    re = /\b(#{keywords.map{ |k| Regexp.escape(k) }.join('|')})\b/
    text.gsub(re) { |m| "#{m} /*:#{m}:*/" }
  end

  def self.annotate_block(text, keywords)
    lines = text.lines.map do |line|
      found = keywords.find { |k| line.include?(k) }
      if found
        "/* annotated: #{found} */\\n#{line}"
      else
        line
      end
    end
    lines.join
  end

  def self.annotate_color(text, keywords)
    # ANSI magenta for keywords
    re = /\b(#{keywords.map{ |k| Regexp.escape(k) }.join('|')})\b/
    text.gsub(re) { |m| \"\\e[35m#{m}\\e[0m\" }
  end

  def self.annotate_side_by_side(text, keywords)
    lines = text.lines.map do |line|
      annotated = line.dup
      keywords.each do |k|
        annotated.gsub!(/\b#{Regexp.escape(k)}\b/, "#{k}/*:#{k}:*/")
      end
      left = line.chomp
      right = annotated.chomp
      sprintf(\"%-60s | %s\\n\", left, right)
    end
    lines.join
  end
end

