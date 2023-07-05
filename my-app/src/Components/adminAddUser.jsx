import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function adminAddUser(props) {
  const {
    modal1,
    setModal1,
    alpha,
    createUser,
    setCreateUser,
    setUser,
    setSite,
    setRobot,
    setUser1,
    setSite1,
  } = props;

  const Change = async (e) => {
    e.preventDefault();
    const resp = await fetch("http://13.233.231.169/api/addNewUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({
        name: createUser.name,
        username: createUser.username,
        password: createUser.password,
        Admin: createUser.admin,
        Phone: createUser.phone,
        Designation: createUser.designation,
        Sites: [],
      }),
    });
    let resp1 = await resp.json();
    if (resp1.success) {
      toast.success("User created successfully", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setCreateUser({
        name: "",
        username: "",
        phone: "",
        admin: "",
        designation: "",
        password: "",
      });
      setUser(false);
      setSite(false);
      setRobot(false);
      setUser1(false);
      setSite1(false);
    } else if (resp1.error) {
      toast.error(resp1.error, {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      toast.error("User not created", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };
  return (
    <Modal
      {...{
        show: modal1,
        onHide: () => setModal1(false),
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="userModal" style={{ width: "100%", padding: "0 2vw" }}>
          <div>Name</div>
          <input
            type="text"
            onChange={alpha}
            value={createUser.name}
            name="name"
            placeholder="fill more than 3 characters"
            style={{ width: "100%" }}
            required
          />
          <div>Username</div>
          <input
            type="email"
            onChange={alpha}
            value={createUser.username}
            name="username"
            placeholder="email is required"
            style={{ width: "100%" }}
            required
          />
          <div>Password</div>
          <input
            type="text"
            onChange={alpha}
            value={createUser.password}
            name="password"
            placeholder="fill more than 8 characters"
            style={{ width: "100%" }}
            required
          />
          <div>Admin</div>
          <input
            type="text"
            onChange={alpha}
            value={createUser.admin}
            name="admin"
            placeholder="fill 0 or 1"
            style={{ width: "100%" }}
            required
          />
          <div>Designation</div>
          <input
            type="text"
            onChange={alpha}
            value={createUser.designation}
            name="designation"
            placeholder="fill more than one characters"
            style={{ width: "100%" }}
            required
          />
          <div>Phone</div>
          <input
            type="text"
            onChange={alpha}
            value={createUser.phone}
            name="phone"
            placeholder="fill 10 numbers"
            style={{ width: "100%" }}
            required
          />
          <button
            onClick={(event) => {
              Change(event);
              setModal1(false);
            }}
            style={{
              backgroundColor: "#12D576",
              marginTop: "1.5vw",
              border: "#12D576",
              borderRadius: "0.3vw",
              padding: "0.5vw 2vw",
              fontSize: "1.1vw",
              fontWeight: "450",
            }}
          >
            Add
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default adminAddUser;
