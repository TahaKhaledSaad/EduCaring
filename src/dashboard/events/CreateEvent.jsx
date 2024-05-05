import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./createEvent.css";
import {
  ADD_EVENT,
  BASE,
  EVENT_GALLERY_RESORSES,
  EVENT_RESORSES,
  GET_SPEAKERS,
  UPLOAD,
} from "../../API/Api";
import { Accordion } from "react-bootstrap";
import LoadingScreen from "../../DashboardComponents/LoadingScreen";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";

const CreateEvent = () => {
  const nav = useNavigate();
  const toast = useRef(null);

  const cookies = new Cookie();

  const token = cookies.get("edu-caring");
  //

  const [speakers, setSpeakers] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_SPEAKERS}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setSpeakers(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  const { t } = useTranslation();
  // TODO Main Data
  const questionObj = {
    id: 0,
    eventDayId: 0,
    questionAr: "",
    questionEn: "",
    point: 0,
    eventDayQuestionAnswers: [
      {
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      },
    ],
  };

  const dayObj = {
    id: 0,
    eventId: 0,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    address: "",
    addressGPSLink: "",
    iFramAddressLink: "",
    latitude: "",
    longitude: "",
    eventStartDay: "",
    noOfTickets: 0,
    price: 0,
    linkZoom: "",
    linkUploadedVideo: "",
    displayLinkUploadedVideo: "",
    isDeleted: false,
    isOnline: false,
    isOffline: false,
    eventDaySpeakers: [
      {
        id: 0,
        eventDayId: 0,
        speakerId: "",
        startSpeakTime: "",
        endSpeakTime: "",
      },
    ],
    eventDayQuestions: [questionObj],
  };

  const [eventData, setEventData] = useState({
    id: 0,
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    primeImageURL: "",
    displayPrimeImageURL: "",
    startDay: "",
    endDay: "",
    startSellTicketDay: "",
    endSellTicketDay: "",
    isDeleted: false,
    isOnline: false,
    isOffline: false,
    totalPrice: 0,
    eventDays: [{ ...dayObj, eventDayQuestions: [questionObj] }],
    eventImages: [
      {
        id: 0,
        eventId: 0,
        imageURL: "",
        displayImageURL: "<string>",
      },
    ],
  });

  // *********************************
  // *********************************

  //TODO Event Changes and Images && Video Upload

  const handleEventChange = (e) => {
    const { id, value, type, checked } = e.target;

    setEventData((prevEvent) => ({
      ...prevEvent,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChangeAndSendPrime = async (e) => {
    e.preventDefault();
    // [1]
    const file = e.target.files.item(0);
    // [2]
    if (file) {
      const formData = new FormData();
      formData.append("Content", file); // Change the property name to 'Content'
      // [3]
      try {
        const uploadResult = await axios.post(
          `${BASE}/${UPLOAD}/${EVENT_RESORSES}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEventData({
          ...eventData,
          primeImageURL: uploadResult.data.responseObject.insert,
          displayPrimeImageURL: uploadResult.data.responseObject.display,
        });
      } catch (error) {}
    }
  };
  ////////////////////////////////////////////////////
  const handleEventImagesChangeAndSendImages = async (e) => {
    e.preventDefault();

    const files = e.target.files;

    if (files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("Content", files[i]);
      }
      setLoading(true);
      try {
        const uploadResult = await axios.post(
          `${BASE}/${UPLOAD}/${EVENT_GALLERY_RESORSES}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Assuming uploadResult.data is an array of image URLs
        const eventImages = uploadResult.data.responseObject.map(
          (imageUrl, i) => ({
            id: 0,
            eventId: 0, // You need to replace this with the actual event ID
            imageURL: imageUrl.insert,
            displayImageURL: imageUrl.display,
          })
        );

        // Now you can update your state or send this data to the server as needed
        setEventData((prevData) => {
          const oldImgs = prevData.eventImages.filter(
            (img) => img.displayImageURL !== "<string>"
          );
          return {
            ...prevData,
            eventImages: [...oldImgs, ...eventImages],
          };
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoChangeAndSend = async (e, dayIndex) => {
    e.preventDefault();

    const file = e.target.files.item(0);

    if (file) {
      const formData = new FormData();
      formData.append("Content", file);

      try {
        const uploadResult = await axios.post(
          `${BASE}/${UPLOAD}/${EVENT_RESORSES}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEventData((prevEventData) => {
          const updatedEventDays = [...prevEventData.eventDays];
          updatedEventDays[dayIndex] = {
            ...updatedEventDays[dayIndex],
            linkUploadedVideo: uploadResult.data.responseObject.insert,
            displayLinkUploadedVideo: uploadResult.data.responseObject.display,
          };

          return {
            ...prevEventData,
            eventDays: updatedEventDays,
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // *********************************
  // *********************************

  //TODO Day Changes and Remove

  const handleDayChange = (e, dayIndex) => {
    const { name, value, type, checked } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      eventDays: prevData.eventDays.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              [name]: type === "checkbox" ? checked : value,
            }
          : day
      ),
    }));
  };

  const handleDayRemove = (dayIndex) => {
    const list = [...eventData.eventDays];
    list.splice(dayIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleDayAdd = () => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays.push({ ...dayObj, id: 0, eventId: 0 });
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  //TODO Speakers Changes and Remove

  const handleSpeakerChange = (e, dayIndex, spIndex) => {
    const { name, value } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays[dayIndex].eventDaySpeakers = updatedEventDays[
        dayIndex
      ].eventDaySpeakers.map((speaker, index) => {
        if (index === spIndex) {
          return { ...speaker, [name]: value };
        }
        return speaker;
      });
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };
  const handleSpeakerNameChange = (e, dayIndex, spIndex) => {
    const { value } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays[dayIndex].eventDaySpeakers = updatedEventDays[
        dayIndex
      ].eventDaySpeakers.map((speaker, index) => {
        if (index === spIndex) {
          return { ...speaker, speakerId: value.id };
        }
        return speaker;
      });
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleSpeakerRemove = (dayIndex, spIndex) => {
    const list = [...eventData.eventDays];
    list[dayIndex].eventDaySpeakers.splice(spIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleSpeakerAdd = (dayIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentDay = updatedEventDays[dayIndex];

      currentDay.eventDaySpeakers.push({
        id: 0,
        eventDayId: 0,
        speakerId: "",
        startSpeakTime: "",
        endSpeakTime: "",
      });

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  //TODO Questions Changes and Remove

  const handleQuestionChange = (e, dayIndex, questionIndex) => {
    const { name, value } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      updatedEventDays[dayIndex].eventDayQuestions = updatedEventDays[
        dayIndex
      ].eventDayQuestions.map((question, index) => {
        if (index === questionIndex) {
          return { ...question, [name]: value };
        }
        return question;
      });
      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleQuestionRemove = (dayIndex, questionIndex) => {
    const list = [...eventData.eventDays];
    list[dayIndex].eventDayQuestions.splice(questionIndex, 1);
    setEventData({ ...eventData, eventDays: list });
  };

  const handleQuestionAdd = (dayIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentDay = updatedEventDays[dayIndex];

      const newQuestion = {
        id: 0,
        eventDayId: 0,
        questionAr: "",
        questionEn: "",
        point: 0,
        eventDayQuestionAnswers: [], // Initialize an empty array for answers
      };

      // Add one initial answer to the new question
      newQuestion.eventDayQuestionAnswers.push({
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      });

      currentDay.eventDayQuestions.push(newQuestion);

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  // TODO Answers Changes and Remove

  const handleAnswerChange = (e, dayIndex, questionIndex, answerIndex) => {
    const { name, value, type, checked } = e.target;
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion =
        updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      const updatedAnswers = currentQuestion.eventDayQuestionAnswers.map(
        (answer, index) => {
          if (index === answerIndex) {
            if (type === "checkbox") {
              return { ...answer, [name]: checked };
            } else {
              return { ...answer, [name]: value };
            }
          }
          return answer;
        }
      );

      // Update the answers array for the current question
      currentQuestion.eventDayQuestionAnswers = updatedAnswers;

      return {
        ...prevEventData,
        eventDays: updatedEventDays,
      };
    });
  };

  const handleAnswerAdd = (dayIndex, questionIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion =
        updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      currentQuestion.eventDayQuestionAnswers.push({
        id: 0,
        eventDayQuestionId: 0,
        answerAr: "",
        answerEn: "",
        isTrueAnswer: false,
      });

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  const handleAnswerRemove = (dayIndex, questionIndex, answerIndex) => {
    setEventData((prevEventData) => {
      const updatedEventDays = [...prevEventData.eventDays];
      const currentQuestion =
        updatedEventDays[dayIndex].eventDayQuestions[questionIndex];

      // Remove the answer at the specified index
      currentQuestion.eventDayQuestionAnswers.splice(answerIndex, 1);

      return { ...prevEventData, eventDays: updatedEventDays };
    });
  };

  // *********************************
  // *********************************

  const [loading, setLoading] = useState(false);
  // Submit Function
  async function submit(e) {
    setLoading(true);
    e.preventDefault();

    try {
      let result = await axios
        .post(`${BASE}/${ADD_EVENT}`, eventData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200 && res.isSuccess) {
            toast.current.show({
              severity: "success",
              summary: t("Created"),
              detail: t("EventCreatedSucc"),
              life: 3000,
            });
          } else {
            toast.current.show({
              severity: "error",
              summary: t("Error"),
              detail: "Something Went wrong",
              life: 3000,
            });
          }
        })
        .then((e) => {
          nav("../events");
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: t("Error"),
        detail: error.message,
        life: 3000,
      });
    }
  }

  // TODO Return ----------

  return (
    <>
      <Toast ref={toast} />
      {loading && <LoadingScreen status="Adding..." />}
      <div>
        <h2 className="main-title fw-bold text-muted">
          {t("Event")} <small>{t("AddNewEvent")}</small>
        </h2>
        <form onSubmit={submit}>
          <div className="event-main-data shadow-sm rounded">
            {/* Boxs */}
            <div className="boxs">
              <div className="box">
                <label htmlFor="nameAr">{t("ArabicName")}</label>
                <input
                  type="text"
                  id="nameAr"
                  placeholder={t("EventNameInArabic")}
                  value={eventData.nameAr}
                  required
                  onChange={(e) => handleEventChange(e)}
                />
              </div>

              <div className="box">
                <label htmlFor="nameEn">{t("EnglishName")}</label>
                <input
                  type="text"
                  id="nameEn"
                  placeholder={t("EventNameInEnglish")}
                  value={eventData.nameEn}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="descriptionAr">{t("ArabicDescription")}</label>
                <input
                  type="text"
                  id="descriptionAr"
                  placeholder={t("EventDescriptionInArabic")}
                  value={eventData.descriptionAr}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="descriptionEn">{t("EnglishDescription")}</label>
                <input
                  type="text"
                  id="descriptionEn"
                  placeholder={t("EventDescriptionInEnglish")}
                  value={eventData.descriptionEn}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="startDay">{t("StartDayOfEvent")}</label>
                <input
                  type="datetime-local"
                  id="startDay"
                  value={eventData.startDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="endDay">{t("EndDayOfEvent")}</label>
                <input
                  type="datetime-local"
                  id="endDay"
                  value={eventData.endDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="startSellTicketDay">
                  {t("StartSellTicketDay")}
                </label>
                <input
                  type="datetime-local"
                  id="startSellTicketDay"
                  value={eventData.startSellTicketDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="endSellTicketDay">
                  {t("EndSellTicketDay")}
                </label>
                <input
                  type="datetime-local"
                  id="endSellTicketDay"
                  value={eventData.endSellTicketDay}
                  onChange={(e) => handleEventChange(e)}
                  required
                />
              </div>

              <div className="box">
                <label htmlFor="totalPrice">{t("TotalPrice")}</label>
                <input
                  type="number"
                  id="totalPrice"
                  value={eventData.totalPrice}
                  onChange={(e) => handleEventChange(e)}
                />
              </div>

              {/* Checkbox for isOnline */}
              <div className="box-bool">
                <label>{t("WillThisEventBeOnline")}</label>
                <div className="checkbox-wrapper-10">
                  <input
                    className="tgl tgl-flip"
                    type="checkbox"
                    id="isOnline"
                    checked={eventData.isOnline}
                    onChange={(e) => handleEventChange(e)}
                  />
                  <label
                    className="tgl-btn"
                    data-tg-off="No"
                    data-tg-on="Yes"
                    htmlFor="isOnline"
                  ></label>
                </div>
              </div>

              {/* Checkbox for isOffline */}
              <div className="box-bool">
                <label>{t("WillThisEventBeOffline")}</label>
                <div className="checkbox-wrapper-10">
                  <input
                    className="tgl tgl-flip"
                    type="checkbox"
                    id="isOffline"
                    checked={eventData.isOffline}
                    onChange={(e) => handleEventChange(e)}
                  />
                  <label
                    className="tgl-btn"
                    data-tg-off="No"
                    data-tg-on="Yes"
                    htmlFor="isOffline"
                  ></label>
                </div>
              </div>
            </div>

            {/* Uploads Container */}
            <div className="">
              <h5 className="text-muted my-4 mt-4 mx-3 fw-bold border-bottom border-secondary pb-2 mb-2">
                {t("EventImages")}
              </h5>

              {/* Prime Image Upload */}
              <div className="d-flex align-items-center mx-3 my-3 p-0">
                <div className="box-upload">
                  <label htmlFor="primeImg" className="upload ">
                    <i className="fas fa-image"></i>
                    <span>{t("UploadPrimeImage")}</span>
                  </label>
                  <input
                    type="file"
                    id="primeImg"
                    onChange={(e) => handleImageChangeAndSendPrime(e)}
                    hidden
                  />
                </div>
                <div className="mx-4 bg-secondary-subtle p-3 rounded border-secondary">
                  {eventData.displayPrimeImageURL && (
                    <img
                      src={`${eventData.displayPrimeImageURL}`}
                      height={"120px"}
                      alt=""
                      className="rounded"
                    />
                  )}
                </div>
              </div>

              {/* Event Images Upload */}
              <div className="box-upload m-3">
                <label htmlFor="eventImages" className="upload w-100">
                  <i className="fas fa-images"></i>
                  <span>{t("UploadEventImages")}</span>
                </label>
                <input
                  type="file"
                  id="eventImages"
                  onChange={(e) => handleEventImagesChangeAndSendImages(e)}
                  multiple
                  hidden
                />
              </div>
              <div className="bg-secondary-subtle mx-3 rounded d-flex justify-content-start gap-4 p-4 align-items-center flex-wrap">
                {eventData.eventImages &&
                  eventData.eventImages.map((image, index) => (
                    <div key={index}>
                      {image.displayImageURL && (
                        <img
                          src={`${image.displayImageURL}`}
                          height={"100px"}
                          style={{ margin: "auto" }}
                          alt=""
                          className="rounded"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Event Days */}
          <Accordion defaultActiveKey="0" flush>
            <h4 className="text-muted my-4 mt-4 fw-bold border-bottom border-secondary pb-2 mb-2">
              {t("EventDays")}
            </h4>
            {eventData.eventDays.map((singleDay, dayIndex) => (
              <div className="event-day" key={dayIndex}>
                <Accordion.Item eventKey={dayIndex} className="my-2">
                  <Accordion.Header>
                    {t("Day")} #{dayIndex + 1}
                  </Accordion.Header>
                  <Accordion.Body className=" shadow-sm rounded">
                    <div className="day-content m-0 p-0">
                      {/* Main Event Day Data */}
                      <div className="boxs">
                        <div className="box">
                          <label htmlFor={`nameAr${dayIndex}`}>
                            {t("ArabicName")}
                          </label>
                          <input
                            type="text"
                            id={`nameAr${dayIndex}`}
                            name="nameAr"
                            placeholder={t("EventNameInArabic")}
                            value={singleDay.nameAr}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`nameEn${dayIndex}`}>
                            {t("EnglishName")}
                          </label>
                          <input
                            type="text"
                            id={`nameEn${dayIndex}`}
                            name="nameEn"
                            placeholder={t("EventNameInEnglish")}
                            value={singleDay.nameEn}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`descriptionAr${dayIndex}`}>
                            {t("ArabicDescription")}
                          </label>
                          <input
                            type="text"
                            id={`descriptionAr${dayIndex}`}
                            name="descriptionAr"
                            placeholder={t("EventDescriptionInArabic")}
                            value={singleDay.descriptionAr}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`descriptionEn${dayIndex}`}>
                            {t("EnglishDescription")}
                          </label>
                          <input
                            type="text"
                            id={`descriptionEn${dayIndex}`}
                            name="descriptionEn"
                            placeholder={t("EventDescriptionInEnglish")}
                            value={singleDay.descriptionEn}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`address${dayIndex}`}>
                            {t("Address")}
                          </label>
                          <input
                            type="text"
                            id={`address${dayIndex}`}
                            name="address"
                            placeholder={t("EventAdress")}
                            value={singleDay.address}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`addressGPSLink${dayIndex}`}>
                            {t("AddressGpsLink")}
                          </label>
                          <input
                            type="url"
                            id={`addressGPSLink${dayIndex}`}
                            name="addressGPSLink"
                            placeholder={t("LocationOfTheEvent")}
                            value={singleDay.addressGPSLink}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`iFramAddressLink${dayIndex}`}>
                            {t("IFramAddressLink")}
                          </label>
                          <input
                            type="url"
                            id={`iFramAddressLink${dayIndex}`}
                            name="iFramAddressLink"
                            placeholder={t("LinkOfIFrame")}
                            value={singleDay.iFramAddressLink}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`latitude${dayIndex}`}>
                            {t("Latitude")}
                          </label>
                          <input
                            type="text"
                            id={`latitude${dayIndex}`}
                            name="latitude"
                            placeholder={t("LatitudeOfLocation")}
                            value={singleDay.latitude}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`longitude${dayIndex}`}>
                            {t("longitude")}
                          </label>
                          <input
                            type="text"
                            id={`longitude${dayIndex}`}
                            name="longitude"
                            placeholder={t("LongitudeOfLocation")}
                            value={singleDay.longitude}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`eventStartDay${dayIndex}`}>
                            {t("EventStartDay")}
                          </label>
                          <input
                            type="datetime-local"
                            id={`eventStartDay${dayIndex}`}
                            name="eventStartDay"
                            placeholder={t("EventStartDay")}
                            value={singleDay.eventStartDay}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`noOfTickets${dayIndex}`}>
                            {t("NoOfTickets")}
                          </label>
                          <input
                            type="number"
                            id={`noOfTickets${dayIndex}`}
                            name="noOfTickets"
                            placeholder={t("NumberOfTickets")}
                            value={singleDay.noOfTickets}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`price${dayIndex}`}>
                            {t("Price")}
                          </label>
                          <input
                            type="number"
                            id={`price${dayIndex}`}
                            name="price"
                            placeholder={t("PriceOfTicket")}
                            value={singleDay.price}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box">
                          <label htmlFor={`linkZoom${dayIndex}`}>
                            {t("LinkZoom")}
                          </label>
                          <input
                            type="link"
                            id={`linkZoom${dayIndex}`}
                            name="linkZoom"
                            placeholder={t("EventZoomLink")}
                            value={singleDay.linkZoom}
                            onChange={(e) => handleDayChange(e, dayIndex)}
                            required
                          />
                        </div>
                        <div className="box-bool">
                          <label>{t("WillThisDayBeOnline")}</label>
                          <div className="checkbox-wrapper-10">
                            <input
                              className="tgl tgl-flip"
                              type="checkbox"
                              id={`isOnline${dayIndex}`}
                              name="isOnline"
                              checked={singleDay.isOnline}
                              onChange={(e) => handleDayChange(e, dayIndex)}
                            />
                            <label
                              className="tgl-btn"
                              data-tg-off="No"
                              data-tg-on="Yes"
                              htmlFor={`isOnline${dayIndex}`}
                            ></label>
                          </div>
                        </div>
                        <div className="box-bool">
                          <label>{t("WillThisDayBeOffline")}</label>
                          <div className="checkbox-wrapper-10">
                            <input
                              className="tgl tgl-flip"
                              type="checkbox"
                              id={`isOffline${dayIndex}`}
                              name="isOffline"
                              checked={singleDay.isOffline}
                              onChange={(e) => handleDayChange(e, dayIndex)}
                            />
                            <label
                              className="tgl-btn"
                              data-tg-off="No"
                              data-tg-on="Yes"
                              htmlFor={`isOffline${dayIndex}`}
                            ></label>
                          </div>
                        </div>
                      </div>

                      {/* Speakers */}
                      <Accordion defaultActiveKey="0" flush>
                        <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                          {t("EventDaySpeakers")}
                        </h6>
                        {eventData.eventDays[dayIndex].eventDaySpeakers.map(
                          (speaker, spIndex) => (
                            <div key={spIndex} className="event-day-speaker">
                              <Accordion.Item
                                eventKey={spIndex}
                                className="my-2"
                              >
                                <Accordion.Header>
                                  {" "}
                                  {t("Speaker")} #{spIndex + 1}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div className="boxs">
                                    <div className="box">
                                      <label
                                        htmlFor={`speakerId${dayIndex}${spIndex}`}
                                      >
                                        {t("SpeakerID")}
                                      </label>
                                      <div className="card flex justify-content-center speaker-selector-card">
                                        <Dropdown
                                          required
                                          value={speaker.speakerId}
                                          valueTemplate={speakers
                                            .filter(
                                              (speakerItem) =>
                                                speakerItem.id ===
                                                speaker.speakerId
                                            )
                                            .map((speakerItem) => {
                                              return (
                                                <p>{speakerItem.nameEn}</p>
                                              );
                                            })}
                                          id={`speakerId${dayIndex}${spIndex}`}
                                          onChange={(e) =>
                                            handleSpeakerNameChange(
                                              e,
                                              dayIndex,
                                              spIndex
                                            )
                                          }
                                          options={speakers}
                                          optionLabel="nameEn"
                                          placeholder="Select a Speaker"
                                          className="w-full md:w-14rem h-3rem p-1 speaker-selector"
                                        />
                                      </div>
                                    </div>
                                    <div className="box">
                                      <label
                                        htmlFor={`startSpeakTime${dayIndex}${spIndex}`}
                                      >
                                        {t("StartSpeakerTime")}
                                      </label>
                                      <input
                                        type="datetime-local"
                                        id={`startSpeakTime${dayIndex}${spIndex}`}
                                        name="startSpeakTime"
                                        placeholder={t("StartSpeakerTime")}
                                        value={speaker.startSpeakTime}
                                        onChange={(e) =>
                                          handleSpeakerChange(
                                            e,
                                            dayIndex,
                                            spIndex
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="box">
                                      <label
                                        htmlFor={`endSpeakTime${dayIndex}${spIndex}`}
                                      >
                                        {t("EndSpeakerTime")}
                                      </label>
                                      <input
                                        type="datetime-local"
                                        id={`endSpeakTime${dayIndex}${spIndex}`}
                                        name="endSpeakTime"
                                        placeholder={t("EndSpeakerTime")}
                                        value={speaker.endSpeakTime}
                                        onChange={(e) =>
                                          handleSpeakerChange(
                                            e,
                                            dayIndex,
                                            spIndex
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  {/* Button Of Remove Current Speaker */}
                                  {eventData.eventDays[dayIndex]
                                    .eventDaySpeakers.length !== 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSpeakerRemove(dayIndex, spIndex)
                                      }
                                      className="remove-btn my-0"
                                    >
                                      <span>{t("RemoveSpeaker")}</span>
                                    </button>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>

                              {/* Button Of Add Current Speaker */}
                              {eventData.eventDays[dayIndex].eventDaySpeakers
                                .length -
                                1 ===
                                spIndex && (
                                <button
                                  type="button"
                                  onClick={() => handleSpeakerAdd(dayIndex)}
                                  className="add-btn"
                                >
                                  <span>{t("AddSpeaker")}</span>
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </Accordion>

                      {/* Event Questions */}
                      <Accordion defaultActiveKey="0" flush>
                        <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                          {t("EventDayQuestions")}
                        </h6>
                        {singleDay.eventDayQuestions.map(
                          (question, questionIndex) => (
                            <div
                              key={questionIndex}
                              className="event-day-questin"
                            >
                              <Accordion.Item
                                eventKey={questionIndex}
                                className="my-2"
                              >
                                <Accordion.Header>
                                  {t("Question")} #{questionIndex + 1}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div className="boxs">
                                    <div className="box">
                                      <label
                                        htmlFor={`questionAr${dayIndex}${questionIndex}`}
                                      >
                                        {t("ArabicQuestion")}
                                      </label>
                                      <input
                                        type="text"
                                        id={`questionAr${dayIndex}${questionIndex}`}
                                        name="questionAr"
                                        placeholder={t("ArabicQuestion")}
                                        value={question.questionAr}
                                        onChange={(e) =>
                                          handleQuestionChange(
                                            e,
                                            dayIndex,
                                            questionIndex
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="box">
                                      <label
                                        htmlFor={`questionEn${dayIndex}${questionIndex}`}
                                      >
                                        {t("EnglishQuestion")}
                                      </label>
                                      <input
                                        type="text"
                                        id={`questionEn${dayIndex}${questionIndex}`}
                                        name="questionEn"
                                        placeholder={t("EnglishQuestion")}
                                        value={question.questionEn}
                                        onChange={(e) =>
                                          handleQuestionChange(
                                            e,
                                            dayIndex,
                                            questionIndex
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="box">
                                      <label
                                        htmlFor={`point${dayIndex}${questionIndex}`}
                                      >
                                        {t("Point")}
                                      </label>
                                      <input
                                        type="number"
                                        id={`point${dayIndex}${questionIndex}`}
                                        name="point"
                                        placeholder={t("Point")}
                                        value={question.point}
                                        onChange={(e) =>
                                          handleQuestionChange(
                                            e,
                                            dayIndex,
                                            questionIndex
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  {/* Answers Section */}
                                  {question.eventDayQuestionAnswers.map(
                                    (answer, answerIndex) => (
                                      <div
                                        key={answerIndex}
                                        className="event-day-question-answer"
                                      >
                                        <div className="boxs">
                                          <div className="box">
                                            <label
                                              htmlFor={`answerAr${dayIndex}${questionIndex}${answerIndex}`}
                                            >
                                              {t("ArabicAnswer")}
                                            </label>
                                            <input
                                              type="text"
                                              id={`answerAr${dayIndex}${questionIndex}${answerIndex}`}
                                              name="answerAr"
                                              placeholder={t("ArabicAnswer")}
                                              value={answer.answerAr}
                                              onChange={(e) =>
                                                handleAnswerChange(
                                                  e,
                                                  dayIndex,
                                                  questionIndex,
                                                  answerIndex
                                                )
                                              }
                                              required
                                            />
                                          </div>
                                          <div className="box">
                                            <label
                                              htmlFor={`answerEn${dayIndex}${questionIndex}${answerIndex}`}
                                            >
                                              {t("EnglishAnswer")}
                                            </label>
                                            <input
                                              type="text"
                                              id={`answerEn${dayIndex}${questionIndex}${answerIndex}`}
                                              name="answerEn"
                                              placeholder={t("EnglishAnswer")}
                                              value={answer.answerEn}
                                              onChange={(e) =>
                                                handleAnswerChange(
                                                  e,
                                                  dayIndex,
                                                  questionIndex,
                                                  answerIndex
                                                )
                                              }
                                              required
                                            />
                                          </div>
                                          <div className="box-bool">
                                            <label>{t("IsTrueAnswer")}</label>
                                            <div className="checkbox-wrapper-10">
                                              <input
                                                className="tgl tgl-flip"
                                                type="checkbox"
                                                id={`isTrueAnswer${dayIndex}${questionIndex}${answerIndex}`}
                                                name="isTrueAnswer"
                                                checked={answer.isTrueAnswer}
                                                onChange={(e) =>
                                                  handleAnswerChange(
                                                    e,
                                                    dayIndex,
                                                    questionIndex,
                                                    answerIndex
                                                  )
                                                }
                                              />
                                              <label
                                                className="tgl-btn"
                                                data-tg-off="No"
                                                data-tg-on="Yes"
                                                htmlFor={`isTrueAnswer${dayIndex}${questionIndex}${answerIndex}`}
                                              ></label>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Button to remove the current answer */}
                                        {question.eventDayQuestionAnswers
                                          .length !== 1 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleAnswerRemove(
                                                dayIndex,
                                                questionIndex,
                                                answerIndex
                                              )
                                            }
                                            className="remove-btn"
                                          >
                                            <span>{t("RemoveAnswer")}</span>
                                          </button>
                                        )}

                                        {/* Button to add more answers */}
                                        {question.eventDayQuestionAnswers
                                          .length -
                                          1 ===
                                          answerIndex && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleAnswerAdd(
                                                dayIndex,
                                                questionIndex
                                              )
                                            }
                                            className="add-btn d-block m-3 my-0"
                                          >
                                            <span>{t("AddAnswer")}</span>
                                          </button>
                                        )}
                                      </div> // End of Answer
                                    )
                                  )}

                                  {/* Button to remove the current question */}
                                  {singleDay.eventDayQuestions.length !== 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleQuestionRemove(
                                          dayIndex,
                                          questionIndex
                                        )
                                      }
                                      className="remove-btn w-100 mt-3 mb-3 my-0"
                                    >
                                      <span>{t("RemoveQuestion")}</span>
                                    </button>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                              {/* Button to add more questions */}
                              {singleDay.eventDayQuestions.length - 1 ===
                                questionIndex && (
                                <button
                                  type="button"
                                  onClick={() => handleQuestionAdd(dayIndex)}
                                  className="add-btn"
                                >
                                  <span>{t("AddQuestion")}</span>
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </Accordion>

                      {/* Upload Video */}
                      <h6 className="text-muted my-2 mt-4 fw-bold border-bottom border-secondary pb-2">
                        {t("EventDayVideos")}
                      </h6>
                      <div className="d-flex align-items-center my-3 p-0">
                        <div className="box-upload ">
                          <label
                            htmlFor={`uploadVidoe${dayIndex}`}
                            className="upload"
                          >
                            <i className="fas fa-video"></i>
                            <span>{t("UploadVideo")}</span>
                          </label>
                          <input
                            type="file"
                            id={`uploadVidoe${dayIndex}`}
                            onChange={(e) =>
                              handleVideoChangeAndSend(e, dayIndex)
                            }
                            hidden
                            className="rounded"
                          />
                        </div>

                        <div className="mx-4 bg-secondary-subtle p-3 rounded border-secondary">
                          {singleDay.displayLinkUploadedVideo && (
                            <video
                              src={`${singleDay.displayLinkUploadedVideo}`}
                              height={"120px"}
                              controls
                              className="rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Button Of Remove Day */}
                {eventData.eventDays.length !== 1 && (
                  <button
                    type="button"
                    onClick={() => handleDayRemove(dayIndex)}
                    className="remove-btn d-block m-0 mb-3"
                  >
                    <span>{t("RemoveDay")}</span>
                  </button>
                )}

                {/* Button Of Add Day */}
                {eventData.eventDays.length - 1 === dayIndex && (
                  <button
                    type="button"
                    onClick={handleDayAdd}
                    className="add-btn w-100"
                  >
                    <span>{t("AddDay")}</span>
                  </button>
                )}
              </div>
            ))}
          </Accordion>

          <button type="submit" onClick={submit} className="submit-btn">
            {t("AddNewEvent")}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
