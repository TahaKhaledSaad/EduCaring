import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import "./style.css";
import Cookie from "cookie-universal";

function TopBar({ isEnglish, setIsEnglish }) {
  //
  const cookies = Cookie();
  const nav = useNavigate();
  return (
    <header
      style={{ direction: "ltr" }}
      className="top-bar d-flex align-items-center"
    >
      <h2 style={{ color: " #0d69d5", fontFamily: "sans-serf" }}>Dashboard</h2>
      <div className="d-flex gap-3 mx-2 align-items-center">
        <LanguageSwitcher isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
        <p
          className="border border-danger rounded p-2 py-1 m-0"
          style={{ cursor: "pointer" }}
          onClick={() => {
            cookies.remove("edu-caring");
            cookies.remove("userId");
            nav("/");
            window.location.reload();
          }}
        >
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.26 13.2925L17.5 11.0525L15.26 8.8125"
              stroke="#C32B43"
              stroke-width="1.3125"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.54004 11.0527H17.4388"
              stroke="#C32B43"
              stroke-width="1.3125"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.29 18C6.42254 18 3.29004 15.375 3.29004 11C3.29004 6.625 6.42254 4 10.29 4"
              stroke="#C32B43"
              stroke-width="1.3125"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-danger mx-1">Logout</span>
        </p>
      </div>
    </header>
  );
}

export default TopBar;
