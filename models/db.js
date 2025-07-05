const mongoose = require("mongoose")
const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url).then(()=>{
    console.log("MongoDB is connected");
}).catch((err)=>{
    console.log("Mongo DB connection failed " , err);
})