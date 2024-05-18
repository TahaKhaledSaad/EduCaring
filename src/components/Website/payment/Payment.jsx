import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE } from "../../../Api";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import "./Payment.css";
import applePay from "../../../assets/Apple_Pay_logo.png";
import mada from "../../../assets/Mada_Logo.png";
import paypal from "../../../assets/PayPal_Logo.png";
import { PulseLoader } from "react-spinners";

export default function Payment() {
  // [0] stats
  const { i18n } = useTranslation();
  const { eventId } = useParams();
  const cookie = new Cookie();
  const [eventDetails, setEventDetails] = useState(null);
  const [userEventDays, setUserEventDays] = useState([]);
  const [userId, setUserId] = useState("");
  const [show, setShow] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");
  const [paymentMethodLink, setPaymentMethodLink] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [inputLength, setInputLength] = useState(false);
  const [selectedDayIndices, setSelectedDayIndices] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [apply, setApply] = useState(false);
  const [open, setOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isSuceess, setIsSuccess] = useState(true);

  // [1] Fetch event details
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

  // check promo code and get discount
  useEffect(() => {
    if (apply) {
      console.log("promo code:", promoCode);
      axios
        .get(`${BASE}/PromoCode/CheckPromoCode`, {
          headers: {
            Accept: "text/plain",
          },
          params: {
            promoCode: promoCode,
          },
        })
        .then((response) => {
          console.log(response);
          setApply(false);
          setIsSuccess(response.data.isSuccess);
          setDiscount(response.data.responseObject.discountPercentage);
        })
        .catch((error) => {
          console.error("Error checking promo code:", error);
        });
    }
  }, [apply]);

  // Function to toggle day selection
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

  // compute subtotal for selected days
  const subtotal = selectedDayIndices.reduce((total, selectedIndex) => {
    const price = eventDetails?.eventDays[selectedIndex]?.price || 0;
    return total + price;
  }, 0);

  // compute total after discount
  const total = subtotal - (subtotal * discount) / 100;
  console.log("total :", total);

  // Fetch payment method link when userEventDays is updated and click on continue btn
  useEffect(() => {
    if (userEventDays.length > 0 && open) {
      axios
        .post(
          `${BASE}/Event/UserBuyEvents2`,
          {
            id: 0,
            userId: userId,
            totalPrice: subtotal,
            priceAfterDiscount: total,
            discount: (subtotal * discount) / 100,
            discountCode: promoCode,
            affiliateCode: affiliateCode,
            isPaid: false,
            userEventDays: userEventDays,
            PaymentMethod: "PayPal",
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
          setPaymentMethodLink(data.data.responseObject.url);
          setOpen(false);
          setPromoCode("");
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false)); // Set loading to false when the data is fetched
    }
  }, [userEventDays, eventId, userId, open]);
  console.log(paymentMethodLink);

  const navigate = useNavigate();
  // open new window with paymentMethodLink when it is available
  useEffect(() => {
    // open new window with paymentMethodLink
    if (paymentMethodLink) {
      //window.open(paymentMethodLink, "_blank");
      
        const newWindow = window.open(paymentMethodLink, '_blank');
        if (newWindow) {
            newWindow.focus();
          navigate("/home");

        } else {
            window.location.href = paymentMethodLink;
        }
    
    }
  }, [paymentMethodLink]);
  console.log(open);

  // [5] Format date to show in the event box
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
  const inputDateString = eventDetails?.startDay;
  const formattedDateString = formatDate(inputDateString);

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Render loading spinner while loading is true
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

  // Function to handle input change in promo code input
  const handlePromoInput = (e) => {
    const value = e.target.value;
    setPromoCode(value);
    setInputLength(value.length >= 5);
    setIsSuccess(true);
  };
  // Function to handle input change in affiliate code input
  const handleAffiliateChange = (e) => {
    const value = e.target.value;
    setAffiliateCode(value);
  };

  console.log("promocode:", promoCode);
  console.log("affiliateCode:", affiliateCode);
  console.log(isSuceess);
  return (
    <>
      {show && show ? (
        <div className="payment row p-4 justify-content-around">
          <div className="col-md-6 col-lg-6">
            <div className=" border rounded p-4 d-flex gap-4">
              <div className="d-flex align-items-center justify-content-around align-items-center gap-4 w-100">
                <div
                  className={`p-2 ${
                    selectedPaymentMethod === "mada" ? " rounded" : ""
                  }`}
                  style={
                    // selectedPaymentMethod === "mada"
                    //   ? {
                    //       boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                    //       cursor: "pointer",
                    //     }
                    //   : { cursor: "pointer" }
                    {
                      opacity: 0.5,
                    }
                  }
                  onClick={() => handlePaymentMethodClick("mada")}
                >
                  <img
                    src={mada}
                    alt="mada pay img"
                    height={"30px"}
                    width={"45px"}
                  />
                  <p
                    className="text-danger text-center m-0"
                    style={{ fontSize: "12px" }}
                  >
                    Soon
                  </p>
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
                    className="m-1"
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
                    // selectedPaymentMethod === "applePay"
                    //   ? {
                    //       boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                    //       cursor: "pointer",
                    //     }
                    //   : { cursor: "pointer" }
                    {
                      opacity: 0.5,
                    }
                  }
                  onClick={() => handlePaymentMethodClick("applePay")}
                >
                  <img
                    src={applePay}
                    alt="apple pay img"
                    height={"30px"}
                    width={"45px"}
                  />
                  <p
                    className="text-danger text-center m-0"
                    style={{ fontSize: "12px" }}
                  >
                    Soon
                  </p>
                </div>
              </div>
            </div>

            <div className="border p-3 my-4 rounded d-flex gap-2 align-items-center position-relative">
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
                value={promoCode}
                onChange={handlePromoInput}
              />
              <button
                className={`btn btn-secondary ${
                  inputLength ? "bg-success" : ""
                }`}
                onClick={() => {
                  setApply(true);
                }}
              >
                {i18n.language === "en" ? "Apply" : "تم"}{" "}
              </button>
              {isSuceess === false ? (
                <p
                  className="position-absolute"
                  style={{
                    bottom: "-45px",
                    left: i18n.language === "en" ? "40px" : "auto",
                    right: i18n.language === "en" ? "auto" : "40px",
                    color: "red",
                    fontSize:"14px"
                  }}
                >
                  {i18n.language === "en"
                    ? "Invalid Promo Code"
                    : "رمز العرض غير صالح"}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="border p-3 my-5 rounded d-flex gap-2 align-items-center">
              <input
                type="text"
                className="border-0 outline-0 flex-grow-1 px-2"
                style={{ color: "#C8C8C8", outline: 0 }}
                placeholder={
                  i18n.language === "en" ? "Affiliate Code" : " رمز الشريك"
                }
                value={affiliateCode}
                onChange={handleAffiliateChange}
              />
            </div>
            <div className="p-3 d-flex gap-3">
              {eventDetails &&
                eventDetails.eventDays.map((day, index) => {
                  if (day.isPaid === true || day.noOfTickets === 0) {
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
                        {/* {i18n.language === "en"
                          ? `Day ${index + 1}`
                          : `اليوم ${index + 1}`} */}
                          {day.name}
                      </div>
                      <p
                        className="text-center"
                        style={{ fontSize: "16px", color: "#27AE60" }}
                      >
                        {day.price
                          ? `${day.price} ${
                              i18n.language === "en" ? "SAR" : "ريال"
                            } `
                          : `${i18n.language === "en" ? "Free" : "مجانا"}`}
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
                  <span>00 {i18n.language === "en" ? "SAR" : "ريال"}</span>
                </div>

                <div
                  className="d-flex justify-content-between my-2"
                  style={{ color: "#747688" }}
                >
                  {/* (subtotal * discount) / 100; */}
                  <span>{i18n.language === "en" ? "Discount" : "الخصم"}</span>
                  <span>
                    {(subtotal * discount) / 100}{" "}
                    {i18n.language === "en" ? "SAR" : "ريال"}
                  </span>
                </div>
              </div>
              <div className="total fw-bold d-flex justify-content-between pt-3">
                <span>
                  {i18n.language === "en" ? "Total" : "المجموع الكلي"}{" "}
                </span>
                <span>{total}</span>
              </div>
              <Link
                className="d-block text-center w-100 mt-5 p-3  text-white"
                style={{ backgroundColor: "#3296D4", borderRadius: "12px" }}
                onClick={() => {
                  setOpen(true);
                }}
                // to={paymentMethodLink ? "/home" : ""}
              >
                {i18n.language === "en" ? "Continue" : "استمرار"}
              </Link>
            </div>
          </div>
          {!paymentMethodLink && open ? (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75 d-flex align-items-center justify-content-center"
              style={{ zIndex: 99999 }}
            >
              <p className="text-white fs-1">
                {i18n.language === "en" ? "Please wait" : "يرجى الانتظار"}
              </p>
            </div>
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
