import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
function Navright(props) {
  const { resp1 } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [sites, setSites] = useState({ site: [] });
  const [site, setSite] = useState({ sit: "Sites" });
  const [user, setUser] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      if (resp1.success) {
        let props = { site: resp1.sites };
        const alpha = location.state?.site;
        if (alpha) setSite({ sit: alpha });
        if (resp1.username) {
          setUser(resp1.username);
        }
        if (props) {
          setSites({ site: props.site });
        }
      }
    } else {
      navigate("/login");
    }
  }, [
    resp1.success,
    resp1.username,
    resp1.sites,
    navigate,
    location.state?.site,
  ]);
  function handleLog(e) {
    e.preventDefault();
    setUser("");
    sessionStorage.removeItem("token");
    navigate("/login");
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/site", { state: { site: event.target.textContent } });
  };
  return (
    <div style={{ paddingRight: "6%" }} className="navRight">
      <Dropdown
        style={{
          padding: "7px 17px",
          backgroundColor: "white",
          borderRadius: "30px",
        }}
      >
        <Dropdown.Toggle
          variant="tranparent"
          id="dropdown-basic"
          style={{ fontSize: "15px", fontWeight: "600" }}
        >
          {site.sit}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {sites.site.map((value) => {
            return (
              <Dropdown.Item onClick={handleSubmit}>{value}</Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <div
        style={{
          padding: "13px 17px",
          backgroundColor: "white",
          borderRadius: "30px",
          textAlign: "center",
        }}
      >
        Welcome {user}
      </div>
      <div
        onClick={handleLog}
        style={{
          cursor: "pointer",
          padding: "13px 17px",
          backgroundColor: "white",
          borderRadius: "30px",
          textAlign: "center",
        }}
      >
        Logout
      </div>
    </div>
  );
}

export default Navright;
