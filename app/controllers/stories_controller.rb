class StoriesController < ApplicationController
  def new
  end

  def index
  	stories = Story.all
  	@titles = Story.go_through(stories)
  end

  def show
  end

  def destroy
  end
end
