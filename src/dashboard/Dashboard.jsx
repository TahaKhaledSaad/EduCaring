import { Outlet } from "react-router-dom";
import SideBar from "../DashboardComponents/SideBar";
import TopBar from "../DashboardComponents/TopBar";
import "./style.css";

////

export default function Dashboard({ isEnglish, setIsEnglish }) {
  return (
    <div
      style={{ direction: isEnglish ? "" : "rtl" }}
      className="only-dashboard"
    >
      <TopBar isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
      <div className="dash-content">
        <SideBar />
        <div className={`outlet ${isEnglish ? `` : `outlet-rtl`}`}>
          <Outlet isEnglish={isEnglish} />
        </div>
      </div>
    </div>
  );
}
