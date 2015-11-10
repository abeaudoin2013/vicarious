class User < ActiveRecord::Base
  has_secure_password
  has_many :stories, dependent: :destroy
  has_many :posts, dependent: :destroy
end
