import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { DataView } from "primereact/dataview";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";
import {
  BASE,
  GET_EVENT_DAY_ATTENDANCE,
  GET_NIGHT_USERS,
  GET_USERS_FOR_EVENTDAY,
} from "../API/Api";
import axios from "axios";
export default function EventReport({
  eventDayId,
  modalEventReportVisible,
  setModalEventReportVisible,
}) {
  console.log(eventDayId);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [nightEventUsers, setNightEventUsers] = useState([]);
  const [usersForEventDay, setUsersForEventDay] = useState([]);
  const [modalNightEventVisible, setModalNightEventVisible] = useState(false);
  const [modalWhoBoughtVisible, setModalWhoBoughtVisible] = useState(false);
  const { t } = useTranslation();
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    // Initial check
    setIsLargeScreen(mediaQuery.matches);

    // Event listener for changes in media query
    const handleMediaQueryChange = (event) => {
      setIsLargeScreen(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleDownload = (binaryData) => {
    const blob = new Blob([binaryData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filename.xlsx"; // Change filename as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGettingUserAttendance = async () => {
    if (eventDayId) {
      try {
        const response = await axios.get(
          `${BASE}/${GET_EVENT_DAY_ATTENDANCE}?eventDayId=${eventDayId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handleDownload(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching user attendance:", error);
      }
    }
  };
  const handleGettingWhoBought = async () => {
    if (eventDayId) {
      try {
        const response = await axios.get(
          `${BASE}/${GET_USERS_FOR_EVENTDAY}?eventDayId=${eventDayId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsersForEventDay(response.data.responseObject);
        setModalWhoBoughtVisible(true);
        console.log(response.data.responseObject);
      } catch (error) {
        console.error("Error fetching user attendance:", error);
      }
    }
  };
  const handleGettingNightUsers = async () => {
    if (eventDayId) {
      try {
        const response = await axios.get(
          `${BASE}/${GET_NIGHT_USERS}?eventDayId=${eventDayId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(
          response.data.responseObject.filter((item) => {
            return item.isAccept === true;
          })
        );
        setModalNightEventVisible(true);
        setNightEventUsers(
          response.data.responseObject.filter((item) => {
            return item.isAccept === true;
          })
        );
      } catch (error) {
        console.error("Error fetching user attendance:", error);
      }
    }
  };

  const itemNightUserTemplate = (user, index) => {
    return (
      <div>
        <div
          className="col-12 d-flex justify-content-between align-items-center gap-3 p-3"
          style={{
            backgroundColor: "#F8F8F8",
            borderRadius: "10px",
          }}
          key={user.id}
        >
          {user.displayProfileImage ? (
            <Avatar
              image={user.displayProfileImage}
              size="xlarge"
              shape="circle"
            />
          ) : (
            <Avatar
              icon="far fa-user"
              size="xlarge"
              style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              shape="circle"
            />
          )}
          <div
            className={`font-bold text-2xl ${
              isLargeScreen ? "fs-3" : "fs-4"
            } me-auto`}
          >
            {user.name}
          </div>
          {isLargeScreen && (
            <div className="font-bold text-2xl fs-4 ps-5">
              {truncateEmail(user.email)}
            </div>
          )}
          <div
            className={`font-bold text-2xl ${isLargeScreen ? "fs-4" : "fs-5"}`}
          >
            {user.phoneNumber}
          </div>
        </div>
        <Divider
          style={{
            backgroundColor: "#2196F3",
            width: "100%",
            height: "1px",
          }}
        />
      </div>
    );
  };
  const listNightUsersTemplate = (items) => {
    if (!items || items.length === 0)
      return <div className="text-center">{t("NoUsersFound")}</div>;

    let list = items.map((user, index) => {
      return itemNightUserTemplate(user.user, index);
    });

    return (
      <div
        className="pt-3"
        style={{
          maxHeight: "300px",
          overflow: "auto",
          backgroundColor: "#F8F8F8",
          padding: "0px 20px 20px 10px",
        }}
      >
        {list}
      </div>
    );
  };
  const listWhoBoughtTemplate = (items) => {
    if (!items || items.length === 0)
      return <div className="text-center">{t("NoUsersFound")}</div>;

    let list = items.map((user, index) => {
      return itemNightUserTemplate(user, index);
    });

    return (
      <div
        className="pt-3"
        style={{
          maxHeight: "300px",
          overflow: "auto",
          backgroundColor: "#F8F8F8",
          padding: "0px 20px 20px 10px",
        }}
      >
        {list}
      </div>
    );
  };
  function truncateEmail(email) {
    const maxLength = 15;
    const atIndex = email.indexOf("@");

    if (atIndex !== -1 && atIndex > maxLength) {
      const truncatedPrefix = email.slice(0, maxLength - 12) + "...";
      const domain = email.slice(atIndex);
      return truncatedPrefix + domain;
    } else {
      return email;
    }
  }
  return (
    <div>
      <Dialog
        visible={modalEventReportVisible}
        onHide={() => setModalEventReportVisible(false)}
        content={({ hide }) => (
          <div
            className="event-report-container p-3 card"
            style={{ backgroundColor: "white" }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="font-bold text-2xl fs-2">{t("EventReports")}</div>
              <Button
                icon="fas fa-times"
                className="p-button-danger p-button-rounded p-button-outlined "
                style={{
                  borderRadius: "50%",
                  borderColor: "transparent",
                  fontSize: "2rem",
                  fontWeight: "900",
                }}
                rounded
                outlined
                severity="danger"
                aria-label="Cancel"
                onClick={hide}
              />
            </div>
            <Divider className="my-3" />
            <div className="event-report-body d-flex">
              <div className="d-flex event-report-item">
                <div className="fs-4 ">{t("UserAttendance")}</div>
                <Button
                  icon={
                    isLargeScreen ? "fas fa-caret-down" : "fas fa-caret-right"
                  }
                  rounded
                  text
                  aria-label="Filter"
                  className="fs-3 rounded-4"
                  raised
                  onClick={handleGettingUserAttendance}
                />
              </div>
              <div
                style={{
                  width: isLargeScreen ? "1px" : "5rem",
                  minHeight: isLargeScreen ? "3rem" : "1px",
                  backgroundColor: "#e5e7eb",
                  marginBlock: isLargeScreen ? "" : "0.3rem",
                }}
              />
              <div className="d-flex event-report-item">
                <div className="fs-4 ">{t("WhoBoughtThisEvent")}</div>
                <Button
                  icon={
                    isLargeScreen ? "fas fa-caret-down" : "fas fa-caret-right"
                  }
                  rounded
                  text
                  aria-label="Filter"
                  className="fs-3 rounded-4"
                  raised
                  onClick={handleGettingWhoBought}
                />
              </div>
              <div
                style={{
                  width: isLargeScreen ? "1px" : "5rem",
                  minHeight: isLargeScreen ? "3rem" : "1px",
                  backgroundColor: "#e5e7eb",
                  marginBlock: isLargeScreen ? "" : "0.3rem",
                }}
              />
              <div className="d-flex event-report-item">
                <div className="fs-4 ">{t("NightEventUsers")}</div>
                <Button
                  icon={
                    isLargeScreen ? "fas fa-caret-down" : "fas fa-caret-right"
                  }
                  rounded
                  text
                  aria-label="Filter"
                  className="fs-3 rounded-4"
                  raised
                  onClick={handleGettingNightUsers}
                />
              </div>
            </div>
          </div>
        )}
      />
      <Dialog
        visible={modalNightEventVisible}
        onHide={() => setModalNightEventVisible(false)}
        style={{ maxWidth: "90%" }}
        className="card"
        content={({ hide }) => (
          <DataView
            value={nightEventUsers}
            listTemplate={listNightUsersTemplate}
            header={
              <div className="d-flex align-items-center justify-content-between gap-5 m-2">
                <div className="font-bold text-2xl fs-2">
                  {t("NightEventUsers")}
                </div>
                <Button
                  icon="fas fa-times"
                  className="p-button-danger p-button-rounded p-button-outlined "
                  style={{
                    borderRadius: "50%",
                    borderColor: "transparent",
                    fontSize: "2rem",
                    fontWeight: "900",
                  }}
                  rounded
                  outlined
                  severity="danger"
                  aria-label="Cancel"
                  onClick={hide}
                />
              </div>
            }
          />
        )}
      />

      <Dialog
        visible={modalWhoBoughtVisible}
        onHide={() => setModalWhoBoughtVisible(false)}
        style={{ maxWidth: "90%" }}
        className="card"
        content={({ hide }) => (
          <DataView
            value={usersForEventDay}
            listTemplate={listWhoBoughtTemplate}
            header={
              <div className="d-flex align-items-center justify-content-between m-2 gap-5">
                <div className="font-bold text-2xl fs-2">
                  {t("WhoBoughtThisEvent")}
                </div>
                <Button
                  icon="fas fa-times"
                  className="p-button-danger p-button-rounded p-button-outlined "
                  style={{
                    borderRadius: "50%",
                    borderColor: "transparent",
                    fontSize: "2rem",
                    fontWeight: "900",
                  }}
                  rounded
                  outlined
                  severity="danger"
                  aria-label="Cancel"
                  onClick={hide}
                />
              </div>
            }
          />
        )}
      />
    </div>
  );
}
