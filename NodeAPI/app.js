const express =require('express');
const app=express();
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const fs = require('fs')
var cors = require('cors')

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => console.log("MongoDB connected")) 
    .catch((err) => console.log(err));




// app.get("/",(req,res)=>{
// 	res.send("Hi there again");
// })
// //app.listen(8080);
// const port=8080;
// app.listen(port,()=>{
// 	console.log('A new API at:', port);
// })

 
// const postRoutes=require('./Routes/post');
// app.get("/", postRoutes.getPosts);
// const port=8080;
// app.listen(port,()=>{
// 	console.log('A new API at:', port);
// })


//const {getPosts}=require('./Routes/post');
// app.get("/", getPosts);
// const port=8080;
// app.listen(port,()=>{
// 	console.log('A new API at:', port);
// })




// const {getPosts}=require('./Routes/post');
// app.use(morgan("dev"));
// app.get("/",getPosts);
// const port=8081;
// app.listen(port,()=>{
// 	console.log('A new API at:', port);
// })




// const morgan = require('morgan');
// app.use(morgan("dev"));
// const myownMiddleware =(req,res,next) =>{
// 	console.log(" Hi middleware");
// 	next();
// }
// app.use(myownMiddleware);
// const {getPosts}=require('./Routes/post');
// app.get("/", getPosts);
// const portx=8080;
// app.listen(portx,()=>{
// 	console.log('A new API at:', portx);
// })


const port= process.env.PORT || 8081;
const postRoutes=require("./Routes/post");
const authRoutes=require('./Routes/auth');
const userRoutes=require('./Routes/user');

app.get('/', (req,res) => {
    fs.readFile('/docs/apiDocs.json' , (err,data) => {
        if(err)
            res.status(400).json({error: err})
        const docs = JSON.parse(data)
        res.json(docs);
    })
})

app.use(cors())
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/',postRoutes);
app.use('/',authRoutes);
app.use('/',userRoutes);
app.use(function(err,req,res,next) {
    if(err.name == "UnauthorizedError")
        res.status(401).json({Error: "Authorization token not found"})
})

app.listen(port,()=>{
    console.log("Yarr neend aarhi hojao",8081);
});