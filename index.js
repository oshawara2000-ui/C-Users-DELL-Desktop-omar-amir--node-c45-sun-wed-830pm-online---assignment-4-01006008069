const express = require("express")
const path = require("path")
const filepath = path.resolve("./file.json")
const fs = require("fs")
const readfile = fs.readFileSync(filepath, { "encoding": "utf-8" })
const database = JSON.parse(readfile)
const server = express()
const port = 3003
server.use(express.json())
server.post("/addnewuser", (req, res, next) => {
    const { email, age, name, } = req.body
    const checkOnEmail = database.find((value) => {
        return value.email == email

    })
    if (checkOnEmail) {
        return res.status(409).json({ msg: "email already exists" })
    }
    req.body.id = Date.now()
    database.push(req.body)
    fs.writeFileSync(filepath, JSON.stringify(database))
    return res.status(201).json({ msg: "user added successfully" })




})
server.patch("/updateuser/:id", (req, res, next) => {
    const { name, age, email } = req.body
    const { id } = req.params


    const CheckOnUserid = database.find((value) => {
        return value.id == id//rage3 bl user delw

    })
    if (CheckOnUserid == undefined) {
        return res.status(409).json({ msg: "id not found" })
    }
    CheckOnUserid.name = name
    CheckOnUserid.age = age
    CheckOnUserid.email = email



    return res.status(201).json({ msg: "data updated successfully", CheckOnUserid })
})
server.delete("/deleteuser/{:id}", (req, res, next) => {
const{id}=req.body
    const checkonid = database.findIndex((value) => {
        return  value.id == req.params.id || value.id == id
    })
    if (checkonid == -1) {
        return res.status(404).json({ msg: "id not found" })
    }
    database.splice(checkonid, 1)
    fs.writeFileSync(filepath,JSON.stringify(database))
    return res.status(200).json({ msg: "user deleted successfully" })
})
server.get("/user/getbyname",(req,res,next)=>{
const{name}=req.query
const checkonname=database.find((value)=>{
    return value.name==name
})
if(checkonname==undefined){
    return res.status(404).json({ msg: "name not found" })
}

return res.status(200).json({ checkonname})

})
server.get("/allusers",(req,res,next)=>{
   return res.status(200).json({database})
})
server.get("/user/filter",(req,res,next)=>{
const {minage}=req.query
const filterMinAge=database.filter((value)=>{
    return value.age<=minage
})
if(filterMinAge.length==0){//////very imp. note
    return res.status(404).json({ msg: " no user found" })
}
return res.status(200).json({filterMinAge})

})
server.get("/getuserbyid/:id",(req,res,next)=>{
const {id}=req.params
const checkid=database.find((value)=>{
    return value.id==id
})
if(checkid==undefined){
    return res.status(404).json({ msg: "id not found" })
}
return res.status(200).json({ checkid})
})






server.listen(port, () => {
    console.log("server is running");

})

