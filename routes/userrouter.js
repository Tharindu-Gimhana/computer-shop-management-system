import express from "express"
import { createusernew, loginuser } from "../controllers/UserControllers.js";


const userrouter=express.Router();

userrouter.post("/" , createusernew );

userrouter.post("/login" , loginuser );



export default userrouter;


