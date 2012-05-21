// PROJECT: ImageFilter Phonegap Plugin
// AUTHOR: Drew Dahlman (www.drewdahlman.com)
// DATE: 2.25.2012
// VERSION: 1.0
/*
NOTES:
A few things to read before using this plugin.
Each filter is created with objective-c. Thus modifications to effects must be made there.
Applying a filter is simple - 

EXAMPLE:
plugins.ImageFilter.stark(successCallback{
    image:imageURI,
    save:'false'
});
 
*/

// GLOBAL VARS
var largeImage;

var app = {
    bodyLoad: function () {
        setTimeout(function() {
            document.addEventListener("deviceready", app.deviceReady, false);
        }, 1000);
    },
    deviceReady: function () {
        app.init();
    },
    init: function () {
		
    },
    useCamera: function () {
        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            //sourceType: Camera.PictureSourceType.CAMERA,
            //encodingType: Camera.EncodingType.JPEG,
            targetWidth: 910,
            targetHeight: 910,
            saveToPhotoAlbum: false
        });
    },
    useRoll: function () {
        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //encodingType: Camera.EncodingType.JPEG,
            //targetWidth: 910,
            //targetHeight: 910,
            saveToPhotoAlbum: false
        });
    },
    onCameraSuccess: function (imageURI) {
  //  largeImage=imageURI;
        window.resolveLocalFileSystemURI(imageURI, app.win, app.fail);
    },
    onCameraFail: function (msg) {
        console.log("ERROR! -" + msg);
    },
    win:function(data){
    	console.log(data.fullPath);
      largeImage = data.fullPath;

      var imageData;
      var reader = new FileReader();
      reader.onloadend = function(evt) {
        imageData = evt.target.result;

        $(".photo").html("<img src='" + imageData + "'>");
        $(".photo").show();
        filters.none(largeImage);
      };
      reader.readAsDataURL(data);
    },
    fail:function(){
    }
};

function readAsText(file) {
}

var filters = {
    none: function (imageURI) {
        plugins.ImageFilter.none(filters.rendered, {
            image: imageURI,
            save: 'false',
        });
    },
    sunnySide: function (imageURI) {
        plugins.ImageFilter.sunnySide(filters.rendered, {
            image: imageURI,
            save: 'false'
        });
    },
    worn: function (imageURI) {
        plugins.ImageFilter.worn(filters.rendered, {
            image: imageURI,
            save: 'false'
        });
    },
    vintage: function (imageURI) {
        plugins.ImageFilter.vintage(filters.rendered, {
            image: imageURI,
            save: 'false'
        });
    },
    stark: function (imageURI) {
        plugins.ImageFilter.stark(filters.rendered, {
            image: imageURI,
            save: 'false'
        });
    },
    pinhole: function (imageURI) {
        plugins.ImageFilter.pinhole(filters.rendered, {
            image: imageURI,
            save: 'true'
        });
    },
    rendered: function (msg) {
        var myRand=parseInt(Math.random()*99999999);

        console.log("msg: " + msg);
        //window.resolveLocalFileSystemURI(msg, function(data) {
          //console.log("data: " + data);
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
              fileSystem.root.getFile(msg, null, function(fileEntry) {
                console.log("fileEntry.ffullPath: " + fileEntry.fullPath);
                var imageData;
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                  imageData = evt.target.result;
        //          console.log("imageData: " + imageData);
                  $(".photo").html("<img src='" + imageData + "'>");
                  //$(".photo").show();
                  //filters.none(largeImage);
                };
                reader.readAsDataURL(fileEntry);
              }, function() {
                console.log("getFile failed.");
              });
            }, function() {
              console.log("requestFileSystem failed.");
            });
        //},
          //function() {
        //});

        //$(".photo").html("<img src='" + msg +"?"+myRand+"'>");
        //$(".photo").html("<img src='" + imageData + "'>");
    }
}
