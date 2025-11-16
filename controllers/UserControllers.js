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
        role:data.role

    })
        
    user.save().then(() => {
        res.json({
            message:"New user created successfully"
        })
    })};


export function loginuser(req,res){
    const email=req.body.email
    const password=req.body.password

    User.find({email:email}).then((users) => {
        
        if (users[0]==null){
            res.json({
                message:"user not found"
            })
        }else{
                const user =users[0]
                

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
    











