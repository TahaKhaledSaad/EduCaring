import { useState, useEffect } from "react";
import logo from "../../../assets/logo-removebg-preview.png";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
import "./Community.css";

// Translation Work
import { useTranslation } from "react-i18next";

export default function Community() {
  const [chat, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatContent, setShowChatContent] = useState(false);

  // Translation Work
  const { i18n } = useTranslation();

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = token ? jwtDecode(token) : {};

  useEffect(() => {
    axios
      .get(`${BASE}/Community/GetByUserId`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
        },
      })
      .then((data) => {
        console.log(data);
        setChat(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [decodedToken.uid, i18n.language]);

  // console.log(chat);

  const handleChatItemClick = (chatItem) => {
    setSelectedChat(chatItem);
    setShowChatContent(true);
  };

  console.log(selectedChat);
  const handleBackClick = () => {
    setShowChatContent(false);
  };

  const convertTimestampToFormattedDate = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  };
  const calculateTimeDifference = (timestamp) => {
    const sentTime = new Date(timestamp);
    const currentTime = new Date();

    const diffInMs = currentTime - sentTime;
    const diffInMin = Math.round(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const dayText = i18n.language === "en" ? "day" : "يوم";
    const hourText = i18n.language === "en" ? "hour" : "ساعة";
    const minuteText = i18n.language === "en" ? "minute" : "دقيقة";

    // Define function to handle pluralization based on language
    const getPluralText = (count, text) => {
      if (i18n.language === "en") {
        return count === 1 ? text : `${text}s`;
      } else {
        return text;
      }
    };

    if (diffInDays > 0) {
      return `${diffInDays} ${getPluralText(diffInDays, dayText)}`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${getPluralText(diffInHours, hourText)}`;
    } else {
      return `${diffInMin} ${getPluralText(diffInMin, minuteText)}`;
    }
  };

  return (
    <>
      <div className="commuinty d-flex gap-3 p-3">
        <div className={`chats ${showChatContent ? "hide" : "show"}`}>
          <div className="search">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="search" />
          </div>

          {chat?.length &&
            chat.map((item) => (
              <div
                key={item.eventId}
                className={` chat-item d-flex gap-2 p-2 position-relative ${
                  selectedChat === item ? "selected-chat" : ""
                }
                ${item?.eventData.isFinished ? "finished" : ""}
                `}
                onClick={() => handleChatItemClick(item)}
              >
                <img
                  src={item.eventData.primeImageURL}
                  alt="chat-img"
                  width={"60px"}
                  height={"60px"}
                  className="rounded"
                />
                <div className="text">
                  <h6>{item.eventData.name}</h6>
                  <p className="text-muted fs-11">
                    {item.messages[item.messages.length - 1]?.message}
                  </p>
                </div>
                {item.unreadCount ? (
                  <span className="num">item.unreadCount </span>
                ) : (
                  ""
                )}
                <span className="time">
                  {calculateTimeDifference(
                    item.messages[item.messages.length - 1]?.timestamp
                  )}
                </span>
                {item?.eventData.isFinished && (
                  <span className="text-danger event-finished">
                    event finished
                  </span>
                )}
              </div>
            ))}
        </div>

        {showChatContent && selectedChat && (
          <div className={`chat-content ${showChatContent ? "show" : "hide"}`}>
            {selectedChat.messages.map((msg) => (
              <div key={msg.id} className="message my-4">
                <div className="sender d-flex gap-2 align-items-center">
                  <div className="d-flex bg-light p-1 rounded-circle justify-content-center align-items-center">
                    <img
                      src={logo}
                      alt="sender-img"
                      width={"40px"}
                      height={"40px"}
                      className="rounded-circle"
                      // style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span>
                    {i18n.language === "en" ? "Event Organizer" : "منظم الحدث"}{" "}
                  </span>
                  <span className="date">
                    {convertTimestampToFormattedDate(msg.timestamp)}
                  </span>
                </div>
                <div className="msg-text rounded p-2 m-2">
                  <p>{msg.message}</p>
                  <span
                    className="view"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(msg.imageUrl, "_blank");
                    }}
                  >
                    view Resource
                  </span>
                </div>
              </div>
            ))}

            <i
              className="fa-regular fa-circle-xmark close-btn"
              onClick={() => {
                handleBackClick();
                setSelectedChat(null);
              }}
            ></i>
          </div>
        )}
      </div>
    </>
  );
}

// useEffect(() => {
//   // Create a FormData object
//   const formData = new FormData();

//   // Append the file object to the FormData object
//   formData.append("ImageFile", "https://www.w3schools.com/w3images/lights.jpg");

//   // Append other data to the FormData object
//   formData.append("UserIds", userId);
//   formData.append("Message", "Hello");
//   formData.append("Timestamp", "2021-11-05T06:51:47");
//   formData.append("EventDayId", 73);

//   axios
//     .post(`${BASE}/Community`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data", // No need for application/json
//         accept: "multipart/form-data",
//       },
//     })
//     .then((data) => {
//       console.log(data);
//       setCommunity(data.data.responseObject);
//     })
//     .catch((err) => console.log(err));
// }, [userId]);
