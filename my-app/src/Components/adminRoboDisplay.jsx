import React from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

function RoboDisplay(props) {
  const {
    specRobot,
    alpha2,
    setUser,
    setRobot,
    setSite,
    setSpecRobot,
    setSite1,
    setUser1,
  } = props;

  const Delete2 = async (e) => {
    const resp = await fetch(
      `http://13.232.106.215/api/deleteRobot/${specRobot._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("auth-token"),
        },
      }
    );
    const resp1 = await resp.json();
    if (resp1.success) {
      toast.success("Robot deleted successfully", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setSpecRobot({
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
      setUser(false);
      setSite(false);
      setRobot(false);
      setSite1(false);
      setUser1(false);
    } else {
      toast.error("Robot not deleted", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const Update2 = async () => {
    const resp = await fetch(
      `http://13.232.106.215/api/updateRobot/${specRobot._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("auth-token"),
        },
        body: JSON.stringify({
          roboId: specRobot.id,
          workingHr: specRobot.workingHr,
          motor1: specRobot.motor1,
          motor2: specRobot.motor2,
          motor3: specRobot.motor3,
          battery1: specRobot.battery1,
          battery2: specRobot.battery2,
          wheel: specRobot.wheel,
          brushes: specRobot.brushes,
        }),
      }
    );
    const resp1 = await resp.json();
    if (resp1.success) {
      toast.success("Updated Successfully", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setUser(false);
      setRobot(false);
      setSite(false);
      setSite1(false);
      setUser1(false);
    } else {
      toast.error("Not Updated", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="RoboSpecific" style={{ padding: "0 3vw", width: "100%" }}>
      <input type="text" onChange={alpha2} name="_id" hidden={true} />
      <div style={{ display: "flex", gap: "2vw" }}>
        <div style={{ width: "28.33vw" }}>
          <div>RobotId</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="id"
              value={specRobot.id}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>WorkingHr</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="workingHr"
              value={specRobot.workingHr}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>Motor1</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="motor1"
              value={specRobot.motor1}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "2vw", paddingTop: "0vw" }}>
        <div style={{ width: "28.33vw" }}>
          <div>Motor2</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="motor2"
              value={specRobot.motor2}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>Motor3</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="motor3"
              value={specRobot.motor3}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>Battery1</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="battey1"
              value={specRobot.battery1}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "2vw", paddingTop: "0vw" }}>
        <div style={{ width: "28.33vw" }}>
          <div>Battery2</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="battery2"
              value={specRobot.battery2}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>Wheel</div>
          <div style={{ paddingTop: "0" }}>
            {" "}
            <input
              type="text"
              onChange={alpha2}
              name="wheel"
              value={specRobot.wheel}
            />
          </div>
        </div>
        <div style={{ width: "28.33vw" }}>
          <div>Brushes</div>
          <div style={{ paddingTop: "0" }}>
            <input
              type="text"
              onChange={alpha2}
              name="brushes"
              value={specRobot.brushes}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.2vw" }}>
        <Button
          onClick={(event) => {
            Update2(event);
          }}
          style={{
            marginTop: "1vw",
            backgroundColor: "#12D576",
            border: "#12D576",
            padding: "0.5vw 2vw",
            fontSize: "1vw",
            fontWeight: "450",
          }}
        >
          Save
        </Button>
        <Button
          onClick={(event) => {
            Delete2(event);
          }}
          style={{
            cursor: "pointer",
            marginTop: "1vw",
            padding: "0.5vw 2vw",
            fontSize: "1vw",
            fontWeight: "450",
          }}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default RoboDisplay;
