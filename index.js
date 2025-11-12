import express from "express";
import userrouter from "./routes/userrouter.js";
import mongoose from "mongoose";


const app = express();
app.use(express.json());  //middleware to parse json data

 //this is not a middelware , from this part we can turn the traffic come as students to the student route.
app.use("/users",userrouter )

const mongourl="MONGO_URL ";  //mongo db url

mongoose.connect(mongourl).then(
    ()=>{console.log("connected to mongodb cluster")}
)   //connect to mongo db


function abc(){
    console.log("app running");
}

app.listen(3000 , ()=>{
    console.log("server started");        //use of arrow function

    abc();
}
)      