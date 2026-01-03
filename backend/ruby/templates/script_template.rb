#!/usr/bin/env ruby
# Simple annotator script generated for user's keywords and style
KEYWORDS = [%%KEYWORDS%%]
STYLE = '%%STYLE%%'

def annotate_inline(text)
  re = Regexp.new('\\b(' + KEYWORDS.map{|k| Regexp.escape(k)}.join('|') + ')\\b')
  text.gsub(re) { |m| \"#{m} /*:#{m}:*/\" }
end

def annotate_block(text)
  text.lines.map do |line|
    found = KEYWORDS.find { |k| line.include?(k) }
    if found
      \"/* annotated: #{found} */\\n#{line}\"
    else
      line
    end
  end.join
end

def annotate_color(text)
  re = Regexp.new('\\b(' + KEYWORDS.map{|k| Regexp.escape(k)}.join('|') + ')\\b')
  text.gsub(re) { |m| \"\\e[35m#{m}\\e[0m\" }
end

def annotate_side_by_side(text)
  text.lines.map do |line|
    annotated = line.dup
    KEYWORDS.each do |k|
      annotated.gsub!(/\\b#{Regexp.escape(k)}\\b/, \"#{k}/*:#{k}:*/\")
    end
    left = line.chomp
    right = annotated.chomp
    sprintf(\"%-60s | %s\\n\", left, right)
  end.join
end

def annotate(text)
  case STYLE
  when 'inline'
    annotate_inline(text)
  when 'block'
    annotate_block(text)
  when 'color'
    annotate_color(text)
  when 'side-by-side'
    annotate_side_by_side(text)
  else
    annotate_inline(text)
  end
end

if __FILE__ == $0
  input = STDIN.read
  puts annotate(input)
end

