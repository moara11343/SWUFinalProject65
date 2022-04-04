var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");

var path = require("path");
const PORT = process.env.PORT || 3000
const donenv = require('dotenv')

app.use(express.static('public'));

const dbConnectionn = require("./database");
const db = require("./database");
const { render } = require("express/lib/response");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 
app.set("views",path.join(__dirname, '/public/views'))
app.set( "view engine", "ejs" );
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

 session.isLoggedIn = false;

//

app.get("/", (request, response,) => {
  response.render("cosci_login");
 });

app.get("/home", (request, response,) => {
  response.render("swu");
 });

 app.get("/login", (request, response) => {
  console.log(session.isLoggedIn,"in /login");
  if (!session.isLoggedIn){
    response.render("cosci_login");
  }else{
    response.render("userprofile")
  }
 });

 app.get("/logout",function(req,res){
  req.session.destroy(function (err) {
    session.isLoggedIn = false;
    res.redirect("/login");
    res.end();
});
 });

 app.post('/getBranch', function (req, res) {
  console.log(req.body.demoFormSelected);
  if (req.body.demoFormSelected == "COSCI"){
    res.redirect("/login");
  }else if (req.body.demoFormSelected == "ENGINEER"){
    res.send("ENGINEER");
  }
});

app.get("/getEJS", function(req,res){
  res.render("userprofile")
});

app.post('/cosciAuth', function (req, res) {
dbConnectionn.query('SELECT * FROM User WHERE username = ? AND password = ?',[req.body.swuID, req.body.password], 
function (error, results, fields) {
  if (results.length > 0) { // check qurey has value
    // in case has value
    if (error) throw error;
    console.log('username is : ', results[0].Username);
    console.log('password is : ', results[0].Password);
    console.log('real name is : ', results[0].Firstname,"",results[0].Lastname);
    session.isLoggedIn = true;
    console.log("session.isLoggedIn = ",session.isLoggedIn  )
    res.render("login_success");
  } else {
    // in case no account
    console.log("HAS NO ACCOUNT")
    res.render("login_fail");
  }
});
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './img')
  },
  filename: (req, file, cb) => {
      cb(null, 'file-' + Date.now() + '.' +
      file.originalname.split('.')[file.originalname.split('.').length-1])}
})

const upload = multer({ storage:storage })


app.get("/user",(req,res)=>{
    res.render("userprofile")
})

app.post("/user",upload.single("image"),(req,res)=>{
  // if (err){
  //   throw console.error();
  //  } else{
   console.log(req.file)
  //  dbConnectionn.query("UPDATE `User` SET `img_user` ") 
   res.send("upload successful")
  // }
  // console.log(JSON.stringify(req.file))
  // res.send("ok")

});



  app.listen(PORT);
  console.log("running on port " + PORT);  