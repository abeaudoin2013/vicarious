// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require underscore
//= require gmaps/google
//= require turbolinks
//= require_tree .




// //initialize is called after page loads in application.html.erb
// function initialize() {
//   //sets map with these coordinates
//   var fenway = {lat: 42.345573, lng: -71.098326};
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: fenway,
//     zoom: 14
//   });
//   var panorama = new google.maps.StreetViewPanorama(
//       document.getElementById('pano'), {
//         position: fenway,
//         pov: {
//           heading: 34,
//           pitch: 10
//         }
//       });
//   map.setStreetView(panorama);


//   $('.posties').hide();
  

//   //Build markers
  function Post(title, body, lat, lng, pitch, heading) {
    this.title = title;
    this.body = body;
    this.lat = lat;
    this.lng = lng;
    this.pitch = pitch;
    this.heading = heading;
    this.makeMap = function(){
      var self = this;

      //make a location
      var location = {lat: this.lat, lng: this.lng};

      //make a map using that location
      var map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 14
      });

      //make a panoram with same location
      var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
          position: location,
          pov: {
            heading: self.heading,
            pitch: self.pitch
          }
        });

      //set map object to street view with street view object
      map.setStreetView(panorama);

      //make an empty infoWindow
      var infowindow = new google.maps.InfoWindow({
      });

      //make a marker
      var marker = new google.maps.Marker({
        position: {lat: self.lat, lng: self.lng}
      });

      //tell the marker to go to the panorama view
      //FIGURE OUT HOW TO GET IT TO ALSO DISPLAY ON REGULAR MAP
      marker.setMap(panorama);

      //add listener to map
      marker.addListener('click', function(){
        infowindow.setContent('<div id="posty"><h1>'  + self.title + '</h1> <br> <p>' + self.body + '</p></div>');
        infowindow.open(panorama, marker);
          $('#posty').click(function(){
             var next_post = new Post('Moooo', 'says the cow', 43.613146,-70.213913, 40, 10);
             next_post.makeMap();
          });
      });
    };
  };



//   //get the data
//   var query_title = $('#title').html();
//   var query_body = $('#body').html();
//   var query_lat = $('#lat').html();
//   var query_lng = $('#lng').html();
//   var query_pitch = $('#pitch').html();
//   var query_heading = $('#heading').html();

//   //parse the lat, lng, pitch, heading
//   var parsed_lat = parseFloat(query_lat)
//   var parsed_lng = parseFloat(query_lng)
//   var parsed_pitch = parseFloat(query_pitch)
//   var parsed_heading = parseFloat(query_heading)


//   //Use parsed variables and query_title and post to build object instance
//   var test_post = new Post(query_title, query_body, parsed_lat, parsed_lng, parsed_heading, parsed_pitch)
//   test_post.makeMap();

  




//     //JSON BUILDER
//     $('#submit-post').click(function(){
        
//       var vicarious = {
//         post_data: {
//         heading: panorama.getPov().heading,
//         pitch: panorama.getPov().pitch,
//         lat: panorama.getPosition().lat(),
//         lng: panorama.getPosition().lng(),
//         title: $('#titleField').val(),
//         body: $('#textBox').val()
//           }
//         };

//       var storyId = $('#story_id').html();

//       var link = '/stories/' + storyId + '/posts'

//       function ajaxCaller(vicarious){
//         var b = $.ajax({
//           type: 'POST',
//           url: link,
//           dataType: 'json',
//           data: {
//             post: {
//               post_JSON: JSON.stringify(vicarious.post_data)
//             }
//           }
//         })
//         b.done($('#titleField').val(''),
//                $('#textBox').val(''))
      
//       }

//       ajaxCaller(vicarious)

//     });
// };
