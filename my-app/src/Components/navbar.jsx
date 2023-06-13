import React,{useState,useEffect} from 'react'
import '../Style/navbar.css'
import Logo from '../Assets/logo.png'
import Navright from './navright.jsx'
import Navright1 from './navright1.jsx'
function Navbar() {
  const [resp1,setResp1]=useState({success:false,sites:[],username:""})
  useEffect(()=>{
    const  handle=async ()=>{const resp=await fetch('http://localhost:8081/api/getData',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'auth-token':sessionStorage.getItem('token')
      },
    })
    const alp=await resp.json()
setResp1({success:alp.success,sites:alp.sites,username:alp.username})}
handle();
  },[])
  function HandleResize(){
    if(window.innerWidth>700)return <Navright resp1={resp1}/>
    else return <Navright1 resp1={resp1}/>
}
  return (
    <div style={{backgroundColor:"#8cc63e"}}>
    <div className="navbar">
      <div style={{paddingLeft:"10%"}}> <img style={{width:"119px",padding:"14px",backgroundColor:"white",borderRadius:"30px"}} src={Logo} alt="not found" />
          </div>
      <HandleResize/>
    </div>
    </div>
  )
}

export default Navbar
