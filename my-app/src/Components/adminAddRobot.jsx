import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function adminAddRobot(props) {
  const {
    modal3,
    setModal3,
    beta1,
    createRobo,
    setCreateRobo,
    setRobot,
    setSite,
    setUser,
    specSite,
    setUser1,
    setSite1,
  } = props;
  const Change1 = async (e) => {
    e.preventDefault();
    const resp = await fetch("http://13.233.231.169/api/createRobot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({
        id: specSite.id,
        roboId: createRobo.roboId,
        workingHr: createRobo.workinghr,
        motor1: createRobo.motor1,
        motor2: createRobo.motor2,
        motor3: createRobo.motor3,
        battery1: createRobo.battery1,
        battery2: createRobo.battery2,
        wheel: createRobo.wheel,
        brushes: createRobo.brushes,
      }),
    });
    const resp1 = await resp.json();
    if (resp1.success) {
      toast.success("Robot Created Successfully", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setCreateRobo({
        roboID: "",
        workingHr: "",
        motor1: "",
        motor2: "",
        motor3: "",
        battery1: "",
        battery2: "",
        wheel: "",
        brushes: "",
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
      toast.error("Robot not created", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <Modal
      {...{
        show: modal3,
        onHide: () => setModal3(false),
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="userModal" style={{ width: "100%", padding: "0 2vw" }}>
          <div>RobotId</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.name}
            name="roboId"
            placeholder="fill more than 3 characters"
            style={{ width: "100%" }}
            required
          />
          <div>Wroking Hours</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.username}
            name="workinghr"
            placeholder="fill number along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Motor 1</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.password}
            name="motor1"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Motor 2</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.password}
            name="motor2"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Motor 3</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.password}
            name="motor3"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Battery 1</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.admin}
            name="battery1"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Battery 2</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.designation}
            name="battery2"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Wheel</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.phone}
            name="wheel"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <div>Brushes</div>
          <input
            type="text"
            onChange={beta1}
            value={createRobo.phone}
            name="brushes"
            placeholder="Condition/Working hours along with unit"
            style={{ width: "100%" }}
            required
          />
          <button
            onClick={(event) => {
              Change1(event);
              setModal3(false);
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

export default adminAddRobot;
