
var Vicarious = {

	initialized: false,

	initialCenter: {
		lat: null,
	  lng: null
	},

  toggleOptions: {
    direction: 'up'
  },

  newPOV: [],

	map: null,

	panorama: null,

  geocoder: null,

  key: null,

  lander: null,

	posts: [],

  panoMarkers: [], 

  mapMarkers: [],	

  infoWindows: [],

  POVs: [],

  centers: [],

  init: function () {

    //Need to figure out how to leave it initialized so it doesn't reload every time

    //Probably better ajax request

    var self = this;

  	if (this.initialized) {
  		console.log('already initialized');
  		return false;

  	}
 
    this.setPosts();

    this.setLander();

    this.setInitialCenter();

  	this.initializeMap();

    this.initializePanorama();

    this.initializeGeocoder();

  	this.plotPosts();

    this.activateLander();

    this.setAnimations();

  	this.initialized = true;

    return true;
  },

  setInitialCenter: function () {

    var firstPost = null;

    if (this.posts.length) {

      firstPost = this.posts[0];

      this.initialCenter = {
        lat: firstPost.lat,
        lng: firstPost.lng
      }; 

    } else {

      this.initialCenter = {
        lat: 37.7833,
        lng: -122.4167
      };

    }

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
        position: {
          lat: this.initialCenter.lat - .0002,
          lng: this.initialCenter.lng - .0002
        }
      });
	  this.map.setStreetView(this.panorama);
  },

  initializeGeocoder: function () {
    this.geocoder =  new google.maps.Geocoder();
  },

  setPosts: function () {
  	
    var $posts = $('.Post');

    $.each($posts, function(index, post) {
      
      var $post = $(post);

      this.posts.push({
        lat: $post.data('lat'),
        lng: $post.data('lng'),
        pitch: $post.data('pitch'),
        heading: $post.data('heading'),
        title: $post.data('title'),
        body: $post.data('body'),
        username: $post.data('username'),
        userId: $post.data('userid')
      });

    }.bind(this));

  },

  plotPosts: function () {

    var self = this;

  	$.each(this.posts, function(index, post) {
      
        
      //Will these make the info windows sync in chronological order?

      var center = {
        lat: post.lat,
        lng: post.lng
      };

      var pov = {
        heading: post.heading,
        pitch: post.pitch
      };

      var mapMarker = new google.maps.Marker({
        position: center,
        animation: google.maps.Animation.DROP
      });

      var panoMarker = new google.maps.Marker({
        position: center,
        animation: google.maps.Animation.DROP
      });

      //NEED TO SET MAX-WIDTH FOR INFOWINDOWS

      var infoWindow = new google.maps.InfoWindow({
        content: '<div class="posty"><h1>'  + post.title + '</h1> <p>' + post.body + '</p></div><br><a href="/users/' + post.userId + '"> by ' + post.username + '</a>'
      });

      mapMarker.setMap(this.map);

      panoMarker.setMap(this.panorama);

      this.centers.push(center);

      this.panoMarkers.push(panoMarker);

      this.mapMarkers.push(mapMarker);

      this.infoWindows.push(infoWindow);

      this.POVs.push(pov);

      
      panoMarker.addListener('click', function () {

        infoWindow.open(self.panorama, panoMarker);

        //auto pan has to go here
        
        $('.posty').click(function () {
          
          self.aroundTheWorld(index);

        });
      });

      mapMarker.addListener('click', function () {
        infoWindow.open(self.map, mapMarker);
      });



    }.bind(this));
  },

  aroundTheWorld: function (index) {

    // index is the position of the current marker and its corresponding infowindow.

    // The index of our .each function has the same index as the arrays containing their information

    // i.e. POVs[0] contains the same pitch and heading taken from $.each post[0];

    // to get to the next one we will add one to each array, and build a panorama out of those coordinates
    

    var j = this.POVs.length - 1,
      i = index + 1,
      self = this,
      // nextPOV = this.POVs[i],
      nextCenter = this.centers[i],
      nextMarker = this.mapMarkers[i],
      nextInfo = this.infoWindows[i],
      currentInfo = {};

    if (index === -1) {

      // this is telling the program to set the current infoWindow to the very last one in the cycle

      currentInfo = this.infoWindows[j];

    } else {

      //otherwise close the window we're currently at as soon as the click event fires

      currentInfo = this.infoWindows[index];

    };


    currentInfo.close();

    this.map.setCenter(nextCenter);

    // this.panorama.setPov(nextPOV); //For now we've turned off POV b/c google maps does not enable putting markers or info windows at specified POVs

    this.panorama.setPosition({

      //Setting the exact lat/lng means that the user will land directly on top of a marker and infoWindow,
      //so we must specifiy approximately 10 steps back by subtracting fractional coordinates

      lat: nextCenter.lat - .0002, 
      lng: nextCenter.lng - .0002
    
    });

    //after we set the map and the panorama, we restart the click event. 

    nextInfo.open(this.panorama, nextMarker);


    $('.posty').click(function () {

      if (i === j) {

        self.aroundTheWorld(-1);

      } else {

        self.aroundTheWorld(i);

      };

    });

  },

  //Here is how we build posts

  makePost: function () {

    $('#post-form').toggle("drop", this.toggleOptions, 500 ); 
    $('#toggleGeo').show();

    var vicariousPoster = {

      post_data: {

        heading: this.panorama.getPov().heading,
        pitch: this.panorama.getPov().pitch,
        lat: this.panorama.getPosition().lat(),
        lng: this.panorama.getPosition().lng(),
        title: $('#titleField').val(),
        body: $('#textBox').val()

        }

      };

    //These two variables are tests becaue I'm trying to figure out why 
    //submitting with the enter button ( see setAnimations() ) will sometimes fire twice

    var titleTest = vicariousPoster.post_data.title;
    var titleBody = vicariousPoster.post_data.body;

    //Get the story id (as a string) from the dom so we can send the post request.

    var storyId = $('#story_id').html();

    //parse into an integer so that we can store in the DB

    var storyInt = parseInt(storyId);

    //make the link to tell AJAX where to send the post request

    var link = '/stories/' + storyId + '/posts'

    function ajaxCaller(vicarious){
      var ajaxRequest = $.ajax({
        type: 'POST',
        url: link,
        dataType: 'json',
        data: {
          post: {
            post_JSON: JSON.stringify(vicarious.post_data),
            story_id: storyInt
          }
        }
      });
      ajaxRequest.done($('#titleField').val(''), $('#textBox').val(''));
    
    }
    console.log(titleTest);
    console.log(titleBody);

    ajaxCaller(vicariousPoster);

  },

  cancelPost: function () {

    $('#post-form').toggle("drop", self.toggleOptions, 500);
    $('#toggleGeo').show();

  },

  search: function () {
    
    // call the geocode function with the address we want to use as parameter

    var self = this;

    var address = $('#addressField').val();

    //geocoder from google maps API

    this.geocoder.geocode({'address': address}, function(results, status) {
    
      if (status === google.maps.GeocoderStatus.OK) {
        
        self.map.setCenter(results[0].geometry.location);

        self.panorama.setPosition(results[0].geometry.location);

        $("#addressField").val('');
        $('#locationFinder').toggle("drop", self.toggleOptions, 500);

      } else {

        alert('We could not find that address. Sorry. Try again. ' + status);

      }
   
    });

  },

// root page lander. Looks for DOM element

  setLander: function () {

    this.lander = $('#aboutLander');

    this.lander.hide();

  },

  activateLander: function () {

    //NEED TO USE COOKIES TO SEE IF IT IS FIRST TIME COMING TO SITE 

    if (this.lander != null) {

      var self = this;

      this.lander.toggle('drop', this.toggleOptions, 500);

      this.lander.click(function () {
        self.lander.toggle('drop', this.toggleOptions, 500);
        self.lander = null;
      });

    }

  },

  setAnimations: function () {

    var self = this;
    // var options = {
    //   direction: "up"
    // };

    $('#story_id').hide();
    $( "#locationFinder" ).hide();
    $('#post-form').hide();

    $('#toggelPostForm').click(function () {
      
      $('#toggleGeo').hide();

      $('#post-form').toggle("drop", self.toggleOptions, 500 );  
      $('#titleField').focus();

    });


    $('#toggleGeo').click(function() {

      $("#locationFinder").toggle( "drop", self.toggleOptions, 500 );
      $("#addressField").focus();

    });

  }

};





