import bcrypt from "bcrypt"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config(); // 👈 add this





const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "tharindugimhana908@gmail.com",
		pass: process.env.Gmail_pwrd
	},
});



export function createusernew(req,res){
    const data=req.body
    const hashedpwrd=bcrypt.hashSync(data.password, 10);

    
    const user=new User({
        email:data.email,
        firstname:data.firstname,
        lastname:data.lastname,
        password:hashedpwrd,

    })
        
    user.save().then(() => {
        res.json({
            message:"New user created successfully"
        })
    })};


export function loginuser(req,res){
    const email=req.body.email
    const password=req.body.password

    console.log("Login attempt for email: " + email);
    User.find({email:email}).then((users) => {
        
        if (users[0]==null){
            res.status(404).json({
                message:"user not found"
            })
        }else{
                const user =users[0]
                console.log(user)
                

                const ispasswordcorrect = bcrypt.compareSync(password,user.password)
                
            
                if(ispasswordcorrect){

                    const payload={
                        email:user.email,
                        firstname:user.firstname,
                        lastname:user.lastname,
                        role:user.role,
                        isemailverified:user.isemailverified,
                        image:user.image 
                    };

                    const token=jwt.sign(payload,process.env.SECRETKEY, {expiresIn:"128h"})

                res.json({
                    matching : ispasswordcorrect,
                    message : "userr login successful",
                    token : token
                
                })}
                else{
                    res.status(403).json({
                    message : "login failed"

                    })
                }
            }
        }
    )};

    export function isadmin(req){
    if(req.user == null){
        return false
        }
        
    

    if(req.user.role != "admin"){
      return false  
    }

    return true
   }

   export function getUser(req, res) {
	if (req.user == null) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	res.json(req.user);
}


export async function googleLogin(req, res) {
	console.log("this is the token that is sent from google ")
	console.log(req.body.token);
	try {
		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${req.body.token}`,
				},
			}
		);

		console.log("this is the details of user that used the google login , from google",response.data);

		const user = await User.findOne({ email: response.data.email });
		if (user == null) {
			const newUser = new User({
				email: response.data.email,
				firstname: response.data.given_name,
				lastname: response.data.family_name,
				password: "123",
				image : response.data.picture,
			})
			await newUser.save();

			const payload = {
				email: newUser.email,
				firstname: newUser.firstname,
				lastname: newUser.lastname,
				role: newUser.role,
				isemailverified: true,
				image: newUser.image,
			};

			const token = jwt.sign(payload, process.env.SECRETKEY, {
				expiresIn: "150h",
			});

			res.json({
				message: "Login successful",
				token: token,
				role: newUser.role,
			});

		} else {
			const payload = {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				role: user.role,
				isemailverified: user.isemailverified,
				image: user.image,
			};

			const token = jwt.sign(payload, process.env.SECRETKEY, {
				expiresIn: "150h",
			});

			res.json({
				message: "Login successful",
				token: token,
				role: user.role,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: "Google login failed",
			error: error.message,
		});
	}
}


export async function sendOTP(req, res) {
	try {
		const email = req.params.email;
		console.log("REQUEST EMAIL:", req.params.email);

		const user = await User.findOne({
			email: email,
		});
		if (user == null) {
			console.log("yes user null");
			res.status(404).json({
				message: "User not found",
			});
			return;
		}

		await OTP.deleteMany({
			email: email,
			
		});console.log("ok");

		//generate random 6 digit otp
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
		console.log("this is otp code",otpCode);

		const Otp = new OTP({
			email: email,
			otp: otpCode,
		});  console.log("new otp saved");

		await Otp.save();

		const message = {
			from: "danceclubfot@gmail.com",
			to: email,
			subject: "Your OTP Code",
			text: "Your OTP code is " + otpCode,
		};

		transporter.sendMail(message, (err, info) => {
			if (err) {
				res.status(500).json({
					message: "Failed to send OTP",
					error: err.message,
				});
				console.log("error point 1",err);
			} else {
				res.json({
					message: "OTP sent successfully",
				});
			}
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to send OTP",
			error: error.message,
		});
		console.log("error point 2",error);
	}
}


export async function validateOTPAndUpdatePassword(req, res) {
	try {
		const otp = req.body.otp;
		const newPassword = req.body.newPassword;
		const email = req.body.email;

		const otpRecord = await OTP.findOne({ email: email, otp: otp });
		if (otpRecord == null) {
			res.status(400).json({
				message: "Invalid OTP",
			});
			return;
		}

		await OTP.deleteMany({ email: email });

		const hashedPassword = bcrypt.hashSync(newPassword, 10);

		await User.updateOne(
			{ email: email },
			{
				$set : {password: hashedPassword, isemailverified: true} ,
			}
		);
		res.json({
			message: "Password updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to update password",
			error: error.message,
		});
	}
}








