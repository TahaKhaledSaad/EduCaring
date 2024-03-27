import { Outlet, Link, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import TopBar from "../topBar/TopBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE } from "../../../Api";
import "./Home.css";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

// Translation Work
import { useTranslation } from "react-i18next";
import { HashLoader } from "react-spinners";

export default function Home() {
  // Translation Work
  const { i18n } = useTranslation();

  // to show the defualt content of the home
  const location = useLocation();
  const isHomeRoute = location.pathname === "/home";

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = token ? jwtDecode(token) : {};

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetUpCommingForApp`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
        },
        params: {
          limite: 100,
          skip: 0,
        },
      })
      .then((data) => {
        setEvents(data.data.responseObject?.events);
      })
      .catch((err) => console.log(err));
  }, [i18n.language, decodedToken.uid]);

  // console.log(events);

  const [recommendEvents, setrecommendEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetAll`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setrecommendEvents(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, []);

  const [reminder, setReminder] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetReminder`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
        },
      })
      .then((data) => {
        setReminder(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [i18n.language, decodedToken.uid]);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (reminder) {
        const eventDate = new Date(reminder.startDay);
        const currentDate = new Date();
        const timeDifference = eventDate.getTime() - currentDate.getTime();

        if (timeDifference < 0) {
          // Set all countdown values to 0 if time difference is negative
          setCountdown({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
        } else {
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          const hoursDifference = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutesDifference = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const secondsDifference = Math.floor(
            (timeDifference % (1000 * 60)) / 1000
          );

          setCountdown({
            days: daysDifference,
            hours: hoursDifference,
            minutes: minutesDifference,
            seconds: secondsDifference,
          });
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reminder]);

  if (!reminder || !events || !recommendEvents) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <HashLoader
          color="#3296d4"
          cssOverride={{}}
          loading={true}
          size={60}
          speedMultiplier={1}
        />
      </div>
    );
  }
  return (
    <div>
      <SideBar />
      <TopBar />
      <div className="outlet pl-2">
        {isHomeRoute && (
          <div className="home-comp">
            <Link to={`event/${reminder?.id}`}>
              <div className="period">
                <h3 className="statement">
                  <span className="text-danger">
                    {i18n.language === "en" ? "Reminder :" : "تذكير : "}{" "}
                  </span>{" "}
                  {reminder?.name}
                </h3>
                <div className="content">
                  <div className="nums">
                    <h4>{String(countdown.days ? countdown.days : "0")}</h4>:
                    <h4>{String(countdown.hours ? countdown.hours : "0")}</h4>:
                    <h4>
                      {String(countdown.minutes ? countdown.minutes : "0")}
                    </h4>
                    :
                    <h4>
                      {String(countdown.seconds ? countdown.seconds : "0")}
                    </h4>
                  </div>

                  <div className="text">
                    <p>{i18n.language === "en" ? "Days" : "أيام"}</p>
                    <p>{i18n.language === "en" ? "Hours" : "ساعات"}</p>
                    <p>{i18n.language === "en" ? "Minutes" : "دقائق"}</p>
                    <p>{i18n.language === "en" ? "Seconds" : "ثواني"}</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="coming-events">
              <h3 className="fw-bold mb-4">Upcoming Events</h3>
              <div className="events">
                {events?.map((event) => (
                  <Link
                    key={event.id}
                    className="event"
                    to={`event/${event.id}`}
                  >
                    <img src={event.displayPrimeImageURL} alt="event-Img" />

                    <div className="content">
                      <div className="txt">
                        <h5 className="text-start">{event.name}</h5>
                        <div className="info">
                          <div className="location">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{event.eventDays[0].address}</span>
                          </div>
                          <div className="money">
                            <i className="bi bi-cash-stack"></i>
                            {event.totalPrice}
                          </div>
                        </div>
                      </div>

                      <div className="date">
                        <p className="day m-0">
                          {new Date(event.startDay).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="month">
                          {new Date(event.startDay).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="recommend mb-3">
              <div className="d-flex justify-content-between align-items-center px-3">
                <h4 className="fw-bold mb-4">Recommendations for you</h4>
                <Link
                  to="recommendations"
                  style={{ fontSize: "14px", color: "#3296D4" }}
                >
                  See All
                </Link>
              </div>
              <div className="events d-flex gap-4 px-3 flex-wrap justify-content-start align-items-center">
                {recommendEvents.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    className="event"
                    to={`event/${event.id}`}
                  >
                    <img src={event.displayPrimeImageURL} alt="event-Img" />

                    <div className="info">
                      <h6>
                        {i18n.language === "en" ? event.nameEn : event.nameAr}
                      </h6>
                      <p>
                        <i className="fa-solid fa-calendar-days"></i>
                        05 Mars, 2023
                      </p>
                      <p>
                        <i className="bi bi-geo-alt-fill"></i>
                        {event.eventDays[0].address}
                      </p>
                      <div className="btns">
                        {event.isOnline && (
                          <span className="online">
                            {i18n.language === "en" ? "Online" : "بث مباشر"}
                          </span>
                        )}
                        {event.isOffline && (
                          <span className="offline">
                            {i18n.language === "en" ? "Offline" : "مكان محدد"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
