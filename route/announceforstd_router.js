const express = require('express');
const router = express.Router();
const dbConnectionn = require("../database");
var session = require("express-session");
const checklogin = require('../middleware/logintokencheck')
const multer = require("multer");
const { resolve } = require('path');
const vary = require('vary');
const { rejects } = require('assert');
const { request } = require('http');
const { response } = require('express');
const { json } = require('express/lib/response');


// router.get("/announce_activity"
// ,checklogin.checklogin
// ,(request,response) => {
// try {
//     if (session.status == "student") {
//         dbConnectionn.query('SELECT * FROM user INNER JOIN Major ON user.Major=Major.idMajor INNER JOIN submajor ON user.secMaj=submajor.idsubMajor INNER JOIN permission ON user.Permission=permission.idPermission WHERE ID_Student = ?',[session.studentID],function (error, results, fields) {
//            if (results.length > 0) { 
//               if (error) throw error;
//               // db connect read request 
//               session.img = results[0].img_user;
//             dbConnectionn.query('SELECT `ID_event`, `Name_Event`, `Detail_Event`, `start_Event`, `end_Event`, `Posted_Event`, `idType_Event`, `thamnail`, `Detail_Img`, `school_year` FROM `event` WHERE 1'),function (error, results, fields) {
//               session.eventx = results;
//               // console.log("datax = ",session.datax, "username = ",session.username )
//                 response.render("status_page", { 
//                   isloggedin : session.isLoggedIn ,
//                   firstname : session.firstname ,
//                   lastname : session.lastname ,
//                   studentID : session.studentID ,
//                   major : session.Major ,
//                   Year : session.Year ,
//                   status : session.status,
//                   imgpath : session.img,
//                   data : session.datax,
//                   event : session.eventx
//                 });
//             } 
//             // end read request
                
//             } else {
//                console.log("HAS NO data")
//             }
//           });
//       } else {
//         response.send("u r not student")
//       } 
//     } catch (error) {
//         // res.redirect('/logout')
//         console.log(`Something went wrong with : checkstatus ` ,error);
// }
// });

router.get("/announce_activity"
,checklogin.checklogin
, async (req,res) => {
    var namevnt = await new Promise ((resolve,rejects)=>{
    dbConnectionn.query(`SELECT ID_Event as id ,Name_event as name, Detail_event as detail, Posted_Event as posted, thamnail as img , main_detail as main, Detail_img as deimg FROM event`
    ,function(error,results,fields){
        if(error) throw error;
        resolve(results)
        });

    }) 
    // console.log()
    console.log(namevnt)
    // console.log(JSON.stringify(result))
    //
    res.render("announce_activity", { 
       namevnt: namevnt
    });
});

// router.get("/sub_activity)"
// ,checklogin.checklogin
// , async (req,res) => {
//     var namevnt = await new Promise ((resolve,rejects)=>{
//     dbConnectionn.query(`SELECT ID_Event as id ,Name_event as name, Detail_event as detail, Posted_Event as posted, thamnail as img , main_detail as main, Detail_img as deimg FROM event`
//     ,function(error,results,fields){
//         if(error) throw error;
//         resolve(results)
//         });

//     }) 
//     // console.log()
//     console.log(namevnt)
//     // console.log(JSON.stringify(result))
//     //
//     res.render("sub_activity", { 
//        namevnt: namevnt
//     });
// });

module.exports = router;