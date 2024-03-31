import { useState, useEffect } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export default function SpeakerTicket() {
  const { i18n } = useTranslation();
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  // Show popup

  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  //   build the popup for the speaker to book tickets (calender)

  const [date, setDate] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(month, year);

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="empty"></td>);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(<td key={day}>{day}</td>);
    }

    const rows = [];
    let cells = [];

    days.forEach((day, index) => {
      cells.push(day);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        rows.push(
          <tr key={index / 7} onClick={dayFunc} style={{cursor: 'pointer', margin:'5px'}}>
            {cells}
          </tr>
        );
        cells = [];
      }
    });

    return rows;
  };

  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  // state for the radio buttons
  const [selectedOption, setSelectedOption] = useState("Attendance");
  const selectedDate = [];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const selectedDay = [];
  // Print Day
  const dayFunc = (e) => {
    console.log(e.target.innerText);
    if (selectedDay.length === 0) {
      selectedDay.push(e.target.innerText);
      selectedDate.push(
        `${e.target.innerText}/${date.getMonth() + 1}/${date.getFullYear()}`
      );
    } else {
      for (let i = 0; i < selectedDay.length; i++) {
        if (!selectedDay.includes(e.target.innerText)) {
          selectedDay.push(e.target.innerText);
          selectedDate.push(
            `${e.target.innerText}/${date.getMonth() + 1}/${date.getFullYear()}`
          );
        }
      }
    }
    console.log(selectedDay);
    console.log(selectedDate);
  };


  const s = [
    "11/3/2024",
    "13/3/2024"
]
,v=[
  "20/3/2024"
]

const formattedDates = s.map(dateString => {
    const [day, month, year] = dateString.split('/').map(Number);
    // Months in JavaScript Date object are zero-based, so subtract 1 from the month
    const date = new Date(year, month - 1, day);
    // Format the date into "YYYY-MM-DDTHH:MM:SS" format
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
});

console.log(formattedDates);

  

  


  return (
    <>
      <button
        className="btn btn-success py-2  w-100"
        style={{ background: "#27AE60", border: "none", outline: "none" }}
        onClick={togglePopup}
      >
        Edit
      </button>

      <div
        className=" w-50 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(300%, -50%)"
            : "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "100440",
          height: "80vh",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>Booking Tickets</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>

        <div className="popup-body d-flex justify-content-between align-items-center p-2 px-4 h-75">
          <div className="d-flex flex-column align-items-center w-50">
            <div
              className="border rounded p-2 my-2"
              style={{
                width: "140px",
                color: selectedOption === "Attendance" ? "#27AE60" : "",
                backgroundColor:
                  selectedOption === "Attendance" ? "#27AE601A" : "",
                borderColor: selectedOption === "Attendance" ? "#27AE60" : "",
              }}
            >
              <label htmlFor="attendance">
                <input
                  type="radio"
                  hidden
                  value="Attendance"
                  checked={selectedOption === "Attendance"}
                  onChange={handleOptionChange}
                  id="attendance"
                />
                <i className="fa-regular fa-circle-check px-2"></i> Attendance
              </label>
            </div>
            <div
              className="border rounded p-2 my-2"
              style={{
                width: "140px",
                color: selectedOption === "Departure" ? "#27AE60" : "",
                backgroundColor:
                  selectedOption === "Departure" ? "#27AE601A" : "",
                borderColor: selectedOption === "Departure" ? "#27AE60" : "",
              }}
            >
              <label htmlFor="departure">
                <input
                  type="radio"
                  hidden
                  value="Departure"
                  checked={selectedOption === "Departure"}
                  onChange={handleOptionChange}
                  id="departure"
                />
                <i className="fa-regular fa-circle-check px-2"></i> Departure
              </label>
            </div>
          </div>

          <div className="calendar w-50">
            <div className="header d-flex justify-content-between align-items-center px-3">
              <h3>
                {monthsOfYear[date.getMonth()]} {date.getFullYear()}
              </h3>
              <div className="d-flex gap-2">
                <button onClick={prevMonth} className="border-0 bg-transparent">
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <button onClick={nextMonth} className="border-0 bg-transparent">
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            </div>
            <table className="table" style={{ borderStyle: "none" }}>
              <thead>
                <tr style={{ borderStyle: "none" }}>
                  {daysOfWeek.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderCalendar()}</tbody>
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center p-2 px-4 gap-3">
          <button
            className="w-50 border-0 rounded text-white py-2"
            style={{
              backgroundColor: "#DCDCDC",
            }}
            // Add onFocus event handler to change background color when focused
            onFocus={(e) => (e.target.style.backgroundColor = "#3296D4")}
            // Add onBlur event handler to revert background color when focus is lost
            onBlur={(e) => (e.target.style.backgroundColor = "#DCDCDC")}
          >
            Confirm
          </button>
          <button
            className="w-50 border-0 rounded text-dark py-2"
            style={{
              backgroundColor: "#F3F5F5",
            }}
            onClick={togglePopup}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
