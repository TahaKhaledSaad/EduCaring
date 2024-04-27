import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabMenu } from "primereact/tabmenu";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import Cookie from "cookie-universal";
import axios from "axios";
import { BASE } from "../../../Api";
import { jwtDecode } from "jwt-decode";
import { FloatLabel } from "primereact/floatlabel";
import { Badge } from "primereact/badge";

export default function SpeakerQuestions({
  speakerQuestions,
  eventDayStart,
  eventDaySpeakerId,
  setRegetSpeakerDetails,
  showAddQuestionToast,
  showDeleteQuestionToast,
}) {
  const { t, i18n } = useTranslation();
  const [showPopup, setShowPopup] = useState(true);
  const [questionValue, setQuestionValue] = useState("");
  const [questionValueAr, setQuestionValueAr] = useState("");
  const toast = useRef(null);
  const [showQuestions, setShowQuestions] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({
    inputText: "",
    inputTextAr: "",
    checked: false,
  });

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  const items = [
    {
      label: t("QuestionsEn"),
      icon: "pi pi-home",
      command: () => {
        setShowQuestions(true);
      },
    },
    {
      label: t("QuestionsAr"),
      icon: "pi pi-chart-line",
      command: () => {
        setShowQuestions(false);
      },
    },
  ];

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      setAnswers([]);
      setQuestionValue("");
      setQuestionValueAr("");
      setNewAnswer({ inputText: "", checked: false });
      setShowQuestions(true);
    }
  };
  const addQuestion = async () => {
    if (questionValue && questionValueAr) {
      const data = {
        id: 0,
        questionAr: questionValueAr,
        questionEn: questionValue,
        point: 1,
        eventDaySpeakerId,
        speakerId: decodedToken.uid,
        speakerQuestionAnswers: answers.map((answer) => ({
          id: 0,
          answerAr: answer.inputTextAr,
          answerEn: answer.inputText,
          isTrueAnswer: answer.checked,
          speakerQuestionId: 0,
        })),
      };
      console.log([...speakerQuestions, data]);
      axios
        .post(`${BASE}/SpeakerQuestion`, [...speakerQuestions, data], {
          headers: {
            UserId: decodedToken.uid,
          },
        })
        .then((response) => {
          if (response.data.isSuccess) {
            setRegetSpeakerDetails((prev) => prev + 1);
            showAddQuestionToast();
            togglePopup();
          }
        })
        .catch((error) => {
          console.error("Error adding question:", error);
        });
    }
  };
  const deleteQuestion = async (itemId) => {
    axios
      .delete(`${BASE}/SpeakerQuestion/${itemId}`, {
        headers: {
          UserId: decodedToken.uid,
        },
      })
      .then((response) => {
        if (response.data.isSuccess) {
          setRegetSpeakerDetails((prev) => prev + 1);
          showDeleteQuestionToast();
        }
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const addNewAnswer = () => {
    if (newAnswer.inputText && newAnswer.inputTextAr) {
      setAnswers([...answers, newAnswer]);
      setNewAnswer({ inputText: "", checked: false, inputTextAr: "" });
    }
  };
  const removeAnswer = (index) => {
    const updatedAnswers = answers.filter((answer, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  const currentDate = new Date(eventDayStart);
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1); // Get previous day
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1); // Get next day
  const nextTwoDates = new Date(currentDate);
  nextTwoDates.setDate(currentDate.getDate() + 2);

  // Date on the box of ticket
  function renderDate(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return (
      <>
        <p>{dayOfWeek}</p>
        <p>
          {month}/{day}
        </p>
      </>
    );
  }

  function padZero(num) {
    return num < 10 ? "0" + num : num;
  }
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  }
  return (
    <>
      <button
        className="btn btn-success py-2  w-100"
        style={{
          background:
            speakerQuestions?.length > 0 ? "#27AE60" : "rgba(195, 43, 67, 1)",
          border: "none",
          outline: "none",
        }}
        onClick={togglePopup}
      >
        {i18n.language === "en" ? " Add Questions" : "إضافة أسئلة"}
      </button>
      <div
        className=" speakerTicket-popup bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(300%, -50%)"
            : "translate(-50%, -50%)",
          direction: i18n.language === "en" ? "ltr" : "rtl",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>{t("Questions")}</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>
        <div className="popup-body d-flex flex-column flex-md-row justify-content-between align-items-center my-3">
          <div className="w-50 speakerTicket-data questions-data">
            <div
              className="d-flex align-items-center justify-content-start gap-1 event-questions gap-2"
              style={{ maxWidth: "350px" }}
            >
              <div
                className="event-question-child"
                style={{ color: "rgba(189, 189, 189, 1)" }}
              >
                {renderDate(previousDate)}
              </div>
              <div
                className="event-question-child"
                style={{
                  backgroundColor: "#3296D4",
                  boxShadow: "0px 0px 9.01263px rgba(47, 128, 237, 0.25)",
                  color: "#fff",
                }}
              >
                {renderDate(currentDate)}
              </div>
              <div
                className="event-question-child"
                style={{
                  border: "1px solid #27AE60",
                  color: "#27AE60",
                  backgroundColor: "rgba(39, 174, 96, 0.1)",
                }}
              >
                {renderDate(nextDate)}
              </div>
              <div
                className="event-question-child"
                style={{
                  border: "1px solid #27AE60",
                  color: "#27AE60",
                  backgroundColor: "rgba(39, 174, 96, 0.1)",
                }}
              >
                {renderDate(nextTwoDates)}
              </div>
            </div>
            <Toast ref={toast} />
            <TabMenu
              model={items}
              className="p-0 questions-answers-tabs"
              activeIndex={showQuestions ? 0 : 1}
              onTabChange={(e) => setShowQuestions(e.index === 0)}
            />
            <div style={{ maxHeight: 300, overflow: "auto" }}>
              {showQuestions &&
                speakerQuestions?.length > 0 &&
                speakerQuestions?.map((item, i) => (
                  <div
                    className="card"
                    key={i}
                    style={{
                      margin: "10px 0px 5px 10px ",
                      borderRadius: "10px",
                      padding: "10px 15px",
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ marginBottom: "10px" }}
                    >
                      <h2
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "#565656",
                          lineHeight: "25px",
                        }}
                      >
                        {item.questionEn}
                      </h2>

                      <Button
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M9.8042 0.883013L9.7018 0.882911C9.21939 0.882191 8.79597 0.881559 8.41869 1.02994C8.0888 1.15969 7.79676 1.37018 7.56935 1.64212C7.30927 1.95311 7.17598 2.355 7.02411 2.81288L7.02411 2.81289L6.99182 2.91006L6.72642 3.70625H3.47087H1.58865C1.19882 3.70625 0.882812 4.02227 0.882812 4.41209C0.882812 4.80191 1.19882 5.11792 1.58865 5.11792H2.80533L3.37387 14.783L3.37563 14.813C3.43282 15.7853 3.47821 16.557 3.56468 17.1784C3.65322 17.8148 3.79139 18.3511 4.06526 18.8381C4.51048 19.6296 5.18623 20.2668 6.00255 20.6647C6.50471 20.9095 7.04827 21.016 7.6887 21.067C8.31415 21.1168 9.08713 21.1168 10.0612 21.1168H10.0912H11.9083H11.9384C12.9124 21.1168 13.6854 21.1168 14.3108 21.067C14.9512 21.016 15.4948 20.9095 15.997 20.6647C16.8133 20.2668 17.489 19.6296 17.9343 18.8381C18.2081 18.3511 18.3463 17.8148 18.4348 17.1784C18.5213 16.5571 18.5667 15.7857 18.6238 14.8137L18.6239 14.8135L18.6239 14.8133L18.6239 14.8131L18.6256 14.783L19.1942 5.11792H20.4109C20.8007 5.11792 21.1167 4.80191 21.1167 4.41209C21.1167 4.02227 20.8007 3.70625 20.4109 3.70625H18.5286H15.2727L15.0073 2.91006L14.975 2.81288C14.8232 2.355 14.6899 1.95311 14.4298 1.64212C14.2024 1.37018 13.9103 1.15969 13.5805 1.02994C13.2032 0.881559 12.7798 0.882191 12.2973 0.882911L12.195 0.883013H9.8042ZM14.744 5.11792C14.7572 5.1183 14.7705 5.1183 14.7838 5.11792H17.7801L17.2164 14.7001C17.1571 15.7091 17.1144 16.4247 17.0366 16.9839C16.96 17.5346 16.8559 17.8757 16.7039 18.146C16.3992 18.6876 15.9369 19.1235 15.3784 19.3958C15.0996 19.5317 14.753 19.6156 14.1987 19.6598C13.6359 19.7046 12.9191 19.7051 11.9083 19.7051H10.0912C9.08043 19.7051 8.36364 19.7046 7.8008 19.6598C7.24652 19.6156 6.8999 19.5317 6.62116 19.3958C6.06263 19.1235 5.60027 18.6876 5.29565 18.146C5.14363 17.8757 5.0395 17.5346 4.96288 16.9839C4.88507 16.4247 4.84245 15.7091 4.7831 14.7001L4.21944 5.11792H7.21534C7.22864 5.1183 7.2419 5.1183 7.25512 5.11792H14.744ZM13.7847 3.70625L13.6681 3.35646C13.4639 2.74397 13.4119 2.6255 13.3469 2.54771C13.2711 2.45707 13.1737 2.3869 13.0638 2.34366C12.9694 2.30654 12.8406 2.29468 12.195 2.29468H9.8042C9.15857 2.29468 9.02974 2.30654 8.93537 2.34366C8.82541 2.3869 8.72806 2.45707 8.65226 2.54771C8.58721 2.6255 8.53521 2.74397 8.33105 3.35646L8.21445 3.70625H13.7847ZM9.82378 9.11814C9.82378 8.72832 9.50776 8.41231 9.11794 8.41231C8.72812 8.41231 8.41211 8.72832 8.41211 9.11814V15.7059C8.41211 16.0957 8.72812 16.4118 9.11794 16.4118C9.50776 16.4118 9.82378 16.0957 9.82378 15.7059V9.11814ZM12.8836 8.41231C13.2734 8.41231 13.5894 8.72832 13.5894 9.11814V12.8826C13.5894 13.2724 13.2734 13.5884 12.8836 13.5884C12.4937 13.5884 12.1777 13.2724 12.1777 12.8826V9.11814C12.1777 8.72832 12.4937 8.41231 12.8836 8.41231Z"
                              fill="white"
                            />
                          </svg>
                        }
                        className="rounded-5 delete-question-icon"
                        style={{
                          width: "32px",
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        raised
                        rounded
                        severity="danger"
                        aria-label="Cancel"
                        onClick={() => deleteQuestion(item.id)}
                      ></Button>
                    </div>
                    <div className="d-flex gap-1 flex-column justify-content-center">
                      {item.speakerQuestionAnswers.map((answer, i) => (
                        <div
                          className="d-flex gap-3 flex-column justify-content-center  gap-2"
                          key={i}
                        >
                          <p
                            style={{
                              marginBottom: "0",
                              fontSize: "16px",
                              fontWeight: "400",
                              color: answer.isTrueAnswer
                                ? "#22c55e"
                                : "#3296D4",
                              lineHeight: "22px",
                            }}
                          >
                            {answer.answerEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              {!showQuestions &&
                speakerQuestions?.length > 0 &&
                speakerQuestions?.map((item, i) => (
                  <div
                    className="card"
                    key={i}
                    style={{
                      margin: "10px 0px 5px 10px ",
                      borderRadius: "10px",
                      padding: "10px 15px",
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ marginBottom: "10px" }}
                    >
                      <h2
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          color: "#565656",
                          lineHeight: "25px",
                        }}
                      >
                        {item.questionAr}
                      </h2>

                      <Button
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M9.8042 0.883013L9.7018 0.882911C9.21939 0.882191 8.79597 0.881559 8.41869 1.02994C8.0888 1.15969 7.79676 1.37018 7.56935 1.64212C7.30927 1.95311 7.17598 2.355 7.02411 2.81288L7.02411 2.81289L6.99182 2.91006L6.72642 3.70625H3.47087H1.58865C1.19882 3.70625 0.882812 4.02227 0.882812 4.41209C0.882812 4.80191 1.19882 5.11792 1.58865 5.11792H2.80533L3.37387 14.783L3.37563 14.813C3.43282 15.7853 3.47821 16.557 3.56468 17.1784C3.65322 17.8148 3.79139 18.3511 4.06526 18.8381C4.51048 19.6296 5.18623 20.2668 6.00255 20.6647C6.50471 20.9095 7.04827 21.016 7.6887 21.067C8.31415 21.1168 9.08713 21.1168 10.0612 21.1168H10.0912H11.9083H11.9384C12.9124 21.1168 13.6854 21.1168 14.3108 21.067C14.9512 21.016 15.4948 20.9095 15.997 20.6647C16.8133 20.2668 17.489 19.6296 17.9343 18.8381C18.2081 18.3511 18.3463 17.8148 18.4348 17.1784C18.5213 16.5571 18.5667 15.7857 18.6238 14.8137L18.6239 14.8135L18.6239 14.8133L18.6239 14.8131L18.6256 14.783L19.1942 5.11792H20.4109C20.8007 5.11792 21.1167 4.80191 21.1167 4.41209C21.1167 4.02227 20.8007 3.70625 20.4109 3.70625H18.5286H15.2727L15.0073 2.91006L14.975 2.81288C14.8232 2.355 14.6899 1.95311 14.4298 1.64212C14.2024 1.37018 13.9103 1.15969 13.5805 1.02994C13.2032 0.881559 12.7798 0.882191 12.2973 0.882911L12.195 0.883013H9.8042ZM14.744 5.11792C14.7572 5.1183 14.7705 5.1183 14.7838 5.11792H17.7801L17.2164 14.7001C17.1571 15.7091 17.1144 16.4247 17.0366 16.9839C16.96 17.5346 16.8559 17.8757 16.7039 18.146C16.3992 18.6876 15.9369 19.1235 15.3784 19.3958C15.0996 19.5317 14.753 19.6156 14.1987 19.6598C13.6359 19.7046 12.9191 19.7051 11.9083 19.7051H10.0912C9.08043 19.7051 8.36364 19.7046 7.8008 19.6598C7.24652 19.6156 6.8999 19.5317 6.62116 19.3958C6.06263 19.1235 5.60027 18.6876 5.29565 18.146C5.14363 17.8757 5.0395 17.5346 4.96288 16.9839C4.88507 16.4247 4.84245 15.7091 4.7831 14.7001L4.21944 5.11792H7.21534C7.22864 5.1183 7.2419 5.1183 7.25512 5.11792H14.744ZM13.7847 3.70625L13.6681 3.35646C13.4639 2.74397 13.4119 2.6255 13.3469 2.54771C13.2711 2.45707 13.1737 2.3869 13.0638 2.34366C12.9694 2.30654 12.8406 2.29468 12.195 2.29468H9.8042C9.15857 2.29468 9.02974 2.30654 8.93537 2.34366C8.82541 2.3869 8.72806 2.45707 8.65226 2.54771C8.58721 2.6255 8.53521 2.74397 8.33105 3.35646L8.21445 3.70625H13.7847ZM9.82378 9.11814C9.82378 8.72832 9.50776 8.41231 9.11794 8.41231C8.72812 8.41231 8.41211 8.72832 8.41211 9.11814V15.7059C8.41211 16.0957 8.72812 16.4118 9.11794 16.4118C9.50776 16.4118 9.82378 16.0957 9.82378 15.7059V9.11814ZM12.8836 8.41231C13.2734 8.41231 13.5894 8.72832 13.5894 9.11814V12.8826C13.5894 13.2724 13.2734 13.5884 12.8836 13.5884C12.4937 13.5884 12.1777 13.2724 12.1777 12.8826V9.11814C12.1777 8.72832 12.4937 8.41231 12.8836 8.41231Z"
                              fill="white"
                            />
                          </svg>
                        }
                        className="rounded-5 delete-question-icon"
                        style={{
                          width: "32px",
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        raised
                        rounded
                        severity="danger"
                        aria-label="Cancel"
                        onClick={() => deleteQuestion(item.id)}
                      ></Button>
                    </div>
                    <div className="d-flex gap-1 flex-column justify-content-center">
                      {item.speakerQuestionAnswers.map((answer, i) => (
                        <div
                          className="d-flex gap-3 flex-column justify-content-center  gap-2"
                          key={i}
                        >
                          <p
                            style={{
                              marginBottom: "0",
                              fontSize: "16px",
                              fontWeight: "400",
                              color: answer.isTrueAnswer
                                ? "#22c55e"
                                : "#3296D4",
                              lineHeight: "22px",
                            }}
                          >
                            {answer.answerAr}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="d-flex gap-3 w-50 flex-wrap calendar question-container-box">
            <h2>{t("Question")}</h2>
            <div className="w-100 d-flex gap-2" style={{ height: "170px" }}>
              <FloatLabel className="w-50">
                <InputTextarea
                  id="questionEn"
                  value={questionValue}
                  onChange={(e) => setQuestionValue(e.target.value)}
                  rows={5}
                  cols={15}
                  placeholder="Question in English"
                  style={{ height: "100%", resize: "none" }}
                  variant={questionValue ? "filled" : "outlined"}
                />
                <label
                  htmlFor="questionEn"
                  style={{ right: i18n.language === "ar" ? "0" : "auto" }}
                  className="mb-5"
                >
                  {t("QuestionEn")}
                </label>
              </FloatLabel>
              <FloatLabel className=" w-50">
                <InputTextarea
                  id="questionAr"
                  value={questionValueAr}
                  onChange={(e) => setQuestionValueAr(e.target.value)}
                  rows={5}
                  cols={15}
                  placeholder="Question in Arabic"
                  style={{ height: "100%", resize: "none" }}
                  variant={questionValueAr ? "filled" : "outlined"}
                />
                <label
                  htmlFor="questionAr"
                  style={{ right: i18n.language === "ar" ? "0" : "auto" }}
                >
                  {t("QuestionAr")}
                </label>
              </FloatLabel>
            </div>
            <div className="d-flex gap-3 align-items-center justify-content-start ">
              <h3 className="mb-0 fw-bold">{t("Answers")}</h3>
              <Badge value={answers.length} size="large" severity="secondary" />
            </div>
            <div
              className="d-flex gap-2 flex-column mb-2 w-100"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            >
              {answers.map((answer, i) => (
                <div
                  key={i}
                  className="d-flex gap-3 align-items-center justify-content-start w-100"
                >
                  <Button
                    icon="fas fa-times"
                    key={i}
                    className="rounded-5"
                    severity="danger"
                    onClick={() => removeAnswer(i)}
                    style={{
                      width: "24px",
                      height: "24px",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  />
                  <p
                    className="mb-0 d-flex align-items-center"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: answer.checked ? "#22c55e" : "#565656",
                      lineHeight: "22px",
                    }}
                  >
                    {truncateString(
                      i18n.language === "en"
                        ? answer.inputText
                        : answer.inputTextAr,
                      25
                    )}
                  </p>
                  {answer.checked && (
                    <i
                      className="fas fa-check"
                      style={{
                        color: "#22c55e",
                        marginLeft: "auto",
                        marginRight: "15px",
                        fontSize: "20px",
                      }}
                    ></i>
                  )}
                </div>
              ))}
            </div>
            <div
              className={`${
                i18n.language === "en" ? "" : "ar"
              } p-inputgroup flex-1`}
            >
              <div className="d-flex flex-column">
                <InputText
                  placeholder={t("AddNewAnswerEn")}
                  value={newAnswer.inputText}
                  variant={newAnswer.inputText ? "filled" : "outlined"}
                  onChange={(e) =>
                    setNewAnswer({ ...newAnswer, inputText: e.target.value })
                  }
                  style={{
                    fontSize: "1.25rem",
                    padding: "0.45rem 0.9375rem",
                    width: "100%",
                    borderTopRightRadius: i18n.language === "en" ? "0" : "6px",
                    borderBottomRightRadius:
                      i18n.language === "en" ? "0" : "6px",
                    borderTopLeftRadius: i18n.language === "en" ? "6px" : "0",
                    borderBottomLeftRadius:
                      i18n.language === "en" ? "6px" : "0",
                  }}
                />
                <InputText
                  placeholder={t("AddNewAnswerAr")}
                  value={newAnswer.inputTextAr}
                  variant={newAnswer.inputTextAr ? "filled" : "outlined"}
                  onChange={(e) =>
                    setNewAnswer({ ...newAnswer, inputTextAr: e.target.value })
                  }
                  style={{
                    fontSize: "1.25rem",
                    padding: "0.45rem 0.9375rem",
                    width: "100%",
                    borderTopRightRadius: i18n.language === "en" ? "0" : "6px",
                    borderBottomRightRadius:
                      i18n.language === "en" ? "0" : "6px",
                    borderTopLeftRadius: i18n.language === "en" ? "6px" : "0",
                    borderBottomLeftRadius:
                      i18n.language === "en" ? "6px" : "0",
                  }}
                />
              </div>
              <span
                className="p-inputgroup-addon"
                style={{
                  borderRight: "1px solid #d1d5db",
                  borderTopRightRadius: i18n.language === "ar" ? "0" : "6px",
                  borderBottomRightRadius: i18n.language === "ar" ? "0" : "6px",
                  borderTopLeftRadius: i18n.language === "ar" ? "6px" : "0",
                  borderBottomLeftRadius: i18n.language === "ar" ? "6px" : "0",
                  marginRight: i18n.language === "ar" ? "0" : "10px",
                  marginLeft: i18n.language === "ar" ? "10px" : "0",
                }}
              >
                <ToggleButton
                  onLabel={t("Correct")}
                  offLabel={t("False")}
                  checked={newAnswer.checked}
                  className="h-100"
                  onChange={(e) =>
                    setNewAnswer({ ...newAnswer, checked: !newAnswer.checked })
                  }
                />
              </span>
              <Button
                icon={`fas fa-${
                  i18n.language === "ar" ? "angle-left" : "angle-right"
                }`}
                className="p-button-success rounded-2 p-1 h-100"
                severity="success"
                aria-label="Submit"
                onClick={addNewAnswer}
                raised
                style={{
                  width: "35px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              />
            </div>
            <Button
              label={t("AddNewQuestion")}
              icon="pi pi-plus"
              className="p-button-rounded p-button-success"
              style={{
                width: "100%",
                fontWeight: "600",
                fontSize: "14px",
                lineHeight: "26px",
                padding: "10px 0px",
                borderRadius: "8px",
                marginTop: "40px",
              }}
              onClick={addQuestion}
            />
          </div>
        </div>
      </div>
    </>
  );
}
