var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const PORT = process.env.PORT || 3000
app.use(express.static('public'));
const dbConnectionn = require("./database");
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
app.get("/home", (request, response,) => {
  response.render("swu");
 });

 app.get("/info_activity01", (request, response,) => {
  response.render("info_activity01");
 }); 
 app.get("/info_activity02", (request, response,) => {
  response.render("info_activity02");
 }); 
 app.get("/info_activity03", (request, response,) => {
  response.render("info_activity03");
 });
 app.get("/announce_activity", (request, response,) => {
  response.render("announce_activity");
 });
 app.get("/details_activity", (request, response,) => {
  response.render("details_activity");
 });
 app.get("/sub_activity", (request, response,) => {
  response.render("sub_activity");
 });
 app.get("/add_activity", (request, response,) => {
  response.render("add_activity");
 });
 

 app.get("/profile", (request, response,) => {
  if (!session.isLoggedIn){
    response.render("cosci_login");
  }else{
    if (session.status == "admin"){
      console.log("go to admin profile");
      response.render("main_admin", { 
        isloggedin : session.isLoggedIn ,
        firstname : session.firstname ,
        lastname : session.lastname ,
        studentID : session.studentID ,
        major : session.Major ,
        Year : session.Year ,
        status : session.status,
        imgpath : session.img
      });
    } else {
      console.log("go to student profile");
      response.render("userprofile", { 
        isloggedin : session.isLoggedIn ,
        firstname : session.firstname ,
        lastname : session.lastname ,
        studentID : session.studentID ,
        major : session.Major ,
        Year : session.Year ,
        status : session.status,
        imgpath : session.img 
      });
    }
  }
 });

 app.get("/login", (request, response) => {
  console.log(session.isLoggedIn,"in /login");
  if (!session.isLoggedIn){
    response.render("cosci_login");
  }else{
    if (session.status == "admin"){
      console.log("go to admin profile");
      response.render("main_admin", { 
        isloggedin : session.isLoggedIn ,
        firstname : session.firstname ,
        lastname : session.lastname ,
        studentID : session.studentID ,
        major : session.Major ,
        Year : session.Year ,
        status : session.status 
      });
    } else {
      console.log("go to student profile");
      response.render("userprofile", { 
        isloggedin : session.isLoggedIn ,
        firstname : session.firstname ,
        lastname : session.lastname ,
        studentID : session.studentID ,
        major : session.Major ,
        Year : session.Year ,
        status : session.status 
      });
    }
    
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

app.get("/main", function(req,res){
  // res.render("main_student");
  res.render("main_student", { 
    isloggedin : session.isLoggedIn ,
    firstname : session.firstname ,
    lastname : session.lastname ,
    studentID : session.studentID ,
    major : session.Major ,
    Year : session.Year ,
    status : session.status 
  });
});


dbConnectionn.query('SELECT * FROM user INNER JOIN Major ON user.Major=Major.idMajor INNER JOIN submajor ON user.secMaj=submajor.idsubMajor INNER JOIN permission ON user.Permission=permission.idPermission WHERE Username = ? AND Password = ?',["co611010035", "co611010035"], 
function (error, results, fields) {
  if (results.length > 0) { // check qurey has value
    if (error) throw error;
    
    console.log(results)
    
  } else {
    console.log("HAS NO ACCOUNT")
  }
});


app.post('/cosciAuth', function (req, res) {
dbConnectionn.query('SELECT * FROM user INNER JOIN Major ON user.Major=Major.idMajor INNER JOIN submajor ON user.secMaj=submajor.idsubMajor INNER JOIN permission ON user.Permission=permission.idPermission WHERE Username = ? AND Password = ?',[req.body.swuID, req.body.password], 
function (error, results, fields) {
  if (results.length > 0) { // check qurey has value
    // in case has value
    if (error) throw error;
    
    session.isLoggedIn = true;
    session.firstname = results[0].Firstname;
    session.lastname = results[0].Lastname;
    session.studentID = results[0].ID_Student;
    session.Major = results[0].name_maj;
    session.subMajor = results[0].name_submaj;
    session.Year = results[0].Year;
    session.status = results[0].Detail_per;
    session.img = results[0].img_user;
    
    res.render("login_success");
    
  } else {
    // in case no account
    console.log("HAS NO ACCOUNT")
    res.render("login_fail");
  }
});
});

//declare func gen uid//
function getuidf() {
  var date = new Date();
  var components = [
     date.getDate(),
     date.getMonth()+1,
      date.getFullYear(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
  ];
  var id = components.join("");
  return id.toString(16);
}

//upload pic

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/img')
  },
  filename: (req, file, cb) => {
      cb(null, 'file-' + Date.now() + '.' +
      file.originalname.split('.')[file.originalname.split('.').length-1])}
})

const upload = multer({ storage:storage })


app.get("/profile",(req,res)=>{
    res.render("userprofile")
})

app.post("/profile", upload.single('image'), (req, res) => {
  if (!req.file) {
      console.log("No file upload");
  } else {
      console.log(req.file.filename)
      var imgsrc = '../img/' + req.file.filename
      var insertData = ("UPDATE `User` SET `img_user`= (?) WHERE ID_Student = (?)");
      console.log(session.studentID);
      dbConnectionn.query(insertData, [imgsrc,session.studentID], (err, result) => {
          if (err) throw err
          // console.log("file uploaded")
          console.log(req.file)
          console.log("upload successful")
          // console.log(session.imgpath)
      })
  }
});

// end gen func

  app.listen(PORT);
  console.log("running on port " + PORT);  