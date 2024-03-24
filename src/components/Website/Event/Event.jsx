import { useEffect, useState } from "react";
import map from "../../../assets/map.jpeg";
import ExMark from "../../../assets/Exclamation_mark.png";
import Carousel from "react-bootstrap/Carousel";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
// Translation Work
import { useTranslation } from "react-i18next";
import "./Event.css";
import Resources from "../Popups/Resources";
import Gallary from "./../Popups/Gallary";
import QrCode from './../Popups/QrCode';

export default function EventDetails() {
  // Translation Work
  const { i18n } = useTranslation();

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // State to track the selected day index

  const decodedToken = token ? jwtDecode(token) : {};

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetForApp/${eventId}`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
        },
      })
      .then((response) => {
        setEventDetails(response.data.responseObject);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [eventId, decodedToken.uid, i18n.language]);

  if (!eventDetails) {
    return <div className="p-4">Loading...</div>;
  }

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = dateTime.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = dateTime.toLocaleTimeString("en-US", options);
    return { formattedDate, formattedTime };
  };
  const { startDay, endDay } = eventDetails;
  const { formattedDate: startDate, formattedTime: startTime } =
    formatDateTime(startDay);
  const { formattedDate: endDate, formattedTime: endTime } =
    formatDateTime(endDay);

  // console.log(eventDetails);

  const uniqueSpeakers = {};

  const isValidImageUrl = (url) => {
    return (
      url &&
      !url.toLowerCase().endsWith("/null") &&
      url.toLowerCase().startsWith("http" || "https")
    );
  };

  const allEventDaysSpeakers = [
    ...eventDetails.eventDays.map((d) => d.eventDaySpeakers),
  ];

  // console.log("Speaker1: ", allEventDaysSpeakers[0][0].speakerId);
  // console.log("Speaker2: ", allEventDaysSpeakers[0][1].speakerId);
  // console.log("Current User ID: ", decodedToken.uid);

  let addResourcesSpeaker;

  allEventDaysSpeakers.map((speaker, index) => {
    // console.log(decodedToken.uid); // After: We will replace this with the current Speaker ID
    if (speaker[index].speakerId === "80d86b3a-7798-4a05-b8dd-33287dc95ec3") {
      addResourcesSpeaker = true;
    } else {
      addResourcesSpeaker = false;
    }
  });

  // console.log(addResourcesSpeaker);

  return (
    <>
      <div className="event-comp">
        <Carousel data-bs-theme="dark" className="coursel">
          {eventDetails.eventImages.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                src={image.displayImageURL}
                className="d-block w-100"
                style={{ height: "55vh", objectFit: "cover" }}
                alt={`Event Image ${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="days-container d-flex p-3 gap-3 text-center">
          {eventDetails.eventDays.map((d, index) => (
            <div
              key={index}
              className={`p-2 rounded fw-bold day-item ${
                selectedDayIndex === index ? "selected" : ""
              }`}
              style={{
                fontSize: "20px",
                backgroundColor:
                  selectedDayIndex === index ? "#3296D4" : "#F2F2F2",
                color: selectedDayIndex === index ? "white" : "black",
                cursor: "pointer",
              }}
              onClick={() => setSelectedDayIndex(index)}
            >
              Day {index + 1}
            </div>
          ))}
        </div>

        <div className="content-container">
          {selectedDayIndex !== null && (
            <div className="event-info m-3 d-flex gap-3">
              <div className="details flex-grow-1">
                <div className="d-flex gap-2 flex-column flex-md-row">
                  <div
                    className="p-1 d-flex gap-2 align-items-center justify-content-center"
                    style={{
                      width: "220px",
                      fontSize: "14px",
                      border: "1px solid #BDBDBD",
                      borderRadius: "20px",
                    }}
                  >
                    <span>
                      {eventDetails.eventDays[selectedDayIndex].noOfAttend
                        ? eventDetails.eventDays[selectedDayIndex].noOfAttend
                        : 0}{" "}
                      Attendees
                    </span>
                    <span
                      className="m-0 fw-bold"
                      style={{
                        textDecoration: "underline",
                        color: "#6B0AB9",
                      }}
                    >
                      (
                      {eventDetails.eventDays[selectedDayIndex].numberOfReviews}{" "}
                      reviews)
                    </span>
                    <span className="m-0 fw-bold d-flex align-items-center gap-1">
                      <svg
                        width="14"
                        height="13"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.04894 0.927052C6.3483 0.0057416 7.6517 0.00574088 7.95106 0.927052L8.79611 3.52786C8.92999 3.93989 9.31394 4.21885 9.74717 4.21885H12.4818C13.4505 4.21885 13.8533 5.45846 13.0696 6.02786L10.8572 7.63525C10.5067 7.8899 10.3601 8.34127 10.494 8.75329L11.339 11.3541C11.6384 12.2754 10.5839 13.0415 9.80017 12.4721L7.58779 10.8647C7.2373 10.6101 6.7627 10.6101 6.41222 10.8647L4.19983 12.4721C3.41612 13.0415 2.36164 12.2754 2.66099 11.3541L3.50604 8.75329C3.63992 8.34127 3.49326 7.8899 3.14277 7.63525L0.930391 6.02787C0.146677 5.45846 0.549452 4.21885 1.51818 4.21885H4.25283C4.68606 4.21885 5.07001 3.93989 5.20389 3.52786L6.04894 0.927052Z"
                          fill="#F7CB15"
                        />
                      </svg>
                      {eventDetails.eventDays[selectedDayIndex].reviewRate}
                    </span>
                  </div>
                  {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                    <Resources
                      eventId={eventId}
                      eventDayId={eventDetails.eventDays[selectedDayIndex].id}
                      userId={decodedToken.uid}
                      addResourcesSpeaker={addResourcesSpeaker}
                    />
                  ) : (
                    ""
                  )}
                  {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                    <Gallary
                      eventId={eventId}
                      eventDayId={eventDetails.eventDays[selectedDayIndex].id}
                      userId={decodedToken.uid}
                    ></Gallary>
                  ) : (
                    ""
                  )}

{eventDetails.eventDays[selectedDayIndex].isPaid ? (
                    <QrCode
                      eventId={eventId}
                      eventDayId={eventDetails.eventDays[selectedDayIndex].id}
                      userId={decodedToken.uid}
                    ></QrCode>
                  ) : (
                    ""
                  )}

                  {!eventDetails.eventDays[selectedDayIndex].isPaid ? (
                    <Link
                      to={`/home/payment/${eventId}`}
                      className="p-1 border text-white text-center"
                      style={{
                        background: "#3296D4",
                        borderRadius: "20px",
                        width: "170px",
                        fontSize: "14px",
                      }}
                    >
                      <span className="mx-1">
                        Buy ticket{" "}
                        {eventDetails.eventDays[selectedDayIndex].price} SAR
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 5.28V12.72C15 13.86 14.895 14.67 14.625 15.2475C14.625 15.255 14.6175 15.27 14.61 15.2775C14.445 15.4875 14.2275 15.5925 13.9725 15.5925C13.575 15.5925 13.095 15.33 12.5775 14.775C11.9625 14.115 11.0175 14.1675 10.4775 14.8875L9.72002 15.8925C9.42002 16.2975 9.0225 16.5 8.625 16.5C8.2275 16.5 7.82998 16.2975 7.52998 15.8925L6.76502 14.88C6.23251 14.1675 5.29499 14.115 4.67999 14.7675L4.67249 14.775C3.82499 15.6825 3.07501 15.8175 2.64001 15.2775C2.63251 15.27 2.625 15.255 2.625 15.2475C2.355 14.67 2.25 13.86 2.25 12.72V5.28C2.25 4.14 2.355 3.33 2.625 2.7525C2.625 2.745 2.62501 2.7375 2.64001 2.73C3.06751 2.1825 3.82499 2.3175 4.67249 3.225L4.67999 3.2325C5.29499 3.885 6.23251 3.8325 6.76502 3.12L7.52998 2.1075C7.82998 1.7025 8.2275 1.5 8.625 1.5C9.0225 1.5 9.42002 1.7025 9.72002 2.1075L10.4775 3.1125C11.0175 3.8325 11.9625 3.885 12.5775 3.225C13.095 2.67 13.575 2.4075 13.9725 2.4075C14.2275 2.4075 14.445 2.52 14.61 2.73C14.625 2.7375 14.625 2.745 14.625 2.7525C14.895 3.33 15 4.14 15 5.28Z"
                          stroke="white"
                          strokeWidth="1.125"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 7.6875H12"
                          stroke="white"
                          strokeWidth="1.125"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 10.3125H10.5"
                          stroke="white"
                          strokeWidth="1.125"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>

                <div
                  className="general my-3"
                  style={{ borderBottom: "1px solid #DCDCDC" }}
                >
                  <h2>{eventDetails.eventDays[selectedDayIndex].name}</h2>
                  <div className="date my-3 d-flex gap-2 align-items-center">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="48"
                        height="48"
                        rx="8"
                        fill="#3296D4"
                        fillOpacity="0.1"
                      />
                      <path
                        d="M28.75 15.56V14C28.75 13.59 28.41 13.25 28 13.25C27.59 13.25 27.25 13.59 27.25 14V15.5H20.75V14C20.75 13.59 20.41 13.25 20 13.25C19.59 13.25 19.25 13.59 19.25 14V15.56C16.55 15.81 15.24 17.42 15.04 19.81C15.02 20.1 15.26 20.34 15.54 20.34H32.46C32.75 20.34 32.99 20.09 32.96 19.81C32.76 17.42 31.45 15.81 28.75 15.56Z"
                        fill="#3296D4"
                      />
                      <path
                        d="M32 21.84H16C15.45 21.84 15 22.29 15 22.84V29C15 32 16.5 34 20 34H28C31.5 34 33 32 33 29V22.84C33 22.29 32.55 21.84 32 21.84ZM21.21 30.21C21.11 30.3 21 30.37 20.88 30.42C20.76 30.47 20.63 30.5 20.5 30.5C20.37 30.5 20.24 30.47 20.12 30.42C20 30.37 19.89 30.3 19.79 30.21C19.61 30.02 19.5 29.76 19.5 29.5C19.5 29.24 19.61 28.98 19.79 28.79C19.89 28.7 20 28.63 20.12 28.58C20.36 28.48 20.64 28.48 20.88 28.58C21 28.63 21.11 28.7 21.21 28.79C21.39 28.98 21.5 29.24 21.5 29.5C21.5 29.76 21.39 30.02 21.21 30.21ZM21.42 26.38C21.37 26.5 21.3 26.61 21.21 26.71C21.11 26.8 21 26.87 20.88 26.92C20.76 26.97 20.63 27 20.5 27C20.37 27 20.24 26.97 20.12 26.92C20 26.87 19.89 26.8 19.79 26.71C19.7 26.61 19.63 26.5 19.58 26.38C19.53 26.26 19.5 26.13 19.5 26C19.5 25.87 19.53 25.74 19.58 25.62C19.63 25.5 19.7 25.39 19.79 25.29C19.89 25.2 20 25.13 20.12 25.08C20.36 24.98 20.64 24.98 20.88 25.08C21 25.13 21.11 25.2 21.21 25.29C21.3 25.39 21.37 25.5 21.42 25.62C21.47 25.74 21.5 25.87 21.5 26C21.5 26.13 21.47 26.26 21.42 26.38ZM24.71 26.71C24.61 26.8 24.5 26.87 24.38 26.92C24.26 26.97 24.13 27 24 27C23.87 27 23.74 26.97 23.62 26.92C23.5 26.87 23.39 26.8 23.29 26.71C23.11 26.52 23 26.26 23 26C23 25.74 23.11 25.48 23.29 25.29C23.39 25.2 23.5 25.13 23.62 25.08C23.86 24.97 24.14 24.97 24.38 25.08C24.5 25.13 24.61 25.2 24.71 25.29C24.89 25.48 25 25.74 25 26C25 26.26 24.89 26.52 24.71 26.71Z"
                        fill="#3296D4"
                      />
                    </svg>
                    <div>
                      <p style={{ fontSize: "14px", margin: 0 }}>
                        {startDate} - {endDate}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          margin: 0,
                          color: "#747688",
                        }}
                      >
                        {startTime} - {endTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="desc py-2"
                  style={{ borderBottom: "1px solid #DCDCDC" }}
                >
                  <h3>{i18n.language === "en" ? "Description" : "الوصف"} </h3>
                  <span
                    style={{
                      color: "#747688",
                      fontSize: "14px",
                      margin: "10px 0",
                    }}
                  >
                    {eventDetails.eventDays[selectedDayIndex].description}
                  </span>
                </div>

                <div className="location py-2">
                  <h3>{i18n.language === "en" ? "Location" : "الموقع"}</h3>
                  <p style={{ fontSize: "14px", color: "#747688" }}>
                    {eventDetails.eventDays[selectedDayIndex].address}
                  </p>

                  <a
                    href={
                      eventDetails.eventDays[selectedDayIndex].addressGPSLink
                    }
                    target="blank"
                  >
                    {" "}
                    <img
                      src={map}
                      alt="map"
                      height={"220px"}
                      width={"100%"}
                      className="rounded"
                    />
                  </a>
                </div>
              </div>

              <div
                className="speakers rounded py-3 px-2 w-25"
                style={{ backgroundColor: "#F5F7FB", height: "50%" }}
              >
                <div>
                  <h5 className="text-left">
                    {i18n.language === "en" ? "Speakers" : "المتحدثين"}
                  </h5>
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {eventDetails.eventDays.map((d) =>
                      d.eventDaySpeakers.map((s) => {
                        // console.log(s.speaker.displayProfileImage);
                        const speakerKey = `${s.speaker.id}`;
                        if (!uniqueSpeakers[speakerKey]) {
                          uniqueSpeakers[speakerKey] = true; // Mark the speaker as encountered
                          return (
                            <Link
                              to={`/home/speakerProfile/${eventId}/${s.eventDayId}/${s.speakerId}`}
                              key={s.id}
                            >
                              {s.speaker.displayProfileImage ? (
                                <img
                                  src={
                                    isValidImageUrl(
                                      s.speaker.displayProfileImage
                                    )
                                      ? s.speaker.displayProfileImage
                                      : ExMark
                                  }
                                  alt="speakerImg"
                                  className="rounded-circle mb-2"
                                  width={"65px"}
                                  height={"65px"}
                                />
                              ) : (
                                <div
                                  className="rounded-circle mb-2"
                                  style={{
                                    width: "65px",
                                    height: "65px",
                                    background: "lightgray",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <span className="text-dark">
                                    {s.speaker.name.substring(0, 2)}
                                  </span>
                                </div>
                              )}
                              <p className="text-dark text-center">
                                {s.speaker.name}
                              </p>
                            </Link>
                          );
                        }
                        return null; // Skip rendering the speaker if they are not unique
                      })
                    )}
                  </div>
                </div>
                {/* /////////////////////////////////////////// */}

                {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                  <div
                    style={{
                      borderTop: "1px solid #DCDCDC",
                      paddingTop: "10px",
                    }}
                  >
                    <h5 className="text-left">
                      {i18n.language === "en" ? "Sessions" : "الجلسات"}
                    </h5>
                    <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                      <Link
                        className="w-100 text-dark"
                        to={`/home/session/${eventId}/${eventDetails.eventDays[selectedDayIndex].id}`}
                      >
                        <div className="session-item bg-white rounded p-2 d-flex align-items-center gap-3">
                          <div className="video-icon">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.07 19.8201C18.88 19.8201 18.69 19.7501 18.54 19.6001C18.25 19.3101 18.25 18.8301 18.54 18.5401C22.15 14.9301 22.15 9.06012 18.54 5.46012C18.25 5.17012 18.25 4.69012 18.54 4.40012C18.83 4.11012 19.31 4.11012 19.6 4.40012C23.79 8.59012 23.79 15.4101 19.6 19.6001C19.45 19.7501 19.26 19.8201 19.07 19.8201Z"
                                fill="#9DB2CE"
                              />
                              <path
                                d="M4.93007 19.8201C4.74007 19.8201 4.55007 19.7501 4.40007 19.6001C0.210068 15.4101 0.210068 8.59012 4.40007 4.40012C4.69007 4.11012 5.17007 4.11012 5.46007 4.40012C5.75007 4.69012 5.75007 5.17012 5.46007 5.46012C1.85007 9.07012 1.85007 14.9401 5.46007 18.5401C5.75007 18.8301 5.75007 19.3101 5.46007 19.6001C5.31007 19.7501 5.12007 19.8201 4.93007 19.8201Z"
                                fill="#9DB2CE"
                              />
                              <path
                                d="M12 22.71C10.75 22.7 9.56 22.5 8.45 22.11C8.06 21.97 7.85 21.54 7.99 21.15C8.13 20.76 8.55 20.55 8.95 20.69C9.91 21.02 10.93 21.2 12.01 21.2C13.08 21.2 14.11 21.02 15.06 20.69C15.45 20.56 15.88 20.76 16.02 21.15C16.16 21.54 15.95 21.97 15.56 22.11C14.44 22.5 13.25 22.71 12 22.71Z"
                                fill="#9DB2CE"
                              />
                              <path
                                d="M15.3 3.34004C15.22 3.34004 15.13 3.33004 15.05 3.30004C14.1 2.96004 13.07 2.79004 12 2.79004C10.93 2.79004 9.91 2.97004 8.95 3.30004C8.55 3.43004 8.13 3.23004 7.99 2.84004C7.85 2.45004 8.06 2.02004 8.45 1.88004C9.57 1.49004 10.76 1.29004 12 1.29004C13.24 1.29004 14.44 1.49004 15.55 1.88004C15.94 2.02004 16.15 2.45004 16.01 2.84004C15.9 3.15004 15.61 3.34004 15.3 3.34004Z"
                                fill="#9DB2CE"
                              />
                              <path
                                d="M8.73999 11.9999V10.3299C8.73999 8.2499 10.21 7.3999 12.01 8.4399L13.46 9.2799L14.91 10.1199C16.71 11.1599 16.71 12.8599 14.91 13.8999L13.46 14.7399L12.01 15.5799C10.21 16.6199 8.73999 15.7699 8.73999 13.6899V11.9999Z"
                                fill="#9DB2CE"
                              />
                            </svg>
                          </div>
                          <h4 className="m-0">Session Video</h4>
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
