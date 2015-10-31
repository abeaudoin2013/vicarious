module StoriesHelper

	def self.parse(text)
		JSON.parse(text)
	end

	def self.go_through(stories)
		titles = []
	 	stories.each do |story|
		 	pre_parse = story.story_JSON
			parsed = Story.parse(pre_parse) 
			title = parsed['title']
			titles.push(title)
		end
		return titles
 	end
 	
end
