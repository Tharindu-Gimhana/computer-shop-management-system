import express from "express"
import { createusernew, getUser, loginuser } from "../controllers/UserControllers.js";


const userrouter=express.Router();

userrouter.post("/" , createusernew );

userrouter.post("/login" , loginuser );

userrouter.get("/",getUser);



export default userrouter;


