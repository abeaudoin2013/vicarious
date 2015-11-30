class User < ActiveRecord::Base
	validates :email, uniqueness: true
	validates :username, uniqueness: true
  has_secure_password
  has_many :stories, dependent: :destroy
  has_many :posts, dependent: :destroy
end
