const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {checkAuth} = require('../middleware/checkAuth');
const db = require("../database");

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get("/getUserList", function(req, res){
    let query = `SELECT * FROM applicationusers`;
    db.query(query, (err, result)=> {
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:result});
        }
    })
});

router.get("/getUserData", function (req, res) {
    let mobileNo = req.body.MobileNo;
    let ParentID = req.body.ParentID;
    let query = `SELECT * FROM applicationusers WHERE MobileNo = ${mobileNo} and ParentID = ${ParentID}`;
    
    try {
        db.query(query, (err, result) => {
            if (err) res.json({ msg: err });
            else if (result[0] == null) {
                return res
                .status(400)
                .json({ message: "User not found, Please add new user" });
              } else {
                let getquery = `SELECT * FROM applicationusers WHERE ParentID = ${ParentID}`;
                db.query(getquery,(err, result) => {
                    if (err) res.json({ msg: err });
                    else return res.json({msg:result});
                }
            )};
            })
        }catch (error) {
         return res.status(500).json({message: "Something went wrong", status:false });
      }
  });

router.get("/config", function(req, res){
    let query = "SELECT * FROM applicationmenus";
    
    db.query(query, (err, result)=> {
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:result});
        }
    })
});

router.post("/signin", function (req, res) {
    let mobileNo = req.body.MobileNo;
    let password = req.body.UserPassword;
    let query = `SELECT * FROM applicationusers WHERE MobileNo = ${mobileNo}`;
    try {
        db.query(query, (err, result) => {
            if (err) res.json({ msg: err });
            else if (result[0] == null) {
                return res
                .status(400)
                .json({ message: "User not found, Please Contact Admin" });
              } else if (result[0] != null && password != null) {
                  bcrypt.compare(password, result[0].UserPassword, function (err, results) {
                      if (results) {
                          results.password = undefined;
                          const jsontoken = jwt.sign({ result: results }, "USERAPI", {
                              expiresIn: "1h",
                                               
                        }); 
                          res.json({ msg: "Signin Successfully",token: jsontoken, status:true, UserID:result[0].UserID  }); 
                                       
                      } else {
                          return res
                          .status(400)
                          .json({ message: "Invalid Creedential, Please Contact Admin",  status:false  });
                      }
                  });
              }
          });       
      } catch (error) {
         return res.status(500).json({message: "Something went wrong", status:false });
      }
  });


  router.delete("/deleteUser/:id",checkAuth, function(req, res){
    let query=(`delete from applicationusers 
    where UserID='${req.params.id}'`);
    
    db.query(query, (err, result)=> {
        if(err){
            res.json({msg:err});
        }else{
            res.json({msg:"Record Deleted Successfully"});
        }
    })
});

router.post("/saveUser", async function(req,res){

    const hashedPassword = await bcrypt.hash(req.body.UserPassword, 10);
    let query = "insert into applicationusers SET?";
    let postData = {
        FirstName:req.body.FirstName,
        MiddleName:req.body.MiddleName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        MobileNo:req.body.MobileNo,
        UserPassword:hashedPassword,        
        Baithak: req.body.Baithak,
        BaithakVar:req.body.BaithakVar,
        BaithakHajeriNo:req.body.BaithakHajeriNo,
        ParentID: req.body.ParentID,
        RoleID:req.body.RoleID,
        ZoneID:req.body.ZoneID,
        MenuRights:req.body.MenuRights
    }
    db.query(query,postData, (err, result)=> {
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Data Save Successfully"});
        }
    });
});

router.patch("/updateUser/:id", checkAuth, function(req, res){   
    let query=(`update umbarli.applicationusers set 
    FirstName='${req.body.FirstName}',
    MiddleName='${req.body.MiddleName}',
    LastName='${req.body.LastName}',
    Email='${req.body.Email}',
    MobileNo='${req.body.MobileNo}',    
    Baithak='${req.body.Baithak}',
    BaithakVar='${req.body.BaithakVar}',
    BaithakHajeriNo='${req.body.BaithakHajeriNo}',
    RoleID='${req.body.RoleID}',   
    ZoneID='${req.body.ZoneID}',
    MenuRights='${req.body.MenuRights}'
    where UserID='${req.params.id}'`);
 
    db.query(query, (err, result)=> {
        if(err){
            return res.json({msg:err});
        }else{
            return res.json({msg:"Record Updated Successfully"});
        }
    })
});
module.exports = router;