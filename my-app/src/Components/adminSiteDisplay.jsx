import React from 'react'
import {Button} from 'react-bootstrap'
import {toast} from 'react-toastify'

function SiteDisplay(props){
    const {alpha1,specSite,setModal3,getRoboData,setUser,setRobot,setSite,setSpecSite,setSite1,setUser1}=props
    const Delete1=async (e)=>{
        const resp=await fetch(`http://13.233.231.169:8081/api/deleteClient/${specSite.id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'auth-token':sessionStorage.getItem('auth-token')
            }
        })
        const resp1=await resp.json()
        if(resp1.success){
            toast.success('Site deleted successfully',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            })
            setSpecSite({id:"",siteName:"",location:"",gps:"",capacity:"",number:"",robos:[]})
            setUser(false);setSite(false);setRobot(false);setSite1(false);setUser1(false)
            
        }
        else {
            toast.error('Site not deleted',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            })
        }
    } 
    
    
    const Update1=async ()=>{
        const resp=await fetch(`http://13.233.231.169:8081/api/updateClient/${specSite.id}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'auth-token':sessionStorage.getItem('auth-token')
        },
        body:JSON.stringify({name:specSite.siteName,location:specSite.location,gps:specSite.gps,number:specSite.number,capacity:specSite.capacity})
        })
        const resp1=await resp.json()
        if(resp1.success){
            toast.success('Updated Successfully',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            })
            setUser(false);setRobot(false);setSite(false);setSite1(false);setUser1(false)
        }
        else if(resp1.error){
            toast.error(resp1.error,{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            }) 
        }
        else {
            toast.error('Not Updated',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            }) 
        }
    }
    
    return (
        <div className="SiteSpecific" style={{padding:"0 3vw",width:"100%"}}>
        <input type="text" onChange={alpha1} name="id" value={specSite.id} hidden={true} />
        <div style={{display:"flex",gap:"5vw"}}>
        <div style={{width:"27.33vw"}}>
        <div >Sitename</div>
        <div style={{paddingTop:"0"}}><input type="text"  onChange={alpha1} name="siteName" value={specSite.siteName} /></div></div>
        <div style={{width:"27.33vw"}}>
        <div>Location</div>
        <div style={{paddingTop:"0"}}><input type="text"  onChange={alpha1} name="location" value={specSite.location} /></div></div>
        <div style={{width:"27.33vw"}}>
        <div>Capacity</div>
        <div style={{paddingTop:"0"}}><input type="text" onChange={alpha1} name="capacity" value={specSite.capacity}/></div></div>
        </div>
        <div style={{display:"flex",gap:"5vw",paddingTop:"0vw"}}>
        <div style={{width:"27.33vw"}}>
        <div>GPS</div>
        <div style={{paddingTop:"0"}}><input type="text" onChange={alpha1} name="gps" value={specSite.gps} /></div></div>
        <div style={{width:"27.33vw"}}>
        <div>Number</div>
        <div style={{paddingTop:"0"}}><input type="text"  onChange={alpha1} name="number" value={specSite.number}/></div>
        </div>
        <div></div>
        </div>
        <div style={{display:"flex",gap:"0.2vw"}}>
          <Button onClick={(event)=>{Update1(event)}} style={{ marginTop: "1vw", backgroundColor: "#12D576", border: "#12D576", padding: "0.5vw 2vw", fontSize: "1vw", fontWeight: "450" }}>Save</Button>
          <Button  onClick={(event)=>{Delete1(event)}} style={{cursor:'pointer',marginTop: "1vw", padding: "0.5vw 2vw", fontSize: "1vw", fontWeight: "450" }} variant='danger'>Delete</Button>
          </div>

    </div>
    )}

export default SiteDisplay
