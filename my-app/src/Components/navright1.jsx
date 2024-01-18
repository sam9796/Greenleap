import React, { useState, useEffect } from "react";
import { Offcanvas, Dropdown } from "react-bootstrap";
import Logo from "../Assets/logo.png";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

function Navright(props) {
  const { resp1 } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [sites, setSites] = useState({ site: [] });
  const [site, setSite] = useState({ sit: "Sites" });

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      if (resp1.success) {
        let props = { site: resp1.sites };
        const alpha = location.state?.site;
        if (alpha) setSite({ sit: alpha });
        if (props) {
          setSites({ site: props.site });
        }
      }
    } else {
      navigate("/login");
    }
  });
  function handleLog(e) {
    e.preventDefault();
    sessionStorage.removeItem("token");
    navigate("/login");
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate("/site", { state: { site: event.target.textContent } });
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="navRight1" style={{ paddingRight: "20px" }}>
      <svg
        onClick={handleShow}
        style={{ width: "35px", height: "35px", fill: "white" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
      </svg>
      <Offcanvas
        show={show}
        onHide={handleClose}
        {...{ scroll: true, placement: "top" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img
              style={{
                width: "200px",
                padding: "14px",
                backgroundColor: "white",
                borderRadius: "30px",
              }}
              src={Logo}
              alt="not found"
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ paddingRight: "6%" }} className="navRight">
            <Dropdown
              style={{
                padding: "7px 17px",
                backgroundColor: "#8cc63e",
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
                    <Dropdown.Item onClick={handleSubmit}>
                      {value}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
            <div
              onClick={handleLog}
              style={{
                cursor: "pointer",
                padding: "13px 17px",
                backgroundColor: "#8cc63e",
                borderRadius: "30px",
                textAlign: "center",
              }}
            >
              Logout
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Navright;
