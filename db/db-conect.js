const mongoose = require('mongoose')
function connection(){mongoose.connect(process.env.MONGODB_URI)}
module.exports=connection
