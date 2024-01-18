import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function adminAddSite(props) {
  const {
    modal2,
    setModal2,
    createSite,
    specUser,
    beta,
    setUser,
    setSite,
    setRobot,
    setCreateSite,
    setUser1,
    setSite1,
  } = props;
  const Change2 = async (e) => {
    e.preventDefault();
    const resp = await fetch("http://13.233.231.169/api/registerClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({
        id: specUser._id,
        siteName: createSite.sitename,
        location: createSite.location,
        capacity: createSite.capacity,
        number: createSite.number,
        GPS: createSite.gps,
      }),
    });
    const resp1 = await resp.json();
    if (resp1.success) {
      toast.success("Site created successfully", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });

      setCreateSite({
        id: "",
        siteName: "",
        location: "",
        gpsx: "",
        gpsy: "",
        capacity: "",
        number: "",
        robos: [],
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
      toast.error("Site not created", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };
  return (
    <Modal
      {...{
        show: modal2,
        onHide: () => setModal2(false),
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="userModal" style={{ width: "100%", padding: "0 2vw" }}>
          <div>Sitename</div>
          <input
            type="text"
            onChange={beta}
            value={createSite.name}
            name="sitename"
            placeholder="fill more than 3 characters"
            style={{ width: "100%" }}
            required
          />
          <div>Location</div>
          <input
            type="text"
            onChange={beta}
            value={createSite.username}
            name="location"
            placeholder="fill more than 3 characters"
            style={{ width: "100%" }}
            required
          />
          <div>Capacity</div>
          <input
            type="text"
            onChange={beta}
            value={createSite.password}
            name="capacity"
            placeholder="fill number with units"
            style={{ width: "100%" }}
            required
          />
          <div>Number</div>
          <input
            type="text"
            onChange={beta}
            value={createSite.admin}
            name="number"
            placeholder="fill number of robots to add"
            style={{ width: "100%" }}
            required
          />
          <div>GPS</div>
          <input
            type="text"
            onChange={beta}
            value={createSite.designation}
            name="gps"
            placeholder="fill in the given format latitude/longitude"
            style={{ width: "100%" }}
            required
          />
          <button
            onClick={(event) => {
              Change2(event);
              setModal2(false);
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

export default adminAddSite;
