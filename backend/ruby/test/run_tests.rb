#!/usr/bin/env ruby
require_relative '../annotator'

def assert_equal(expected, actual, message=nil)
  unless expected == actual
    puts \"Assertion failed: #{message}\"
    puts \"Expected:\\n#{expected}\\nGot:\\n#{actual}\"
    exit 1
  end
end

puts \"Running Annotator tests...\"

sample = \"foo bar baz\\nfoo line\\n\"
keywords = ['foo']
out = Annotator.annotate(sample, keywords, 'inline')
assert_equal(\"foo /*:foo:*/ bar baz\\nfoo /*:foo:*/ line\\n\", out, 'inline style')

out2 = Annotator.annotate(sample, keywords, 'block')
expected_block = \"/* annotated: foo */\\nfoo bar baz\\n/* annotated: foo */\\nfoo line\\n\"
assert_equal(expected_block, out2, 'block style')

puts \"All tests passed.\"

