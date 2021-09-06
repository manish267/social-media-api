const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute=require('./routes/users');
const authRoute=require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,useUnifiedTopology:true
},()=>console.log("Database Connected"));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.get('/',(req,res)=>{
    res.send("welcome to homepage");
})

app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)

app.listen(8800,()=>{
    console.log("Backend server is Running");
})