import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
import { useParams } from "react-router-dom";
import ExMark from "../../../assets/Exclamation_mark.png";
import { PulseLoader } from "react-spinners";
// Translation Work
import { useTranslation } from "react-i18next";
import "./SpeakerProfile.scss";

export default function SpeakerProfile() {
  const { i18n } = useTranslation();
  const { eventId, eventDayId, speakerId } = useParams();
  // console.log(typeof (speakerId));

  const [eventDays, setEventDays] = useState(null);
  const [eventDay, setEventDay] = useState(null);
  const [speakerObj, setSpeakerObj] = useState(null);

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = jwtDecode(token);

  const [loading, setLoading] = useState(true); // Add loading state

  // Get event details
  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetForApp/${eventId}`, {
        params: {
          id: eventId,
        },
        headers: {
          UserId: decodedToken.uid,
          Authorization: `Bearer ${token}`,
          language: i18n.language,
        },
      })
      .then((response) => {
        setEventDays(response.data.responseObject.eventDays);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      })
      .finally(() => setLoading(false)); // Set loading to false when the data is fetched
  }, [eventId, decodedToken.uid, token, i18n.language]);

  // Event Day ID
  useEffect(() => {
    if (eventDays) {
      const selectedEventDay = eventDays.find(
        (d) => d.id === parseInt(eventDayId)
      );
      setEventDay(selectedEventDay);
    }
  }, [eventDays, eventDayId]);

  // Speaker ID
  useEffect(() => {
    if (eventDay) {
      const selectedSpeaker = eventDay.eventDaySpeakers.find(
        (s) => s.speakerId === speakerId
      );
      setSpeakerObj(selectedSpeaker.speaker);
    }
  }, [eventDay, speakerId]);
  console.log(speakerObj);

  // Calculate age
  const [age, setAge] = useState(null);
  function calculateAge(birthDateString) {
    // Handle the case where birthDateString is null
    if (!birthDateString) {
      return null;
    }

    // Handle the case where birthDateString is not a valid date string
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) {
      return null;
    }

    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    // If the current month is less than the birth month,
    // or if it's the same month but the current day is less than the birth day,
    // the age should be decreased by 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  useEffect(() => {
    if (speakerObj && speakerObj.dateOfBirth) {
      const age = calculateAge(speakerObj.dateOfBirth);
      setAge(age);
    } else {
      setAge(null);
    }
  }, [speakerObj]);

  const downloadCV = () => {
    window.open(speakerObj.displayCvURL, "_blank");
  };
  const [showAlert, setShowAlert] = useState(false);
  const handleClick = () => {
    if (speakerObj.displayCvURL) {
      downloadCV();
    } else {
      setShowAlert(true);
    }
  };
  const isValidImageUrl = (url) => {
    return (
      url &&
      !url.toLowerCase().endsWith("/null") &&
      url.toLowerCase().startsWith("http" || "https")
    );
  };

  if (loading) {
    // Render loading spinner while loading is true
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{
          height: "100vh",
          position: "realative",
        }}
      >
        <PulseLoader
          color="#3296d4"
          size={50}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      </div>
    );
  }

  return (
    <>
      {speakerObj && (
        <div className="profile-cards">
          <div className="card card-1">
            {speakerObj.displayProfileImage ? (
              <img
                src={
                  isValidImageUrl(speakerObj.displayProfileImage)
                    ? speakerObj.displayProfileImage
                    : ExMark
                }
                className="card-image"
                alt="speakerImg"
              />
            ) : (
              <div
                className="rounded-circle mb-2"
                style={{
                  width: "140px",
                  height: "140px",
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: " 0 auto",
                }}
              >
                <span className="text-dark fs-1 fw-bold">
                  {speakerObj.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="card-description">
              <h2 className="card-description-title">{speakerObj.name}</h2>

              <span className="card-description-profession">
                {speakerObj.email}
              </span>

              <div>
                <h4 className="fw-bold ">
                  {i18n.language === "en" ? "About" : "نبذة عنه"}
                </h4>
                <p
                  className="m-auto m-md-0"
                  style={{ color: "#747688", fontSize: "14px", width: "90%" }}
                >
                  {speakerObj.bio}
                </p>
              </div>

              <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="10"
                      fill="#3296D4"
                      fillOpacity="0.1"
                    />
                    <path
                      d="M9.2251 7V17"
                      stroke="#3296D4"
                      strokeWidth="0.75"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.4751 8L13.5251 9.75C15.1751 10.45 15.1751 11.65 13.6251 12.45L9.4751 14.5"
                      stroke="#3296D4"
                      strokeWidth="0.75"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="px-1 fw-bold" style={{ color: "#3296D4" }}>
                    {speakerObj.expYears ? speakerObj.expYears : "-"}
                  </span>
                  <p className="py-2" style={{ color: "#747688" }}>
                    {i18n.language === "en" ? "Experience" : "الخبرة"}
                  </p>
                </div>

                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="10"
                      fill="#3296D4"
                      fillOpacity="0.1"
                    />
                    <path
                      d="M17.1858 12.5833V13.1666H16.6783C16.2466 13.1666 15.8966 13.5166 15.8966 13.9541V14.1291C15.8966 14.5666 15.5466 14.9166 15.1091 14.9166C14.6774 14.9166 14.3274 14.5666 14.3274 14.1291V13.9541C14.3274 13.5166 13.9716 13.1666 13.5399 13.1666C13.1083 13.1666 12.7583 13.5166 12.7583 13.9541V14.1291C12.7583 14.5666 12.4024 14.9166 11.9708 14.9166C11.5391 14.9166 11.1833 14.5666 11.1833 14.1291V13.9541C11.1833 13.5166 10.8333 13.1666 10.4016 13.1666C9.96992 13.1666 9.61409 13.5166 9.61409 13.9541V14.1291C9.61409 14.5666 9.26409 14.9166 8.83242 14.9166C8.39492 14.9166 8.04492 14.5666 8.04492 14.1291V13.9424C8.04492 13.5108 7.70075 13.1608 7.27492 13.1549H6.81409V12.5833C6.81409 11.7783 7.42075 11.0958 8.24325 10.8974C8.40659 10.8566 8.57575 10.8333 8.75659 10.8333H15.2433C15.4241 10.8333 15.5933 10.8566 15.7566 10.8974C16.5791 11.0958 17.1858 11.7783 17.1858 12.5833Z"
                      fill="#3296D4"
                    />
                    <path
                      d="M15.7567 9.18258V10.0051C15.5875 9.97008 15.4183 9.95841 15.2433 9.95841H8.75668C8.58168 9.95841 8.41251 9.97591 8.24335 10.0109V9.18258C8.24335 8.48258 8.87335 7.91675 9.65501 7.91675H14.345C15.1267 7.91675 15.7567 8.48258 15.7567 9.18258Z"
                      fill="#3296D4"
                    />
                    <path
                      d="M10.1042 7.07082V7.92248H9.65502C9.50335 7.92248 9.36335 7.93998 9.22919 7.97498V7.07082C9.22919 6.86665 9.42752 6.69165 9.66669 6.69165C9.90585 6.69165 10.1042 6.86665 10.1042 7.07082Z"
                      fill="#3296D4"
                    />
                    <path
                      d="M14.7708 6.94263V7.97513C14.6366 7.93429 14.4966 7.91679 14.345 7.91679H13.8958V6.94263C13.8958 6.70346 14.0941 6.50513 14.3333 6.50513C14.5725 6.50513 14.7708 6.70346 14.7708 6.94263Z"
                      fill="#3296D4"
                    />
                    <path
                      d="M12.4375 6.64508V7.91675H11.5625V6.64508C11.5625 6.38258 11.7608 6.16675 12 6.16675C12.2392 6.16675 12.4375 6.38258 12.4375 6.64508Z"
                      fill="#3296D4"
                    />
                    <path
                      d="M17.8334 17.3959C17.8334 17.635 17.635 17.8334 17.3959 17.8334H6.60419C6.36502 17.8334 6.16669 17.635 6.16669 17.3959C6.16669 17.1567 6.36502 16.9584 6.60419 16.9584H6.81419V14.03H7.17002V14.0709C7.17002 14.8525 7.68335 15.5759 8.44752 15.745C9.04252 15.885 9.60835 15.6925 9.99335 15.3134C10.215 15.0917 10.5767 15.0859 10.7984 15.3075C11.1017 15.605 11.5159 15.7917 11.9709 15.7917C12.4259 15.7917 12.84 15.6109 13.1434 15.3075C13.365 15.0917 13.7209 15.0917 13.9484 15.3134C14.3275 15.6925 14.8934 15.885 15.4942 15.745C16.2584 15.5759 16.7717 14.8525 16.7717 14.0709V14.0417H17.1859V16.9584H17.3959C17.635 16.9584 17.8334 17.1567 17.8334 17.3959Z"
                      fill="#3296D4"
                    />
                  </svg>

                  <span className="px-1 fw-bold" style={{ color: "#3296D4" }}>
                    {age} {""}
                    {i18n.language === "en" ? "years old" : "سنة"}
                  </span>
                  <p className="py-2" style={{ color: "#747688" }}>
                    {i18n.language === "en" ? "Age" : "العمر"}
                  </p>
                </div>

                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="10"
                      fill="#3296D4"
                      fillOpacity="0.1"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.825 15.5524C9.51542 15.5524 8.45 14.487 8.45 13.1774C8.45 11.8678 9.51542 10.8024 10.825 10.8024C12.1346 10.8024 13.2 11.8678 13.2 13.1774C13.2 14.487 12.1346 15.5524 10.825 15.5524ZM13.2 7V7.95H15.3784L12.8133 10.5159C12.2585 10.1003 11.5717 9.85191 10.825 9.85191C8.98865 9.85191 7.5 11.3406 7.5 13.1769C7.5 15.0133 8.98865 16.5024 10.825 16.5024C12.6613 16.5024 14.15 15.0137 14.15 13.1774C14.15 12.4307 13.9006 11.7438 13.4855 11.1885L16.05 8.624V10.8H17V7H13.2Z"
                      fill="#3296D4"
                    />
                  </svg>

                  <span className="px-1 fw-bold" style={{ color: "#3296D4" }}>
                    {speakerObj.gender?.name}
                  </span>
                  <p className="py-2" style={{ color: "#747688" }}>
                    {i18n.language === "en" ? "Gender" : "النوع"}
                  </p>
                </div>
              </div>
              <div>
                {showAlert && (
                  <div
                    className="alert alert-danger w-50 fw-bold position-absolute d-flex justify-content-between align-items-center"
                    style={{ right: "12%" }}
                    role="alert"
                  >
                    {i18n.language === "en"
                      ? "There Is No CV For This Speaker Yet"
                      : "لا يوجد سيرة ذاتية لهذا المتحدث حتى الآن"}

                    <i
                      className="bi bi-x close fw-bold fs-4"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowAlert(false)}
                    ></i>
                  </div>
                )}
                <button
                  className="border-0 p-2 px-3 text-white "
                  style={{
                    backgroundColor: "#3296D4",
                    borderRadius: "12px",
                  }}
                  onClick={handleClick}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 11V17L11 15"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 17L7 15"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  {i18n.language === "en" ? "Show CV" : "عرض السيرة الذاتية"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
