import express from "express"
import { createusernew, getUser, loginuser, sendOTP, validateOTPAndUpdatePassword } from "../controllers/UserControllers.js";
import { googleLogin } from "../controllers/UserControllers.js";


const userrouter=express.Router();

userrouter.post("/" , createusernew );

userrouter.post("/login" , loginuser );
userrouter.post("/google-login" , googleLogin );


userrouter.get("/",getUser);
userrouter.get("/send-otp/:email",sendOTP)
userrouter.post("/validate-otp", validateOTPAndUpdatePassword)





export default userrouter;


