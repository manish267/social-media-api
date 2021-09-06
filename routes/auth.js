const router = require("express").Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const { findOne } = require("./../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    newUser.password = hashedPassword;
    const data = await newUser.save();
    res
      .status(200)
      .json({ status: "success", message: "new user get created" });
  } catch (error) {
    console.log(error.message);
  }
});

// LOGIN

router.post('/login',async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email}).select('username email password');

    if(!user) return res.json({status:"error",message:"Invalid credentials"});
    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(validPassword && user){

      return  res.status(200).json({status:"success",user});
    }

    return res.json({status:"error",message:"Invalid credentials"})
    

    }catch(error){
        console.log(error.message);
    }


    

})

module.exports = router;
