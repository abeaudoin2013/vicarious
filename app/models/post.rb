class Post < ActiveRecord::Base
	belongs_to :story
	belongs_to :user

	def self.parse(text)
		JSON.parse(text)
	end

	def self.go_through(posts)
		contents = []
		#posts come in as an array of post objects 
	 	posts.each do |post|
		 	pre_parse = post.post_JSON
			parsed = Post.parse(pre_parse) 
			title = parsed['title']
			body = parsed['body']
			lat = parsed['lat']
			lng = parsed['lng']
			heading = parsed['heading']
			pitch = parsed['pitch']
			contents.push([title, body, lat, lng, heading, pitch])
		end
		return contents
 	end

 	def self.go_through_last(post)
 		pre_parse = post.post_JSON
 		parsed = Post.parse(pre_parse)
 		title = parsed['title']
 		return title
 	end
end
