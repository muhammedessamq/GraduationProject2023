const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/wasteless",{
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("Database connected..")
   }).catch((err)=>{
    console.log(err)
   });