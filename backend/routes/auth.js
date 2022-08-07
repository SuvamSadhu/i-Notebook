const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Harryisagoodb$oy';


////CREATE A USER////
//ROUTE 1: Create a user using: POST "/api/auth/CreateUser" Login not required
router.post('/CreateUser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  //If there are errors return the error and bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  //Check weather the user with same email exist already
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "Sorry user with this email alreay exists" })
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    //Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email
    });

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success=true
    res.json({success, authtoken })
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
})



/////LOGIN//////
//ROUTE 2: Authenticate a user using: POST "/api/auth/CreateUser" Login not required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;

  //If there are errors return the error and bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Please try to login with correct credentials "});
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({success,error: "Please try to login with correct credentials "});
    }

    const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success, authtoken});

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error Ocurred");
  }

})


//ROUTE 3: Get logged in user details: POST "/api/auth/getuser" Login  required

router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");//selecting everyfeild except the password so -password
    res.send(user);

} catch (error) {
  console.log(error);
  res.status(500).send("Internal Server Error");
}

})



module.exports = router;