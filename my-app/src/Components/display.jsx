import React, { useEffect } from "react";
import "../Style/display.css";
function Display(props) {
  const { element } = props;
  return (
    <div
      className="displaysite"
      style={{
        height: "25.5vh",
        backgroundColor: "white",
        padding: "0.1% 0.1%",
        borderRadius: "5px",
        fontSize:'13px'
      }}
    >
      <h6 style={{ color: "#8cc63e" }}>{element.siteName}</h6>
      <table>
        <tbody className="displayTBody">
          <tr>
            <td>Location</td>
            <td>{element.location}</td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td>30 deg cel</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>30 g*m-3</td>
          </tr>
          <tr>
            <td>Capacity</td>
            <td>{element.capacity}</td>
          </tr>
          <tr>
            <td>GPS</td>
            <td>
              {element.gpsx} / {element.gpsy}
            </td>
          </tr>
          <tr>
            <td>Number</td>
            <td>{element.number}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Display;
