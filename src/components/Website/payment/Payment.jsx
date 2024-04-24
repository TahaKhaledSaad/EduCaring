import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE } from "../../../Api";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useCreditCardValidator } from "react-creditcard-validator";
import "./Payment.css";
import applePay from "../../../assets/Apple_Pay_logo.png";
import mada from "../../../assets/Mada_Logo.png";
import paypal from "../../../assets/PayPal_Logo.png";
import { PulseLoader } from "react-spinners";

export default function Payment() {
  const { i18n } = useTranslation();

  const { eventId } = useParams();

  const cookie = new Cookie();
  // const userId = cookie.get("userId");

  const [eventDetails, setEventDetails] = useState(null);
  const [userEventDays, setUserEventDays] = useState([]);

  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = cookie.get("edu-caring");
    const decodedToken = token ? jwtDecode(token) : {};
    setUserId(decodedToken.uid);

    // Fetch event details only if userId and eventId are available
    if (decodedToken.uid && eventId) {
      axios
        .get(`${BASE}/Event/GetForApp/${eventId}`, {
          headers: {
            UserId: decodedToken.uid,
            Language: i18n.language,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEventDetails(response.data.responseObject);
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
        })
        .finally(() => setLoading(false)); // Set loading to false when the data is fetched
    }
  }, [eventId, i18n.language]);

  // Rest of your code...

  console.log(eventDetails);

  const [selectedDayIndices, setSelectedDayIndices] = useState([]);

  const toggleDaySelection = (index) => {
    const isSelected = selectedDayIndices.includes(index);
    if (isSelected) {
      // If already selected, remove from selection
      setSelectedDayIndices(selectedDayIndices.filter((i) => i !== index));
      // Remove the day from userEventDays
      setUserEventDays(
        userEventDays.filter(
          (day) => day.eventDayId !== eventDetails.eventDays[index].id
        )
      );
    } else {
      // If not selected, add to selection
      setSelectedDayIndices([...selectedDayIndices, index]);
      // Add the day to userEventDays
      setUserEventDays([
        ...userEventDays,
        {
          id: 0,
          eventDayId: eventDetails.eventDays[index].id,
          eventId: eventId,
        },
      ]);
    }
  };

  // console.log(userEventDays);

  const [isPaid, setIsPaid] = useState(false);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (isPaid && userEventDays.length > 0) {
      // Check if isPaid is true and userEventDays has data
      axios
        .post(
          `${BASE}/Event/UserBuyEvents`,
          {
            id: 0,
            userId: userId,
            totalPrice: 400,
            priceAfterDiscount: 400,
            discount: 0,
            discountCode: "",
            isPaid: true,
            userEventDays: userEventDays,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "text/plain",
            },
          }
        )
        .then((data) => {
          console.log(data);
          setTickets(data.data.responseObject);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false)); // Set loading to false when the data is fetched
    }
  }, [isPaid, userEventDays, eventId]);

  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(false);
  // console.log(tickets);

  const handleContinueClick = () => {
    setIsPaid(true); // Set isPaid state to true when "Continue" button is clicked
    setShow(false);
    setShow2(true);
    setLoading(true);
  };

  function expDateValidate(month, year) {
    if (Number(year) > 2035) {
      return "Expiry Date Year cannot be greater than 2035";
    }
    return;
  }

  const {
    getCardNumberProps,
    getCVCProps,
    getExpiryDateProps,

    meta: { erroredInputs },
  } = useCreditCardValidator({ expiryDateValidator: expDateValidate });

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Check if dateString is undefined or null

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? "0" + day : day} ${month.slice(
      0,
      3
    )}, ${year}`;

    return formattedDate;
  };

  // Test the function with your date string
  const inputDateString = eventDetails?.startDay;
  const formattedDateString = formatDate(inputDateString);

  const subtotal = selectedDayIndices.reduce((total, selectedIndex) => {
    const price = eventDetails?.eventDays[selectedIndex]?.price || 0;
    return total + price;
  }, 0);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };
  const [selectedDayTicket, setSelectedDayTicket] = useState(0);

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
      {show && show ? (
        <div className="payment row p-4 justify-content-around">
          <div className="col-md-6 col-lg-6">
            <div className=" border rounded p-4 d-flex gap-4">
              <div className="d-flex flex-column align-items-center justify-content-around gap-4">
                <div
                  className={`p-2 ${
                    selectedPaymentMethod === "mada" ? " rounded" : ""
                  }`}
                  style={
                    selectedPaymentMethod === "mada"
                      ? {
                          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                        }
                      : { cursor: "pointer" }
                  }
                  onClick={() => handlePaymentMethodClick("mada")}
                >
                  <img
                    src={mada}
                    alt="mada pay img"
                    height={"30px"}
                    width={"45px"}
                  />
                </div>
                <div
                  className={`p-2  ${
                    selectedPaymentMethod === "paypal" ? "rounded" : ""
                  }`}
                  style={
                    selectedPaymentMethod === "paypal"
                      ? {
                          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                        }
                      : { cursor: "pointer" }
                  }
                  onClick={() => handlePaymentMethodClick("paypal")}
                >
                  <img
                    src={paypal}
                    alt="paypal pay img"
                    height={"30px"}
                    width={"45px"}
                  />
                </div>
                <div
                  className={`p-2 ${
                    selectedPaymentMethod === "applePay" ? " rounded" : ""
                  }`}
                  style={
                    selectedPaymentMethod === "applePay"
                      ? {
                          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                        }
                      : { cursor: "pointer" }
                  }
                  onClick={() => handlePaymentMethodClick("applePay")}
                >
                  <img
                    src={applePay}
                    alt="apple pay img"
                    height={"30px"}
                    width={"45px"}
                  />
                </div>
              </div>

              <div className="form flex-grow-1 overflow-hidden">
                <div className="d-flex flex-column my-3 position-relative">
                  <label
                    htmlFor="numCard"
                    style={{ color: "#747688", fontSize: "14px" }}
                  >
                    {i18n.language === "en" ? "Card Number" : "رقم البطاقة"}
                  </label>
                  <input
                    type="number"
                    id="numCard"
                    className="p-2 border rounded"
                    style={{ borderColor: "#DCDCDC", outline: "none" }}
                    {...getCardNumberProps()}
                  />

                  <small
                    className="text-danger position-absolute"
                    style={{ bottom: "-20px" }}
                  >
                    {i18n.language === "en"
                      ? erroredInputs.cardNumber && erroredInputs.cardNumber
                      : "ادخل رقم البطاقة الصحيح"}
                  </small>
                </div>

                <div className="d-flex flex-column my-3">
                  <label
                    htmlFor="name"
                    style={{ color: "#747688", fontSize: "14px" }}
                  >
                    {i18n.language === "en"
                      ? "Name On Card"
                      : "الاسم المكتوب على البطاقة"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="p-2 border rounded"
                    style={{ borderColor: "#DCDCDC", outline: "none" }}
                  />
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between  my-3 ">
                  <div className="d-flex flex-column col-md-6 col-lg-7 position-relative my-2">
                    <label
                      htmlFor="exDate"
                      style={{ color: "#747688", fontSize: "14px" }}
                    >
                      {i18n.language === "en" ? "Exp Date" : "انتهاء الصلاحية"}
                    </label>
                    <input
                      type="number"
                      id="exDate"
                      className="p-2 border rounded"
                      style={{ borderColor: "#DCDCDC", outline: "none" }}
                      {...getExpiryDateProps()}
                    />
                    <small
                      className="text-danger position-absolute"
                      style={{ bottom: "-20px" }}
                    >
                      {i18n.language === "en"
                        ? erroredInputs.expiryDate && erroredInputs.expiryDate
                        : "أدخل تاريخ انتهاء الصلاحية الصحيح"}
                    </small>
                  </div>

                  <div className="d-flex flex-column col-lg-4 col-md-3 position-relative my-2">
                    <label
                      htmlFor="cvv"
                      style={{ color: "#747688", fontSize: "14px" }}
                    >
                      CVC
                    </label>
                    <input
                      type="number"
                      id="cvv"
                      className="p-2 border rounded"
                      style={{ borderColor: "#DCDCDC", outline: "none" }}
                      {...getCVCProps()}
                    />
                    <small
                      className="text-danger position-absolute"
                      style={{ bottom: "-20px" }}
                    >
                      {erroredInputs.cvc && erroredInputs.cvc}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="border p-3 my-3 rounded d-flex gap-2 align-items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.9023 19.8701H17.3723C21.0723 19.8701 21.9923 18.9501 21.9923 15.2501C20.7123 15.2501 19.6823 14.2101 19.6823 12.9401C19.6823 11.6601 20.7123 10.6201 21.9923 10.6201V9.70008C21.9923 6.00008 21.0723 5.08008 17.3723 5.08008H10.9923V11.8701"
                  stroke="#C8C8C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.9936 16.87V19.87H8.22356C6.74356 19.87 5.87357 18.86 4.91357 16.54L4.73356 16.09C5.94356 15.61 6.53357 14.21 6.02357 13C5.53357 11.79 4.14357 11.21 2.92357 11.71L2.75357 11.28C1.31356 7.76 1.81357 6.53 5.33357 5.08L7.97357 4L10.9936 11.32V13.87"
                  stroke="#C8C8C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.16219 19.8701H7.99219"
                  stroke="#C8C8C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                className="border-0 outline-0 flex-grow-1 px-2"
                style={{ color: "#C8C8C8", outline: 0 }}
                placeholder={
                  i18n.language === "en" ? "Promocode" : "رقم العرض الترويجي"
                }
              />
              <button className="btn btn-secondary">
                {i18n.language === "en" ? "Apply" : "تم"}{" "}
              </button>
            </div>

            <div className="p-3 d-flex gap-3">
              {eventDetails &&
                eventDetails.eventDays.map((day, index) => {
                  if (day.isPaid === true) {
                    return null; // Skip this iteration
                  }

                  return (
                    <div key={index}>
                      <div
                        key={index}
                        className={`p-2 rounded fw-bold day-item ${
                          selectedDayIndices.includes(index) ? "selected" : ""
                        }`}
                        style={{
                          fontSize: "20px",
                          backgroundColor: selectedDayIndices.includes(index)
                            ? "#3296D4"
                            : "#F2F2F2",
                          color: selectedDayIndices.includes(index)
                            ? "white"
                            : "black",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleDaySelection(index)}
                      >
                        {i18n.language === "en"
                          ? `Day ${index + 1}`
                          : `اليوم ${index + 1}`}
                      </div>
                      <p
                        className="text-center"
                        style={{ fontSize: "16px", color: "#27AE60" }}
                      >
                        {day.price ? `${day.price} ${i18n.language === "en" ? "SAR" : "ريال"} ` : `${i18n.language === "en" ? "Free" : "مجانا"}`}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="col-md-6 col-lg-5">
            <div
              className="d-flex p-1 rounded gap-2 align-items-center"
              style={{ boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)" }}
            >
              <img
                src={eventDetails?.displayPrimeImageURL}
                alt="eventImg"
                width={"90px"}
                height={"90px"}
                className="rounded"
              />
              <div className="flex-grow-1 ">
                <h5 style={{ fontWeight: "900" }}>
                  {eventDetails.name.split(" ").slice(0, 9).join(" ")}{" "}
                  {eventDetails.name.split(" ").length > 3 ? "..." : ""}
                </h5>
                <p className="m-0">
                  <span className="px-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.77089 2.57666V1.66666C9.77089 1.42749 9.57255 1.22916 9.33339 1.22916C9.09422 1.22916 8.89589 1.42749 8.89589 1.66666V2.54166H5.10422V1.66666C5.10422 1.42749 4.90589 1.22916 4.66672 1.22916C4.42755 1.22916 4.22922 1.42749 4.22922 1.66666V2.57666C2.65422 2.72249 1.89005 3.66166 1.77339 5.05582C1.76172 5.22499 1.90172 5.36499 2.06505 5.36499H11.9351C12.1042 5.36499 12.2442 5.21916 12.2267 5.05582C12.1101 3.66166 11.3459 2.72249 9.77089 2.57666Z"
                        fill="#565656"
                      />
                      <path
                        d="M11.6667 6.23999H2.33333C2.0125 6.23999 1.75 6.50249 1.75 6.82332V10.4167C1.75 12.1667 2.625 13.3333 4.66667 13.3333H9.33333C11.375 13.3333 12.25 12.1667 12.25 10.4167V6.82332C12.25 6.50249 11.9875 6.23999 11.6667 6.23999ZM5.3725 11.1225C5.31417 11.175 5.25 11.2158 5.18 11.245C5.11 11.2742 5.03417 11.2917 4.95833 11.2917C4.8825 11.2917 4.80667 11.2742 4.73667 11.245C4.66667 11.2158 4.6025 11.175 4.54417 11.1225C4.43917 11.0117 4.375 10.86 4.375 10.7083C4.375 10.5567 4.43917 10.405 4.54417 10.2942C4.6025 10.2417 4.66667 10.2008 4.73667 10.1717C4.87667 10.1133 5.04 10.1133 5.18 10.1717C5.25 10.2008 5.31417 10.2417 5.3725 10.2942C5.4775 10.405 5.54167 10.5567 5.54167 10.7083C5.54167 10.86 5.4775 11.0117 5.3725 11.1225ZM5.495 8.88832C5.46583 8.95832 5.425 9.02249 5.3725 9.08082C5.31417 9.13332 5.25 9.17416 5.18 9.20332C5.11 9.23249 5.03417 9.24999 4.95833 9.24999C4.8825 9.24999 4.80667 9.23249 4.73667 9.20332C4.66667 9.17416 4.6025 9.13332 4.54417 9.08082C4.49167 9.02249 4.45083 8.95832 4.42167 8.88832C4.3925 8.81832 4.375 8.74249 4.375 8.66666C4.375 8.59082 4.3925 8.51499 4.42167 8.44499C4.45083 8.37499 4.49167 8.31082 4.54417 8.25249C4.6025 8.19999 4.66667 8.15916 4.73667 8.12999C4.87667 8.07166 5.04 8.07166 5.18 8.12999C5.25 8.15916 5.31417 8.19999 5.3725 8.25249C5.425 8.31082 5.46583 8.37499 5.495 8.44499C5.52417 8.51499 5.54167 8.59082 5.54167 8.66666C5.54167 8.74249 5.52417 8.81832 5.495 8.88832ZM7.41417 9.08082C7.35583 9.13332 7.29167 9.17416 7.22167 9.20332C7.15167 9.23249 7.07583 9.24999 7 9.24999C6.92417 9.24999 6.84833 9.23249 6.77833 9.20332C6.70833 9.17416 6.64417 9.13332 6.58583 9.08082C6.48083 8.96999 6.41667 8.81832 6.41667 8.66666C6.41667 8.51499 6.48083 8.36332 6.58583 8.25249C6.64417 8.19999 6.70833 8.15916 6.77833 8.12999C6.91833 8.06582 7.08167 8.06582 7.22167 8.12999C7.29167 8.15916 7.35583 8.19999 7.41417 8.25249C7.51917 8.36332 7.58333 8.51499 7.58333 8.66666C7.58333 8.81832 7.51917 8.96999 7.41417 9.08082Z"
                        fill="#565656"
                      />
                    </svg>
                  </span>
                  {formattedDateString}
                </p>
                <p>
                  <span className="px-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0284 5.42918C11.4159 2.73418 9.06506 1.52084 7.00006 1.52084C7.00006 1.52084 7.00006 1.52084 6.99422 1.52084C4.93506 1.52084 2.57839 2.72834 1.96589 5.42334C1.28339 8.43334 3.12672 10.9825 4.79506 12.5867C5.41339 13.1817 6.20672 13.4792 7.00006 13.4792C7.79339 13.4792 8.58672 13.1817 9.19922 12.5867C10.8676 10.9825 12.7109 8.43918 12.0284 5.42918ZM7.00006 8.35168C5.98506 8.35168 5.16256 7.52918 5.16256 6.51418C5.16256 5.49918 5.98506 4.67668 7.00006 4.67668C8.01506 4.67668 8.83756 5.49918 8.83756 6.51418C8.83756 7.52918 8.01506 8.35168 7.00006 8.35168Z"
                        fill="#565656"
                      />
                    </svg>
                  </span>
                  {eventDetails?.eventDays[selectedDayIndices]?.address
                    ? eventDetails?.eventDays[selectedDayIndices]?.address
                    : eventDetails?.eventDays[0]?.address}
                </p>
              </div>
            </div>

            <div className="w-75 mt-5 mx-auto">
              <h4>{i18n.language === "en" ? "Summary" : "الفاتورة"}</h4>
              <div className="border-bottom mt-4 mx-1">
                <div
                  className="d-flex justify-content-between my-2"
                  style={{ color: "#747688" }}
                >
                  <span>
                    {i18n.language === "en" ? "Subtotal" : "المجموع الفرعي"}{" "}
                  </span>
                  <span>{subtotal}</span>
                </div>

                <div
                  className="d-flex justify-content-between my-2"
                  style={{ color: "#747688" }}
                >
                  <span>{i18n.language === "en" ? "Fees" : "المصاريف"} </span>
                  <span>00  {i18n.language === "en" ? "SAR" : "ريال"}</span>
                </div>

                <div
                  className="d-flex justify-content-between my-2"
                  style={{ color: "#747688" }}
                >
                  <span>{i18n.language === "en" ? "Discount" : "الخصم"}</span>
                  <span>00  {i18n.language === "en" ? "SAR" : "ريال"}</span>
                </div>
              </div>
              <div className="total fw-bold d-flex justify-content-between pt-3">
                <span>
                  {i18n.language === "en" ? "Total" : "المجموع الكلي"}{" "}
                </span>
                <span>{subtotal}</span>
              </div>
              <Link
                className="d-block text-center w-100 mt-5 p-3  text-white"
                style={{ backgroundColor: "#3296D4", borderRadius: "12px" }}
                onClick={userEventDays.length > 0 ? handleContinueClick : ""}
              >
                {i18n.language === "en" ? "Continue" : "استمرار"}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {show2 && tickets && tickets.length > 0 ? (
        <div className="ticket row p-4 w-100 justify-content-around ">
          {tickets ? (
            <>
              <div className="d-flex flex-column align-items-center justify-content-center py-3 col-md-6 col-lg-5">
                <svg
                  width="254"
                  height="227"
                  viewBox="0 0 254 227"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_927_9270)">
                    <mask
                      id="mask0_927_9270"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="254"
                      height="227"
                    >
                      <path d="M253.07 0H0V227H253.07V0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_927_9270)">
                      <g opacity="0.5">
                        <path
                          d="M35.4297 112.911L154.385 44.5641L35.4297 112.911Z"
                          fill="white"
                        />
                        <path
                          d="M35.4297 112.911L154.385 44.5641"
                          stroke="#3296D4"
                          strokeWidth="29.2537"
                          strokeLinecap="round"
                        />
                      </g>
                      <g opacity="0.5">
                        <path
                          d="M63.7241 157.739L182.68 89.3914L63.7241 157.739Z"
                          fill="white"
                        />
                        <path
                          d="M63.7241 157.739L182.68 89.3914"
                          stroke="#3296D4"
                          strokeWidth="29.2537"
                          strokeLinecap="round"
                        />
                      </g>
                      <g opacity="0.5">
                        <path
                          d="M213.152 72.2165L222.423 66.8196L213.152 72.2165Z"
                          fill="white"
                        />
                        <path
                          d="M213.152 72.2165L222.423 66.8196"
                          stroke="#3296D4"
                          strokeWidth="29.2537"
                          strokeLinecap="round"
                        />
                      </g>
                      <g opacity="0.5">
                        <path
                          d="M105.691 194.618L196.033 141.85L105.691 194.618Z"
                          fill="white"
                        />
                        <path
                          d="M105.691 194.618L196.033 141.85"
                          stroke="#3296D4"
                          strokeWidth="29.2537"
                          strokeLinecap="round"
                        />
                      </g>
                      <path
                        d="M218.231 146.7C219.678 146.847 220.733 148.141 220.586 149.589C220.439 151.036 219.145 152.092 217.697 151.945C216.25 151.798 215.195 150.503 215.342 149.056C215.489 147.608 216.783 146.553 218.231 146.7Z"
                        stroke="#3296D4"
                        strokeWidth="1.36186"
                      />
                      <path
                        d="M64.6329 200.89C67.0128 201.131 68.7488 203.26 68.5069 205.64C68.265 208.02 66.1363 209.756 63.7563 209.514C61.3764 209.272 59.6404 207.143 59.8823 204.764C60.1242 202.384 62.2529 200.648 64.6329 200.89Z"
                        stroke="#3296D4"
                        strokeWidth="2.23948"
                      />
                      <path
                        d="M124.8 23.0169C127.18 23.2588 128.916 25.3875 128.674 27.7675C128.432 30.1475 126.304 31.8834 123.924 31.6415C121.544 31.3997 119.808 29.2709 120.05 26.891C120.292 24.511 122.42 22.7751 124.8 23.0169Z"
                        stroke="#3296D4"
                        strokeWidth="2.23948"
                      />
                      <path
                        d="M24.7048 79.4512C25.7977 79.4512 26.6851 80.3385 26.6851 81.4314C26.6851 82.5243 25.7977 83.4116 24.7048 83.4116C23.6119 83.4116 22.7246 82.5243 22.7246 81.4314C22.7246 80.3385 23.6119 79.4512 24.7048 79.4512Z"
                        stroke="#3296D4"
                        strokeWidth="1.63697"
                      />
                      <path
                        d="M178.507 208.585C179.6 208.585 180.487 209.472 180.487 210.565C180.487 211.658 179.6 212.545 178.507 212.545C177.414 212.545 176.527 211.658 176.527 210.565C176.527 209.472 177.414 208.585 178.507 208.585Z"
                        stroke="#3296D4"
                        strokeWidth="1.63697"
                      />
                      <path
                        d="M201.405 22.4678L203.055 14.6929"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M198.472 17.7993L206.247 19.4499"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M33.0596 152.213L34.3933 144.378"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M29.9397 147.667L37.7752 149"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M198.319 186.585L199.14 178.679"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M194.91 182.252L202.816 183.072"
                        stroke="#3296D4"
                        strokeWidth="0.953781"
                      />
                      <path
                        d="M126.57 56.3632C158.11 56.3632 183.718 81.971 183.718 113.511C183.718 145.05 158.11 170.658 126.57 170.658C95.0304 170.658 69.4226 145.05 69.4226 113.511C69.4226 81.971 95.0304 56.3632 126.57 56.3632Z"
                        fill="#3296D4"
                      />
                      <path
                        d="M126.537 61.7676C155.093 61.7676 178.279 84.9534 178.279 113.51C178.279 142.067 155.093 165.253 126.537 165.253C97.9798 165.253 74.7939 142.067 74.7939 113.51C74.7939 84.9534 97.9798 61.7676 126.537 61.7676Z"
                        fill="#3296D4"
                      />
                      <path
                        d="M103.169 115.408L117.158 129.079L149.904 96.3327"
                        stroke="white"
                        strokeWidth="5.72269"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_927_9270">
                      <rect width="253.07" height="227" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="mt-4 fw-bold">
                  {" "}
                  {i18n.language === "en" ? "Congratulations" : "مبروك"}
                </h3>
                <p>
                  {i18n.language === "en"
                    ? "you have a ticket now"
                    : "لديك التذكرة الآن"}
                </p>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="p-3 d-flex gap-3 justify-content-center">
                  {tickets &&
                    tickets.map((t, index) => (
                      <div key={index}>
                        <div
                          className={`p-2 rounded fw-bold day-item ${
                            selectedDayTicket === index ? "selected" : ""
                          }`}
                          style={{
                            fontSize: "20px",
                            backgroundColor: "#F2F2F2",
                            color: "black",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedDayTicket(index)}
                        >
                          {i18n.language === "en"
                            ? ` Day ${index + 1}`
                            : `اليوم ${index + 1}`}
                        </div>
                      </div>
                    ))}
                </div>
                {tickets &&
                  tickets.map((t, index) => (
                    <div
                      key={index}
                      className={`rounded overflow-hidden p-0 ${
                        selectedDayTicket !== index ? "hidden" : ""
                      }`}
                      style={{
                        boxShadow: "0 0 5px rgba(0,0,0,0.4)",
                        backgroundColor: "#F2F2F2",
                      }}
                    >
                      <img
                        src={eventDetails.displayPrimeImageURL}
                        style={{ objectFit: "cover" }}
                        alt="ticketImg"
                        className="w-100"
                        height={"220px"}
                      />
                      <div className="border-bottom d-flex gap-3 align-items-center px-3 py-1">
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <span
                            className="fw-bold m-0"
                            style={{
                              color: "#3296D4",
                              fontSize: "12px",
                              display: "block",
                            }}
                          >
                            {new Date(t.eventStartDay).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                          <p className="fw-bold p-0 m-0 fs-2">
                            {new Date(t.eventStartDay).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <p className="fs-4 fw-bold">{t.eventDayName}</p>
                      </div>

                      <div className="QR p-3 text-center">
                        <img
                          src={t.qrCode}
                          alt="qrCode"
                          width={"265px"}
                          height={"244px"}
                        />
                        <p
                          className="m-0"
                          style={{ fontSize: "12px", color: "#323232" }}
                        >
                          {i18n.language === "en"
                            ? "verified by @EduCaring"
                            : `@EduCaring تم التحقق منها بواسطة`}
                        </p>
                        <button
                          className="text-uppercase border-0 w-100 p-2 rounded my-3 text-white"
                          style={{ backgroundColor: "#565656" }}
                          onClick={() => {
                            const content = `
                        <html>
                        <head>
                        <title>Ticket</title>
                      <style>
                      @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap");
                      body {
                        font-family: "Cairo", sans-serif;
                      }
                      .ticket-content{
                        width:350px;
                        box-shadow:0 0 5px rgba(0,0,0,0.2);
                        margin:20px auto;
                        padding:5px;
                        background-color:#F2F2F2;
                      }
                      .eventImg{
                        height:220px;
                        width:100%;
                      }
                      .ticket-content .content{
                        display:flex;
                        gap:20px;
                        padding:10px;
                        align-items:center;
                      }
                      .month{
                        color: #3296D4;
                        font-weight:bold;
                        margin:0;
                        font-size:12px;
                      }
                      .day{
                        font-weight:bold;
                        margin:0;
                        font-size:20px;
                      }
                      .name{
                        font-size:22px;
                        font-weight:bold;
                      }
                      .QR {
                        text-align:center;
                        padding:10px;
                      }
                      </style>
                      </head>
                        <body>
                        <div class="ticket-content">
                        <img
                        src=${eventDetails.displayPrimeImageURL}
                        alt="ticketImg"
                        class="eventImg"
                       
                      />
                      <div class="content">
                        <div>
                          <span
                            class="month"
                            
                          >
                            ${new Date(t.eventStartDay).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                          <p class="day">
                            ${new Date(t.eventStartDay).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <p class="name">${t.eventDayName}</p>
                      </div>
    
                      <div class="QR">
                        <img
                          src=${t.qrCode}
                          alt="qrCode"
                          width="265px"
                          height="244px"
                        />
                        <p
                          className="m-0"
                          style={{ fontSize: "12px", color: "#323232" }}
                        >
                          verified by @EduCaring
                        </p>
                        
                        </div>
                        </body>
                        </html> `;
                            const printWindow = window.open("", "_blank");
                            printWindow.document.open();
                            printWindow.document.write(content);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                        >
                          {i18n.language === "en"
                            ? `print pdf `
                            : " pdf طباعة "}

                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="29"
                              height="29"
                              rx="14.5"
                              fill="white"
                              fillOpacity="0.2"
                            />
                            <path
                              d="M12.4272 12.2916H17.5731V11.2083C17.5731 10.125 17.1668 9.58331 15.9481 9.58331H14.0522C12.8335 9.58331 12.4272 10.125 12.4272 11.2083V12.2916Z"
                              stroke="white"
                              strokeWidth="0.8125"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17.1668 16.625V18.7917C17.1668 19.875 16.6252 20.4167 15.5418 20.4167H14.4585C13.3752 20.4167 12.8335 19.875 12.8335 18.7917V16.625H17.1668Z"
                              stroke="white"
                              strokeWidth="0.8125"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.875 13.9167V16.625C19.875 17.7084 19.3333 18.25 18.25 18.25H17.1667V16.625H12.8333V18.25H11.75C10.6667 18.25 10.125 17.7084 10.125 16.625V13.9167C10.125 12.8334 10.6667 12.2917 11.75 12.2917H18.25C19.3333 12.2917 19.875 12.8334 19.875 13.9167Z"
                              stroke="white"
                              strokeWidth="0.8125"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17.7082 16.625H17.0528H12.2915"
                              stroke="white"
                              strokeWidth="0.8125"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.2915 14.4583H13.9165"
                              stroke="white"
                              strokeWidth="0.8125"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
