const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')

router.post('/orderData' , async(req,res) => {
    let data = req.body.order_data
    await data.splice(0,0, { order_date: req.body.order_date })
    console.log("1231242343242354",req.body.email)
    
    // console.log(eId)
        try{
            await Order.findOneAndUpdate({ email: req.body.email },
                { $push: { order_data : data }
            })
            {console.log("eId",data)} 
                res.json({ success: true })
        }
        catch(error){
         res.send("Server Error", error.message) 
        }

        
})

router.post('/myOrderData' , async(req,res) => {
    try {
        let eId = await Order.findOne({ "email" : req.body.email })
        // let myData = await Order.findOne({"email" : req.body.email})
        res.json({orderData : eId})
        console.log(eId)
    } catch (error) {
        res.send("Server Error", error.message) 
    }
})

module.exports = router;