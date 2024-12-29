const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://BakeMake:BakeMake123@cluster0.t2jp1fl.mongodb.net/BakeMakeMERN?retryWrites=true&w=majority&appName=Cluster0'

const mongoDB = async () => {
  await mongoose.connect(mongoURI,{
    useNewURLParser : true 
}, async (error,result) => {
    if(error) {
    console.log("SOME PROBLEM",error)
    }
    else{
    console.log("CONNECTED!!!!!")
    const fetched_data = await mongoose.connection.db.collection("bakery_items");
    fetched_data.find({}).toArray(
        async function(err,data) {

            const bakeCategory = await mongoose.connection.db.collection("bakery_category");
            bakeCategory.find({}).toArray(
                function(err,catData) {
                    if(err) {
                console.log("SOME PROBLEM",err)
            }
            else{
                global.bakery_items = data;
                global.bakery_category = catData;
                // console.log(global.bakery_items)
            }
                })
            
        }
    )
    }
});
}

module.exports = mongoDB;