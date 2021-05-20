const fs = require("fs");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const credentials = require("./credentialesnuevas.json");
require("dotenv").config();

var oauth2Cient = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris
);


oauth2Cient.setCredentials({
  access_token: "ya29.a0AfH6SMBo8DqYjq_2w6kQ1kkDm9S3HAc9w5bh60_SH0AI7aOKAamrOiwMwqKz6ArVxQuEnJw5FDHwLPEhmcS2tCwiKtJjZqtiEaw_ZuzJZhqnctygAfc8uYwHRUnTd2OFr_SAiC_Y5nfAOOLA8iYnCZGDinaX",
  refresh_token: "1//04Uk99Z_fT-cSCgYIARAAGAQSNwF-L9IrCDwuh2r0c2tdzH7EGWRpDMpDpu6PIx2LLrmbtd_Smc_R6jSDlusBD-vqokPTovJK8Wg"
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