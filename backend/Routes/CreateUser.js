const express = require('express')
const router = express.Router()
const user= require('../models/User')
const order = require('../models/Orders')
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = "HafsaJazibaWillBeADeveloperInShaAllah";

router.post('/createuser',[
body('email').isEmail(),
body('password','incorrect Password').isLength({ min: 5 }),
body('name').isLength({ min: 5 })]
, async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    const salt = await bcrypt.genSalt(15);
    const secPassword = await bcrypt.hash(req.body.password,salt)
    let eId = await order.create({"email" : req.body.email})
    try{
    await user.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            location: req.body.location 
        })
        let userD = await user.findOne({"email" : req.body.email});
        const data = {
            user: {
                id: userD.id
            }
        }
    //   res.json({success:true})
    console.log(eId)
      const authToken = jwt.sign(data,secret);
      return res.json({
        success: true,
        authToken: authToken,
    })
    
    }
    
    catch(error){
        console.log(error)
        res.json({success:false})
    }
})

router.post('/loginuser',[
body('email').isEmail(),
body('password','incorrect Password').isLength({ min: 5 })]
, async(req, res) => {
    let email = req.body.email;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    try{
    let userData = await user.findOne({email});
    if(!userData){
        return res.status(400).json
        ({ 
            errors : "Try Logging with correct email"
        })
    }

    const pwdCheck = await bcrypt.compare(req.body.password,userData.password)
    if(!pwdCheck){
        return res.status(400).json({
            errors : "Try Logging with correct password"
        }) 
    }

    const data = {
        user: {
            id: userData.id
        }
    }
    const authToken = jwt.sign(data,secret);
      return res.json({
        success: true,
        authToken: authToken
    })
    
    }
    
    catch(error){
        console.log(error)
        res.json({success:false})
    }
})

module.exports = router 