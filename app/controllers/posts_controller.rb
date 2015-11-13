class PostsController < ApplicationController

  def all
    @posts = Post.all
  end

  # STORIES SHOW SHOULD SHOW THE POSTS
  # def index
  # 	@posts = Post.all
  # end

  def create
    # Comes in from JS

    # @story = Story.find_by(params[:id])

  	@post = Post.create(post_params)
  	if @post.save
      render nothing: true
  	else
  		redirect_to @user
    end
  end

  # def new 
  #   @post = Post.new
  # end

  # def update
  # 	@post = Post.find(params[:id])
  # 	respond_to do |format|
		# 	if @element.update(element_params)
		# 		format.js {render nothing: true}
		# 	else
		# 		format.js {render nothing: true}
		# 	end
		# end
  # end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def post_params
  	params.require(:post).permit(:post_JSON, :story_id).merge(user: current_user)
  end

end


