import express from "express";
import userrouter from "./routes/userrouter.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";



const app = express();
app.use(express.json());  //middleware to parse json data

app.use((req,res,next)=>{

    const authorizationheader = req.header("Authorization")
    console.log(authorizationheader)

    if (authorizationheader != null){
        const token = authorizationheader.replace("Bearer ","")
        
        jwt.verify(token,"SECRETKEY",(error,content)=>{
        if(content ==null){
            console.log("invalid user")
            res.json({message :"invalid token"})
        }
        else{
            console.log(content)
            req.user=content
            next( )
        }
            
        }
        )
    }else{
    next()  }
})

 //this is not a middelware , from this part we can turn the traffic come as students to the student route.
app.use("/users",userrouter )

const mongourl="MONGO_URL ";  //mongo db url

mongoose.connect(mongourl).then(
    ()=>{console.log("connected to mongodb cluster")}
)   //connect to mongo db


function abc(){
    console.log("app running");
}

app.listen(5000 , ()=>{
    console.log("server started");        //use of arrow function

    abc();
}
)      