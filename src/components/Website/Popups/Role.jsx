import { useState } from "react";
import att from "../../../assets/attendance.png";
import attColored from "../../../assets/attendance-color.png";
import spk from "../../../assets/speaker-icon.png";
import spkColored from "../../../assets/speaker-icon-color.png";
import "./role.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Role({ roleCase }) {
  const [showRole, setShowRole] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);


  const handleRoleItemClick = (role) => {
    setSelectedRole(role);
  };

  const handleCloseClick = () => {
    setShowRole(!showRole);
    roleCase(!showRole);
  };

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
              <h5
                style={{
                  color: selectedRole === "attendance" ? "#3296D4" : "",
                }}
              >
                Attendance
              </h5>
            </div>
            <div className="role-item" onClick={() => handleRoleItemClick("speaker")}>
              <img src={selectedRole === "speaker" ? spkColored : spk} alt="speaker" />
              <h5 style={{ color: selectedRole === "speaker" ? "#3296D4" : "" }}>Speaker</h5>
            </div>
          </div>
          <div className="btns">
            <Link to={selectedRole === "attendance" ? "/register-attendance" : "/register-speaker"}>
              Ok
            </Link>
            <button onClick={handleCloseClick}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

Role.propTypes = {
  roleCase: PropTypes.string.isRequired,
};