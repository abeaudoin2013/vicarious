class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.integer :story_id
      t.text :post_JSON

      t.timestamps null: false
    end
  end
end
