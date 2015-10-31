Rails.application.routes.draw do

  get 'maps/index', to: 'maps#index', as: 'around_the_world'
  post 'maps/create', to: 'maps#create_story', as: 'tag_the_world'
  get 'stories/new', to: 'stories#new'
  get 'stories/index', to: 'stories#index'
  get 'stories/show', to: 'stories#show'
  get 'stories/destroy', to: 'stories#destroy'
  post '/sessions', to: 'sessions#create'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
  resources :users
  root 'users#index'
end
