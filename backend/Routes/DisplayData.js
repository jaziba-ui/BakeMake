const express = require('express')
const router = express.Router()

router.post('/bakeData',(req,res) => {
    try {
        // console.log(global.bake_items)
        res.send([global.bakery_items, global.bakery_category])
    } catch (error) {
        console.error(error.message)
        res.send("SERVER ERROR")
    }
})


module.exports = router;