const express = require('express');
const router = express.Router();
const dbConnectionn = require("../database");
var session = require("express-session");
const checklogin = require('../middleware/logintokencheck');
const res = require('express/lib/response');
const { resolve } = require('path');
const { rejects } = require('assert');

router.post('/details_submit',checklogin.checklogin,(req, response) => {
try {
    if (session.status == "student") {
        dbConnectionn.query('SELECT * FROM user INNER JOIN Major ON user.Major=Major.idMajor INNER JOIN submajor ON user.secMaj=submajor.idsubMajor INNER JOIN permission ON user.Permission=permission.idPermission WHERE ID_Student = ? ',[session.studentID], 
          function (error, results, fields) {
           if (results.length > 0) { 
              if (error) throw error;
              // db connect read request 
              session.img = results[0].img_user;
            dbConnectionn.query('SELECT request.idRequest,user.ID_Student,user.Firstname,user.Lastname,Major.name_maj,user.user_phone,event.Name_Event,event.start_Event,event.end_Event,request.file_img ,request.file_pdf FROM request INNER JOIN event ON request.ID_event=event.ID_event INNER JOIN type_event ON event.idType_Event=type_event.idType_Event INNER JOIN user ON request.Username=user.Username INNER JOIN major ON user.Major=major.idMajor WHERE user.Username = ? AND request.idRequest = ?',[session.username,req.body.reqiD],function (error, results, fields) {  
              session.datax = results;
              console.log("datax = ",session.datax)
                response.render("details_submit", { 
                  isloggedin : session.isLoggedIn ,
                  firstname : session.firstname ,
                  lastname : session.lastname ,
                  studentID : session.studentID ,
                  major : session.Major ,
                  Year : session.Year ,
                  status : session.status,
                  imgpath : session.img,
                  data : session.datax,
                  gender : session.gender
                });
            }); 
            // end read request 
            } else {
               console.log("HAS NO data")
            }
          });
      } else {
        response.send("u r not student")
      } // if perm student // admin
} catch (error) {
    console.log(`Something went wrong with : sub_checkforstd ` ,error);
}
});

module.exports =router;