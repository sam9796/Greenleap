const mongoose=require('mongoose')
const express =require('express')
const cors=require('cors')
const dotenv =require('dotenv')
const morgan = require('morgan')
const app=express()
const User = require('./models/User.model.js');
const Client = require('./models/Client.model.js');
const Robot =require('./models/Robot.model.js');
const compression=require('compression')
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');            //To upload files to S3
const multer = require('multer');
const mqtt=require('mqtt');
const Pusher = require("pusher");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetchuser=require('./fetchUser.js')
const jwt=require('jsonwebtoken')
const path=require('path')
require('dotenv').config();

app.use(cors())
app.use(express.json())
app.use(compression())


const buildPath=path.join(__dirname,"./my-app/build")
const pusher = new Pusher({
  appId: "1606316",
  key: "5564dcf7d4ec7a6e2484",
  secret: "c5fd8e2c8c8334533252",
  cluster: "ap2",
  useTLS: true,
});

aws.config.update({
    secretAccessKey: 'eqRVZfUWCMiiA85sZVWDJXXbbnk24GDhapJlP3Zf',
    accessKeyId: 'AKIAR5BJHCWWGXOMBAOM',
    region: 'us-east-1'
});
let params={
    Bucket:'robot-logs'
}
const s3 = new aws.S3();

const mqttClient = mqtt.connect('mqtt://65.2.179.139:1883', {
    username: 'gwortssh',
    password: 'F3Ce-SNdObpe',
});
mongoAtlasUri="mongodb+srv://Apoorv:mongodb%40greenleap5@greenleap-cluster0.kxtkm.mongodb.net/dev?retryWrites=true&w=majority";

     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
    ).then(()=>{console.log("Mongodb Connected")}).catch((err)=>{console.log(err)});

    // app.use(express.static(buildPath));
    // app.get('/admin', (req, res) => {
    //     res.sendFile(path.join(buildPath, 'index.html'));
    //   });
    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(buildPath, 'index.html'));
    //   });
    // app.get('/login', (req, res) => {
    //     res.sendFile(path.join(buildPath, 'index.html'));
    //   });
    // app.get('/admindashboard', (req, res) => {
    //     res.sendFile(path.join(buildPath, 'index.html'));
    //   });
    // app.get('/site', (req, res) => {
    //     res.sendFile(path.join(buildPath, 'index.html'));
    //   });
      


// Clients APIs
app.post('/api/registerClient',fetchuser,async (req,res)=>{
        const {id,siteName,location,capacity,number,GPS}=req.body;
        const [GPSx,GPSy]=GPS.split('/')
       try{ 
        const oldClient=await Client.findOne({siteName:siteName})
        if(oldClient){res.json({success:false,error:"this site already exists"})}
        const newClient=await Client.create({siteName:siteName,location:location,number:number,capacity:capacity,GPSx:GPSx,GPSy:GPSy,robots:[]})
        const user=await User.findById(id)
        let users=await User.find()
        for(let use of users){
            if(use.Admin){
                let arr1=use.Sites
                arr1.push(siteName)
                await User.findByIdAndUpdate(use._id,{Sites:arr1})
            }
        }
        let arr=user.Sites
        arr.push(siteName)
        await User.findByIdAndUpdate(id,{Sites:arr})
        res.json({success:true})
        }
         catch(error){
        res.status(422).send("Unable to register the Site")}
    
    })
    
app.post('/api/updateClient/:id',fetchuser,async(req,res)=>{
    let {name,location,number,capacity,gps}=req.body
    const id=req.params.id

    try{
           const [GPSx,GPSy]=gps.split('/') 
        const client=await Client.findById(id)
    if(client){
        const site=client.siteName
      await Client.findOneAndUpdate({_id:id},{siteName:name,location:location,number:number,capacity:capacity,GPSx:GPSx,GPSy:GPSy},{new:true})
     if(name!=site) {let users=await User.find()
      for(let user of users){
        let arr=user.Sites
        let arr2=[]
        for(let sit of arr){
            if(sit==site){arr2.push(name);continue;}
            else arr2.push(sit);
        }
        await User.findByIdAndUpdate(user._id,{Sites:arr})
      }}
        res.json({success:true})}
        else {
            res.json({success:false,error:"Site not found"})
        }
    }
        catch(error){
            res.status(422).send("Update not successfull")
        }
    }
)
app.delete('/api/deleteClient/:id',fetchuser,async(req,res)=>{
    try{
   const site=await Client.findById(req.params.id)
        let users=await User.find()
        for(let user of users){
            let arr=user.Sites;
            let arr2=[]
            for( let i of arr){
                if(i==site.siteName){
                    continue;
                }
                else {
                    arr2.push(i);
                }
            }
            await User.findByIdAndUpdate(user._id,{Sites:arr2});
        }
        await Client.findByIdAndDelete(req.params.id) 
   res.json({success:'true'})
    }
   catch(error){
    res.status(500).send("Internal Server Error")
   }

})
 
// Authentication APIs

app.post('/api/auth', async (req, res) => {
    const {email,password}=req.body
    
       try{const user=await User.findOne({username:email})
         if(user){
            if (user.password!=password) {
                return res.status(400).json({ success:false, error: "Please try to login with correct credentials" });
              }
              else {
                const data = {
                    user: {
                      id: user.id
                    }
                  }
                  let authtoken =jwt.sign(data, process.env.USER_KEY);
                return res.json({success:true,authtoken});
              }
        }
        else {
            return res.json({success:false})
        }
    }catch(error){
        return res.status(500).send("Internal Server Error")
    }
});

app.post('/api/auth/admin', async (req, res) => {
    const {email,password}=req.body
    
       try{const user=await User.findOne({username:email})
         if(user){
            if (user.password!=password) {
                return res.status(400).json({ success:false, error: "Please try to login with correct credentials" });
              }
              else {
                if(user.Admin){
                const data = {
                    user: {
                      id: user.id
                    }
                  }
                  let authtoken =jwt.sign(data, process.env.USER_KEY);
                return res.json({success:true,authtoken});}
                else res.json({success:false,error:"Please try to login with correct credentials"});
              }
        }
        else {
            return res.json({success:false})
        }
    }catch(error){
        return res.json({success:false,error:"Internal Server Error"})
    }
});

// User APIs

app.get('/api/getAllUsers',fetchuser,async (req,res)=>{
    let data=await User.find()
    if(data){
       res.json({success:true,data:data})
    } 
    else {
       res.json({success:false,error:"Wrong Credentials"})
    } 
})

app.post('/api/addNewUser',fetchuser,[],async (req, res) => {
    let {name,username,password,Admin,Phone,Designation,Sites} = req.body;
    Admin=parseInt(Admin)
    const ser1=await User.findOne({username:username})
    if(ser1){res.json({success:false,error:"User with this email id already exists"})}
    try{
    // console.log(secPass)
    const newUser = {
        name: name,
        username:username,
        password:password,
        Admin:Admin,
        Phone:Phone,
        Designation:Designation,
        Sites:Sites,
    };
    const user=await User.create(newUser)
    res.json({success:true})
}catch(error){
        res.status(500).send('Internal server error')
    }
});


app.post('/api/updateUser/:id',fetchuser,async (req, res) => {
    let {name,username,phone,designation,admin} = req.body;

    try{    admin=admin.toLowerCase();
        if(admin==='true')admin=1
        else admin=0
        const user=await User.findById(req.params.id)
        if(user){const alp=await User.findOneAndUpdate({_id:req.params.id},{name:name,username:username,Phone:phone,Designation:designation,Admin:admin},{new:true})
                res.json({success:true})}
                else {
                    res.json({success:false,error:'User does not exist'})
                }
                }catch(err){
                        res.status(406).send(err);
                    }
        
    
});

app.delete('/api/deleteUser/:id',fetchuser,async (req,res)=>{
   try{ 
    const user=await User.findByIdAndDelete(req.params.id)
res.json({success:true}) }catch(error){
    res.status(500).send("Deletion not Successfull")
   }
})

//Robot APIs 

app.post('/api/roboCommand/:command',(req, res) => {
    let {robots}=req.body
    let count=0;
    console.log(robots)
    for(let robo in robots){
        mqttClient.publish(`${robots[robo]}`,req.params.command,function() {
        console.log("sent successfully")
            count+=1;
          }); 
    } 
    if(count==robots.length)res.json({success:true});
    else res.send({success:false})
});


app.post('/api/getData',async (req,res)=>{
    const token=req.header('auth-token')
    const data = jwt.verify(token,process.env.USER_KEY);
    const id=data.user.id;
    const mem=await User.findById({_id:id})
    if(mem){
        return res.json({success:true,username:mem.username,sites:mem.Sites})
    }
    else return res.json({success:false})
})
app.post('/api/getRobots',fetchuser,async (req,res)=>{
    const {site}=req.body
    let success=false
    try{let sit=await Client.findOne({siteName:site})
    if(sit){
        let robos=sit.robots
        success=true;
        const id=sit._id
        const  siteName=sit.siteName
        const location=sit.location
        const gpsx=sit.GPSx
        const gpsy=sit.GPSy
        const capacity=sit.capacity
        const number=sit.number 
        return res.json({success:true,id,robos,siteName,location,gpsx,gpsy,capacity,number})}
    else return res.json({success:false,error:"Error finding the site"})
}catch(error){
        res.status(500).send("Internal Server Error")
    }
    
})

app.post('/api/getRoboData',fetchuser,async (req,res)=>{
    const {robo}=req.body
    let robot=await Robot.findOne({roboId:robo})
    if(robot){const workingHr=robot.workingHr
    const battery1=robot.battery1
    const battery2=robot.battery2
    const wheel=robot.wheel
    const brushes=robot.brushes
    const motor1=robot.motor1
    const motor2=robot.motor2
    const motor3=robot.motor3
    const _id=robot._id
    res.json({success:true,_id,workingHr,battery1,battery2,wheel,brushes,motor1,motor2,motor3})}
    else res.json({success:false})
})

app.post('/api/createRobot',fetchuser,async (req,res)=>{
    const {id,roboId,workingHr,battery1,battery2,wheel,brushes,motor1,motor2,motor3}=req.body
    
    try{let alp=await Robot.findOne({roboId:roboId})
    if(!alp){
      const data=await Robot.create({roboId:roboId,workingHr:workingHr,battery1:battery1,battery2:battery2,wheel:wheel,brushes:brushes,motor1:motor1,motor2:motor2,motor3:motor3
      })
      let site=await Client.findById(id)
      let arr=site.robots;
      arr.push(roboId)
      let newSite=await Client.findByIdAndUpdate(id,{robots:arr});
      res.json({success:true})
    }
    else {
            res.json({success:false,error:"RobotId already exists"})
    }}catch(error){
        res.status(500).send('Internal Server Error')
    }
})

app.delete('/api/deleteRobot/:id',fetchuser,async(req,res)=>{
try{
    console.log(req.params.id)
 let robot=await Robot.findById(req.params.id)
 let sites=await Client.find()
 for( let site of sites){
    let arr=site.robots
    let arr2=[]
    for(let a of arr){
        if(a==robot.roboId)continue;
        else arr2.push(a)
    }
    await Client.findByIdAndUpdate(site._id,{robots:arr2});
 }

 await Robot.findByIdAndDelete(req.params.id)
 res.send({success:true})
}catch(error){
    res.status(500).send('Internal Server Error')
}
})

app.post('/api/updateRobot/:id',fetchuser,async(req,res)=>{
    let {roboId,workingHr,motor1,motor2,motor3,battery1,battery2,wheel,brushes}=req.body
    const id=req.params.id
    try{
        const robot=await Robot.findById(id)
    if(robot){
        const roboid=robot.roboId
      await Robot.findOneAndUpdate({_id:id},{roboId:roboId,workingHr:workingHr,battery1:battery1,battery2:battery2,wheel:wheel,brushes:brushes,motor1:motor1,motor2:motor2,motor3:motor3},{new:true})
     if(roboid!=roboId) {let sites=await Client.find()
      for(let site of sites){
        let arr=site.robots
        let arr2=[]
        for(let rob of arr){
            if(rob==roboid){arr2.push(roboId);continue;}
            else arr2.push(rob);
        }
        await Client.findByIdAndUpdate(site._id,{robots:arr})
      }}
        res.json({success:true})}
        else {
            res.json({success:false,error:"Site not found"})
        }
    }
        catch(error){
            res.status(422).send("Update not successfull")
        }
    }
)

//Log Files APIs
app.post('/api/load',fetchuser,async (req,res)=>{
    let {field,roboId,month,date,year}=req.body
   try {let deta=""
    res.setHeader('Content-Type', 'text/plain');
    s3.getObject({Bucket:"robot-logs",Key:`${roboId}_${date}-${month}-${year}_${field}.txt`},(err,data)=>{
        if(err){
            res.send("0")
        }
       else { let codes=JSON.stringify(data.Body);
        let beta=""
        for(let i=0;i<codes.length;++i){
            let k=i.toString()
             beta+=codes[k]
        }
        let temp=""
        for(let i=32;i<beta.length-3;++i){
           if(beta[i]==','){deta=deta+String.fromCharCode(Number(temp));temp=""}
           else temp+=beta[i]
        }
        res.send(deta);}
    })
}
catch(error) {
    res.status(500).send("Internal Server Error")
}

// Send the file content as the response


})



mqttClient.on('connect', () => {
    console.log('connected to mqtt broker');
    mqttClient.subscribe('robot/state');
    mqttClient.subscribe('robot/response');

    mqttClient.on('message', (topic, message) => {
        switch (topic) {
            case "robot/state":                                                           
                let m = message.toString();                                               
                let m2 = m.split(';');
                pusher.trigger("my-channel", m2[0] + '/state', m2);
                console.log('pushing')
                break;
            case "robot/response":                                                        
                let m3 = message.toString();                                              
                let m4 = m3.split(';');
                pusher.trigger("my-channel", m4[0] + '/response', m4);
                console.log('pushing')
                break;
            default:
                console.log("Unknown topic");

        }
    });
});


app.listen(8081,()=>{
    console.log("Server running on port: 8081")
})