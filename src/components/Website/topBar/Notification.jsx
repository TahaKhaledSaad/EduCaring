// import React from "react";
// import imgEvent from "../../../assets/event-img1.jpeg";
// import person from "../../../assets/person.jpeg";
// import person1 from "../../../assets/person1.jpeg";

// export default function Notification() {
//   return (
//     <div className="notification">
//       <div className="icon">
//         <i className="bi bi-bell-fill"></i>
//       </div>
//       <div className="notif-popup">
//         <div className="head">
//           <h5>Notification</h5>
//           <span>Mark all as read</span>
//         </div>
//         <div className="body">
//           <div className="notif-row">
//             <img src={person} alt="notify-img" />
//             <div className="text">
//               <h6>Osama Hassan</h6>
//               <p>please answer these questions !</p>
//               <span className="ago">just now</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (sami)</h6>
//               <p className="new">new update in community!</p>
//               <span className="ago">just now</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (sami)</h6>
//               <p>event had been ended, need your vot</p>
//               <span className="ago">just now</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={person1} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (Momen)</h6>
//               <p className="survey">please, we need your survey</p>
//               <div className="stars">
//                 <i className="bi bi-star-fill"></i>
//                 <i className="bi bi-star-fill"></i>
//                 <i className="bi bi-star-fill"></i>
//                 <i className="bi bi-star-fill"></i>
//                 <i className="bi bi-star-fill"></i>
//               </div>
//               <span className="ago">6:14 AM</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Osama Hassan</h6>
//               <p className="required">
//                 you need to solve a quiz!
//                 <span>(required)</span>
//               </p>
//               <span className="ago">21 may</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (sami)</h6>
//               <p className="zoom">
//                 wait you in the session
//                 <span>
//                   zoom meeting link
//                   <img src="./images/icons8-zoom-48.png" alt="zoom" />
//                 </span>
//               </p>
//               <span className="ago">21 may</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (sami)</h6>
//               <p className="details">
//                 your subscription had been done successfully
//                 <span>view details</span>
//               </p>
//               <span className="ago">21 may</span>
//             </div>
//           </div>
//           <div className="notif-row">
//             <img src={imgEvent} alt="notify-img" />
//             <div className="text">
//               <h6>Event Organizer (sami)</h6>
//               <p className="details">Are you going to dinner today?</p>
//               <div className="btns">
//                 <button className="yes">Yes</button>
//                 <button className="no">No</button>
//               </div>
//               <span className="ago">21 may</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import imgEvent from "../../../assets/event-img1.jpeg";
import person from "../../../assets/person.jpeg";
import person1 from "../../../assets/person1.jpeg";
import zoom from "../../../assets/icons8-zoom-48.png";

export default function Notification() {
  const [popupVisible, setPopupVisible] = useState(false);
  const suppRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suppRef.current && !suppRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    }

    if (popupVisible) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [popupVisible]);

  function togglePopup() {
    setPopupVisible((prevState) => !prevState);
  }

  return (
    <div className="notification">
      <div className="icon" onClick={togglePopup}>
        <i className="bi bi-bell-fill"></i>
      </div>

      {popupVisible && (
        <div className="notif-popup">
          <div className="head">
            <h5>Notification</h5>
            <span>Mark all as read</span>
          </div>
          <div className="body">
            <div className="notif-row">
              <img src={person} alt="notify-img" />
              <div className="text">
                <h6>Osama Hassan</h6>
                <p>please answer these questions !</p>
                <span className="ago">just now</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (sami)</h6>
                <p className="new">new update in community!</p>
                <span className="ago">just now</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (sami)</h6>
                <p>event had been ended, need your vot</p>
                <span className="ago">just now</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={person1} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (Momen)</h6>
                <p className="survey">please, we need your survey</p>
                <div className="stars">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <span className="ago">6:14 AM</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Osama Hassan</h6>
                <p className="required">
                  you need to solve a quiz!
                  <span>(required)</span>
                </p>
                <span className="ago">21 may</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (sami)</h6>
                <p className="zoom">
                  wait you in the session
                  <span>
                    zoom meeting link
                    <img src={zoom} alt="zoom" />
                  </span>
                </p>
                <span className="ago">21 may</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (sami)</h6>
                <p className="details">
                  your subscription had been done successfully
                  <span>view details</span>
                </p>
                <span className="ago">21 may</span>
              </div>
            </div>
            <div className="notif-row">
              <img src={imgEvent} alt="notify-img" />
              <div className="text">
                <h6>Event Organizer (sami)</h6>
                <p className="details">Are you going to dinner today?</p>
                <div className="btns">
                  <button className="yes">Yes</button>
                  <button className="no">No</button>
                </div>
                <span className="ago">21 may</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
