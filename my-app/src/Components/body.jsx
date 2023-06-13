import React,{useEffect,useState} from 'react';
import '../Style/body.css';
import {Button,Table} from "react-bootstrap";
import Display from './display.jsx';
import {useLocation,useNavigate} from 'react-router-dom';
import Pusher from 'pusher-js';
import {toast} from 'react-toastify';
import MyChart from './mychart.jsx';
import {Data} from './data.js';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale)
function Body() {
  const navigate=useNavigate()
  const pusher = new Pusher('5564dcf7d4ec7a6e2484', {
    cluster: 'ap2',
    forceTLS: true,
    disableStats: true
});
const channel = pusher.subscribe("my-channel");
    //Stores the response to the command, sent by the robot/ server
    //set response if the server res prop changes
    const location=useLocation()
    const [robo,setRobo]=useState({val:[]})
    const [data,setData]=useState({siteName:"",location:"",capacity:"",number:"",gpsx:"",gpsy:""})
    const [chartData,setChartData] =useState({    labels: Data.map((data) => data.year), 
      datasets: [
        {
          label: "Users Gained ",
          data: Data.map((data) => data.userGain),
        }
      ]});
    const [visible,setVisible]=useState('hidden');
    // const [change,setChange]=useState("0")
    //function that handles what happens when the robot send it's current state
    const toUpdate=async ()=>{
      const resp=await fetch('http://localhost:8081/api/getRobots',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'auth-token':sessionStorage.getItem('token')
        },
        body:JSON.stringify({site:location.state?.site})
      })
      const resp1=await resp.json()
      if(resp1.success){
      setRobo({val:resp1.robos}) 
    setData({siteName:resp1.siteName,location:resp1.location,capacity:resp1.capacity,number:resp1.number,gpsx:resp1.gpsx,gpsy:resp1.gpsy})
  }
    else {
      toast.error("Site Data Doesn't Exist",{
        toClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      })
      navigate(-1);return;
    }
  }

   useEffect(()=>{toUpdate();
  function clearData(){
    let alp=document.getElementById('displayStats')
    let va=document.getElementsByClassName('bodyFirst')[0]
    if(alp){va.removeChild(alp)}
  }
  clearData();
  setVisible('hidden');
  },[location.state?.site])
    const giveDate= async (event)=>{
      let k1=event.target.parentNode.parentNode
      let k2=event.target.parentNode
      if(event.target.tagName==='path'){k1=k1.parentNode;
        k2=k2.parentNode;
      }
      k2=k2.firstChild.value
      k1=k1.children[1].textContent
      if(k2===""){toast.error('Please select a date',{
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });return;}
      let arr=k2.split('-')
      let resp1=await fetch('http://localhost:8081/api/load',{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
          'auth-token':sessionStorage.getItem('token')
        },
        
        body:JSON.stringify({field:"System",roboId:k1,month:arr[1],date:arr[2],year:arr[0].substr(2)})
      })
      let resp2=await resp1.text()
      if(resp2==='0'){
        toast.error("System Data file does not exit",{toClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,})
      }
      else {let blob = new Blob([resp2], { type: 'text/plain' });
      // Create a temporary <a> element to trigger the file download
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'System.txt';
      link.click();}
    
      resp1=await fetch('http://localhost:8081/api/load',{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
          'auth-token':sessionStorage.getItem('token')
        },
        
        body:JSON.stringify({field:"Clean",roboId:k1,month:arr[1],date:arr[2],year:arr[0].substr(2)})
      })
      resp2=await resp1.text()
      if(resp2==='0'){
        toast.error("Clean Data file does not exit",{toClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,})
        return;
      }
     else {let blob = new Blob([resp2], { type: 'text/plain' });
      // Create a temporary <a> element to trigger the file download
     let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Clean.txt';
      link.click();}
    }
    const showDisplay = async (event)=>{
    let k1=event.target.parentNode.children[1].textContent
    const resp1=await fetch('http://localhost:8081/api/getRoboData',{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
        'auth-token':sessionStorage.getItem('token')
      },
      body: JSON.stringify({robo:k1})
      }) 
   
     const resp2=await resp1.json()
     if(!resp2.success){toast.error("Robot Data Does Not Exist",{
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,});return;}
    let alp=document.getElementById('displayStats')
    let va=document.getElementsByClassName('bodyFirst')[0]
    if(alp){va.removeChild(alp)}
      let el=document.createElement('div')
      el.style.backgroundColor="white"
      el.style.padding="1% 1%"
      el.style.borderRadius="5px"
      el.style.display='flex'
      el.style.gap="20px"
      el.id="displayStats"
      el.innerHTML=`
      <div id="displayHealth">
      <h6>${k1} Health</h6>
      <table id="tab1">
        <tbody>
            <tr>
                <td class="distd">Total Working</td>
                <td class="distd">${resp2.workingHr}</td>
            </tr>
            <tr>
                <td class="distd">Motor1</td>
                <td class="distd">${resp2.motor1}</td>
            </tr>
            <tr>
                <td class="distd">Motor2</td>
                <td class="distd">${resp2.motor2}</td>
            </tr>
            <tr>
                <td class="distd">Motor3</td>
                <td class="distd">${resp2.motor3}</td>
            </tr>
            <tr>
                <td class="distd">Battery1</td>
                <td class="distd">${resp2.battery1}</td>
            </tr>
            <tr>
                <td class="distd">Battery2</td>
                <td class="distd">${resp2.battery2}</td>
            </tr>
            <tr>
                <td class="distd">Wheel</td>
                <td class="distd">${resp2.wheel}</td>
            </tr>
            <tr>
                <td class="distd">Brushes</td>
                <td class="distd">${resp2.brushes}</td>
            </tr>
        </tbody>
      </table>
      </div>
      `
      va.appendChild(el)
      let ga=document.getElementsByTagName('h6')
      for(let i=0;i<ga.length;++i){
        ga[i].style.color="#8cc63e"
      }
      let ba=document.getElementById('tab1')
      ba.style.border="2px solid #ccc"
      ba.style.backgroundColor="#f3f5fb"
      let ca=document.getElementsByClassName('distd')
      for(let i=0;i<ca.length;++i){
        ca[i].style.border="2px solid #ccc"
      }
      setVisible('visible');
    }

    useEffect(()=>{
        const masterCheckBox = document.getElementById('masterCheckBox');
const slaveCheckboxes = document.querySelectorAll('.slaveCheckBox');

masterCheckBox.addEventListener('change', function() {
  slaveCheckboxes.forEach(function(checkbox) {
    checkbox.checked = masterCheckBox.checked;
  });
});

    })

    const handleCommand=async (event,comm)=>{
      let beta=""
      if(comm)beta=comm;
      else {let alp=event.target.parentNode.previousElementSibling.firstChild;
          beta=alp.value;
          alp.value=""}
      let robos=document.getElementsByClassName('slaveCheckBox')
      let robots=[]
        for(let i in robos){
          if(robos[i].checked)robots.push(robos[i].parentNode.nextElementSibling.textContent)
        }
        if(robots.length===0){
          toast.info("Please select atleast 1 robot to send command",{
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,});
        return;}
      const resp=await fetch(`http://localhost:8081/api/roboCommand/${beta}`,{
            method:"POST",
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({robots})
      })
      const resp1=await resp.json()
      if(resp1.success){
        toast.success('Command Successfully Sent',{
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,})
      }
      if(!resp1.success){
        toast.error('Command Not Sent',{autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,})
      }
    }
    function RenderTable(props){
      const {val}=props
    const [response, setResponse] = useState(["NaN","NaN"]);
    const [Status,setStatus]=useState(["NaN","NaN","Not ALive","NaN","NaN"])
    const [color,setColor]=useState('#ff0000')
  
      const stateHandler = (data) => {
        let temp = [data[0],data[1], data[3], data[2],data[4]];
        setStatus(temp)
        setColor('#76ad1f')}

        useEffect(()=>{
          let timer;
          if (Status[2] !== 'Not Alive')
              timer = setTimeout(() => {
                setColor('#ff0000')
                setStatus(["NaN","NaN","Not ALive","NaN","NaN"])
                setResponse([val,'NaN'])
              }, 30000);
  
          return () => clearTimeout(timer);
        },[Status])

    const responseHandler = (data) => {
      let temp=[data[0],data[1]]
        setResponse(temp);
    };
      useEffect(() => {
        //Listening on the channel for "robot.id/state", where the robot sends it's current state
        
          channel.bind( `${val}/state`, stateHandler);
      
        //Listening on the channel for "robot.id/response", where the robot/server sends the response to the command
        channel.bind(`${val}/response`, responseHandler);
      
        //Cleanup function to stop listening when the component unmounts
        return (() => {
            channel.unbind(`${val}/state`);
            channel.unbind(`${val}/response`);
        }) 
      }, []);
return (<tr >
           <td><input  type="checkbox" className="slaveCheckBox"/>
            </td>
          <td onClick={showDisplay}>{val}</td>
          <td onClick={showDisplay}>{Status[1]}</td>
          <td onClick={showDisplay}><svg xmlns="http://www.w3.org/2000/svg" style={{fill:`${color}`}} height="9" width="9" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>{Status[2]}</td>
          <td onClick={showDisplay}>{response[1]}</td>
          <td onClick={showDisplay}>{Status[3]}%</td>
          <td onClick={showDisplay}>{Status[4]}</td>
          <td><input type="date" id="datepicker"  name="datepicker"/><svg onClick={giveDate} xmlns="http://www.w3.org/2000/svg"  style={{marginLeft:"4px",width:"20px",height:"20px",fill:"#64708d"}} viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg></td>
        </tr>)
    }
  return (
    <div className="body" >
        <div className="bodyFirst" style={{display:"flex",overflowX:"auto"}}>
        <Display element={data}/> 
        {/* <MyChart chartData={chartData} visibility={visible}/> */}
        </div>
        <div style={{marginTop:"20px",backgroundColor:"white",padding:"1% 1%",borderRadius:"5px"}}>
        <div style={{padding:"0",margin:"0",height:"400px",overflowY:"auto"}}>
      <Table style={{marginTop:"15px"}}className="align-items-center table-flush" responsive>
            <thead style={{backgroundColor:"#f6f9fc",color:"#a7b3c1"}}className="thead-light">
            <tr >
                <th scope="col"><input type="checkbox" id="masterCheckBox"/></th>
                <th scope="col">ROBOT ID</th>
                <th scope="col">SIGNAL</th>
                <th scope="col">STATUS</th>
                <th scope="col">RESPONSE</th>
                <th scope="col">BATTERY</th>
                <th scope="col">GPS</th>
                <th scope="col">DOWNLOAD</th>
            </tr>
            </thead>
            <tbody className="realtimeData" style={{color:"#64708d"}}>
        {robo.val.map((value)=>{return (
          <RenderTable val={value}/>
           )})}
      </tbody>
      </Table>
      </div>
      <div className="bodySecondRow">
        <div >
        <input style={{height:"100%",border:"5px solid whitesmoke",borderRadius:"5px"}} placeholder='Custom Command' type="text" />
        </div>
        <div>
        <Button variant="light" onClick={handleCommand} style={{fontWeight:"500",height:"100%",border:"5px solid whitesmoke"}}>GO</Button>
        </div>
         <div className='controlButton'  onClick={(event) => handleCommand(event, 'start')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg></div>
         <div className='controlButton' onClick={(event) => handleCommand(event, 'stop')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg></div>
         <div className='controlButton' onClick={(event) => handleCommand(event, 'clean')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z"/></svg></div>
         <div className='controlButton' onClick={(event) => handleCommand(event, 'rtrn')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg></div>
      </div>  
      </div>
    </div>
  )
}


export default Body
