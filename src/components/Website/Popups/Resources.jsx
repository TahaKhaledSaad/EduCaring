import { useState, useEffect } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
// Translation Work
import { useTranslation } from "react-i18next";
import upload from "./../../../assets/image.png";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export let filesNumber = 0;
export let imgsNumber = 0;
export let linksNumber = 0;

export default function Resources({
  eventDayId,
  userId,
  addResourcesSpeaker,
  eventDaySpeakerId,
  sendId,
  speakerResourses,
  flag,
  setFlag,
}) {
  // [0] State Variables
  const { i18n } = useTranslation();
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  const [link, setLink] = useState("");
  // const [flag, setFlag] = useState(false);
  const [resources, setResources] = useState([]);

  // [13] Function to get resources of the user
  useEffect(() => {
    if (!addResourcesSpeaker) {
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
          setResources(response.data.responseObject);
        });
    }
  }, [eventDayId, userId, i18n.language, token]);

  // [6] File Icon
  const [files, setFiles] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [links, setLinks] = useState([]);

  // [7] Update Files, Images, and Links

  // filter resource url to Files, Images, and Links

  useEffect(() => {
    const files = [];
    const imgs = [];
    const links = [];

    if (addResourcesSpeaker) {
      speakerResourses.forEach((speakerResourse) => {
        const { resorsesURL, link } = speakerResourse;

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
    } else {
      resources.forEach((eventDaySpeakerResorses) => {
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
    }

    setFiles(files);
    setImgs(imgs);
    setLinks(links);
  }, [resources, speakerResourses, addResourcesSpeaker, flag]);

  // [8] Handle Option Change
  const [selectedOption, setSelectedOption] = useState("files");

  // [9] Handle Option Change
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // [10] Get File Icon
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

  // [11] Popup
  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // [12] Function to select files and send them to the server
  const sendLinks = () => {
    const object = {
      Id: eventDaySpeakerId, // 57
      EventDaySpeakerId: sendId, // 56
      SpeakerId: decodedToken.uid, // a1db4239-e0bf-4f99-a63a-28f87f495122
      Link: link, // constant
      Title: null, // constant
      ResoursesFile: null, // files
    };

    const formData = new FormData();

    formData.append("Id", object.Id);
    formData.append("EventDaySpeakerId", object.EventDaySpeakerId);
    formData.append("SpeakerId", object.SpeakerId);
    formData.append("Link", link);
    formData.append("Title", null);
    // formData.append("ResorsesFile", imgFormData);

    axios
      .post(`${BASE}/SpeakerResors/Multiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setFlag(!flag);
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
    // setFlag((prev) => !prev);
  };

  // [12] Function to select files and send them to the server
  const sendFiles = (e) => {
    const files = e.target.files;
    const arrOfImgs = [];
    // const imgFormData = new FormData();

    const object = {
      Id: eventDaySpeakerId, // 57
      EventDaySpeakerId: sendId, // 56
      SpeakerId: decodedToken.uid, // a1db4239-e0bf-4f99-a63a-28f87f495122
      Link: "https://www.youtube.com/", // constant
      Title: "Test", // constant
      ResoursesFile: arrOfImgs, // files
    };

    const formData = new FormData();

    formData.append("Id", object.Id);
    formData.append("EventDaySpeakerId", object.EventDaySpeakerId);
    formData.append("SpeakerId", object.SpeakerId);
    formData.append("Link", null);
    formData.append("Title", null);
    // formData.append("ResorsesFile", imgFormData);

    for (let i = 0; i < files.length; i++) {
      arrOfImgs.push(files[i]);
      formData.append("ResorsesFile", files[i]);
    }

    axios
      .post(`${BASE}/SpeakerResors/Multiple`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setFlag(!flag);
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  useEffect(() => {
    filesNumber = files.length;
    imgsNumber = imgs.length;
    linksNumber = links.length;
  }, [files, imgs, links, flag]);

  function deleteResource(url, type) {
    speakerResourses?.forEach((speakerResourse) => {
      if (type === "image" || type === "file") {
        if (speakerResourse.resorsesURL === url) {
          axios
            .delete(`${BASE}/SpeakerResors/${speakerResourse.id}`)
            .then((response) => {
              console.log(response);
              setFlag(!flag);
            });
        }
      } else if (type === "link") {
        if (speakerResourse.link === url) {
          axios
            .delete(`${BASE}/SpeakerResors/${speakerResourse.id}`)
            .then(() => {
              setFlag(!flag);
            });
        }
      }
    });
  }

  // Image Popup
  const [selectedImage, setSelectedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // function to open image popup
  const openPopup = (image) => {
    setSelectedImage(image);
    setPopupVisible(true);
  };

  // function to close image popup
  const closePopup = () => {
    setSelectedImage(null);
    setPopupVisible(false);
  };

  return (
    <>
      {decodedToken.roles.includes("User") && (
        <div
          className="p-1 text-center resources"
          style={{
            width: "100px",
            fontSize: "14px",
            border: "1px solid #BDBDBD",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={togglePopup}
        >
          <p className="m-0">
            {i18n.language === "en" ? "Resources" : "الموارد"}{" "}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 8.25V12.75C16.5 15.75 15.75 16.5 12.75 16.5H5.25C2.25 16.5 1.5 15.75 1.5 12.75V5.25C1.5 2.25 2.25 1.5 5.25 1.5H6.375C7.5 1.5 7.7475 1.83 8.175 2.4L9.3 3.9C9.585 4.275 9.75 4.5 10.5 4.5H12.75C15.75 4.5 16.5 5.25 16.5 8.25Z"
                stroke="#9DB2CE"
                strokeWidth="1.125"
                strokeMiterlimit="10"
              />
              <path
                d="M6 1.5H12.75C14.25 1.5 15 2.25 15 3.75V4.785"
                stroke="#9DB2CE"
                strokeWidth="1.125"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </div>
      )}

      {decodedToken.roles.includes("Speaker") && (
        <button
          className="btn btn-success py-2  w-100"
          style={{
            background:
              speakerResourses?.length > 0 ? "#27AE60" : "rgba(195, 43, 67, 1)",
            border: "none",
            outline: "none",
          }}
          onClick={togglePopup}
        >
          {i18n.language === "en" ? "Edit" : "تعديل"}
        </button>
      )}

      <div
        className=" w-50 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(300%, -50%)"
            : "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "10000",
          height: "80vh",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>{i18n.language === "en" ? "Resources" : "الموارد"}</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>

        <div className="py-2 px-3 ">
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

          <div className="my-2 overflow-y-auto overflow-x-hidden">
            {/* Upload Resources */}
            {addResourcesSpeaker &&
              (selectedOption === "files" || selectedOption === "images") && (
                <div className="input-group p-1">
                  <input
                    type="file"
                    className="form-control"
                    id="PassportImage"
                    hidden
                    multiple
                    onChange={sendFiles}
                  />
                  <label
                    className="input-group-box d-flex align-items-center justify-content-center border text-muted py-3 rounded  w-100"
                    htmlFor="PassportImage"
                  >
                    <img src={upload} alt="upload files" width="80px" />
                    <div>
                      <div className="text-center my-0">
                        {i18n.language === "en"
                          ? "Drag and Drop image"
                          : "سحب وإسقاط الصورة"}{" "}
                        <p className="text-info d-inline">
                          {i18n.language === "en" ? "here" : "هنا"}
                        </p>
                      </div>
                      <div className="text-center my-0">
                        {i18n.language === "en" ? "or" : "او"}{" "}
                        <p className="text-info d-inline text-decoration-down">
                          {i18n.language === "en" ? "upload" : "رفع"}
                        </p>{" "}
                        {i18n.language === "en" ? "image" : "صورة"}
                      </div>
                    </div>
                  </label>
                </div>
              )}

            {/* Add Links */}
            {addResourcesSpeaker && selectedOption === "links" && (
              <div className="input-group p-2 mb-3 border border-muted rounded d-flex justify-content-between">
                <input
                  type="text"
                  placeholder={
                    i18n.language === "en" ? "Enter new link" : "أدخل رابط جديد"
                  }
                  style={{
                    border: "none",
                    outline: "none",
                    width: "calc(100% - 150px)",
                  }}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <button
                  className="btn btn-success px-4 py-2"
                  style={{
                    backgroundColor: "#27AE60",
                    border: "none",
                    outline: "none",
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    sendLinks();
                    setLink("");
                  }}
                >
                  {i18n.language === "en" ? "Add new Link" : "إضافة رابط جديد"}
                </button>
              </div>
            )}

            {/* User */}
            {selectedOption === "files" &&
              files.map((file, index) => (
                <li
                  key={index}
                  className="my-2 d-flex gap-2 align-items-center justify-content-between p-2 border-bottom w-75"
                >
                  <a
                    href={file}
                    className="text-dark fw-bold"
                    style={{ fontSize: "16px" }}
                    target="blank"
                    rel="noopener noreferrer"
                  >
                    {getFileIcon(file)}
                    {i18n.language === "en" ? "file" : "ملف"} {index + 1}
                  </a>
                  {addResourcesSpeaker && (
                    <i
                      className="fas fa-trash-alt text-danger justify-self-end"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteResource(file, "file")}
                    ></i>
                  )}
                </li>
              ))}

            {/* User */}
            {selectedOption === "images" && (
              <div className="row gap-2 my-2 justify-content-center flex-wrap">
                {imgs.map((img, index) => (
                  <div
                    key={index}
                    className={`col-3 p-0 text-center rounded ${
                      addResourcesSpeaker ? "bg-danger" : ""
                    }`}
                  >
                    <img
                      key={index}
                      src={img}
                      alt={`Image ${index}`}
                      className="rounded w-100"
                      height={80}
                      style={{ objectFit: "cover", cursor: "pointer" }}
                      onClick={() => openPopup(img)}
                    />
                    {addResourcesSpeaker && (
                      <i
                        className="fas fa-trash-alt text-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteResource(img, "image")}
                      ></i>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* User */}
            {selectedOption === "links" && // Links For All Users
              links.map((link, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: "#27AE601A" }}
                  className="d-flex align-items-center rounded my-2 overflow-hidden w-75"
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

                  <div className="p-2 flex-grow-1">
                    <h5 className="m-0 fw-bold">
                      {i18n.language === "en" ? "Link" : "الرابط"}
                      {index + 1}
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
                  {addResourcesSpeaker && (
                    <i
                      className="fas fa-trash-alt text-danger fs-5 p-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteResource(link, "link")}
                    ></i>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* popup for selected image */}
      {popupVisible && (
        <div
          className="custom-popup bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
          style={{
            transform: showPopup
              ? "translate(300%,-50%)"
              : "translate(-50%, -50%)",
            transition: "0.5s",
            zIndex: "1000000",
            height: "90vh",
            scrollbarWidth: "none",
            boxShadow: "0px 0px 30px #666",
            width: "60%",
          }}
        >
          <div className="popup-content">
            <div
              className="d-flex justify-content-between align-items-center py-2 px-3"
              style={{ backgroundColor: "#F2F2F2" }}
            >
              <h3>
                {i18n.language === "en" ? "Zoomed Image" : "الصورة المكبرة"}
              </h3>
              <i
                className="fa-solid fa-x"
                style={{ cursor: "pointer" }}
                onClick={closePopup}
              ></i>
            </div>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="image"
                className="rounded-3 d-block"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
Resources.propTypes = {
  eventDayId: PropTypes.string.isRequired,
};
Resources.propTypes = {
  eventId: PropTypes.string.isRequired,
};
Resources.propTypes = {
  userId: PropTypes.string.isRequired,
};
Resources.propTypes = {
  addResourcesSpeaker: PropTypes.bool.isRequired,
};
Resources.propTypes = {
  eventDaySpeakerId: PropTypes.number.isRequired,
};
Resources.propTypes = {
  sendId: PropTypes.number.isRequired,
};
Resources.propTypes = {
  eventDays: PropTypes.object.isRequired,
};
