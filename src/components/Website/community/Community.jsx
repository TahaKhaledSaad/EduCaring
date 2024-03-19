import { useState, useEffect } from "react";
import chatImg from "../../../assets/event-img1.jpeg";
import axios from "axios";
import Cookie from "cookie-universal";
import { BASE } from "../../../Api";
import "./Community.css"


export default function Community() {
  const [community, setCommunity] = useState([]);

  const cookie = new Cookie();
  const userId = cookie.get("userId");
  console.log(userId);

  useEffect(() => {
    axios
      .get(`${BASE}/Community/GetByUserId`, {
        headers: {
          UserId: userId,
        },
      })
      .then((data) => {
        console.log(data);
        setCommunity(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(community);

  const [showChatContent, setShowChatContent] = useState(false);

  const handleChatItemClick = () => {
    setShowChatContent(true);
  };
  const handleBackClick = () => {
    setShowChatContent(false);
  };

  return (
    <>
      <div className="commuinty d-flex gap-3 p-3">
        <div className={`chats ${showChatContent ? "d-none" : ""}`}>
          <div className="search">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="search" />
          </div>
          <div
            className="chat-item d-flex gap-2 p-2 position-relative active"
            onClick={handleChatItemClick}
          >
            <img
              src={chatImg}
              alt="chat-img"
              width={"60px"}
              height={"60px"}
              className="rounded"
            />
            <div className="text">
              <h6>Programming : How to begin your ..</h6>
              <p className="text-muted fs-11">Hi All</p>
            </div>
            <span className="num">3</span>
            <span className="time">5 m</span>
          </div>
          <div className="chat-item d-flex gap-2 p-2 position-relative">
            <img
              src={chatImg}
              alt="chat-img"
              width={"60px"}
              height={"60px"}
              className="rounded"
            />
            <div className="text">
              <h6>Programming : How to begin your ..</h6>
              <p className="text-muted fs-11">Send an image</p>
            </div>
            <span className="num">13</span>
            <span className="time">1 hr</span>
          </div>
          <div className="chat-item d-flex gap-2 p-2 position-relative finished">
            <img
              src={chatImg}
              alt="chat-img"
              width={"60px"}
              height={"60px"}
              className="rounded"
            />
            <div className="text">
              <h6>Programming : How to begin your ..</h6>
              <p className="text-muted fs-11">Send an image</p>
            </div>
            <span className="time">5 nov</span>
            <span className="expire">event finished</span>
          </div>
          <div className="chat-item d-flex gap-2 p-2 position-relative finished">
            <img
              src={chatImg}
              alt="chat-img"
              width={"60px"}
              height={"60px"}
              className="rounded"
            />
            <div className="text">
              <h6>Programming : How to begin your ..</h6>
              <p className="text-muted fs-11">Send an image</p>
            </div>
            <span className="expire">event finished</span>
            <span className="time">5 nov</span>
          </div>
        </div>

        <div className={`chat-content ${showChatContent ? "" : "d-none"}`}>
          <div className="message my-4">
            <div className="sender d-flex gap-2">
              <img
                src={chatImg}
                alt="sender-img"
                width={"30px"}
                height={"30px"}
                className="rounded-circle"
              />
              <span>Event Organizer (sami)</span>
              <span className="date">05 nov 02:30 PM</span>
            </div>
            <div className="msg-text rounded p-2 m-2">
              <p>New resources had been added!</p>
              <span className="view">view</span>
            </div>
          </div>
          <div className="message my-4">
            <div className="sender d-flex gap-2">
              <img
                src={chatImg}
                alt="sender-img"
                width={"30px"}
                height={"30px"}
                className="rounded-circle"
              />
              <span>Event Organizer (sami)</span>
              <span className="date">05 nov 02:30 PM</span>
            </div>
            <div className="msg-text rounded p-2 m-2">
              <p>we need to know how this session was?</p>
              <span className="quiz">Take a quiz</span>
            </div>
          </div>
          <div className="message my-4">
            <div className="sender d-flex gap-2">
              <img
                src={chatImg}
                alt="sender-img"
                width={"30px"}
                height={"30px"}
                className="rounded-circle"
              />
              <span>Event Organizer (sami)</span>
              <span className="date">05 nov 02:30 PM</span>
            </div>
            <div className="msg-text rounded p-2 m-2">
              <p>
                Ut enim ad minima veniam, quis nostrum ationem ullam corporis
                suscipit laboriosam, nisi ut al Sed ut perspiciatis unde omnis
                iste natus error sit ptate...
              </p>
              <span className="view">view</span>
            </div>
          </div>
          <div className="message my-4">
            <div className="sender d-flex gap-2">
              <img
                src={chatImg}
                alt="sender-img"
                width={"30px"}
                height={"30px"}
                className="rounded-circle"
              />
              <span>Event Organizer (sami)</span>
              <span className="date">05 nov 02:30 PM</span>
            </div>
            <div className="msg-text rounded p-2 m-2">
              <p>Hi All</p>
            </div>
          </div>
          <i
            className="fa-regular fa-circle-left back"
            onClick={handleBackClick}
          ></i>
        </div>
      </div>
    </>
  );
}
