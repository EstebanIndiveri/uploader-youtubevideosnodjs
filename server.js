const fs = require("fs");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const credentials = require("./credentials2.json");
require("dotenv").config();

var oauth2Cient = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris
);


oauth2Cient.setCredentials({
  access_token: "ya29.a0AfH6SMBCXQtQuO3Pwl2s_KtG4WUX-eiPY1Gh5ApEwpyua_Z2FpucMVTPxVtTTqnYf7GTr1cRdafiHLfB4s1koh8WWW3q2kk3LaQM7CQ_FP0v3kbla5nRtLQ2FA8-MbG27VWq8fEY9e7RO4RTkI1iApYgBxcJ",
  refresh_token: "1//042qXDtqMU83yCgYIARAAGAQSNwF-L9Ir9E6izDwytqgoyivmfiLz5WZp1FYxSJIyy1McJiuZ1sE-iZuvTY2O1cIcqcH90jsjAGo"
});

google.options({ auth: oauth2Cient }, function (err, res) {
  if (err) throw err;
  console.log(res);
});

let youtube = google.youtube('v3')

let options = {
  resource: {
    snippet: {
      title: "Upload by Xercana.com",
      description: "Upload fine",
    },
    status: {
      privacyStatus: "private",
    },
  },
  part: "snippet,status",
  media: {
    body: fs.createReadStream("video.mp4"),
  },
};

youtube.videos.insert(options,function(err,data){
    if(err)throw err
    console.log(data);
});