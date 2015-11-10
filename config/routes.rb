Rails.application.routes.draw do

  get '/allstories', to: 'stories#all'
  get '/allposts', to: 'posts#all'
  
  resources :users do 
    
    resources :stories, shallow: :true, only: [:new, :show, :destroy, :create] do
      resources :posts, only: [:create]
    end

  end

  post '/sessions', to: 'sessions#create'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  root 'users#index'
end
