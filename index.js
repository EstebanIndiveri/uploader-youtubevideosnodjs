const express=require('express');
const Youtube = require("youtube-api");
const {v4:uuidv4}=require('uuid');
const cors= require('cors');
const open=require('open');
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const multer=require('multer');
// const credentials=require('./credentialesnuevas.json');
const credentials=require('./secretsback.json');

const fs= require('fs');
const app=express();

app.use(express.json());

app.use(cors());

let videoFileSize='';


const storage=multer.diskStorage({
    destination:'./',
    filename(req,file,cb){
        const newFileName=`${uuidv4()}-${file.originalname}`
        cb(null,newFileName);
    }
})

const uploadVideoFile=multer({
    storage:storage
}).single('videoFile');

app.post('/upload',uploadVideoFile,async(req,res)=>{
    var oauth2Cient = await new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris
      );
      
      
    await oauth2Cient.setCredentials({
  
    });

    
await google.options({ auth: oauth2Cient }, function (err, res) {
    if (err) throw err;
    console.log(res);
  });

//   let youtube = google.youtube('v3')
let youtube = google.youtube('v3')

    if(req.file){

        const filename=req.file.filename;
        videoFileSize=fs.statSync(filename).size;
        const {title,description}=req.body;
        // open(oAuth.generateAuthUrl({
        //     access_type:'offline',
        //     scope:'https://www.googleapis.com/auth/youtube.upload',
            // state:JSON.stringify({
                // filename,title,description
            // })
        // }))
        //   youtube.videos.insert({
        //     resource:{
        //         snippet:{
        //             title,
        //             description,
        //             tags:'xercana'
        //         },
        //         status:{
        //             privacyStatus:'private'
        //         }
        //     },
        //     part:'snippet,status',
        //     media:{
        //         body:fs.createReadStream(filename)
        //     }
        const requestParameters={
            resource:{
                snippet:{
                    title,
                    description,
                    tags:'xercana'
                },
                status:{
                    privacyStatus:'private'
                }
            },
            part:'snippet,status',
            media:{
                body:fs.createReadStream(filename)
            }
        };

         youtube.videos.insert(requestParameters,{
            onUploadProgress:onUploadProgress
        },(data,error)=>{
            res.json({data})
            if(error)console.log(error);
            // res.status(200).json({data})
        })
        // (error,data)=>{
        //     if(error)console.log(error)
        //     // console.log(data);
        //     res.json({message:'done',data,filename})
        //     console.log('Done');
        //     // process.exit();
        // })
    }

})

function onUploadProgress(e){
    const progress=Math.round((e.bytesRead/videoFileSize)*100)
    console.log(progress+' complete');
}

app.get('/oauth2callback',(req,res)=>{
    res.redirect('http://localhost:3000/success');
    const {filename,title,description}=JSON.parse(req.query.state);

    oAuth.getToken(req.query.code,(err,tokens)=>{
        if(err){
            console.log(err)
            return;
        }
        oAuth.setCredentials(tokens);

        Youtube.videos.insert({
            resource:{
                snippet:{title,description},
                status:{privacyStatus:'unlisted'}
            },
            part:'snippet,status',
            media:{
                body:fs.createReadStream(filename)
            }
        },(error,data)=>{
            // if(error)console.log(error)
            // console.log(data);
            console.log('Done');
            // process.exit();
        })
    })
})

// const oAuth=Youtube.authenticate({
//     type:'oauth',
//     client_id:credentials.web.client_id,
//     client_secret:credentials.web.client_secret,
//     redirect_url:credentials.web.redirect_uris[0]
// })

const PORT=5000;

app.listen(PORT,()=>{
    console.log('APP READY IN PORT '+PORT)
});