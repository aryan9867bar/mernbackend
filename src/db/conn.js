const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RegisterForm", {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(() => {
    console.log("connection is successful");
}).catch((e) => {
    console.log("No Connection");
})