const express=require('express');
const Youtube = require("youtube-api");
const {v4:uuidv4}=require('uuid');
const cors= require('cors');
const open=require('open');
const multer=require('multer');
const credentials=require('./credentialesnuevas.json');
const fs= require('fs');
const app=express();

app.use(express.json());

app.use(cors());

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

app.post('/upload',uploadVideoFile,(req,res)=>{
    if(req.file){
        const filename=req.file.filename;
        const {title,description}=req.body;
        open(oAuth.generateAuthUrl({
            access_type:'offline',
            scope:'https://www.googleapis.com/auth/youtube.upload',
            state:JSON.stringify({
                filename,title,description
            })
        }))
    }
})

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
                status:{privacyStatus:'private'}
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

const oAuth=Youtube.authenticate({
    type:'oauth',
    client_id:credentials.web.client_id,
    client_secret:credentials.web.client_secret,
    redirect_url:credentials.web.redirect_uris[0]
})

const PORT=5000;

app.listen(PORT,()=>{
    console.log('APP READY IN PORT '+PORT)
});