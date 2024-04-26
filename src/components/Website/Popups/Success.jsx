import { useState } from "react";
import "./success.css";
// Translation Work
import { useTranslation } from "react-i18next";

export default function Success({ text, type }) {
  const { i18n } = useTranslation();
  const [x, setX] = useState(false);
  const hide = () => {
    setX(true);
  };

  return (
    <div>
      <div className="successPopup" onClick={hide} style={{ display: x ? "none" : "block" }}>
        <div className="popup" style={{ background: type === "error" ? "rgba(255, 0, 0, 0.3)" : "#3296d465" }}>
          {type === "success" && (
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <g transform="translate(-595.805 -678.805)">
                <circle cx="25" cy="25" r="25" transform="translate(595.805 678.805)" fill="#fff" />
                <path
                  d="M2348.164,5670.065l5.524,5.523,9.476-9.476"
                  transform="translate(-1735.235 -4967.489)"
                  fill="none"
                  stroke="#3296D4"
                  strokeWidth="4"
                />
              </g>
            </svg>
          )}
          {type === "error" && <i className="fas fa-times-circle error"></i>}
          <p>{text}</p>
          <div className="timeIndicator"></div>
        </div>
        <div className="overlay"></div>
      </div>
    </div>
  );
}
