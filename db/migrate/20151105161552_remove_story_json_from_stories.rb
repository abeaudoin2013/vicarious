class RemoveStoryJsonFromStories < ActiveRecord::Migration
  def change
    remove_column :stories, :story_JSON, :text
  end
end
