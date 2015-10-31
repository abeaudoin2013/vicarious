class MapsController < ApplicationController
	def index
		@story = Story.new
	end

	def create_story
		# @story = Story.create
		# if @story.save
		# 	redirect_to around_the_world_path
		# else
		# 	# notice: 'There was a problem'
		# 	redirect_to around_the_world_path
		# end
	end

end
