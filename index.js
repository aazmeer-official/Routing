// BASIC REQUIREMENTS
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const { faker } = require('@faker-js/faker');
const { v4:uuidv4 } = require('uuid');
const mysql = require('mysql2');

// EXPRESS REQUIREMENTS

app.use(express.urlencoded({extended:true}))  //For Parsing
app.set("view engine", "ejs") //For setting view engine
app.set("views",path.join(__dirname,"views")) //For conecting views folder
app.use(express.static(path.join(__dirname,"public"))) // For connecting Public Folder
app.use(methodOverride('_method'))

// DATABASE REQUIREMENTS

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'routing',
  password: '#' //Write your own password here
});
app.get("/",(req,res)=>{
    let q = "SELECT count(*) FROM user";
    try{connection.query(q,(err,result)=>{
        if (err) throw err;
        let count = result[0]['count(*)']
        res.render("home.ejs",{count})
    })}catch(err){
        console.log(err)
    }
});

app.get("/user",(req,res)=>{
    let q1 = "SELECT id,username,email FROM user;"
    try{
        connection.query(q1,(err,result)=>{
            if(err) throw err;
            // console.log({result})
            res.render("user.ejs",{result})
        })
    }catch(err){
        console.log(err)
    }
})

app.get("/user/:id",(req,res)=>{
    let {id} = req.params;
    console.log(id)
    res.render("edit.ejs",{id})
})

app.post("/user",(req,res)=>{
    let id = uuidv4();
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let q4 = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)"
    userData = [id,username,email,password];
    try{
        connection.query(q4,userData,(err,result)=>{
            if(err) throw err;
            console.log(result)
            res.redirect("/user")
        })
    }catch(err){
        console.log(err)
    }

})

app.patch("/user/:id",(req,res)=>{
    let{id} = req.params
    let username = req.body.username;
    let userArr = [username,id]
    let q2 = "UPDATE user SET username = ? WHERE id = ?"
        try{
        connection.query(q2,userArr,(err,result)=>{
            if(err) throw err;
            console.log(result)
            res.redirect("/user")
        })
    }catch(err){
        console.log(err)
    }

})

app.delete("/user/:id",(req,res)=>{
    let q5 = "DELETE FROM user WHERE id = ?";
    let {id} = req.params;
    let uId = [id]
    try{
        connection.query(q5,uId,(err,result)=>{
            if(err) throw err;
            console.log(result)
            res.redirect("/user")
        })
    }catch(err){
        console.log(err)
    }
})
app.listen(port,()=>{
    console.log("server is listening...")
})

