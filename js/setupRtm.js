var md5 = (org) => CybozuLabs.MD5.calc(org)

var showPopup = (url, callback) => {
  var popup = window.open(url);
  var wait = () => {
    if(popup.closed) {
      callback();
    } else {
      setTimeout(wait, 300);
    }
  };
  wait();
}

var showRtmErrorAlert = (resp) => {
  alert(resp.rsp.err.code + ': ' + resp.rsp.err.msg);
}

var setupRtm = (api_key, api_secret, setupCallback) => {
  var rtm = new RememberTheMilk(api_key, api_secret, 'delete');

  var getAuthUrl = (callback) => {
    rtm.get('rtm.auth.getFrob', function(resp){
      rtm.frob = resp.rsp.frob;
      var authUrl = rtm.getAuthUrl(rtm.frob);
      callback(authUrl);
    });
  };

  var getToken = () => {
    rtm.get('rtm.auth.getToken', {frob: rtm.frob}, function(resp){
      console.log(resp);
      if(resp.rsp.stat == 'fail') {
        alert(resp.rsp.err.code + ': ' + resp.rsp.err.msg);
        return;
      }
      rtm.auth_token = resp.rsp.auth.token;
      localStorage.token = rtm.auth_token;
      setupCallback(rtm);
    });
  };

  var setup = (setupCallback) => {
    if(localStorage.token && localStorage.token.length > 0) {
      rtm.auth_token = localStorage.token;
      setupCallback(rtm);
    } else {
      getAuthUrl((authUrl) => {
        showPopup(authUrl, getToken);
      });
    }

  };

  setup(setupCallback);
}
