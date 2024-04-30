import { useRef, useState, useEffect } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import notFound from "../../../assets/notfound.jpg";

export default function Session() {
  const cookie = new Cookie();
  const [userId, setUserId] = useState(null);
  const { eventId, eventDayId } = useParams();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  const [eventDays, setEventDays] = useState([]);
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = cookie.get("edu-caring");
    const decodedToken = token ? jwtDecode(token) : {};
    setUserId(decodedToken.uid);
    if (decodedToken.uid) {
      axios
        .get(`${BASE}/Event/GetForApp/${eventId}`, {
          headers: {
            UserId: userId,
            Language: i18n.language,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEventDays(response.data.responseObject?.eventDays);
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
        })
        .finally(() => setLoading(false)); // Set loading to false when the data is fetched
    }
  }, [eventId, userId, i18n.language, decodedToken.uid, token, setUserId, i18n, cookie, setLoading]);

  const [videoUrl, setVideoUrl] = useState("");
  const [resources, setResources] = useState([]);

  const selectedEventDay = eventDays?.find(
    (day) => day.id === parseInt(eventDayId)
  );

  // console.log(eventDays);

  console.log(selectedEventDay);

  useEffect(() => {
    if (selectedEventDay && userId) {
      setVideoUrl(selectedEventDay.displayLinkUploadedVideo);
    } else {
      setVideoUrl(""); // Set video URL to empty string if no matching event day is found
    }
  }, [eventDays, eventDayId, selectedEventDay]);

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetEventResoresesForUser`, {
        params: {
          eventDayId: eventDayId,
        },
        headers: {
          UserId: userId,
          Language: i18n.language,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setResources(response.data.responseObject);
      });
  }, [eventDayId, userId, i18n.language, decodedToken.uid, token]);

  const [files, setFiles] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const files = [];
    const imgs = [];
    const links = [];

    resources?.forEach((eventDaySpeakerResorses) => {
      eventDaySpeakerResorses.eventDaySpeakerResorses?.forEach((resource) => {
        const { resorsesURL, link } = resource;

        // Check if resource is a file or an image
        if (resorsesURL) {
          const extension = resorsesURL.split(".").pop().toLowerCase();
          if (extension.match(/(jpg|jpeg|png|gif)$/)) {
            imgs.push(resorsesURL);
          } else {
            files.push(resorsesURL);
          }
        }

        // Check if link exists and is not null
        if (link && link !== "null") {
          links.push(link);
        }
      });
    });

    setFiles(files);
    setImgs(imgs);
    setLinks(links);
  }, [resources]);

  // console.log(files);
  // console.log(imgs);
  // console.log(links);

  console.log(resources);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBackward = () => {
    const video = videoRef.current;
    video.currentTime -= 5;
  };

  const handleForward = () => {
    const video = videoRef.current;
    video.currentTime += 5;
  };

  const [selectedOption, setSelectedOption] = useState("files");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.6461 20.4275H18.8905V26.1008H19.6278C19.7205 26.1024 19.8125 26.0842 19.8976 26.0474C19.9827 26.0106 20.059 25.9561 20.1214 25.8875C20.1858 25.8226 20.2367 25.7455 20.2712 25.6608C20.3057 25.5761 20.3231 25.4854 20.3225 25.3939V21.1283C20.3238 21.0353 20.3062 20.943 20.2705 20.8571C20.2349 20.7711 20.1821 20.6934 20.1153 20.6286C20.0542 20.5658 19.9813 20.5157 19.9008 20.4812C19.8203 20.4467 19.7337 20.4285 19.6461 20.4275ZM15.3073 22.8285C15.3738 22.7635 15.4265 22.6857 15.4621 22.5998C15.4977 22.5139 15.5155 22.4217 15.5145 22.3288V21.11C15.5189 21.0164 15.5044 20.9229 15.4719 20.835C15.4395 20.747 15.3897 20.6665 15.3256 20.5982C15.2584 20.5321 15.1782 20.4806 15.0901 20.4471C15.002 20.4135 14.9079 20.3985 14.8137 20.4032H14.0703V23.0357H14.8077C14.9008 23.0377 14.9933 23.0204 15.0793 22.9847C15.1654 22.949 15.243 22.8958 15.3073 22.8285Z"
            fill="#C32B43"
          />
          <path
            d="M33.5156 16.4531H32.9062V9.14062C32.9062 9.14062 32.9062 9.14062 32.9062 9.10406C32.9032 9.05013 32.8929 8.99685 32.8758 8.94563V8.89078C32.8478 8.82558 32.8086 8.76578 32.76 8.71406L25.4475 1.40156C25.3958 1.35297 25.336 1.31379 25.2708 1.28578H25.2159C25.1552 1.25252 25.0893 1.22985 25.0209 1.21875H6.70312C6.54151 1.21875 6.38651 1.28295 6.27223 1.39723C6.15795 1.51151 6.09375 1.66651 6.09375 1.82812V16.4531H5.48438C5.32276 16.4531 5.16776 16.5173 5.05348 16.6316C4.9392 16.7459 4.875 16.9009 4.875 17.0625V29.25C4.875 29.4116 4.9392 29.5666 5.05348 29.6809C5.16776 29.7952 5.32276 29.8594 5.48438 29.8594H6.09375V37.1719C6.09375 37.3335 6.15795 37.4885 6.27223 37.6028C6.38651 37.717 6.54151 37.7812 6.70312 37.7812H32.2969C32.4585 37.7812 32.6135 37.717 32.7278 37.6028C32.842 37.4885 32.9062 37.3335 32.9062 37.1719V29.8594H33.5156C33.6772 29.8594 33.8322 29.7952 33.9465 29.6809C34.0608 29.5666 34.125 29.4116 34.125 29.25V17.0625C34.125 16.9009 34.0608 16.7459 33.9465 16.6316C33.8322 16.5173 33.6772 16.4531 33.5156 16.4531ZM25.5938 3.29672L30.8283 8.53125H25.5938V3.29672ZM31.6875 36.5625H7.3125V29.8594H31.6875V36.5625ZM12.8395 27.3122V19.177H14.7712C15.0355 19.1653 15.2992 19.2098 15.545 19.3075C15.7908 19.4052 16.0131 19.5539 16.1972 19.7438C16.5331 20.122 16.7099 20.6154 16.6908 21.1209V22.3031C16.695 22.5586 16.6475 22.8123 16.5512 23.049C16.4548 23.2857 16.3116 23.5004 16.1302 23.6803C15.9558 23.8649 15.745 24.0112 15.511 24.1098C15.2771 24.2084 15.0251 24.2572 14.7712 24.2531H14.0705V27.3L12.8395 27.3122ZM17.678 27.3122V19.1709H19.6036C19.8585 19.166 20.1116 19.2144 20.3467 19.313C20.5817 19.4116 20.7936 19.5584 20.9686 19.7438C21.1499 19.9225 21.293 20.1362 21.3894 20.3719C21.4858 20.6075 21.5333 20.8603 21.5292 21.1148V25.3805C21.533 25.6364 21.4847 25.8905 21.3873 26.1273C21.2899 26.364 21.1454 26.5785 20.9625 26.7577C20.7875 26.943 20.5756 27.0898 20.3406 27.1884C20.1055 27.2871 19.8524 27.3354 19.5975 27.3305L17.678 27.3122ZM25.4963 22.6261V23.8448H23.8387V27.3H22.62V19.1709H26.1117V20.3897H23.8387V22.6078L25.4963 22.6261ZM31.6875 16.4531H7.3125V2.4375H24.375V9.14062C24.375 9.30224 24.4392 9.45724 24.5535 9.57152C24.6678 9.6858 24.8228 9.75 24.9844 9.75H31.6875V16.4531Z"
            fill="#C32B43"
          />
        </svg>
      );
    } else if (extension === "doc" || extension === "docx") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="39"
          height="39"
          viewBox="0 0 48 48"
        >
          <linearGradient
            id="Q7XamDf1hnh~bz~vAO7C6a_pGHcje298xSl_gr1"
            x1="28"
            x2="28"
            y1="14.966"
            y2="6.45"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#42a3f2"></stop>
            <stop offset="1" stopColor="#42a4eb"></stop>
          </linearGradient>
          <path
            fill="url(#Q7XamDf1hnh~bz~vAO7C6a_pGHcje298xSl_gr1)"
            d="M42,6H14c-1.105,0-2,0.895-2,2v7.003h32V8C44,6.895,43.105,6,42,6z"
          ></path>
          <linearGradient
            id="Q7XamDf1hnh~bz~vAO7C6b_pGHcje298xSl_gr2"
            x1="28"
            x2="28"
            y1="42"
            y2="33.054"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#11408a"></stop>
            <stop offset="1" stopColor="#103f8f"></stop>
          </linearGradient>
          <path
            fill="url(#Q7XamDf1hnh~bz~vAO7C6b_pGHcje298xSl_gr2)"
            d="M12,33.054V40c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2v-6.946H12z"
          ></path>
          <linearGradient
            id="Q7XamDf1hnh~bz~vAO7C6c_pGHcje298xSl_gr3"
            x1="28"
            x2="28"
            y1="-15.46"
            y2="-15.521"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#3079d6"></stop>
            <stop offset="1" stopColor="#297cd2"></stop>
          </linearGradient>
          <path
            fill="url(#Q7XamDf1hnh~bz~vAO7C6c_pGHcje298xSl_gr3)"
            d="M12,15.003h32v9.002H12V15.003z"
          ></path>
          <linearGradient
            id="Q7XamDf1hnh~bz~vAO7C6d_pGHcje298xSl_gr4"
            x1="12"
            x2="44"
            y1="28.53"
            y2="28.53"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#1d59b3"></stop>
            <stop offset="1" stopColor="#195bbc"></stop>
          </linearGradient>
          <path
            fill="url(#Q7XamDf1hnh~bz~vAO7C6d_pGHcje298xSl_gr4)"
            d="M12,24.005h32v9.05H12V24.005z"
          ></path>
          <path
            d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z"
            opacity=".05"
          ></path>
          <path
            d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z"
            opacity=".07"
          ></path>
          <path
            d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z"
            opacity=".09"
          ></path>
          <linearGradient
            id="Q7XamDf1hnh~bz~vAO7C6e_pGHcje298xSl_gr5"
            x1="4.744"
            x2="23.494"
            y1="14.744"
            y2="33.493"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#256ac2"></stop>
            <stop offset="1" stopColor="#1247ad"></stop>
          </linearGradient>
          <path
            fill="url(#Q7XamDf1hnh~bz~vAO7C6e_pGHcje298xSl_gr5)"
            d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"
          ></path>
          <path
            fill="#fff"
            d="M18.403,19l-1.546,7.264L15.144,19h-2.187l-1.767,7.489L9.597,19H7.641l2.344,10h2.352l1.713-7.689	L15.764,29h2.251l2.344-10H18.403z"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="39"
          height="39"
          viewBox="0,0,256,256"
        >
          <g
            fill="none"
            fillRule="nonzero"
            stroke="none"
            strokeWidth="1"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
            strokeDasharray=""
            strokeDashoffset="0"
            fontFamily="none"
            fontWeight="none"
            fontSize="none"
            textAnchor="none"
            style={{ mixBlendMode: "normal" }}
          >
            <g transform="scale(5.33333,5.33333)">
              <path d="M40,45h-32v-42h22l10,10z" fill="#008dff"></path>
              <path d="M38.5,14h-9.5v-9.5z" fill="#e1f5fe"></path>
            </g>
          </g>
        </svg>
      );
    }
  };

  if (loading && !videoUrl && !files.length && !imgs.length && !links.length) {
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
      <div className="p-4 d-flex gap-3 flex-column flex-md-row align-items-center align-items-md-start">
        <div className=" col-12 col-md-8">
          {videoUrl ? (
            <div
              className="position-relative over-flow-hidden"
              style={{ height: "60vh", borderRadius: "10px" }}
            >
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <video
                id="video"
                ref={videoRef}
                preload=""
                className=" w-100  rounded"
                src={videoUrl}
                style={{ height: "100%", objectFit: "cover" }}
              >
                Your browser does not support the video tag.
              </video>
              <div
                className="position-absolute top-50 start-50 d-flex gap-3"
                style={{ transform: "translate(-50%,-50%)" }}
              >
                <button
                  onClick={handleBackward}
                  className="bg-transparent border-0"
                >
                  <svg
                    width="33"
                    height="34"
                    viewBox="0 0 33 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.9">
                      <path
                        d="M16.25 7.66481V3.88668C16.25 3.27731 15.5188 2.97939 15.099 3.41272L9.95314 8.54501C9.68231 8.81585 9.68231 9.23564 9.95314 9.50647L15.0854 14.6388C15.5188 15.0586 16.25 14.7606 16.25 14.1513V10.3731C21.3011 10.3731 25.2959 15.0044 24.1854 20.245C23.549 23.3054 21.2875 25.6481 18.2406 26.3794C13.3115 27.5711 8.85627 24.2127 8.19273 19.6627C8.11148 18.9992 7.54273 18.4981 6.87918 18.4981C6.06668 18.4981 5.41668 19.2158 5.52502 20.0283C6.37814 26.0815 12.2146 30.5231 18.7552 29.0606C22.9396 28.1263 26.0542 24.8898 26.8667 20.6783C28.2208 13.7315 22.9396 7.66481 16.25 7.66481ZM14.4761 19.7169L14.8146 16.7783H18.0511V17.7398H15.749L15.6 18.9856C15.6406 18.9586 15.6948 18.945 15.749 18.9179C15.8031 18.8908 15.8709 18.8638 15.9521 18.8502C16.0333 18.8367 16.1146 18.8096 16.1959 18.7961C16.2771 18.7825 16.3719 18.769 16.4667 18.769C16.7511 18.769 16.9948 18.8096 17.2115 18.9044C17.4281 18.9992 17.6177 19.1211 17.7667 19.2836C17.9156 19.4461 18.0375 19.6492 18.1052 19.8929C18.1729 20.1367 18.2271 20.4075 18.2271 20.7054C18.2271 20.9627 18.1865 21.2065 18.1052 21.4367C18.024 21.6669 17.9021 21.87 17.7396 22.0461C17.5771 22.2221 17.374 22.3711 17.1302 22.4658C16.8865 22.5606 16.6021 22.6283 16.2636 22.6283C16.0198 22.6283 15.7761 22.5877 15.5458 22.52C15.3156 22.4523 15.1125 22.3304 14.9229 22.195C14.7334 22.0596 14.5979 21.87 14.4896 21.6669C14.3813 21.4638 14.3136 21.22 14.3136 20.9492H15.4511C15.4781 21.1929 15.5594 21.3825 15.7084 21.5044C15.8573 21.6263 16.0469 21.7075 16.2771 21.7075C16.4261 21.7075 16.5479 21.6804 16.6427 21.6263C16.7375 21.5721 16.8323 21.4908 16.8865 21.3961C16.9406 21.3013 16.9948 21.1929 17.0354 21.0575C17.0761 20.9221 17.0761 20.7867 17.0761 20.6377C17.0761 20.4888 17.0625 20.3533 17.0219 20.2179C16.9813 20.0825 16.9271 19.9877 16.8458 19.8929C16.7646 19.7981 16.6698 19.7304 16.5615 19.6898C16.4531 19.6492 16.3042 19.6221 16.1552 19.6221C16.0469 19.6221 15.9521 19.6356 15.8844 19.6492C15.8167 19.6627 15.7354 19.6898 15.6813 19.7169C15.6271 19.744 15.5729 19.7846 15.5188 19.8117C15.4646 19.8388 15.424 19.8929 15.3834 19.9336L14.4761 19.7169Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </button>
                <button
                  onClick={handleTogglePlay}
                  className="bg-transparent border-0"
                >
                  {isPlaying ? (
                    <svg
                      width="66"
                      height="65"
                      viewBox="0 0 66 65"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M33.2189 8.125C20.1258 8.125 9.521 18.7298 9.521 31.8229C9.521 44.916 20.1258 55.5208 33.2189 55.5208C46.312 55.5208 56.9168 44.916 56.9168 31.8229C56.9168 18.7298 46.312 8.125 33.2189 8.125ZM30.8491 41.3021H26.1095V22.3438H30.8491V41.3021ZM40.3283 41.3021H35.5887V22.3438H40.3283V41.3021Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48"
                      width="48"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#ffffff"
                        d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleForward}
                  className="bg-transparent border-0"
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.9">
                      <path
                        d="M26.136 18.4974C25.4589 18.4974 24.9037 18.9984 24.8089 19.662C24.1589 24.2255 19.7037 27.5703 14.761 26.3786C11.7141 25.6474 9.4662 23.3047 8.8162 20.2443C7.71932 15.0036 11.7141 10.3724 16.7652 10.3724V14.1505C16.7652 14.7599 17.4964 15.0578 17.9162 14.6245L23.0485 9.49219C23.3193 9.22136 23.3193 8.80156 23.0485 8.53073L17.9162 3.39844C17.4964 2.97865 16.7652 3.27656 16.7652 3.8724V7.66406C10.0756 7.66406 4.79432 13.7307 6.14849 20.6641C6.96099 24.8755 10.0756 28.112 14.2599 29.0464C20.8006 30.5089 26.6506 26.0672 27.4902 20.0141C27.612 19.2151 26.9485 18.4974 26.136 18.4974ZM17.4152 21.4089C17.3475 21.5036 17.2662 21.5849 17.1714 21.6391C17.0766 21.6932 16.9412 21.7203 16.8058 21.7203C16.5756 21.7203 16.386 21.6526 16.237 21.5172C16.0881 21.3818 16.0068 21.1922 15.9797 20.962H14.8422C14.8558 21.2328 14.9099 21.463 15.0183 21.6797C15.1266 21.8964 15.2756 22.0589 15.4516 22.2078C15.6277 22.3568 15.8443 22.4651 16.0745 22.5328C16.3047 22.6005 16.5485 22.6411 16.7922 22.6411C17.1172 22.6411 17.4152 22.587 17.6589 22.4786C17.9027 22.3703 18.1058 22.2349 18.2683 22.0589C18.4308 21.8828 18.5527 21.6797 18.6339 21.4495C18.7152 21.2193 18.7558 20.9755 18.7558 20.7182C18.7558 20.4203 18.7152 20.1359 18.6339 19.9057C18.5527 19.6755 18.4443 19.4589 18.2954 19.2964C18.1464 19.1339 17.9568 18.9984 17.7402 18.9172C17.5235 18.8359 17.2797 18.7818 16.9954 18.7818C16.9006 18.7818 16.8058 18.7953 16.7245 18.8089C16.6433 18.8224 16.5485 18.8359 16.4808 18.863C16.4131 18.8901 16.3454 18.9036 16.2777 18.9307C16.2099 18.9578 16.1693 18.9849 16.1287 18.9984L16.2777 17.7526H18.5797V16.7911H15.3433L15.0047 19.7297L15.912 19.9599C15.9527 19.9193 15.9933 19.8786 16.0474 19.838C16.1016 19.7974 16.1422 19.7703 16.2099 19.7432C16.2777 19.7161 16.3454 19.6891 16.4131 19.6755C16.4808 19.662 16.5891 19.6484 16.6839 19.6484C16.8464 19.6484 16.9818 19.6755 17.0902 19.7161C17.1985 19.7568 17.3068 19.838 17.3745 19.9193C17.4422 20.0005 17.5099 20.1089 17.5506 20.2443C17.5912 20.3797 17.6047 20.5016 17.6047 20.6641C17.6047 20.8266 17.5912 20.962 17.5641 21.0839C17.537 21.2057 17.4829 21.3141 17.4152 21.4089Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div
              className="position-relative over-flow-hidden"
              style={{ height: "60vh", borderRadius: "10px" }}
            >
              <img
                src={notFound}
                alt="notfound-img"
                width={"60%"}
                height={"100%"}
                className="d-block mx-auto my-5"
              />
            </div>
          )}

          <div className="text">
            <h3 className="text-dark my-3">{selectedEventDay?.name}</h3>
            <p className="text-secondary" style={{ fontSize: "14px" }}>
              {selectedEventDay?.description}
            </p>
          </div>
        </div>
        <div
          className="resources col-12 col-md-4 p-2 rounded overflow-hidden overflow-y-auto"
          style={{
            backgroundColor: "#F5F7FB",
            height: "70vh",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
          }}
        >
          <h3>{i18n.language === "en" ? "Resources" : "الموارد"}</h3>
          <div className="d-flex gap-3 border-bottom w-75">
            <button
              onClick={() => handleOptionChange("files")}
              className="bg-transparent"
              style={{
                color: selectedOption === "files" ? "#3296D4" : "#A5A5A5",
                border: 0,
                borderBottom:
                  selectedOption === "files" ? "2px solid #3296D4" : "none",
              }}
            >
              {i18n.language === "en" ? "Files" : "الملفات"}
            </button>
            <button
              onClick={() => handleOptionChange("images")}
              className="bg-transparent"
              style={{
                color: selectedOption === "images" ? "#3296D4" : "#A5A5A5",
                border: 0,
                borderBottom:
                  selectedOption === "images" ? "2px solid #3296D4" : "none",
              }}
            >
              {i18n.language === "en" ? "Images" : "الصور"}
            </button>
            <button
              onClick={() => handleOptionChange("links")}
              className="bg-transparent"
              style={{
                color: selectedOption === "links" ? "#3296D4" : "#A5A5A5",
                border: 0,
                borderBottom:
                  selectedOption === "links" ? "2px solid #3296D4" : "none",
              }}
            >
              {i18n.language === "en" ? "Links" : "الروابط"}
            </button>
          </div>
          <div className="my-2">
            {selectedOption === "files" &&
              files.map((file, index) => (
                <li
                  key={index}
                  className="my-2 d-flex gap-2 align-items-center p-2 border-bottom"
                >
                  {getFileIcon(file)}
                  <a
                    href={file}
                    className="text-dark fw-bold"
                    style={{ fontSize: "16px" }}
                    target="blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    {i18n.language === "en" ? "file" : "ملف"} {index + 1}
                  </a>
                </li>
              ))}
            {selectedOption === "images" && (
              <div className="row p-2 gap-3 my-2 justify-content-center">
                {imgs.map((img, index) => (
                  <div key={index} className="col-5">
                    <img
                      src={img}
                      alt={`Image ${index}`}
                      className="w-100 rounded"
                    />
                  </div>
                ))}
              </div>
            )}
            {selectedOption === "links" &&
              links.map((link, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: "#27AE601A" }}
                  className="d-flex rounded my-2 overflow-hidden"
                >
                  <div
                    style={{ backgroundColor: "#27AE60" }}
                    className="p-3 d-flex justify-content-cnter align-items-center"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_986_10122)">
                        <path
                          d="M9.65531 14.413L4.16816 14.413C3.5154 14.4014 2.89262 14.1369 2.43098 13.6753C1.96934 13.2136 1.70487 12.5909 1.69329 11.9381C1.69264 11.6129 1.75622 11.2908 1.88037 10.9903C2.00451 10.6897 2.18679 10.4166 2.41673 10.1867C2.64667 9.95674 2.91975 9.77446 3.22031 9.65032C3.52086 9.52617 3.84298 9.46259 4.16816 9.46323L9.65531 9.46323C9.92161 9.46323 10.177 9.35745 10.3653 9.16914C10.5536 8.98084 10.6594 8.72544 10.6594 8.45914C10.6594 8.19284 10.5536 7.93745 10.3653 7.74914C10.177 7.56084 9.92161 7.45505 9.65531 7.45505L4.16109 7.46212C3.00678 7.51102 1.91599 8.00397 1.11652 8.83803C0.31704 9.67209 -0.129305 10.7828 -0.129306 11.9381C-0.129306 13.0935 0.31704 14.2041 1.11652 15.0382C1.91599 15.8722 3.00678 16.3652 4.16109 16.4141L9.65531 16.4212C9.92161 16.4212 10.177 16.3154 10.3653 16.1271C10.5536 15.9388 10.6594 15.6834 10.6594 15.4171C10.6594 15.1508 10.5536 14.8954 10.3653 14.7071C10.177 14.5188 9.92161 14.413 9.65531 14.413ZM24.2641 11.9381C24.2604 10.7521 23.7877 9.6158 22.9491 8.77719C22.1105 7.93858 20.9741 7.46582 19.7881 7.46212L14.2939 7.45505C14.1621 7.45505 14.0315 7.48102 13.9097 7.53148C13.7879 7.58194 13.6772 7.6559 13.5839 7.74914C13.4907 7.84238 13.4167 7.95307 13.3663 8.07489C13.3158 8.19672 13.2898 8.32728 13.2898 8.45914C13.2898 8.591 13.3158 8.72157 13.3663 8.84339C13.4167 8.96521 13.4907 9.07591 13.5839 9.16914C13.6772 9.26238 13.7879 9.33634 13.9097 9.3868C14.0315 9.43726 14.1621 9.46323 14.2939 9.46323L19.7811 9.46324C20.4338 9.47482 21.0566 9.73929 21.5183 10.2009C21.9799 10.6626 22.2444 11.2854 22.256 11.9381C22.2566 12.2633 22.193 12.5854 22.0689 12.886C21.9447 13.1865 21.7625 13.4596 21.5325 13.6895C21.3026 13.9195 21.0295 14.1018 20.7289 14.2259C20.4284 14.35 20.1063 14.4136 19.7811 14.413L14.2939 14.413C14.1619 14.4124 14.0311 14.438 13.909 14.4883C13.787 14.5386 13.6761 14.6125 13.5827 14.7059C13.4894 14.7992 13.4154 14.9101 13.3652 15.0322C13.3149 15.1543 13.2893 15.2851 13.2898 15.4171C13.2893 15.5491 13.3149 15.6799 13.3652 15.802C13.4154 15.924 13.4894 16.0349 13.5827 16.1283C13.6761 16.2216 13.787 16.2956 13.909 16.3458C14.0311 16.3961 14.1619 16.4217 14.2939 16.4212L19.7881 16.4141C20.9741 16.4104 22.1105 15.9376 22.9491 15.099C23.7877 14.2604 24.2604 13.1241 24.2641 11.9381ZM7.49156 11.9381C7.4921 12.0697 7.51861 12.1999 7.56957 12.3213C7.62054 12.4426 7.69495 12.5527 7.78855 12.6452C7.88107 12.7388 7.99116 12.8132 8.1125 12.8642C8.23384 12.9152 8.36405 12.9417 8.49565 12.9422H15.4536C15.7199 12.9422 15.9753 12.8364 16.1636 12.6481C16.3519 12.4598 16.4577 12.2044 16.4577 11.9381C16.4577 11.6718 16.3519 11.4164 16.1636 11.2281C15.9753 11.0398 15.7199 10.934 15.4536 10.934L8.49565 10.934C8.36364 10.9335 8.23283 10.9591 8.11077 11.0093C7.9887 11.0596 7.87779 11.1336 7.78445 11.2269C7.6911 11.3202 7.61716 11.4312 7.56689 11.5532C7.51662 11.6753 7.49102 11.8061 7.49156 11.9381Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_986_10122">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div className="p-2">
                    <h5 className="m-0 fw-bold">
                      {i18n.language === "en" ? "Link" : "الرابط"} {index + 1}
                    </h5>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#747688",
                        fontSize: "14px",
                      }}
                    >
                      {link}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
