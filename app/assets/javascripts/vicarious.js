var Vicarious = {


	initialized: false,

	// This is fenway park
	initialCenter: {
		lat: 42.345573,
	  lng: -71.098326
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

	// markerData: {},

  init: function () {

  	if (this.initialized) {
  		console.log('already initialized');
  		return false;

  	}

  	//This is the array of posts
 

  	this.initializeMap();

    this.initializePanorama();

    this.initializeGeocoder();

  	this.setPosts();

  	this.plotPosts();

    // this.aroundTheWorld();

    var self = this;

    // $('.posty').click(function () {

    //   // self.aroundTheWorld();
    //   // console.log('hi')

    // });

    $('#submit-post').click(function (){

      self.makePost();

    });

    $('submitAddress').click(function (){
      this.search
    });


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

  initializeGeocoder: function () {
    this.geocoder =  new google.maps.Geocoder();
  },

  setPosts: function () {
  	this.posts = $('.Post');
  },

  plotPosts: function () {

  	$.each(this.posts, function(index, post) {
      
      var $post = $(post),

      lat = $post.data('lat'),

      lng = $post.data('lng'),

      pitch = $post.data('pitch'),

      heading = $post.data('heading'),

      title = $post.data('title'),

      body = $post.data('body'),
      
      //Will these make the info windows sync in chronological order?

      center = {
        lat: lat,
        lng: lng
      },

      mapMarker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
      }),

      panoMarker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
      }),

      infoWindow = new google.maps.InfoWindow({
        content: '<div class="posty"><h1>'  + title + '</h1> <p>' + body + '</p></div>'
      }),

      setMap = mapMarker.setMap(this.map),
      
      setPano = panoMarker.setMap(this.panorama),

      self = this;

      this.centers.push(center);

      this.panoMarkers.push(panoMarker);

      this.mapMarkers.push(mapMarker);

      this.infoWindows.push(infoWindow);

      this.POVs.push({heading, pitch});

      
      panoMarker.addListener('click', function () {

        infoWindow.open(self.panorama, panoMarker);
        
        $('.posty').click(function () {
          
          self.aroundTheWorld(index);

        });
      });

      mapMarker.addListener('click', function () {
        infoWindow.open(self.map, mapMarker);
      });

      // this.infoWindowArr.push(infoWindow);

      // this.mapMarkersArr.push(mapMarker);


    }.bind(this))
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

    nextInfo = this.infoWindows[i];

    if (index = -1) {

      var currentInfo = this.infoWindows[j];

    } else {

      var currentInfo = this.infoWindows[index];

    };


    currentInfo.close();

    this.map.setCenter(nextCenter);

    this.panorama.setPov(nextPOV);

    this.panorama.setPosition(nextCenter);

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

    var storyId = $('#story_id').html();

    var link = '/stories/' + storyId + '/posts'

    function ajaxCaller(vicarious){
      var b = $.ajax({
        type: 'POST',
        url: link,
        dataType: 'json',
        data: {
          post: {
            post_JSON: JSON.stringify(vicarious.post_data)
          }
        }
      })
      b.done($('#titleField').val(''),
             $('#textBox').val(''))
    
    }

    ajaxCaller(vicariousPoster);
  },

  search: function () {
    
    // call the geocode function with the address we want to use as parameter


    var address = $('#addressField').val();

    var self = this;

    this.geocoder.geocode({'address': address}, function(results, status) {
    
      if (status === google.maps.GeocoderStatus.OK) {
        
        self.map.setCenter(results[0].geometry.location);

      } else {

        alert('Geocode was not successful for the following reason: ' + status);

      }
   
    });

  }

};





