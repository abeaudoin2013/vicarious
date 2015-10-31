class CreateStories < ActiveRecord::Migration
  def change
    create_table :stories do |t|
      t.integer :user_id
      t.text :story_JSON

      t.timestamps null: false
    end
  end
end
