import React from 'react'
import {Button} from 'react-bootstrap'
import {toast} from 'react-toastify'

function Display(props){
    const {specUser,alpha3,setModal2,getSiteData,setSpecUser,setUser,setSite,setRobot,setSite1,setUser1}=props

    const Delete=async (e)=>{
        const resp=await fetch(`http://localhost:8081/api/deleteUser/${specUser._id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'auth-token':sessionStorage.getItem('auth-token')
            },
        })
        const resp1=await resp.json()
        if(resp1){
            toast.success('User deleted successfully',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            })
            setSpecUser({_id:"",name:"",username:"",Admin:"",Designation:'',Phone:'',Sites:[]})
            setUser(false);setSite(false);setRobot(false);setSite1(false);setUser1(false)
    
        }
        else {
            toast.error('User not deleted',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            })
        }
    }

    const Update=async ()=>{
        const resp=await fetch(`http://localhost:8081/api/updateUser/${specUser._id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':sessionStorage.getItem('auth-token')
            },
            body:JSON.stringify({name:specUser.name,username:specUser.username,admin:specUser.Admin,designation:specUser.Designation,phone:specUser.Phone})
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
        else {
            toast.error('Not Updated',{
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            }) 
        }
    }

    return (
        <div className="UserSpecific" style={{padding:"0 3vw",width:"100%"}}>
            <input type="text" onChange={alpha3} name="_id" value={specUser._id} hidden={true} />
            <div style={{display:"flex",gap:"5vw"}}>
            <div style={{width:"27.33vw"}}>
            <div>Name</div>
            <div style={{paddingTop:"0"}}><input type="text" onChange={alpha3} name="name" value={specUser.name} /></div>
            </div>
            <div style={{width:"27.33vw"}}>
            <div>Username</div>
            <div style={{paddingTop:"0"}}><input type="text" onChange={alpha3} name="username" value={specUser.username} /></div>
            </div>
            <div>
            <div style={{width:"27.33vw"}}>Admin</div>
            <div style={{paddingTop:"0"}}><input type="text" onChange={alpha3} name="Admin" value={specUser.Admin}/></div></div>
            </div>
            <div style={{display:"flex",gap:"5vw",paddingTop:"0vw"}}>
            <div>
            <div style={{width:"27.33vw"}}>Phone</div>
            <div style={{paddingTop:"0"}}><input type="text" onChange={alpha3} name="Phone" value={specUser.Phone}/></div></div>
            <div>
            <div style={{width:"27.33vw"}}>Designation</div>
            <div style={{paddingTop:"0"}}><input type="text"  onChange={alpha3} name="Designation" value={specUser.Designation}/></div></div>
            <div></div>
            </div>
        <div style={{display:"flex",gap:"0.2vw"}}>
          <Button  onClick={(event)=>{Update(event)}} style={{ marginTop: "1vw", backgroundColor: "#12D576", border: "#12D576", padding: "0.5vw 2vw", fontSize: "1vw", fontWeight: "450" }}>Save</Button>
          <Button  onClick={(event)=>{Delete(event)}} style={{cursor:'pointer',marginTop: "1vw",padding: "0.5vw 2vw", fontSize: "1vw", fontWeight: "450" }} variant="danger">Delete</Button>
          </div>

        </div>
    )
}

export default Display
