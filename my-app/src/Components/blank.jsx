import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Blank() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("token")) navigate("/login");
  });
  return (
    <div className="body" style={{ height: "86vh", textAlign: "center" }}>
      <h1 style={{ color: "grey", fontSize: "80px", opacity: "0.5" }}>
        Select Site To Display
      </h1>
    </div>
  );
}

export default Blank;
