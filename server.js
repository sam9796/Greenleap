const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const User = require("./models/User.model.js");
const Client = require("./models/Client.model.js");
const Robot = require("./models/Robot.model.js");
const { Graph, GraphModel } = require("./models/Graph.model.js");
const compression = require("compression");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3"); //To upload files to S3
const multer = require("multer");
const mqtt = require("mqtt");
const Pusher = require("pusher");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const fetchuser = require("./fetchUser.js");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(compression());

//used for serving the build of react as static files 
const buildPath = path.join(__dirname, "./my-app/build"); 

//credentials used for connecting to pusher 
const pusher = new Pusher({
  appId: "1606316",
  key: "5564dcf7d4ec7a6e2484",
  secret: "c5fd8e2c8c8334533252",
  cluster: "ap2",
  useTLS: true,
});

//credentials for connecting to aws s3 to get the robot log files

aws.config.update({
  secretAccessKey: "eqRVZfUWCMiiA85sZVWDJXXbbnk24GDhapJlP3Zf",
  accessKeyId: "AKIAR5BJHCWWGXOMBAOM",
  region: "us-east-1",
});
let params = {
  Bucket: "robot-logs",
};
const s3 = new aws.S3();

//connecting to mqtt broker

const mqttClient = mqtt.connect("mqtt://65.2.179.139:1883", {
  username: "gwortssh",
  password: "F3Ce-SNdObpe",
});

//connecting to mongodb atlas

mongoAtlasUri =
  "mongodb+srv://Apoorv:mongodb%40greenleap5@greenleap-cluster0.kxtkm.mongodb.net/dev?retryWrites=true&w=majority";

mongoose
  .connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//serving the static files which is our build here and specifying all the paths here where are there on the website

app.use(express.static(buildPath));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
app.get('/', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
app.get('/login', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
app.get('/admindashboard', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
app.get('/site', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });


//this is the function which at a particular time on a day triggers an event to get the log file 
//of whole day working of robots and calculate their time spent in cleaning and then save it on database

function triggerEventAtTime(targetTime, callback) {
  const target = new Date();
  const [hours, minutes, seconds] = targetTime.split(":");
  target.setHours(Number(hours), Number(minutes), Number(seconds), 0);

  const currentTime = new Date();
  if (currentTime >= target) {
    // The current time has already passed the target time, trigger the event immediately
    callback();
  } else {
    const delay = target - currentTime;
    setTimeout(callback, delay);
  }
}

triggerEventAtTime("11:18:00", async () => { //event is triggered at this particular time 
    const today = new Date();
    //date of one day before is calculated
    const previousDay = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    let month = (previousDay.getMonth() + 1).toString();
    let year = previousDay.getFullYear().toString().slice(-2);
    let date = previousDay.getDate().toString();
    month = "06";
    year = "23";
    date = "29";
    try {
      let robots = await Robot.find(); //list of all the robots is taken
      const field = "Clean";
      for (let i in robots) {
        const roboId = robots[i].roboId;
        processData(month, year, date, roboId, field);
      }
    } catch (error) {}
  })
  
setInterval(()=>triggerEventAtTime("11:18:00", async () => { //event is triggered at this particular time 
  const today = new Date();
  //date of one day before is calculated
  const previousDay = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  let month = (previousDay.getMonth() + 1).toString();
  let year = previousDay.getFullYear().toString().slice(-2);
  let date = previousDay.getDate().toString();
  month = "06";
  year = "23";
  date = "29";
  try {
    let robots = await Robot.find(); //list of all the robots is taken
    const field = "Clean";
    for (let i in robots) {
      const roboId = robots[i].roboId;
      processData(month, year, date, roboId, field);
    }
  } catch (error) {}
}),24*60*60*1000)

//based on a particular month,year,date and roboId and field a robot file is taken 
//from s3 and processed further 
const processData = async (month, year, date, roboId, field) => {
  try {
    let deta = "";
    s3.getObject(
      {
        Bucket: "robot-logs",
        Key: `${roboId}_${date}-${month}-${year}_${field}.txt`,
      },
      async (err, data) => {
        if (err) {
        //if no file found for this particular info then set an event which checks regularly after 24 hrs 
        //if file is uploaded or not and if uploaded event ends and if not found ends automatically after 
        //10 days 
          const timecheck = setInterval(
            () => processData(month, year, date, roboId, field),
            24 * 60 * 60 * 1000
          );
          setTimeout(() => {
            clearInterval(timecheck);
          }, 10 * 24 * 60 * 60 * 1000);
        } else {
          let codes = JSON.stringify(data.Body);
          let beta = "";
          for (let i = 0; i < codes.length; ++i) {
            let k = i.toString();
            beta += codes[k];
          }
          let temp = "";
          for (let i = 32; i < beta.length - 3; ++i) {
            if (beta[i] == ",") {
              deta = deta + String.fromCharCode(Number(temp));
              temp = "";
            } else temp += beta[i];
          }
          let alp = deta.split(" ");
          let flag = false;
          let time = "";
          let prev = "";
          let total = 0;
          let interval = 0;
          for (let i in alp) {
            let alp1 = alp[i].split("\t");
            if (alp1[1] === "Cleaning") {
              let alp2 = alp[i - 1].split("\r\r\n")[0];
              let alp3 = alp1[0];
              if (!flag) {
                time = alp3;
                prev = alp3;
                flag = true;
              } else {
                if (alp2 === "Stopped!") {
                  interval = calc(prev, time);
                  if (interval) total += interval;
                  prev = alp3;
                }
              }
              time = alp3;
            }
          }
          interval = calc(prev, time);
          if (interval) total += interval;
          const alp4 = (total / 60).toString();
          let p1 = await GraphModel.findOne({ roboId: roboId });

          if (p1) {
            let p2 = p1.graph_list;
            let p3 = false;
            for (let i in p2) {
              if (p2[i].month === month && p2[i].year === year) {
                let arr1 = p2[i].workingHrs;
                p3 = true;
                arr1[parseInt(date) - 1] = alp4;
                const alp2 = new Graph({
                  month: month,
                  year: year,
                  workingHrs: arr1,
                });
                let beta = p1.graph_list;
                beta[i] = alp2;
                await GraphModel.findOneAndUpdate(
                  { roboId: roboId },
                  { graph_list: beta }
                );
                break;
              }
            }
            if (!p3) {
              const length = getDaysInMonth(`20${year}`, month);
              let arr = Array(length).fill(0);
              arr[parseInt(date) - 1] = alp4;
              const p5 = new Graph({
                month: month,
                year: year,
                workingHrs: arr,
              });
              let arr1 = [];
              for (let i in p2) {
                arr1.push(p2[i]);
              }
              arr1.push(p5);
              await GraphModel.findOneAndUpdate(
                { roboId: roboId },
                { graph_list: arr1 }
              );
            }
          } else {
            const length = getDaysInMonth(`20${year}`, month);
            let arr = Array(length).fill(0);
            arr[parseInt(date) - 1] = alp4;
            const p5 = new Graph({ month: month, year: year, workingHrs: arr });
            let arr1 = [];
            arr1.push(p5);
            const temp2 = new GraphModel({ roboId: roboId, graph_list: arr1 });
            await GraphModel.create(temp2);
          }
        }
      }
    );
  } catch (error) {
    console.log("error");
  }
};
function getDaysInMonth(yearStr, monthStr) {
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;

  return new Date(year, month + 1, 0).getDate();
}

//getGraph for getting the data from database used for respresenting the graph
app.post("/api/getGraph", fetchuser, async (req, res) => {
  const { month, year, roboId } = req.body;
  try {
    let graph = await GraphModel.findOne({ roboId: roboId });
    if (graph) {
      let p2 = graph.graph_list;
      let p3 = false;
      for (let i in p2) {
        if (p2[i].month === month && p2[i].year === year) {
          p3 = true;
          return res.json({ success: true, arr: p2[i].workingHrs });
        }
        if (!p3) {
          return res.json({ success: false });
        }
      }
    } else {
      return res.json({ success: false, msg: "Data not found" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Register a site
app.post("/api/registerClient", fetchuser, async (req, res) => {
  const { id, siteName, location, capacity, number, GPS } = req.body;
  const [GPSx, GPSy] = GPS.split("/");
  try {
    const oldClient = await Client.findOne({ siteName: siteName });
    if (oldClient) {
      res.json({ success: false, error: "this site already exists" });
    }
    const newClient = await Client.create({
      siteName: siteName,
      location: location,
      number: number,
      capacity: capacity,
      GPSx: GPSx,
      GPSy: GPSy,
      robots: [],
    });
    const user = await User.findById(id);
    let users = await User.find();
    for (let use of users) {
      if (use.Admin) {
        let arr1 = use.Sites;
        arr1.push(siteName);
        await User.findByIdAndUpdate(use._id, { Sites: arr1 });
      }
    }
    let arr = user.Sites;
    arr.push(siteName);
    await User.findByIdAndUpdate(id, { Sites: arr });
    res.json({ success: true });
  } catch (error) {
    res.status(422).send("Unable to register the Site");
  }
});

//Update site's information
app.post("/api/updateClient/:id", fetchuser, async (req, res) => {
  let { name, location, number, capacity, gps } = req.body;
  const id = req.params.id;
  try {
    const [GPSx, GPSy] = gps.split("/");
    const client = await Client.findById(id);
    if (client) {
      const site = client.siteName;
      await Client.findOneAndUpdate(
        { _id: id },
        {
          siteName: name,
          location: location,
          number: number,
          capacity: capacity,
          GPSx: GPSx,
          GPSy: GPSy,
        },
        { new: true }
      );
      if (name != site) {
        let users = await User.find();
        for (let user of users) {
          let arr = user.Sites;
          let arr2 = [];
          for (let sit of arr) {
            if (sit == site) {
              arr2.push(name);
              continue;
            } else arr2.push(sit);
          }
          await User.findByIdAndUpdate(user._id, { Sites: arr2 });
        }
      }
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "Site not found" });
    }
  } catch (error) {
    res.status(422).send("Update not successfull");
  }
});

//delete a particular site data 

app.delete("/api/deleteClient/:id", fetchuser, async (req, res) => {
  try {
    const site = await Client.findById(req.params.id);
    let users = await User.find();
    for (let user of users) {
      let arr = user.Sites;
      let arr2 = [];
      for (let i of arr) {
        if (i == site.siteName) {
          continue;
        } else {
          arr2.push(i);
        }
      }
      await User.findByIdAndUpdate(user._id, { Sites: arr2 });
    }
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: "true" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Authenticate a user while logging in

app.post("/api/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ username: email });
    if (user) {
      if (user.password != password) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please try to login with correct credentials",
          });
      } else {
        const data = {
          user: {
            id: user.id,
          },
        };
        let authtoken = jwt.sign(data, process.env.USER_KEY);
        return res.json({ success: true, authtoken });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

//Authenticate a user while logging into the admin panel

app.post("/api/auth/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ username: email });
    if (user) {
      if (user.password != password) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please try to login with correct credentials",
          });
      } else {
        if (user.Admin) {
          const data = {
            user: {
              id: user.id,
            },
          };
          let authtoken = jwt.sign(data, process.env.USER_KEY);
          return res.json({ success: true, authtoken });
        } else
          res.json({
            success: false,
            error: "Please try to login with correct credentials",
          });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false, error: "Internal Server Error" });
  }
});

// Get all users 

app.get("/api/getAllUsers", fetchuser, async (req, res) => {
  let data = await User.find();
  if (data) {
    res.json({ success: true, data: data });
  } else {
    res.json({ success: false, error: "Wrong Credentials" });
  }
});

//add a new user to the database

app.post("/api/addNewUser", fetchuser, [], async (req, res) => {
  let { name, username, password, Admin, Phone, Designation, Sites } = req.body;
  Admin = parseInt(Admin);
  const ser1 = await User.findOne({ username: username });
  if (ser1) {
    res.json({
      success: false,
      error: "User with this email id already exists",
    });
  }
  try {
    // console.log(secPass)
    const newUser = {
      name: name,
      username: username,
      password: password,
      Admin: Admin,
      Phone: Phone,
      Designation: Designation,
      Sites: Sites,
    };
    const user = await User.create(newUser);
    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//update a user's information

app.post("/api/updateUser/:id", fetchuser, async (req, res) => {
  let { name, username, phone, designation, admin } = req.body;
  try {
    if(typeof admin==='string'){admin = admin.toLowerCase();
    if (admin === "true") admin = 1;
    else admin = 0;}
    const user = await User.findById(req.params.id);
    if (user) {
      const alp = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: name,
          username: username,
          Phone: phone,
          Designation: designation,
          Admin: admin,
        },
        { new: true }
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "User does not exist" });
    }
  } catch (err) {
    res.status(406).send(err);
  }
});

//delete a particular user

app.delete("/api/deleteUser/:id", fetchuser, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Deletion not Successfull");
  }
});

//User for sending command to robots

app.post("/api/roboCommand/:command", (req, res) => {
  let { robots } = req.body;
  let count = 0;
  for (let robo in robots) {
    mqttClient.publish(`${robots[robo]}`, req.params.command, function () {
      console.log("sent successfully");
      count += 1;
    });
  }
  if (count == robots.length) res.json({ success: true });
  else res.send({ success: false });
});

//get sites of a particular user after logging in

app.post("/api/getData", async (req, res) => {
  const token = req.header("auth-token");
  const data = jwt.verify(token, process.env.USER_KEY);
  const id = data.user.id;
  const mem = await User.findById({ _id: id });
  if (mem) {
    return res.json({
      success: true,
      username: mem.username,
      sites: mem.Sites,
    });
  } else return res.json({ success: false });
});

//get robots of a particular site 

app.post("/api/getRobots", fetchuser, async (req, res) => {
  const { site } = req.body;
  let success = false;
  try {
    let sit = await Client.findOne({ siteName: site });
    if (sit) {
      let robos = sit.robots;
      success = true;
      const id = sit._id;
      const siteName = sit.siteName;
      const location = sit.location;
      const gpsx = sit.GPSx;
      const gpsy = sit.GPSy;
      const capacity = sit.capacity;
      const number = sit.number;
      return res.json({
        success: true,
        id,
        robos,
        siteName,
        location,
        gpsx,
        gpsy,
        capacity,
        number,
      });
    } else return res.json({ success: false, error: "Error finding the site" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//get a particular robot data 

app.post("/api/getRoboData", fetchuser, async (req, res) => {
  const { robo } = req.body;
  let robot = await Robot.findOne({ roboId: robo });
  if (robot) {
    const workingHr = robot.workingHr;
    const battery1 = robot.battery1;
    const battery2 = robot.battery2;
    const wheel = robot.wheel;
    const brushes = robot.brushes;
    const motor1 = robot.motor1;
    const motor2 = robot.motor2;
    const motor3 = robot.motor3;
    const _id = robot._id;
    res.json({
      success: true,
      _id,
      workingHr,
      battery1,
      battery2,
      wheel,
      brushes,
      motor1,
      motor2,
      motor3,
    });
  } else res.json({ success: false });
});

//create a robot 

app.post("/api/createRobot", fetchuser, async (req, res) => {
  const {
    id,
    roboId,
    workingHr,
    battery1,
    battery2,
    wheel,
    brushes,
    motor1,
    motor2,
    motor3,
  } = req.body;

  try {
    let alp = await Robot.findOne({ roboId: roboId });
    if (!alp) {
      const data = await Robot.create({
        roboId: roboId,
        workingHr: workingHr,
        battery1: battery1,
        battery2: battery2,
        wheel: wheel,
        brushes: brushes,
        motor1: motor1,
        motor2: motor2,
        motor3: motor3,
      });
      let site = await Client.findById(id);
      let arr = site.robots;
      arr.push(roboId);
      let newSite = await Client.findByIdAndUpdate(id, { robots: arr });
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "RobotId already exists" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//delete a robot 

app.delete("/api/deleteRobot/:id", fetchuser, async (req, res) => {
  try {
    let robot = await Robot.findById(req.params.id);
    let sites = await Client.find();
    for (let site of sites) {
      let arr = site.robots;
      let arr2 = [];
      for (let a of arr) {
        if (a == robot.roboId) continue;
        else arr2.push(a);
      }
      await Client.findByIdAndUpdate(site._id, { robots: arr2 });
    }

    await Robot.findByIdAndDelete(req.params.id);
    res.send({ success: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//update a robot's data 

app.post("/api/updateRobot/:id", fetchuser, async (req, res) => {
  let {
    roboId,
    workingHr,
    motor1,
    motor2,
    motor3,
    battery1,
    battery2,
    wheel,
    brushes,
  } = req.body;
  const id = req.params.id;
  try {
    const robot = await Robot.findById(id);
    if (robot) {
      const roboid = robot.roboId;
      await Robot.findOneAndUpdate(
        { _id: id },
        {
          roboId: roboId,
          workingHr: workingHr,
          battery1: battery1,
          battery2: battery2,
          wheel: wheel,
          brushes: brushes,
          motor1: motor1,
          motor2: motor2,
          motor3: motor3,
        },
        { new: true }
      );
      if (roboid != roboId) {
        let sites = await Client.find();
        for (let site of sites) {
          let arr = site.robots;
          let arr2 = [];
          for (let rob of arr) {
            if (rob == roboid) {
              arr2.push(roboId);
              continue;
            } else arr2.push(rob);
          }
          await Client.findByIdAndUpdate(site._id, { robots: arr2 });
        }
      }
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "Site not found" });
    }
  } catch (error) {
    res.status(422).send("Update not successfull");
  }
});
function calc(prev, time) {
  const date1 = new Date(`1970-01-01T${prev}`);
  const date2 = new Date(`1970-01-01T${time}`);

  const intervalInMilliseconds = date2 - date1;

  // Convert milliseconds to minutes and seconds
  return Math.floor(intervalInMilliseconds / 1000);
}

//Downloading the log files
app.post("/api/load", fetchuser, async (req, res) => {
  let { field, roboId, month, date, year } = req.body;
  try {
    let deta = "";
    res.setHeader("Content-Type", "text/plain");
    s3.getObject(
      {
        Bucket: "robot-logs",
        Key: `${roboId}_${date}-${month}-${year}_${field}.txt`,
      },
      (err, data) => {
        if (err) {
          res.send("0");
        } else {
          let codes = JSON.stringify(data.Body);
          let beta = "";
          for (let i = 0; i < codes.length; ++i) {
            let k = i.toString();
            beta += codes[k];
          }
          let temp = "";
          for (let i = 32; i < beta.length - 3; ++i) {
            if (beta[i] == ",") {
              deta = deta + String.fromCharCode(Number(temp));
              temp = "";
            } else temp += beta[i];
          }
          res.send(deta);
        }
      }
    );
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }

  // Send the file content as the response
});

//upload the log files
const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'robot-logs',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, `${file.originalname}`); //use Date.now() for unique file keys
        }
    })
});

app.post('/api/uploadLogs',upload.single('test'),(req, res) => {
    res.send('ok')
});  

//after connecting to mqtt broker if any message received then 
mqttClient.on('connect',() => {
    console.log('connected to mqtt broker')
    mqttClient.subscribe(`robot/state`);
    mqttClient.subscribe(`robot/response`);
    mqttClient.on('message',(topic, message) => {
        switch (topic) {
            case `robot/state`:                                                           
                let m = message.toString();                                               
                let m2 = m.split(';');
                if(m)mqttClient.publish(`${m2[0]}/state`,m)
                console.log('pushing')
                break;
            case `robot/response`:                                                        
                let m3 = message.toString();                                              
                let m4 = m3.split(';');
                if(m3)mqttClient.publish(`${m4[0]}/response`,m3)
                console.log('pushing')
                break;
            default:
                console.log("Unknown topic");
        }
    });
  });



app.listen(8081, () => {
  console.log("Server running on port: 8081");
});
