import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import "./style.css";
import Cookie from "cookie-universal";
// Translation Work
import { useTranslation } from "react-i18next";
import Logout from "./../components/Website/Popups/Logout";

function TopBar({ isEnglish, setIsEnglish }) {
  const { i18n } = useTranslation();
  const cookies = Cookie();
  const nav = useNavigate();
  return (
    <header
      style={{ direction: "ltr" }}
      className="top-bar d-flex align-items-center"
    >
      <h2 style={{ color: " #0d69d5", fontFamily: "sans-serf" }}>
        {i18n.language === "en" ? "Dashboard" : "لوحة التحكم"}
      </h2>
      <div className="d-flex gap-3 mx-2 align-items-center">
        <LanguageSwitcher isEnglish={isEnglish} setIsEnglish={setIsEnglish} />

        <Logout />
      </div>
    </header>
  );
}

export default TopBar;
