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
//= require turbolinks
//= require_tree .

function initialize() {
  var fenway = {lat: 42.345573, lng: -71.098326};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: fenway,
    zoom: 14
  });
  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
  map.setStreetView(panorama);
}

// (function() {

//   var Vicarious = {

//     panorama: null,

//     textBox: $('#textBox'),
//     titleField: $('#titleField'),
//     submitButton: $('#submit-post'),
//     cancelButton: $('#cancel-post'),

//     panoramaEvents: {
//       positionChanged: 'position_changed',
//       povChanged: 'pov_changed'
//     },

//     routes: {
//       posts: {
//         POST: 'posts/create'
//       }
//     },

//     init: function () {

//       if (panorama) {
//         return;
//       }

//       this.panorama = new ...;
//       this.bindPanorama();
//     },

//     bindPanorama: function () {

//       var self = this;

//       // This listens for a click. The text box is hidden right now.
//       this.panorama.addListener(this.panoramaEvents.positionChanged, function () {
//         self.showTextBox();
//       });

//       // This listens for a click. The text box is hidden right now.
//       this.panorama.addListener(this.panoramaEvents.povChanged, function () {
//         self.showTextBox();
//       });

//       this.submitButton.click(function () {

//         var data = {
//           title: self.titleField.text(),
//           location: this.panorama.getPosition(),
//           pov: this.panorama.getPov();
//         };

//         self.createPost(data);
//       });

//       this.cancelButton.click(function() {
//         self.hideTextBox();
//       });
//     },

//     showTextBox: function() {
//       this.textBox.show();
//     },

//     hideTextBox: function () {
//       this.textBox.hide();
//     },

//     createPost: function(data) {
//       $.POST({
//         url: this.routes.posts.POST,
//         data: data
//       });
//     }

//   };

// }());

// Vicarious.init();