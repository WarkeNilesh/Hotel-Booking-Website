import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

export const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })

        await newUser.save()

        res.status(200).send("user has been created.")
    } catch (err) {

        res.status(500).send("user not created");
    }
} 

export const login = async (req, res) => {
    try {
        const user =await User.findOne({email:req.body.email})
        if(!user) return  res.status(500).send("user doesn't match");

        const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password)
        if(!isPasswordCorrect)  return res.status(500).send("password didn't match");
        
        // command to get secret id
        // $randomBytes = New-Object -TypeName byte[] 32
        // $randomNumberGenerator = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
        // $randomNumberGenerator.GetBytes($randomBytes)
        // $base64String = [System.Convert]::ToBase64String($randomBytes)
        // $base64String

        const token = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT);  //secret key
        // to prevent sending password and is admin to user
        const {password,isAdmin, ...otherDetails} = user._doc;
        res.cookie("access_token",token,{
            httpOnly: true,
        }).status(200).json({...otherDetails});
       
    } catch (err) {

        res.status(500).send("not working");
    }
} 