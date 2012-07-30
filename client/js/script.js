function stringToJSON(obj) {
  return eval('(' + obj + ')');
}

function eventsouceTest() {
  if(typeof(EventSource)!=="undefined")
  {
    var source=new EventSource("http://mocodo.sinaapp.com/server/eventsouce.php");
    source.onmessage=function(event)
    {
      //document.getElementById("result").innerHTML+=event.data + "<br />";
      alert("msg: " + event.data);
    };
  }
  else
  {
    alert("not support");
  }
}

$.ajaxSetup({
  // Disable caching of AJAX responses
  cache : false
});

app = {};

app.alarm = {
  start : function() {
    sina.alarm.start(Date.now(), 30000, "callback.html", "callback", true);
  },
  stop : function() {
    sina.alarm.stop();
  }
};

app.updater = {
  check : function() {
    sina.updater.check();
  },
}

app.notification = {
  notify : function() {
    sina.notification.notify({
      "saeAppName": "mocodo",
      "redirectUrl": "index.html",
      "tickerText": "tickerText",
      "contentTitle": "contentTitle",
      "contentText": "contentText",
      "id": 1
    });
  },
  cancel : function() {
    sina.notification.cancel(1);
  },
  cancelAll : function() {
    sina.notification.cancelAll();
  }
};

app.utils = {
  exit : function() {
    sina.utils.exit();
  },
  lockscreen : function() {
    sina.utils.screen("lock");
  },
  disableKeyguard : function() {
    sina.utils.keyguard("enable");
  },
};

app.childbrowser = {
  showWebPage : function() {
    sina.childBrowser.showWebPage("http://www.google.com.hk/m?gl=cn&hl=zh_cn&source=ihp", { showLocationBar: true });
  },
  openExternal : function() {
    sina.childBrowser.openExternal("http://www.google.com.hk/m?gl=cn&hl=zh_cn&source=ihp");
  }
};

app.weibo = {
  access_t : "",
  init : function() {
    CDV.WB.init({
      appKey : "D15FBF1C7E586D5684770062F8CF2744081C4560B9F36BDE",
      appSecret : "9272F9E87FC7B2BC69A61897964A56193EA9B43295D5F0481848DDF316EBED6A182EF23446156A6B",
      redirectUrl : "http://www.sina.com"
    }, function(response) {
      alert("init: " + response);
    }, function(msg){
      alert(msg);
    });
    this.access_t = localStorage.getItem("access_t");
  },
  login : function() {
    sina.weibo.login(function(access_token, expires_in) {
      if (access_token && expires_in) {
        alert('logged in');
        localStorage.setItem('access_t', access_token);
        app.weibo.access_t = access_token;
      } else {
        alert('not logged in');
      }
    });
  },
  logout : function() {
    sina.weibo.logout(function(response) {
      alert('logged out');
      localStorage.removeItem("access_t");
      this.access_t = null;
    });
  },
  timeline : function() {
    if (this.access_t) {
      sina.weibo.get("https://api.weibo.com/2/statuses/home_timeline.json", {
        access_token : this.access_t,
      }, function(response) {
        var data = stringToJSON(response);
        alert('statuses[0].text: ' + data.statuses[0].text);
      }, function(response) {
        alert('error: ' + response);
      });
    } else {
      alert('not logged in');
    }
  },
  get : function() {
    sina.weibo.get("https://api.weibo.com/2/account/get_uid.json", {
      access_token : this.access_t,
    }, function(response){
      alert('User uid is ' + stringToJSON(response).uid);
    }, function(response){
      alert('error: ' + response);
    });
  },
  post : function() {
    sina.weibo.post("https://api.weibo.com/2/statuses/update.json", {
      access_token : this.access_t,
      status : "test update"
    }, function(data) {
      alert('update success.' + data);
    }, function(response){
      alert('error: ' + response);
    })
  },
  upload : function() {
    function onSuccess(imageURI) {
      $("#upload").html("uploading...");
      sina.weibo.upload("https://api.weibo.com/2/statuses/upload.json", {
        access_token : this.access_t,
        status : "test update"
      },
      imageURI,
      function(data) {
        $("#upload").html("upload");
        alert('update success.' + data);
      }, function(response){
        $("#upload").html("upload");
        alert('error: ' + response);
      })
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }

    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
    });
  }
};

app.voice = {};
app.voice.recognizer = {
  contentID : "",
  recognizerInited : false,
  appId : '4fa1e775',
  listenerName : 'app.voice.recognizer.onResults',
  start : function() {
    $("#voice-text").html("");
    if(!this.recognizerInited) {
      sina.voice.recognizer.init(this.appId);
      this.recognizerInited = true;
    }

    sina.voice.recognizer.setOption({
      engine: 'sms',
      sampleRate: 'rate16k',
    });

    sina.voice.recognizer.setListener(this.listenerName);

    sina.voice.recognizer.start(function(response) {
      console.log("response: " + response.errorCode + ", msg: " + response.message);
    });

    console.log("start");
  },
  onResults : function(response) {
    console.log('isLast: ' + response.isLast);
    console.log(response);
    response.results.forEach(function(recognizerResult) {
      console.log(recognizerResult.text + "##" + recognizerResult.confidence);
      $("#voice-text").append(recognizerResult.text);
    });
  },
  uploadKeyword : function() {
    if(!this.recognizerInited) {
      sina.voice.recognizer.init(this.appId);
      this.recognizerInited = true;
    }

    var keys = "互联网,计算机,科技,生活,人文,天文,月球的多面,第三集";
    sina.voice.recognizer.uploadKeyword(keys, "tags", function(result) {
      app.voice.recognizer.extendID = result.extendID;
      console.log("extendID: " + result.extendID);
    }, function(response) {
      console.log("response: " + response.errorCode + ", msg: " + response.message);
    });

    console.log("uploadKeyword");
  },
  keywordRecogize : function() {
    if(!this.recognizerInited) {
      sina.voice.recognizer.init(this.appId);
      this.recognizerInited = true;
    }

    console.log("this.extendID: " + app.voice.recognizer.extendID);
    sina.voice.recognizer.setOption({grammar: this.extendID});
    sina.voice.recognizer.setListener(this.listenerName);

    sina.voice.recognizer.start(function(response) {
      console.log("response: " + response.errorCode + ", msg: " + response.message);
    });

    console.log("keywordRecogize");
  }
};

app.imagefilter = {
  goto : function() {
    window.open('imagefilter.html');
  }
};

app.cordova = {
  goto : function() {
    window.open('cordova.html');
  }
};

app.sms = {
  send : function() {
    sina.sms.send("phonenumber", "给自己的测试短信", function() {
      console.log("success");
      alert("success: send 13146477160");
    }, function(e) {
      console.log('Message Failed:' + e);
      alert("fail: " + e);
    });
  },
  getInbox : function() {
    sina.sms.get(function(data) {
      console.log(data);
      alert("success: " + JSON.stringify(data));
    }, function() {
      console.log("fail");
      alert("fail");
    }, null, {
      "type": "inbox"
    });
  },
  getAllTen : function() {
    sina.sms.get(function(data) {
      console.log(data);
      alert("success: " + JSON.stringify(data));
    }, function() {
      console.log("fail");
      alert("fail");
    }, null, {
      "order": "date desc",
      "start": "10",
      "count": "10"
    });
  },
  getThread : function() {
    sina.sms.get(function(data) {
      console.log(data);
      alert("success: " + JSON.stringify(data));
    }, function() {
      console.log("fail");
      alert("fail");
    }, {
      "thread_id": "1"
    });
  },
  insert : function() {
    sina.sms.insert({
      "thread_id": "1",
      "number": "13146477160",
      "person_id": "8",
      "text": "测试插入短信",
      "type": "inbox"
    }, function(id) {
      console.log("id: " + id);
      app.sms.insertId = id;
      alert("insert " + app.sms.insertId + " success.");
    }, function() {
      console.log("fail");
      alert("insert failed.");
    });
  },
  remove : function() {
    if(app.sms.insertId) {
      sina.sms.remove(app.sms.insertId, function() {
        console.log("success");
        alert("del " + app.sms.insertId + " success.");
      }, function() {
        console.log("fail");
        alert("del " + app.sms.insertId + " failed.");
      });
    }
  }
};

app.barcode = {
  scan: function() {
    sina.barcodeScanner.scan( function(result) {
          alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
      }, function(error) {
          alert("Scanning failed: " + error);
      });
  },
  encode: function() {
    sina.barcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
          alert("encode success: " + success);
        }, function(fail) {
          alert("encoding failed: " + fail);
        }
      );
  }
};
