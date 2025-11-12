import bcrypt from "bcrypt"
import User from "../models/users.js";


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
            message:"user created successfully"
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
                res.json({
                    matching : ispasswordcorrect
                })
            }
        }
    )};











