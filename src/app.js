require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public" );
const template_path = path.join(__dirname, "./templates/views" );
const partial_path = path.join(__dirname, "./templates/partials" );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req,res) => {
    res.render("index")
});

app.get("/secret",auth, (req,res) => {
    // console.log(`this is the cookie awesome ${req.cookies.jwt}`);
    res.render("secret")
});

app.get("/logout",auth, async (req,res) => {
   try {
       console.log("req.user");
      
                        // for single logout
    //    req.user.tokens = req.user.tokens.filter((currElement)=>{
    //        return currElement.token !== req.token
    //    });
                            // logout from all devices
                req.user.tokens = [];


       res.clearCookie("jwt");
       console.log("logout successfully");
       
       await req.user.save();
       res.render("login");
   } catch (error) {
       res.status(500).send(error);
   }
});

app.get("/register", (req,res) => {
    res.render("register")
});

app.get("/login", (req,res) => {
    res.render("login")
});

app.post("/register", async (req,res) => {
  try {
      const password = req.body.Password;
      const cpassword = req.body.ConfirmPassword;
      if(password === cpassword) {
          const registerClient = new Register({
            FirstName : req.body.firstname,
            MiddleName : req.body.middlename,
            LastName : req.body.lastname,
            Gender : req.body.gender,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            Password : password,
            ConfirmPassword : cpassword
        });
    console.log("the success part" + registerClient);

    const token = await registerClient.generateAuthToken(); 
    console.log("the token part" + token); 

    res.cookie("jwt",token, {
        expires:new Date(Date.now()+600000),
        httpOnly:true
    });
    console.log(cookie); 

    const registered = await registerClient.save();
    console.log("the page part" + registered); 
    res.status(201).render("login");

      }else {
          res.send("password arenot matching");
      }
    }catch(e) {
         res.status(400).send(e);
        console.log("the error part page");
  }
});

app.post("/login", async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and password is ${password}`);
           const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);
        // console.log(useremail);

        const isMatch = await bcrypt.compare(password, useremail.Password)
        
    const token = await useremail.generateAuthToken(); 
    console.log("the token part" + token); 

    res.cookie("jwt",token, {
        expires:new Date(Date.now()+600000),
        httpOnly:true,
        // secure:true
    });
    
        if(isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid pas details");
        }

    }catch(e) {
        res.status(400).send("Invalid login details");
    }
});

// const bcrypt = require("bcryptjs");
// const securePassword = async (password) => {
//     const passwordHash = await bcrypt.hash(password,10);
//     console.log(passwordHash);
//     const passwordMatch = await bcrypt.compare("thapa@123",passwordHash);
//     console.log(passwordMatch);
// }
// securePassword("thapa@123");

// const createToken = async() => {
//     const token = await jwt.sign({_id:"606956a3c07b27410865a22a"},"abcdwfqwertyuioplkjhgfdsazxcvbnmgfhgfdfdfgdghfjhghb",{
//         expiresIn:"2 minutes"
//     });
//     console.log(token);
//     const userVer = await jwt.verify(token,"abcdwfqwertyuioplkjhgfdsazxcvbnmgfhgfdfdfgdghfjhghb");
//     console.log(userVer);
// };
// createToken();

app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})