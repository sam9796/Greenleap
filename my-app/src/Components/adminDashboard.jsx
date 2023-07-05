import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../Style/admindash.css";
import Display from "./adminDisplay.jsx";
import SiteDisplay from "./adminSiteDisplay.jsx";
import RoboDisplay from "./adminRoboDisplay.jsx";
import AddUser from "./adminAddUser.jsx";
import AddSite from "./adminAddSite.jsx";
import AddRobot from "./adminAddRobot.jsx";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [user, setUser] = useState(false);
  const [site, setSite] = useState(false);
  const [user1, setUser1] = useState(false);
  const [site1, setSite1] = useState(false);
  const [robot, setRobot] = useState(false);
  const [userdata, setUserData] = useState({ val: [] });
  const [specUser, setSpecUser] = useState({
    _id: "",
    name: "",
    username: "",
    Admin: "",
    Designation: "",
    Phone: "",
    Sites: [],
  });
  const [specSite, setSpecSite] = useState({
    id: "",
    siteName: "",
    location: "",
    gps: "",
    capacity: "",
    number: "",
    robos: [],
  });
  const [specRobot, setSpecRobot] = useState({
    _id: "",
    id: "",
    workingHr: "",
    motor1: "",
    motor2: "",
    motor3: "",
    battery1: "",
    battery2: "",
    wheel: "",
    brushes: "",
  });
  const [createUser, setCreateUser] = useState({
    name: "",
    username: "",
    phone: "",
    designation: "",
    password: "",
    admin: "",
  });
  const [createRobo, setCreateRobo] = useState({
    roboId: "",
    workinghr: "",
    motor1: "",
    motor2: "",
    motor3: "",
    wheel: "",
    brushes: "",
    battery1: "",
    battery2: "",
  });
  const [createSite, setCreateSite] = useState({
    sitename: "",
    location: "",
    capacity: "",
    number: "",
    gps: "",
  });

  function visitSite(e) {
    e.preventDefault();
    navigate("/login");
  }
  function logout(e) {
    e.preventDefault();
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("admin-user");
    navigate("/admin");
  }

  useEffect(() => {
    if (!sessionStorage.getItem("auth-token")) navigate("/admin");
    const handleUser = async () => {
      console.log("Hello");
      const resp = await fetch("http://13.233.231.169/api/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("auth-token"),
        },
      });

      const resp1 = await resp.json();
      if (resp1.success) {
        setUserData({ val: resp1.data });
      } else {
        toast.error("Wrong Credentials", {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    };
    handleUser();
  }, [user]);

  function alpha1(e) {
    setSpecSite({ ...specSite, [e.target.name]: e.target.value });
  }
  function alpha2(e) {
    setSpecRobot({ ...specRobot, [e.target.name]: e.target.value });
  }
  function alpha3(e) {
    setSpecUser({ ...specUser, [e.target.name]: e.target.value });
  }

  function beta(e) {
    setCreateSite({ ...createSite, [e.target.name]: e.target.value });
  }

  function beta1(e) {
    setCreateRobo({ ...createRobo, [e.target.name]: e.target.value });
  }
  function alpha(e) {
    setCreateUser({ ...createUser, [e.target.name]: e.target.value });
  }

  const getSiteData = async (site1) => {
    console.log(site1)
    const resp = await fetch("http://13.233.231.169/api/getRobots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ site: site1 }),
    });
    const resp1 = await resp.json();
    if (resp1.success) {
      setSpecSite({
        id: resp1.id,
        siteName: resp1.siteName,
        location: resp1.location,
        capacity: resp1.capacity,
        gps: `${resp1.gpsx}/${resp1.gpsy}`,
        robos: resp1.robos,
        number: resp1.number,
      });
      setSite(true);
      setUser(false);
      setRobot(false);
      setSite1(true);
    } else {
      toast.error("No data available", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const getRoboData = async (robo1) => {
   
    const resp = await fetch("http://13.233.231.169/api/getRoboData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ robo: robo1 }),
    });
    const resp1 = await resp.json();
    if (resp1.success) {
      setSpecRobot({
        _id: resp1._id,
        id: robo1,
        workingHr: resp1.workingHr,
        motor1: resp1.motor1,
        motor2: resp1.motor2,
        motor3: resp1.motor3,
        brushes: resp1.brushes,
        battery1: resp1.battery1,
        battery2: resp1.battery2,
        wheel: resp1.wheel,
      });
      setRobot(true);
      setUser(false);
      setSite(false);
    } else {
      toast.error("No data available", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div style={{ minHeight: "95vh" }}>
      <div
        style={{
          backgroundColor: "#8cc63e",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0.2vw 2vw",
          flexWrap: "wrap",
          color: "white",
        }}
      >
        <div style={{ fontSize: "1.7vw" }}>Greenleap Admin</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "1.5vw",
            fontSize: "1vw",
            paddingTop: "0.5vw",
          }}
        >
          <div>Welcome {sessionStorage.getItem("admin-user")}</div>
          <div style={{ cursor: "pointer" }} onClick={visitSite}>
            Visit site
          </div>
          <div style={{ cursor: "pointer" }} onClick={logout}>
            Logout
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", padding: "2vw 3vw" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2vw",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ width: "28.33vw", maxHeight: "15vw", overflowY: "auto" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#8cc63e",
                marginTop: "2vw",
                padding: "0.5vw",
              }}
            >
              <div style={{ fontSize: "1.4vw", fontWeight: "500" }}>Users</div>
              <div style={{ display: "flex", gap: "1vw", paddingTop: "0.4vw" }}>
                <svg
                  onClick={() => {
                    setModal1(true);
                  }}
                  height="1.2vw"
                  width="1.2vw"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                </svg>
              </div>
            </div>
            {userdata.val.map((val) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    fontSize: "1.2vw",
                    fontWeight: "450",
                    cursor: "pointer",
                    padding: "0.5vw",
                    backgroundColor: "#e8e8e8",
                    borderBottom: "1px solid #adb5bd",
                  }}
                >
                  <div>{val.username}</div>
                  <div
                    style={{ display: "flex", gap: "1vw", paddingTop: "0.4vw" }}
                    onClick={() => {
                      setSpecUser({
                        _id: val._id,
                        name: val.name,
                        username: val.username,
                        Admin: val.Admin,
                        Phone: val.Phone,
                        Designation: val.Designation,
                        Sites: val.Sites,
                      });
                      setUser(true);
                      setSite(false);
                      setRobot(false);
                      setUser1(true);
                      setSite1(false);
                    }}
                  >
                    <svg
                      height="1vw"
                      width="1vw"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
          {user1 ? (
            <div
              style={{ width: "28.33vw", maxHeight: "15vw", overflowY: "auto" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#8cc63e",
                  marginTop: "2vw",
                  padding: "0.5vw",
                }}
              >
                <div style={{ fontSize: "1.4vw", fontWeight: "500" }}>
                  {specUser.username}
                </div>
                <div
                  style={{ display: "flex", gap: "1vw", paddingTop: "0.4vw" }}
                >
                  <svg
                    onClick={() => {
                      setModal2(true);
                    }}
                    height="1.2vw"
                    width="1.2vw"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                  </svg>
                </div>
              </div>
              {specUser.Sites.map((val) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      fontSize: "1.2vw",
                      fontWeight: "450",
                      cursor: "pointer",
                      padding: "0.5vw",
                      backgroundColor: "#e8e8e8",
                      borderBottom: "1px solid #adb5bd",
                    }}
                  >
                    <div>{val}</div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1vw",
                        paddingTop: "0.4vw",
                      }}
                      onClick={() => {
                        getSiteData(val);
                      }}
                    >
                      <svg
                        height="1vw"
                        width="1vw"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
          {site1 ? (
            <div
              style={{ width: "28.33vw", maxHeight: "15vw", overflowY: "auto" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#8cc63e",
                  marginTop: "2vw",
                  padding: "0.5vw",
                }}
              >
                <div style={{ fontSize: "1.4vw", fontWeight: "500" }}>
                  {specSite.siteName}
                </div>
                <div
                  style={{ display: "flex", gap: "1vw", paddingTop: "0.4vw" }}
                >
                  <svg
                    onClick={() => {
                      setModal3(true);
                    }}
                    height="1.2vw"
                    width="1.2vw"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                  </svg>
                </div>
              </div>
              {specSite.robos.map((val) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      fontSize: "1.2vw",
                      fontWeight: "450",
                      cursor: "pointer",
                      padding: "0.5vw",
                      backgroundColor: "#e8e8e8",
                      borderBottom: "1px solid #adb5bd",
                    }}
                  >
                    <div>{val}</div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1vw",
                        paddingTop: "0.4vw",
                      }}
                      onClick={() => {
                        getRoboData(val);
                      }}
                    >
                      <svg
                        height="1vw"
                        width="1vw"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div style={{ padding: "2vw 0 5vw 0" }}>
        {user ? (
          <Display
            getSiteData={getSiteData}
            specUser={specUser}
            alpha3={alpha3}
            setModal2={setModal2}
            setUser={setUser}
            setSite={setSite}
            setRobot={setRobot}
            setSpecUser={setSpecUser}
            setUser1={setUser1}
            setSite1={setSite1}
          />
        ) : site ? (
          <SiteDisplay
            alpha1={alpha1}
            specSite={specSite}
            setModal3={setModal3}
            getRoboData={getRoboData}
            setUser={setUser}
            setSite={setSite}
            setRobot={setRobot}
            setSpecSite={setSpecSite}
            setUser1={setUser1}
            setSite1={setSite1}
          />
        ) : robot ? (
          <RoboDisplay
            specRobot={specRobot}
            setUser={setUser}
            setSite={setSite}
            setRobot={setRobot}
            setSpecRobot={setSpecRobot}
            alpha2={alpha2}
            setUser1={setUser1}
            setSite1={setSite1}
          />
        ) : (
          <div></div>
        )}
      </div>
      <AddUser
        modal1={modal1}
        setModal1={setModal1}
        createUser={createUser}
        alpha={alpha}
        setCreateSite={setCreateUser}
        setUser={setUser}
        setSite={setSite}
        setRobot={setRobot}
        setUser1={setUser1}
        setSite1={setSite1}
      />
      <AddSite
        modal2={modal2}
        setModal2={setModal2}
        createSite={createSite}
        beta={beta}
        setCreateSite={setCreateSite}
        setUser={setUser}
        setSite={setSite}
        setRobot={setRobot}
        specUser={specUser}
        setUser1={setUser1}
        setSite1={setSite1}
      />
      <AddRobot
        modal3={modal3}
        setModal3={setModal3}
        beta1={beta1}
        createRobo={createRobo}
        setCreateRobo={setCreateRobo}
        setUser={setUser}
        setSite={setSite}
        setRobot={setRobot}
        specSite={specSite}
        setUser1={setUser1}
        setSite1={setSite1}
      />
    </div>
  );
}

export default AdminDashboard;
