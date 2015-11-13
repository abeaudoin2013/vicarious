class Post < ActiveRecord::Base
	belongs_to :story
	belongs_to :user

	def self.parse(text)
		JSON.parse(text)
	end


	def self.go_through(posts)

		contents = []

	 	posts.each do |post|

		 	pre_parse = post.post_JSON
			parsed = Post.parse(pre_parse)

			user_id = post.user_id
 			username = User.find(user_id).username

			title = parsed['title']
			body = parsed['body']
			lat = parsed['lat']
			lng = parsed['lng']
			heading = parsed['heading']
			pitch = parsed['pitch']

			contents.push([title, body, lat, lng, heading, pitch, username, user_id])

		end

		return contents

 	end

 	def self.parse_centers(stories)

 		centers = []

 		stories.each do |story|

 			post = story.posts.first.post_JSON
 			title = story.title
 			id = story.id

 			parsed_post = JSON.parse(post)

			lat = parsed_post["lat"].to_s
 			lng = parsed_post["lng"].to_s

 			centers.push([lat, lng, title, id])

	 	end

	 	return centers

 	end

 	def self.go_through_last(post)
 		pre_parse = post.post_JSON
 		parsed = Post.parse(pre_parse)
 		title = parsed['title']
 		return title
 	end
end
