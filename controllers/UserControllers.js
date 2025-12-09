import bcrypt from "bcrypt"
import User from "../models/user.js";
import jwt from "jsonwebtoken";


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

		console.log(response.data);

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
				isemailVerified: true,
				image: newUser.image,
			};

			const token = jwt.sign(payload, process.env.SECRETKEY, {
				expiresIn: "150h",
			});

			res.json({
				message: "Login successful",
				token: token,
				role: user.role,
			});

		} else {
			const payload = {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				role: user.role,
				isemailVerified: user.isemailVerified,
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











