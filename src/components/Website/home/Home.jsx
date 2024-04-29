import { Outlet, Link, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import TopBar from "../topBar/TopBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE } from "../../../Api";
import "./Home.css";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { PulseLoader } from "react-spinners";

// Translation Work
import { useTranslation } from "react-i18next";

export default function Home() {
  // Translation Work
  const { i18n } = useTranslation();

  // to show the defualt content of the home
  const location = useLocation();
  const isHomeRoute = location.pathname === "/home";

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = token ? jwtDecode(token) : {};

  const [loading, setLoading] = useState(true); // Add loading state

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetUpCommingForApp`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
          Authorization: `Bearer ${token}`,
        },
        params: {
          limite: 100,
          skip: 0,
        },
      })
      .then((data) => {
        setEvents(data.data.responseObject?.events);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // Set loading to false when the data is fetched
  }, [i18n.language, decodedToken.uid, token]);



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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // Set loading to false when the data is fetched
  }, []);

  const [reminder, setReminder] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetReminder`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setReminder(data.data.responseObject);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // Set loading to false when the data is fetched
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()].slice(0, 3);
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day} ${month}, ${year}`;
  };



  if (loading) {
    // Render loading spinner while loading is true
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{
          height: "100vh",
        }}
      >
        <PulseLoader color="#3296d4" size={50} />
      </div>
    );
  }

  return (
    <div>
      <SideBar isEnglish={i18n.language} />
      <TopBar isEnglish={i18n.language} />
      <div
        className={`outlet p-0 ${i18n.language === "en" ? "" : "outlet-rtl"}`}
        style={{ direction: i18n.language === "en" ? "" : "rtl" }}
      >
        {isHomeRoute && (
          <div className="home-comp">
            {
              // Reminder Section
              reminder && (
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
                        <h4>{String(countdown.days ? countdown.days : "0")}</h4>
                        :
                        <h4>
                          {String(countdown.hours ? countdown.hours : "0")}
                        </h4>
                        :
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
              )
            }

            <div className="coming-events">
              <h3 className="fw-bold mb-4">
                {decodedToken.roles.includes("Speaker")
                  ? 
                  i18n.language === "en" ? "My Events" : "أحداثي"
                  : 
                  i18n.language === "en" ? "Upcoming Events" : "الأحداث القادمة"
                  }{" "}
              </h3>

              {events?.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center flex-column gap-3">
                  <svg
                    width="250"
                    height="220"
                    viewBox="0 0 174 177"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M79.0875 161.945C118.991 161.945 151.341 129.595 151.341 89.549C151.341 49.5033 118.848 17.1533 79.0875 17.1533C39.1845 17.1533 6.83447 49.5033 6.83447 89.549C6.83447 129.595 39.1845 161.945 79.0875 161.945Z"
                      fill="#F1F3F9"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M130.432 26.2679C133.659 26.2679 136.275 23.652 136.275 20.425C136.275 17.198 133.659 14.582 130.432 14.582C127.205 14.582 124.589 17.198 124.589 20.425C124.589 23.652 127.205 26.2679 130.432 26.2679Z"
                      fill="#F1F3F9"
                    />
                    <path
                      d="M106.912 7.98062C109.115 7.98062 110.902 6.1941 110.902 3.99031C110.902 1.78652 109.115 0 106.912 0C104.708 0 102.921 1.78652 102.921 3.99031C102.921 6.1941 104.708 7.98062 106.912 7.98062Z"
                      fill="#F1F3F9"
                    />
                    <path
                      d="M10.1124 42.0929C12.3162 42.0929 14.1027 40.3064 14.1027 38.1026C14.1027 35.8988 12.3162 34.1123 10.1124 34.1123C7.90859 34.1123 6.12207 35.8988 6.12207 38.1026C6.12207 40.3064 7.90859 42.0929 10.1124 42.0929Z"
                      fill="#F1F3F9"
                    />
                    <path
                      d="M7.41057 147.535C11.5033 147.535 14.8211 144.217 14.8211 140.124C14.8211 136.032 11.5033 132.714 7.41057 132.714C3.31783 132.714 0 136.032 0 140.124C0 144.217 3.31783 147.535 7.41057 147.535Z"
                      fill="#F1F3F9"
                    />
                    <path
                      d="M79.0875 161.945C118.991 161.945 151.341 129.595 151.341 89.549C151.341 49.5033 118.848 17.1533 79.0875 17.1533C39.1845 17.1533 6.83447 49.5033 6.83447 89.549C6.83447 129.595 39.1845 161.945 79.0875 161.945Z"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M108.267 123.641L101.199 126.013C100.522 123.932 98.2951 122.867 96.2136 123.545C94.1321 124.222 93.0188 126.449 93.7449 128.53L86.6291 130.902C85.9515 128.821 83.7248 127.708 81.6433 128.434C79.5618 129.111 78.4969 131.338 79.1746 133.42L72.0588 135.791C71.5264 134.194 70.0742 133.177 68.4768 133.129C68.0411 133.129 67.557 133.177 67.073 133.323C64.9915 134 63.8781 136.227 64.6042 138.309L57.5369 140.68C55.4554 134.484 48.7754 131.144 42.5793 133.226C42.3857 133.274 42.2405 133.371 42.0469 133.42L10.4375 39.5594C10.6311 39.511 10.8248 39.4626 10.97 39.4142C17.166 37.3327 20.506 30.6042 18.4246 24.4566L25.4919 22.0847C26.1696 24.1662 28.3963 25.2795 30.4777 24.5534C32.5592 23.8757 33.6242 21.649 32.9465 19.5676L40.0138 17.1956C40.6915 19.2771 42.9666 20.3905 44.9997 19.6644C47.0811 18.9867 48.1945 16.76 47.4684 14.6785L54.5357 12.3066C55.2134 14.3881 57.4401 15.453 59.5216 14.7753C61.603 14.0976 62.668 11.8709 61.9903 9.78946L69.1544 7.36914C71.2359 13.5652 77.916 16.8568 84.112 14.7753L95.9716 50.0152L115.721 108.684C109.525 110.765 106.185 117.445 108.267 123.641Z"
                      fill="white"
                      stroke="#C5CCDA"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M98.9243 109.506L55.891 123.98C53.9063 124.658 51.7281 123.593 51.0504 121.56L24.8141 43.6253C24.1364 41.6407 25.2014 39.4624 27.2344 38.7847L70.2677 24.3112C72.2524 23.6335 74.4307 24.6984 75.1083 26.7315L101.345 104.666C102.022 106.651 100.909 108.829 98.9243 109.506Z"
                      fill="#F1F3F9"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      opacity="0.2"
                      d="M108.267 123.641L101.199 126.013C100.522 123.931 98.2949 122.866 96.2134 123.544C94.1319 124.222 93.0186 126.448 93.7447 128.53L86.629 130.902C85.9513 128.82 83.7246 127.707 81.6431 128.433C79.5616 129.111 78.4967 131.337 79.1744 133.419L72.0586 135.791C71.5262 134.193 70.074 133.177 68.4766 133.128L77.2381 59.6473C77.4317 59.6958 77.6254 59.6958 77.819 59.7442C84.3054 60.5187 90.1626 55.8716 90.9371 49.4336L95.9714 50.0145L115.721 108.683C109.525 110.765 106.185 117.445 108.267 123.641Z"
                      fill="#AAB2C5"
                    />
                    <path
                      d="M28.9766 56.0653L79.3192 39.123"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M43.4023 42.6574L59.7153 37.1875"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M46.8389 109.023L97.1331 92.0811"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M74.4561 67.0386L71.1645 73.3798C70.9709 73.7671 70.9709 74.2027 71.1645 74.5416L74.5529 80.8344C74.8918 81.4637 74.6497 82.1898 74.0205 82.5286C73.7784 82.6738 73.488 82.7223 73.1976 82.6738L66.1302 81.5605C65.6946 81.5121 65.3073 81.6089 65.0169 81.9478L60.0794 87.1272C59.5954 87.6113 58.8209 87.6597 58.2884 87.1756C58.0948 86.982 57.9495 86.74 57.9011 86.4496L56.7878 79.3822C56.7394 78.995 56.4489 78.6077 56.1101 78.4625L49.6721 75.3645C49.0428 75.074 48.8007 74.2995 49.0912 73.6703C49.188 73.4282 49.43 73.2346 49.6721 73.0894L56.0617 69.8461C56.449 69.6525 56.691 69.3137 56.7394 68.878L57.7075 61.8107C57.8043 61.133 58.4336 60.6489 59.1113 60.7457C59.4017 60.7941 59.6438 60.891 59.8374 61.0846L64.8717 66.1189C65.1621 66.4093 65.5978 66.5545 65.985 66.4577L73.0523 65.1507C73.73 65.0055 74.4077 65.4896 74.5045 66.1673C74.6497 66.5061 74.6013 66.7965 74.4561 67.0386Z"
                      fill="#D6DCE8"
                      stroke="#AAB2C5"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M66.395 110.91L82.6596 105.44"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M160.981 66.3278L149.218 164.69C142.732 163.915 136.875 168.562 136.1 175L128.694 174.129C128.936 171.951 127.387 170.014 125.257 169.772C123.079 169.53 121.142 171.079 120.9 173.209L113.494 172.338C113.736 170.16 112.187 168.223 110.057 167.981C107.879 167.739 105.943 169.288 105.701 171.418L98.2946 170.547C98.5367 168.369 96.9877 166.432 94.8578 166.19C92.6795 165.948 90.7433 167.497 90.5012 169.627L83.095 168.756C83.8696 162.269 79.2225 156.412 72.7845 155.638C72.5909 155.638 72.3972 155.589 72.2036 155.589L83.9664 57.2274C84.16 57.2758 84.3536 57.2758 84.5472 57.3242C91.0337 58.0987 96.8909 53.4517 97.6654 47.0137L105.072 47.885C104.83 50.0633 106.379 51.9995 108.508 52.2416C110.638 52.4836 112.623 50.9346 112.865 48.8047L120.271 49.676C120.029 51.8543 121.578 53.7906 123.708 54.0326C125.886 54.2746 127.823 52.7256 128.065 50.5957L135.471 51.4671C135.229 53.6454 136.778 55.5816 138.908 55.8236C141.086 56.0657 143.022 54.5167 143.264 52.3868L150.67 53.2581C149.847 59.6962 154.494 65.5533 160.981 66.3278Z"
                      fill="white"
                      stroke="#C5CCDA"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M133.728 158.203L88.6137 152.83C86.5322 152.588 85.0316 150.652 85.2737 148.57L95.0517 66.9086C95.2938 64.8272 97.23 63.3266 99.3115 63.5686L144.426 68.9417C146.508 69.1837 148.008 71.12 147.766 73.2015L138.037 154.863C137.746 156.945 135.81 158.445 133.728 158.203Z"
                      fill="#F1F3F9"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M93.4546 79.9297L146.169 86.2225"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M112.236 74.0234L129.323 76.0565"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M103.716 145.569L120.755 147.602"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M86.8223 135.452L139.537 141.745"
                      stroke="#D6DCE8"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M129.833 109.345L124.121 113.702C123.782 113.944 123.589 114.331 123.637 114.766L124.024 121.882C124.073 122.56 123.54 123.189 122.814 123.189C122.524 123.189 122.282 123.141 122.04 122.947L116.134 118.881C115.795 118.639 115.359 118.591 114.972 118.736L108.292 121.301C107.663 121.543 106.888 121.253 106.646 120.575C106.549 120.333 106.55 120.043 106.598 119.752L108.631 112.927C108.728 112.54 108.679 112.104 108.389 111.765L103.887 106.199C103.451 105.666 103.548 104.892 104.081 104.407C104.274 104.214 104.565 104.117 104.855 104.117L112.019 103.923C112.455 103.923 112.794 103.681 113.036 103.343L116.957 97.3886C117.344 96.8077 118.119 96.6625 118.7 97.0013C118.942 97.1465 119.087 97.3886 119.184 97.6306L121.555 104.359C121.701 104.746 122.04 105.037 122.427 105.134L129.349 106.973C130.027 107.167 130.414 107.844 130.269 108.522C130.22 108.958 130.075 109.2 129.833 109.345Z"
                      fill="#D6DCE8"
                      stroke="#AAB2C5"
                      strokeWidth="2.38539"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M157.835 47.8364L159.819 42.8506"
                      stroke="#AAB2C5"
                      strokeWidth="3.57808"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M162.723 52.6295L171.001 46.1914"
                      stroke="#AAB2C5"
                      strokeWidth="3.57808"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M166.693 58.5831L171.437 57.8086"
                      stroke="#AAB2C5"
                      strokeWidth="3.57808"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="fs-4 fw-bold" style={{ color: "#bdbdbd" }}>
                    {i18n.language === "en" ? "NO EVENTS" : "لا يوجد أحداث "}
                  </p>
                </div>
              ) : (
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
                          <h5 className="text-start">
                            {event.name.split(" ").slice(0, 4).join(" ")}{" "}
                            {event.name.split(" ").length > 3 ? "..." : ""}
                          </h5>
                          <div className="info">
                            <div className="location">
                              <i className="bi bi-geo-alt-fill"></i>
                              <span>
                                {event.eventDays[0].address
                                  .split(" ")
                                  .slice(0, 2)
                                  .join(" ") +
                                  (event.eventDays[0].address.split(" ")
                                    .length > 3
                                    ? "..."
                                    : "")}
                              </span>
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
              )}
            </div>
            {!decodedToken.roles.includes("Speaker") && (
              <div className="recommend mb-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-3 my-3">
                  <h4 className="fw-bold mb-4">
                    {i18n.language === "en" ? "Recommendations for you" : "توصيات لك"}
                    </h4>
                  <Link
                    to="recommendations"
                    style={{
                      fontSize: "14px",
                      color: "#3296D4",
                      alignSelf: "end",
                    }}
                  >
                    {i18n.language === "en" ? "See All" :  " عرض الكل"}
                    
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
                          {i18n.language === "en"
                            ? event.nameEn.split(" ").slice(0, 3).join(" ") +
                              (event.nameEn.split(" ").length > 3 ? "..." : "")
                            : event.nameAr.split(" ").slice(0, 3).join(" ") +
                              (event.nameAr.split(" ").length > 3 ? "..." : "")}
                        </h6>
                        <p>
                          <i className="fa-solid fa-calendar-days"></i>
                          {formatDate(event.startDay)}
                        </p>
                        <p>
                          <i className="bi bi-geo-alt-fill"></i>
                          {event.eventDays[0].address
                            .split(" ")
                            .slice(0, 2)
                            .join(" ") +
                            (event.eventDays[0].address.split(" ").length > 3
                              ? "..."
                              : "")}
                        </p>
                        <div className="btns my-2">
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
            )}
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
