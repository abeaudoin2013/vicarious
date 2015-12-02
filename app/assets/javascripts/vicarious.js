
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

    //This function is called after JS libraries are loaded and DOM is loaded

    var self = this;

  	if (this.initialized) {
  		console.log('already initialized');
  		return false;

  	}
    
    //first, abstract the post data hidden in the DOM

    this.setPosts();

    //finds the lander on the DOM and sets it to the lander property 

    this.setLander();

    //find the first post's center and set that is the inital point

    this.setInitialCenter();

    //start the map

  	this.initializeMap();

    //start the panorama

    this.initializePanorama();

    //set the geolocator

    this.initializeGeocoder();

    //once all that is set plot the posts on the map

  	this.plotPosts();

    //If there is a lander in the DOM, toggle it

    this.activateLander();

    //Set all other animations

    this.setAnimations();

    //And then finally make set the initalize function to true so that we do re-initialize

  	this.initialized = true;

    return true;
  },

  setInitialCenter: function () {

    var firstPost = null;

    //Once you have your array of posts, find the first one and set it to the intial center.
    //Otherwise go to San Francisco

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
	  
    //Map must have a DOM element to display in before google maps can initialize.
    //This is why we load the DOM before we call Google Maps
    //set Vicarious.map property to an instance of the google maps object
    //passing it the initial center that we've already set

	  this.map = new google.maps.Map(document.getElementById('map'), {
	    center: this.initialCenter,
	    zoom: 14,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true
	  });
	  
  },

  initializePanorama: function () {

    //Although our panorama is the heart of the project,
    //We have to have an instance of the google maps object already set.
    //This is why we call initialize Map first. 

  	this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: {

          //we subtract a small fraction off of the lat
          //and lng in order for the user to see the post 
          //that will land at the EXACT lat/lng

          lat: this.initialCenter.lat - .0002,
          lng: this.initialCenter.lng - .0002
        }
      });

    //this is a google maps function

	  this.map.setStreetView(this.panorama);

  },

  initializeGeocoder: function () {

    this.geocoder =  new google.maps.Geocoder();

  },

  setPosts: function () {
  	
    //sets a variable equal to all post elements in the DOM

    var $posts = $('.Post');

    $.each($posts, function(index, post) {
      
      //set a variable for each post

      var $post = $(post);

      //take each post's data and push it the Vicarious.posts array 

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

    //Now that we've 
    //1. gotten our posts
    //2. put them into an array
    //3. initialized our maps and geocoder
    // we can now actually plot the posts on both maps

    var self = this;

  	$.each(this.posts, function(index, post) {

      var center = {
        lat: post.lat,
        lng: post.lng
      };

      //the POV properties are still in beta

      var pov = {
        heading: post.heading,
        pitch: post.pitch
      };

      //set lat, lng and animation for map and pano markers

      var mapMarker = new google.maps.Marker({
        position: center,
        animation: google.maps.Animation.DROP
      });

      var panoMarker = new google.maps.Marker({
        position: center,
        animation: google.maps.Animation.DROP
      });

      //set infowindow information

      var infoWindow = new google.maps.InfoWindow({
        content: '<div class="posty"><h1>'  + post.title + '</h1> <h3>' + post.body + '</h3></div><br><a href="/users/' + post.userId + '"> by ' + post.username + '</a>'
      });

      //tell markers which map to go to
      //i.e. that map and panorama on the Vicarious object

      mapMarker.setMap(this.map);

      panoMarker.setMap(this.panorama);

      //push each piece of information into arrays which will be used in Vicarious.aroundTheWorld()

      this.centers.push(center);

      this.panoMarkers.push(panoMarker);

      this.mapMarkers.push(mapMarker);

      this.infoWindows.push(infoWindow);

      this.POVs.push(pov);

      
      panoMarker.addListener('click', function () {

        //info window needs a map to open on and 
        //needs to be attached to a marker

        infoWindow.open(self.panorama, panoMarker);

        //Make it so that when you click on the infowindow,
        //it will take you to the next infowindow, 
        //the function for which lives in aroundTheWorld()
        
        $('.posty').click(function () {
          
          //it gets passed the index of the current post

          self.aroundTheWorld(index);

        });

      });

      mapMarker.addListener('click', function () {

        //this allows you to also see the infoWindow on the regular map

        infoWindow.open(self.map, mapMarker);

      });



    }.bind(this));

  },

  aroundTheWorld: function (index) {

    // index is the position of the current marker and its corresponding infowindow.

    // The index of our .each function has the same index as the centers, infowindow, marker, and pov arrays

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

  //Here is how we send posts via AJAX

  makePost: function () {

    $('#post-form').toggle("drop", this.toggleOptions, 500 ); 
    $('#toggleGeo').show();


    var vicariousPoster = {

      //JSON object to be sent 

      post_data: {

        //gets heading, pitch, lat and lng from pano

        heading: this.panorama.getPov().heading,
        pitch: this.panorama.getPov().pitch,
        lat: this.panorama.getPosition().lat(),
        lng: this.panorama.getPosition().lng(),
        title: $('#titleField').val(),
        body: $('#textBox').val()

        }

      };

    if (vicariousPoster.post_data.body === '') {

      alert('You must include a description!');

    } else { 

      //sanity check to make sure these are being sent

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

        //clear the the text fields

        ajaxRequest.done($('#titleField').val(''), $('#textBox').val(''));
      
      }
      console.log(titleTest);
      console.log(titleBody);

      ajaxCaller(vicariousPoster);

      //send latest post data to this function

      this.addToPosts(vicariousPoster.post_data);

    }

  },

  cancelPost: function () {

    $('#post-form').toggle("drop", self.toggleOptions, 500);
    $('#toggleGeo').show();

  },

  addToPosts: function (post) {

    //Instead invoking an AJAX request, reparsing it through rails, and then loading it to the server
    //We'll instead just push the latest post object we have to our posts array property so that it can load it
    //dynamically

    var latestPost = post;
    var findUserId = $('#find_user_id').html();
    var findUsername = $('#find_username').html();

    latestPost.userId = findUserId;
    latestPost.username = findUsername;

    this.posts.push(latestPost);

    //replot the posts

    this.plotPosts();

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

  cancelSearch: function () {

    $('#locationFinder').toggle( "drop", self.toggleOptions, 500 );

  },

// root page lander. Looks for DOM element. Rails will hide the lander if there is a current user

  setLander: function () {

    this.lander = $('#aboutLander');

    this.lander.hide();

  },

  activateLander: function () {

    if (this.lander != null) {

      var self = this;

      this.lander.toggle('drop', this.toggleOptions, 500);

      $('.landerCloser').click(function () {
        self.lander.toggle('drop', this.toggleOptions, 500);
        self.lander = null;
      });

    }

  },

  setAnimations: function () {

    var self = this;
    
    // Hide elements in the dom.

    $('#story_id').hide();
    $( "#locationFinder" ).hide();
    $('#post-form').hide();
    $('#find_user_id').hide();
    $('#find_username').hide();
    $('.editUser').hide();

    $('#toggelPostForm').click(function () {

      $('#post-form').toggle("drop", self.toggleOptions, 500 );  
      $('#titleField').focus();

    });


    $('#toggleGeo').click(function() {

      $("#locationFinder").toggle( "drop", self.toggleOptions, 500 );
      $("#addressField").focus();

    });

  }

};





