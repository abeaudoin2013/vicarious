class StoriesController < ApplicationController
  before_action :set_story, only: [:show, :edit, :update, :destroy]

  def new
    if @user = current_user 
      @story = Story.new
    else
      redirect_to login_path, notice: "You gotta login to do that."
    end
  end

  def all
    @user = User.new
    posts = Post.all
    @all_parsed_posts = Post.go_through(posts)
  end

  def create

    @story = Story.create(story_params)

    if @story.save
      redirect_to story_path(@story.id)
    else
      redirect_to root_path, notice: 'There was a problem'
    end

  end 

  # def update
  #   if @story.update(story_params)
  #     redirect_to user_stories_path
  #   else
  #     redirect_to :back
  #   end
  # end

  def show
    @post = Post.new
    @user = User.find_by(@story.user_id)
    posts = @story.posts.all
    @all_parsed_posts = Post.go_through(posts)
  end

  # DO THIS ACTION LATER
  # def edit 
  #   @user = current_user
  #   #@story lives here
  # end

  def destroy
    user_id = @story.user_id
    @story.destroy
    redirect_to user_path(user_id)
  end

  private
   
    def set_story
      begin 
        @story = Story.find(params[:id])
      rescue
        flash[:notice] = "We can't find that post"
        redirect_to allstories_path
      end
    end
  
    def story_params
      params.require(:story).permit(:title).merge(user: current_user)
    end
  
end
