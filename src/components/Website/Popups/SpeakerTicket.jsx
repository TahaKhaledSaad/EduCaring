import { useState } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export default function SpeakerTicket({ sendId }) {
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};
  const [cityTO, setCityTO] = useState("");
  const [cityFrom, setCityFrom] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [modAmColor, setModAmColor] = useState(false);
  const [modPmColor, setModPmColor] = useState(false);

  console.log(confirm);

  // Show popup

  const [showPopup, setShowPopup] = useState(true);

  //   build the popup for the speaker to book tickets (calendar)

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
      days.push(
        <td
          key={day}
          style={{
            cursor: "pointer",
            textAlign: "center",

            padding: 0,
            margin: "5px",
            lineHeight: "30px",
          }}
        >
          {day}
        </td>
      );
    }

    const rows = [];
    let cells = [];

    days.forEach((day, index) => {
      cells.push(day);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        rows.push(
          <tr key={index / 7} onClick={dayFunc}>
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
  const [formattedDates, setFormattedDates] = useState([]); // ["2022-01-01T00:00:00", "2022-01-02T00:00:00"
  let dayFunc;

  dayFunc = (e) => {
    const selectedDayText = e.target.innerText;
    const selectedIndex = selectedDay.indexOf(selectedDayText);

    if (selectedIndex === -1) {
      // If the selected day is not already in the array, add it
      e.target.classList.add("selectedtr");
      selectedDay.push(selectedDayText);
      selectedDate.push(
        `${parseInt(selectedDayText) + 1}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`
      );
    } else {
      // If the selected day is already in the array, remove it
      e.target.classList.remove("selectedtr");
      selectedDay.splice(selectedIndex, 1);
      selectedDate.splice(selectedIndex, 1);
    }

    selectedDate.map((dateString) => {
      const [day, month, year] = dateString.split("/").map(Number);
      // Months in JavaScript Date object are zero-based, so subtract 1 from the month
      const date = new Date(year, month - 1, day);
      // Format the date into "YYYY-MM-DDTHH:MM:SS" format
      const formattedDate = date.toISOString().slice(0, 19).replace(" ", "T");
      setFormattedDates((prev) => [...prev, formattedDate]);
    });

    console.log(formattedDates);
  };

  console.log(formattedDates);

  const handleConfirm = async () => {
    if (formattedDates.length >= 3 && cityTO && cityFrom) {
      setConfirm(true);
      setCityTO(""); // Clear input value
      setCityFrom(""); // Clear input value
      setFormattedDates([]); // Clear formattedDates array
      // Remove added styles
      const selectedElements = document.querySelectorAll(".selectedtr");
      selectedElements.forEach((element) => {
        element.classList.remove("selectedtr");
      });

      const sendedArray = formattedDates.map((date) => {
        const city = {
          cityAttendFrom: selectedOption === "Attendance" ? cityFrom : null,
          cityAttendTo: selectedOption === "Attendance" ? cityTO : null,
        };

        const sendedCity = selectedOption === "Attendance" ? city : {};

        console.log({
          id: 0,
          eventDaySpeakerId: sendId,
          speakerId: decodedToken.uid,
          dayMod: "Am",
          departureDay: selectedOption === "Departure" ? date : null,
          attendDay: selectedOption === "Attendance" ? date : null,
          ...sendedCity,
        });
        
        return {
          id: 0,
          eventDaySpeakerId: sendId,
          speakerId: decodedToken.uid,
          dayMod: "Am",
          departureDay: selectedOption === "Departure" ? date : null,
          attendDay: selectedOption === "Attendance" ? date : null,
          ...sendedCity,
        };
      });

      if (
        (selectedOption === "Departure" && formattedDates.length >= 3) ||
        (selectedOption === "Attendance" && formattedDates.length >= 3)
      ) {
        try {
          const response = await axios.put(
            selectedOption === "Departure"
              ? `${BASE}/SpeakerDeparture`
              : `${BASE}/SpeakerAttend`,
            sendedArray
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        } finally {
          setConfirm(false); // Set confirm back to false after request is sent
        }
      }
    }
    setShowPopup(!showPopup);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      setCityTO(""); // Clear input value
      setCityFrom(""); // Clear input value
      setFormattedDates([]); // Clear formattedDates array
      // Remove added styles
      const selectedElements = document.querySelectorAll(".selectedtr");
      selectedElements.forEach((element) => {
        element.classList.remove("selectedtr");
      });
    }
  };
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
        className=" w-75 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
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

        <div className="popup-body d-flex flex-column flex-md-row justify-content-between align-items-center p-2 px-4 my-3">
          <div className="w-50">
            <div className="d-flex gap-2 flex-column">
              <div className="w-50">
                <p className="m-0">city to</p>
                <input
                  type="text"
                  className="border rounded p-2"
                  value={cityTO}
                  onChange={(e) => setCityTO(e.target.value)}
                />
              </div>
              <div className="w-50">
                <p className="m-0">city from </p>
                <input
                  type="text"
                  className="border rounded p-2"
                  value={cityFrom}
                  onChange={(e) => setCityFrom(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center my-2">
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
                    <th key={day} style={{ margin: "5px" }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderCalendar()}</tbody>
            </table>
          </div>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          {formattedDates.map((date, index) => (
            <div
              key={index}
              className="m-2 rounded"
              style={{ width: "100px", background: "#f2f2f2" }}
            >
              <div className="d-flex pt-2 justify-content-around flex-column align-items-center">
                <span className="fw-bold fs-4">{new Date(date).getDate()}</span>
                <span>
                  {new Date(date).toLocaleString("default", {
                    month: "long",
                  })}
                </span>
              </div>
              <hr className="p-0 my-2" />
              <div className="d-flex justify-content-around pb-2">
                <span
                  onClick={() => {
                    setModAmColor(true);
                    setModPmColor(false);
                  }}
                  style={{
                    background: modAmColor ? "gray" : "",
                    color: modAmColor ? "#fff" : "",
                  }}
                  className="p-1 fw-bold rounded"
                >
                  AM
                </span>
                <span
                  onClick={() => {
                    setModAmColor(false);
                    setModPmColor(true);
                  }}
                  style={{
                    background: modPmColor ? "gray" : "",
                    color: modPmColor ? "#fff" : "",
                  }}
                  className="p-1 rounded fw-bold"
                >
                  PM
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center p-2 px-4 gap-3 my-2">
          <button
            className="w-50 border-0 rounded text-white py-2"
            style={{
              backgroundColor:
                formattedDates.length >= 3 && cityTO && cityFrom
                  ? "#3296D4"
                  : "#DCDCDC",
            }}
            onClick={handleConfirm}
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
SpeakerTicket.propTypes = {
  sendId: PropTypes.number.isRequired,
};
