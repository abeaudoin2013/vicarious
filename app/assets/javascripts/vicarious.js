var Vicarious = {


	initialized: false,

	// This is fenway park
	initialCenter: {
		lat: null,
	  lng: null
	},

  newPOV: [],

	map: null,

	panorama: null,

  geocoder: null,

	posts: [],

  panoMarkers: [], 

  mapMarkers: [],	

  infoWindows: [],

  POVs: [],

  centers: [],

  lander: null,

	// markerData: {},

  init: function () {

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

    if (this.lander != null) {
      this.activateLander();
      console.log('here I am');
    }

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
        lat: 43,
        lng: -20
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
        position: center
      });

      var panoMarker = new google.maps.Marker({
        position: center
      });

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

      // this.infoWindowArr.push(infoWindow);

      // this.mapMarkersArr.push(mapMarker);


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
      nextPOV = this.POVs[i],
      nextCenter = this.centers[i],
      nextMarker = this.mapMarkers[i],
      nextInfo = this.infoWindows[i],
      currentInfo = {};

    if (index === -1) {

      currentInfo = this.infoWindows[j];

    } else {

      currentInfo = this.infoWindows[index];

    };


    currentInfo.close();

    this.map.setCenter(nextCenter);

    this.panorama.setPov(nextPOV);

    this.panorama.setPosition({

      lat: nextCenter.lat - .0002, 
      lng: nextCenter.lng - .0002
    
    });

    nextInfo.open(this.panorama, nextMarker);


    $('.posty').click(function () {

      if (i === j) {

        self.aroundTheWorld(-1);

      } else {

        self.aroundTheWorld(i);

      };

    });

  },



  makePost: function () {

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

    var titleTest = vicariousPoster.post_data.title;
    var titleBody = vicariousPoster.post_data.body;

    var storyId = $('#story_id').html();

    var storyInt = parseInt(storyId);


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

  search: function () {
    
    // call the geocode function with the address we want to use as parameter


    var address = $('#addressField').val();

    var self = this;

    this.geocoder.geocode({'address': address}, function(results, status) {
    
      if (status === google.maps.GeocoderStatus.OK) {
        
        self.map.setCenter(results[0].geometry.location);

        self.panorama.setPosition(results[0].geometry.location);

      } else {

        alert('We could not find that address. Sorry. Try again. ' + status);

      }
   
    });

  },

  setLander: function () {

    this.lander = $('#aboutLander');

    this.lander.hide();

  },

  activateLander: function () {
  
    var self = this;

    var options = {
      direction: 'up'
    };

    this.lander.toggle('drop', options, 500);

    $('.gotIt').click(function () {
      self.lander.toggle('drop', options, 500);
    });

  },

  setAnimations: function () {

    var options = {
      direction: "up"
    };

    var self = this;

    $('#story_id').hide();
    $( "#locationFinder" ).hide();
    $('#post-form').hide();

    $('#toggelPostForm').click(function () {
      
      $('#toggleGeo').hide();

      $('#post-form').toggle("drop", options, 500 );  
      $('#titleField').focus();


      $('#cancel-post').click(function () {

        $('#post-form').toggle("drop", options, 500);
        $('#toggleGeo').show();

      });


      $('#textBox').keypress(function (e) {

        var key = e.which;


        if (key === 13) {

          self.makePost();

          $('#post-form').toggle("drop", options, 500 ); 
          $('#toggleGeo').show();

        }


      });

    });


    $('#toggleGeo').click(function() {

      $("#locationFinder").toggle( "drop", options, 500 );

      $("#addressField").focus();

      $("#addressField").keypress(function (e) {

          var key = e.which;
          
          if(key === 13) {

            self.search();

            $("#addressField").val('');

            $('#locationFinder').toggle("drop", options, 500);

          }

      });

    });


  }


};





