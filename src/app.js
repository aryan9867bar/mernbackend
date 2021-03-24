const express = require("express");
const path = require("path");
const hbs = require('hbs');
const app = express();
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public" );
const template_path = path.join(__dirname, "./templates/views" );
const partial_path = path.join(__dirname, "./templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req,res) => {
    res.render("index")
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

        const registered = await registerClient.save();
        res.status(201).render("login");

      }else {
          res.send("password arenot matching");
      }
  }catch(e) {
      res.status(400).send(e);
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
        if(useremail.Password === password) {
            res.status(201).render("index");
        } else {
            res.send("Invalid login details");
        }

    }catch(e) {
        res.status(400).send("Invalid login details");
    }
});


app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})