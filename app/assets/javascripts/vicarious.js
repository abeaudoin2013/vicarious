var Vicarious = {


	initialized: false,

	// This is fenway park
	initialCenter: {
		lat: 42.345573,
	  lng: -71.098326
	},

	map: null,

	panorama: null,

	posts: [],

  panoMarkers: [],

  mapMarkers: [],

	infoWindow: null,	

	markerData: {},

  init: function () {

  	if (this.initialized) {
  		console.log('already initialized');
  		return false;

  	}

  	//This is the array of posts
 

  	this.initializeMap();
  	this.initializePanorama();
  	this.setPosts();
  	this.plotPosts();
  	this.initialized = true;
    return true;
  },

  initializeMap: function () {
	  
	  this.map = new google.maps.Map(document.getElementById('map'), {
	    center: this.initialCenter,
	    zoom: 14
	  });
	  
  },

  initializePanorama: function () {
  	this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: this.initialCenter,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
	  this.map.setStreetView(this.panorama);
  },

  setPosts: function () {
  	this.posts = $('.Post');
  },

  plotPosts: function () {

  	$.each(this.posts, this.plotPost);
  },

  plotPost: function(index, post) {
  		$post = $(post),
  		lat = $post.data('lat'),
  		lng = $post.data('lng'),
  		pitch = $post.data('pitch'),
  		heading = $post.data('heading'),
  		title = $post.data('title'),
  		body = $post.data('body');

        //this is refering to this posts' 
      makeMapMarker(lat, lng);

      makePanoMarker(lat, lng);
      //So create a function here

			// Vicarious.makeMarker(lat, lng);

      //And then invoke it down here?f
  		
  },

  makePanoMarker: function (lat, lng) {
  	
    var panoMarker = new google.maps.Marker({
      position: {lat: lat, lng: lng}
    });

		panoMarker.setMap(this.panorama);

    this.panoMarkers.push(panoMarker);

  },

  makeMapMarker: function (lat, lng) {

    var mapMarker = new google.maps.Marker({
      position: {lat: lat, lng: lng}
    });

    mapMarker.setMap(this.map);

    this.mapMarkers.push(mapMarker);
  },

  makeInfoWindow: function () {
  	this.infoWindow = new google.maps.InfoWindow({

  	});
  } 

};


 // marker.addListener('click', function(){
 //        infowindow.setContent('<div id="posty"><h1>'  + self.title + '</h1> <br> <p>' + self.body + '</p></div>');
 //        infowindow.open(panorama, marker);
 //          $('#posty').click(function(){
 //             var next_post = new Post('Moooo', 'says the cow', 43.613146,-70.213913, 40, 10);
 //             next_post.makeMap();
 //          });
 //      });







