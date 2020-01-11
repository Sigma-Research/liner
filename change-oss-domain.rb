#!/usr/bin/env ruby

Dir.glob("Test/t*.json") do |f|
	puts f
	lines = File.readlines(f)
	lines.each do |line|
		line.gsub!(/sigma-/,'ai-')
	end
	file_handle = File.open(f, 'w')
	file_handle.puts lines.join
	file_handle.close
end