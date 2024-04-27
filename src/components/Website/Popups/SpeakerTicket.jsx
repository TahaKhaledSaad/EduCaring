import { useEffect, useRef, useState } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Calendar } from "primereact/calendar";
import "./SpeakerTicket.css";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import { Steps } from "primereact/steps";
import { Badge } from "primereact/badge";

export default function SpeakerTicket({
  eventDaySpeakerId,
  userId,
  departureDatesBE,
  departureDates,
  datesBE,
  dates,
  setDates,
  setDepartureDates,
  setGetSpeakerDetails,
  cityTO,
  setCityTO,
  cityFrom,
  setCityFrom,
  cityTOOld,
  cityFromOld,
  cityTODepature,
  setCityTODepature,
  cityFromDepature,
  setCityFromDepature,
  cityTOOldDepature,
  cityFromOldDepature,
}) {
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  const [confirm, setConfirm] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Attendance");
  const [showAttendanceCalendar, setShowAttendanceCalendar] = useState(true);

  const { t, i18n } = useTranslation();
  const toast = useRef(null);

  const handleCalendarToggle = (e) => {
    const newSelectedOption = e.value;
    if (newSelectedOption === null) return;
    setSelectedOption(newSelectedOption);
    setShowAttendanceCalendar(newSelectedOption === "Attendance");
  };

  const ticketsItems = [
    {
      label: t("Attendance"),
    },
    {
      label: t("Departure"),
    },
  ];

  // Show popup

  const [showPopup, setShowPopup] = useState(true);

  //   build the popup for the speaker to book tickets (calendar)

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
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  // Print Day
  const [formattedDates, setFormattedDates] = useState([]); // ["2022-01-01T00:00:00", "2022-01-02T00:00:00"

  console.log(formattedDates);

  const handleConfirm = async () => {
    if (
      dates?.length <= 3 &&
      departureDates?.length <= 3 &&
      cityTO &&
      cityFrom &&
      cityFromDepature &&
      cityTODepature
    ) {
      // Separate formattedDates based on selected option
      try {
        // Send request for attendance
        const attendanceArray = dates?.map((date) => {
          let monthStr, dayNum, year, formattedDate;
          const oldDate = datesBE?.find(
            (dateObj) => dateObj.attendDay === date.attendDay
          );
          if (oldDate && oldDate.dayMod === date.dayMod) {
            [, monthStr, dayNum, year] = oldDate.attendDay.split(" ");

            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: oldDate.id,
              attendDay: formattedDate,
              departureDay: null,
              dayMod: oldDate.dayMod,
              cityAttendFrom: cityFrom,
              cityAttendTo: cityTO,
              eventDaySpeakerId,
              speakerId: userId,
            };
          } else if (oldDate) {
            [, monthStr, dayNum, year] = oldDate.attendDay.split(" ");

            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: oldDate.id,
              attendDay: formattedDate,
              departureDay: null,
              dayMod: date.dayMod,
              cityAttendFrom: cityFrom,
              cityAttendTo: cityTO,
              eventDaySpeakerId,
              speakerId: userId,
            };
          } else {
            [, monthStr, dayNum, year] = date.attendDay.split(" ");

            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: 0,
              attendDay: formattedDate,
              departureDay: null,
              dayMod: date.dayMod,
              cityAttendFrom: cityFrom,
              cityAttendTo: cityTO,
              eventDaySpeakerId,
              speakerId: userId,
            };
          }
        });
        const attendanceResponse = await axios.put(
          `${BASE}/SpeakerAttend`,
          attendanceArray
        );
        console.log("Attendance Response:", attendanceResponse);

        // Send request for departure
        const departureArray = departureDates?.map((date) => {
          let monthStr, dayNum, year, formattedDate;
          const oldDate = departureDatesBE?.find(
            (dateObj) => dateObj.departureDay === date.departureDay
          );
          if (oldDate && oldDate.dayMod === date.dayMod) {
            [, monthStr, dayNum, year] = oldDate.departureDay.split(" ");
            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: oldDate.id,
              departureDay: formattedDate,
              attendDay: null,
              dayMod: oldDate.dayMod,
              cityDepartureFrom: cityFromDepature,
              cityDepartureTo: cityTODepature,
              eventDaySpeakerId,
              speakerId: userId,
            };
          } else if (oldDate) {
            [, monthStr, dayNum, year] = oldDate.departureDay.split(" ");
            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: oldDate.id,
              departureDay: formattedDate,
              attendDay: null,
              dayMod: date.dayMod,
              cityDepartureFrom: cityFromDepature,
              cityDepartureTo: cityTODepature,
              eventDaySpeakerId,
              speakerId: userId,
            };
          } else {
            [, monthStr, dayNum, year] = date.departureDay.split(" ");
            formattedDate = `${year}-${months[monthStr]}-${dayNum.padStart(
              2,
              "0"
            )}`;
            return {
              id: 0,
              departureDay: formattedDate,
              attendDay: null,
              dayMod: date.dayMod,
              cityDepartureFrom: cityFromDepature,
              cityDepartureTo: cityTODepature,
              eventDaySpeakerId,
              speakerId: userId,
            };
          }
        });
        const departureResponse = await axios.put(
          `${BASE}/SpeakerDeparture`,
          departureArray
        );
        console.log("Departure Response:", departureResponse);
        if (
          attendanceResponse.data.isSuccess &&
          departureResponse.data.isSuccess
        ) {
          toast.current.show({
            severity: "info",
            summary: t("BookingDatesSent"),
            detail: t("BookingDatesMessageSent"),
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: t("Error"),
            detail: t("SomethingWentWrong"),
            life: 3000,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setConfirm(false); // Set confirm back to false after requests are sent
      }
    }
    setShowPopup(!showPopup);
    setCityTO(""); // Clear input value
    setCityTODepature(""); // Clear input value
    setCityFrom(""); // Clear input value
    setCityFromDepature(""); // Clear input value

    setDates([]); // Clear dates array
    setDepartureDates([]); // Clear departureDates array
    setSelectedOption("Attendance");
    setShowAttendanceCalendar(true);
    setGetSpeakerDetails((prev) => prev + 1);
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      setCityTO(cityTOOld); // Clear input value
      setCityFrom(cityFromOld); // Clear input value
      setCityTODepature(cityTOOldDepature); // Clear input value
      setCityFromDepature(cityFromOldDepature); // Clear input value
      setFormattedDates([]); // Clear formattedDates array
      // Remove added styles
      setDates(datesBE);
      setDepartureDates(departureDatesBE);
      // setShowAttendanceCalendar(true);
      setSelectedOption("Attendance");
      setShowAttendanceCalendar(true);
    }
  };
  const dateTemplate = (date) => {
    const selectedDates = dates || []; // Ensure dates is not null
    const dateString = new Date(date.year, date.month, date.day).toDateString(); // Convert date object to string

    let daydayMod;
    const isSelected = selectedDates?.some((selectedDate, i) => {
      daydayMod = i;
      return new Date(selectedDate.attendDay).toDateString() === dateString;
    }); // Check if the date is selected

    return (
      <div className="p-1 w-100">
        <p
          style={{
            textAlign: "center",
            marginBottom: isSelected ? "0.5em" : "0",
            color: isSelected ? "rgba(39, 174, 96, 1)" : "black",
            fontSize: "12px",
          }}
        >
          {date.day}
        </p>
        {isSelected && (
          <div
            style={{
              textAlign: "center",

              marginTop: "-1em",
              color: "rgba(39, 174, 96, 1)",
              fontSize: "10px",
            }}
          >
            {selectedDates[daydayMod].dayMod}
          </div>
        )}
      </div>
    );
  };
  console.log(departureDates);
  const depatureDateTemplate = (date) => {
    const selectedDates = departureDates || []; // Ensure dates is not null
    const dateString = new Date(date.year, date.month, date.day).toDateString(); // Convert date object to string
    let daydayMod;
    const isSelected = selectedDates?.some((selectedDate, i) => {
      daydayMod = i;
      return new Date(selectedDate.departureDay).toDateString() === dateString;
    }); // Check if the date is selected
    return (
      <div className="p-1 w-100">
        <p
          style={{
            textAlign: "center",
            marginBottom: isSelected ? "0.5em" : "0",
            color: isSelected ? "rgba(39, 174, 96, 1)" : "black",
            fontSize: "12px",
          }}
        >
          {date.day}
        </p>
        {isSelected && (
          <div
            style={{
              textAlign: "center",

              marginTop: "-1em",
              color: "rgba(39, 174, 96, 1)",
              fontSize: "10px",
            }}
          >
            {selectedDates[daydayMod].dayMod}
          </div>
        )}
      </div>
    );
  };
  const itemTemplate = (item) => {
    return (
      <div
        className={`py-2  ${
          item === "Attendance" && showAttendanceCalendar
            ? "selected-state"
            : item === "Departure" && !showAttendanceCalendar
            ? "selected-state"
            : ""
        }`}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          height: "30px",
          lineHeight: "30px",
          padding: "0 1em",
          fontSize: "16px",
          fontWeight: "500",
          position: "relative",
        }}
      >
        <i
          className={`${
            item === "Attendance" && showAttendanceCalendar
              ? "fa-solid"
              : item === "Departure" && !showAttendanceCalendar
              ? "fa-solid"
              : "fa-regular"
          } fa-circle-check px-2`}
        ></i>{" "}
        {t(item)}
        {item === "Attendance" &&
          (dates?.length !== 3 || cityTO === "" || cityFrom == "") && (
            <Badge
              severity="danger"
              className="position-absolute top-0 end-0"
              size={"normal"}
              style={{ fontSize: "2px" }}
            ></Badge>
          )}
        {item === "Departure" &&
          (departureDates?.length !== 3 ||
            cityTODepature === "" ||
            cityFromDepature === "") && (
            <Badge
              severity="danger"
              className="position-absolute top-0 end-0"
              size={"normal"}
              style={{ fontSize: "2px" }}
            ></Badge>
          )}
      </div>
    );
  };
  return (
    <>
      <Toast ref={toast} />
      <button
        className="btn btn-success py-2  w-100"
        style={{
          background:
            departureDatesBE?.length > 0 && datesBE?.length > 0
              ? "#27AE60"
              : "rgba(195, 43, 67, 1)",
          border: "none",
          outline: "none",
        }}
        onClick={togglePopup}
      >
        {i18n.language === "en" ? "Edit" : "تعديل"}
      </button>

      <div
        className=" speakerTicket-popup bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(300%, -50%)"
            : "translate(-50%, -50%)",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>{i18n.language === "en" ? "Booking Tickets" : "حجز التذاكر"}</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>
        <div className="d-flex justify-content-center">
          <Steps
            model={ticketsItems}
            activeIndex={showAttendanceCalendar ? 0 : 1}
            readOnly
            style={{ width: "50%", marginTop: "10px" }}
          />
        </div>
        <div className="popup-body d-flex flex-column flex-md-row justify-content-between align-items-center p-2 px-4 my-3">
          <div className="w-50 speakerTicket-data">
            <div className="d-flex gap-4 flex-column">
              <FloatLabel
                style={{ direction: i18n.language === "ar" ? "rtl" : "ltr", }}
                className="w-50 speakerTicket-inputTexts"
              >
                <InputText
                  id="cityFrom"
                  value={
                    selectedOption === "Attendance"
                      ? cityFrom
                      : cityFromDepature
                  }
                  style={{
                    fontSize: "1.25rem",
                    padding: "0.45rem 0.9375rem",
                    marginTop: "10px",
                    width: "100%",
                    border:"1px solid #eee"
                  }}
                  onChange={(e) =>
                    selectedOption === "Attendance"
                      ? setCityFrom(e.target.value)
                      : setCityFromDepature(e.target.value)
                  }
                />
                <label
                  style={{
                    right: i18n.language === "ar" ? "0" : "auto",
                  }}
                  htmlFor="cityFrom"
                >
                  {t("CityFrom")}
                </label>
              </FloatLabel>
              <FloatLabel
                className="w-50 speakerTicket-inputTexts"
                style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              >
                <InputText
                  id="cityTo"
                  value={
                    selectedOption === "Attendance" ? cityTO : cityTODepature
                  }
                  style={{
                    fontSize: "1.25rem",
                    padding: "0.45rem 0.9375rem",
                    marginTop: "10px",
                    width: "100%",
                    border:"1px solid #eee"
                  }}
                  onChange={(e) => {
                    return selectedOption === "Attendance"
                      ? setCityTO(e.target.value)
                      : setCityTODepature(e.target.value);
                  }}
                />
                <label
                  style={{
                    right: i18n.language === "ar" ? "0" : "auto",
                  }}
                  htmlFor="cityTo"
                >
                  {t("CityTo")}
                </label>
              </FloatLabel>
            </div>

            <SelectButton
              value={selectedOption}
              onChange={handleCalendarToggle}
              options={["Attendance", "Departure"]}
              className="w-100  d-flex  align-items-center my-5 gap-3"
              itemTemplate={itemTemplate}
            />
          </div>

          <div className="calendar w-50 ">
            {showAttendanceCalendar ? (
              <Calendar
                value={dates?.map((dateObj) => new Date(dateObj.attendDay))}
                // value={dates}
                onChange={(e) => {
                  const newDates = e.value.map((date) => {
                    const existingDate = dates?.find(
                      (dateObj) => dateObj.attendDay === date.toDateString()
                    );
                    return existingDate
                      ? existingDate
                      : { attendDay: date.toDateString(), dayMod: "PM" };
                  });
                  setDates(newDates);
                }}
                disabled={dates?.length >= 3}
                style={{ width: "100%" }}
                dateTemplate={dateTemplate}
                selectionMode="multiple"
                className="custom-calendar"
                readOnlyInput
                inline
              />
            ) : (
              <Calendar
                value={departureDates?.map(
                  (dateObj) => new Date(dateObj.departureDay)
                )}
                onChange={(e) => {
                  const newDates = e.value.map((date) => {
                    const existingDate = departureDates?.find(
                      (dateObj) => dateObj.departureDay === date.toDateString()
                    );

                    return existingDate
                      ? existingDate
                      : {
                          departureDay: date.toDateString(),
                          dayMod: "PM",
                          id: existingDate ? existingDate.id : 0, // Keep the existing id or set to 0 if it doesn't exist
                        };
                  });
                  setDepartureDates(newDates);
                }}
                style={{ width: "100%" }}
                dateTemplate={depatureDateTemplate}
                disabled={departureDates?.length >= 3}
                selectionMode="multiple"
                className="custom-calendar"
                readOnlyInput
                inline
              />
            )}
          </div>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          {showAttendanceCalendar
            ? dates?.map(({ attendDay, dayMod }, index) => (
                <div key={index}>
                  <div
                    className="m-2 rounded"
                    style={{ width: "100px", background: "#f2f2f2" }}
                  >
                    <div className="d-flex pt-2 justify-content-around flex-column align-items-center">
                      <span className="fw-bold fs-4">
                        {new Date(attendDay).getDate()}
                      </span>
                      <span>
                        {monthsOfYear[new Date(attendDay).getMonth()]}
                      </span>
                    </div>
                    <hr className="p-0 my-2" />
                    <div className="d-flex justify-content-around pb-2">
                      <span
                        onClick={() => {
                          setDates((prevDates) => {
                            const newDates = [...prevDates];
                            newDates[index].dayMod = "AM";
                            return newDates;
                          });
                        }}
                        style={{
                          background: dayMod === "AM" ? "gray" : "",
                          color: dayMod === "AM" ? "#fff" : "",
                        }}
                        className="p-1 fw-bold rounded"
                      >
                        AM
                      </span>
                      <span
                        onClick={() => {
                          setDates((prevDates) => {
                            const newDates = [...prevDates];
                            newDates[index].dayMod = "PM";
                            return newDates;
                          });
                        }}
                        style={{
                          background: dayMod === "PM" ? "gray" : "",
                          color: dayMod === "PM" ? "#fff" : "",
                        }}
                        className="p-1 rounded fw-bold"
                      >
                        PM
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      setDates(dates.filter((d) => d.attendDay !== attendDay))
                    }
                    label={t("Remove")}
                    className="p-button-danger p-button-rounded p-button-sm "
                    size="small"
                    raised
                    style={{
                      width: "80px",
                      marginInline: "auto",
                      marginBlock: "10px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "2rem",
                    }}
                  />
                </div>
              ))
            : departureDates?.map(({ departureDay, dayMod }, index) => (
                <div key={index}>
                  <div
                    className="m-2 rounded"
                    style={{ width: "100px", background: "#f2f2f2" }}
                  >
                    <div className="d-flex pt-2 justify-content-around flex-column align-items-center">
                      <span className="fw-bold fs-4">
                        {new Date(departureDay).getDate()}
                      </span>
                      <span>
                        {monthsOfYear[new Date(departureDay).getMonth()]}
                      </span>
                    </div>
                    <hr className="p-0 my-2" />
                    <div className="d-flex justify-content-around pb-2">
                      <span
                        onClick={() => {
                          setDepartureDates((prevDates) => {
                            const newDates = [...prevDates];
                            newDates[index].dayMod = "AM";
                            return newDates;
                          });
                        }}
                        style={{
                          background: dayMod === "AM" ? "gray" : "",
                          color: dayMod === "AM" ? "#fff" : "",
                        }}
                        className="p-1 fw-bold rounded"
                      >
                        AM
                      </span>
                      <span
                        onClick={() => {
                          setDepartureDates((prevDates) => {
                            const newDates = [...prevDates];
                            newDates[index].dayMod = "PM";
                            return newDates;
                          });
                        }}
                        style={{
                          background: dayMod === "PM" ? "gray" : "",
                          color: dayMod === "PM" ? "#fff" : "",
                        }}
                        className="p-1 rounded fw-bold"
                      >
                        PM
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      setDepartureDates(
                        departureDates.filter(
                          (d) => d.departureDay !== departureDay
                        )
                      )
                    }
                    className="p-button-danger p-button-rounded p-button-sm "
                    size="small"
                    raised
                    label={t("Remove")}
                    style={{
                      width: "80px",
                      marginInline: "auto",
                      marginBlock: "10px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "2rem",
                    }}
                  />
                </div>
              ))}
        </div>

        <div className="d-flex justify-content-between align-items-center p-2 px-4 gap-3 my-2">
          <Button
            className="w-50 border-0 rounded text-white py-2 align-items-center justify-content-center"
            disabled={
              dates?.length !== 3 ||
              departureDates?.length !== 3 ||
              !cityTO ||
              !cityFrom ||
              !cityTODepature ||
              !cityFromDepature
            }
            style={{
              backgroundColor: "#3296D4",
            }}
            onClick={handleConfirm}
          >
            {t("Confirm")}
          </Button>
          <button
            className="w-50 border-0 rounded text-dark py-2"
            style={{
              backgroundColor: "#F3F5F5",
            }}
            onClick={togglePopup}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </>
  );
}
