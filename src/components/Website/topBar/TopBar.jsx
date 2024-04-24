import { useState, useEffect } from "react";
import Language from "./Language";
import Support from "./Support";
import Notification from "./Notification";
import Person from "./Person";
import { useLocation } from "react-router-dom";
// Translation Work
import { useTranslation } from "react-i18next";

export default function TopBar(isEnglish) {
  const location = useLocation();
  const [routeText, setRouteText] = useState("Home");
  const [iconsVisible, setIconsVisible] = useState(true);
  const eventId = location.pathname.split("/")[3];

  const { i18n } = useTranslation();
  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        {
          (" ");
        }
        {
          i18n.language === "en"
            ? setRouteText("Home")
            : setRouteText("الرئيسية");
        }

        break;
      case "/home/myevents":
        {
          i18n.language === "en"
            ? setRouteText("My Events")
            : setRouteText("الفعاليات الخاصة بي");
        }

        break;
      case "/home/community":
        {
          i18n.language === "en"
            ? setRouteText("Community")
            : setRouteText("المجتمع");
        }

        break;
      case "/home/recommendations":
        {
          i18n.language === "en"
            ? setRouteText("Recommendations")
            : setRouteText("التوصيات");
        }

        break;
      case "/home/update-user-profile":
      case "/home/update-speaker-profile":
        {
          i18n.language === "en"
            ? setRouteText("Update Profile")
            : setRouteText("تحديث الملف الشخصي");
        }

        break;
      case `/home/event/${eventId}`:
        {
          i18n.language === "en"
            ? setRouteText("Event Details")
            : setRouteText("تفاصيل الفعالية");
        }

        break;
      case `/home/payment/${eventId}`:
        {
          i18n.language === "en"
            ? setRouteText("Payment")
            : setRouteText("الدفع");
        }
        break;
      default:
        {
          i18n.language === "en"
            ? setRouteText("Event Details")
            : setRouteText("تفاصيل الفعالية");
        }
        break;
    }
  }, [location, eventId, i18n.language]);

  const toggleIconsVisibility = () => {
    setIconsVisible(!iconsVisible);
  };

  // console.log(isEnglish);

  return (
    <>
      <div
        className={`topbar d-flex justify-content-between align-items-center px-2 pt-2 ${
          isEnglish.isEnglish === "en" ? "" : "topbar-rtl"
        }`}
        style={{ direction: isEnglish.isEnglish === "en" ? "" : "rtl" }}
      >
        <span>{routeText}</span>

        <i
          className="fa-solid fa-caret-down p-4 fs-4 d-md-none"
          role="button"
          onClick={toggleIconsVisibility}
        ></i>
        <div
          className={`icons d-flex align-items-center gap-4 ${
            !iconsVisible ? "d-sm-flex" : "d-none d-md-flex"
          }`}
        >
          <Language />
          <Support />
          <Notification />
          <Person />
        </div>
      </div>
    </>
  );
}
