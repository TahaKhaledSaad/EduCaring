import { useState } from "react";
import att from "../../../assets/attendance.png";
import attColored from "../../../assets/attendance-color.png";
import spk from "../../../assets/speaker-icon.png";
import spkColored from "../../../assets/speaker-icon-color.png";
import "./role.css";
import { Link } from "react-router-dom";

function Role({ roleCase }) {
  const [showRole, setShowRole] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleItemClick = (role) => {
    setSelectedRole(role);
  };

  const handleCloseClick = () => {
    setShowRole(!showRole);
    roleCase(!showRole);
  };

  function definePath() {
    if (selectedRole === "attendance") {
      window.location.pathname = "register-attendance";
    } else if (selectedRole === "speaker") {
      window.location.pathname = "register-speaker";
    }
  }

  return (
    <>
      {showRole && (
        <div className="role">
          <div className="head">
            <h4>Register as a</h4>
          </div>
          <div className="roles">
            <div className="role-item" onClick={() => handleRoleItemClick("attendance")}>
              <img src={selectedRole === "attendance" ? attColored : att} alt="attendance" />
              <h5 style={{ color: selectedRole === "attendance" ? "#3296D4" : "" }}>Attendance</h5>
            </div>
            <div className="role-item" onClick={() => handleRoleItemClick("speaker")}>
              <img src={selectedRole === "speaker" ? spkColored : spk} alt="speaker" />
              <h5 style={{ color: selectedRole === "speaker" ? "#3296D4" : "" }}>Speaker</h5>
            </div>
          </div>
          <div className="btns">
            <Link onClick={definePath}>Ok</Link>
            <button onClick={handleCloseClick}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Role;
