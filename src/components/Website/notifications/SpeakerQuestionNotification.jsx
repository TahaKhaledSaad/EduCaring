import { useEffect, useRef, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import logo from "../../../assets/logo.jpg";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { BASE, SPEAKER_QUESTIONS_ANSWERS } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import ChangingProgressProvider from "./ChangingProgressProvider";
import "react-circular-progressbar/dist/styles.css";
const SpeakerQuestionNotification = ({
  sendTime,
  notification,
  onHandleMenu,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const questionsRef = useRef(null);
  const toast = useRef(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};
  const { t } = useTranslation();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        questionsRef.current &&
        !questionsRef.current.contains(event.target)
      ) {
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

  const handleSend = () => {
    const requestBody = [];
    for (const questionId in selectedAnswers) {
      requestBody.push({
        eventDaySpeakerId: notification[0].eventDaySpeakerId,
        questionId,
        answerId: selectedAnswers[questionId],
        userId: decodedToken.uid,
      });
    }
    console.log(requestBody);

    axios
      .post(`${BASE}/${SPEAKER_QUESTIONS_ANSWERS}`, requestBody)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.current.show([
            {
              severity: "success",
              summary: t("AnswersSent"),
              detail: t("AnswersSubmittedSuccessfully"),
              life: 3000,
            },
          ]);
          setShowScore(true);
          setScore(response.data.responseObject.score);
        }
      })
      .catch((error) => {
        console.error("Error submitting answers:", error);
        // Handle error
      });
  };
  function handleAnswerChange(questionId, answerId) {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  }
  function togglePopup() {
    setPopupVisible((prevState) => !prevState);
  }
  const totalQuestions = notification?.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  return (
    <div ref={questionsRef} className="question">
      <Toast ref={toast} />
      <div className="notif-row" onClick={togglePopup}>
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6>{notification[0]?.speakerName}</h6>
          <p>{t("PleaseAnswerTheseQuestions")}</p>
          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
        {popupVisible && <div className="backdrop"></div>}
      </div>
      <div
        className={`notif-questions-popup shadow-lg  ${
          popupVisible ? "show " : "slide-out"
        }`}
      >
        <div className="head">
          <h4>Questions</h4>
          <i className="bi bi-x close" onClick={togglePopup}></i>
        </div>
        <div className="body">
          <div className="form">
            <div className="questions-body">
              {showScore ? (
                <ScoreContainer>
                  <ChangingProgressProvider values={[Math.round(score)]}>
                    {(score) => (
                      <CircularProgressbar
                        value={Math.round(score)}
                        text={`${Math.round(score)}%`}
                        styles={buildStyles({
                          pathTransition:
                            score === 0
                              ? "none"
                              : "stroke-dashoffset 0.5s ease 0s",
                        })}
                      />
                    )}
                  </ChangingProgressProvider>
                </ScoreContainer>
              ) : (
                notification.map((question) => (
                  <div className="question" key={question.id}>
                    <h5>{question.question}</h5>

                    {question.speakerQuestionAnswers.map((answer) => (
                      <div className="answer" key={question.id + answer.id}>
                        <Form.Check // prettier-ignore
                          type={"radio"}
                          id={`default-${question.id}-${answer.id}`}
                          label={`${answer.answer}`}
                          value={question.id + answer.id}
                          onChange={() =>
                            handleAnswerChange(question.id, answer.id)
                          }
                          checked={selectedAnswers[question.id] === answer.id}
                          className="question-answer-input"
                          name={`question-${question.id}`}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            <ProgressBar now={progress} className="questions-progress-bar" />
            <div className="btns p-3">
              <button
                className={`send-question-btn answer-question-btn btn btn-success flex-column d-flex justify-content-center ${
                  progress !== 100 ? "disabled bt-disabled-op" : ""
                } `}
                onClick={showScore ? () => onHandleMenu(false) : handleSend}
              >
                {showScore ? t("Close") : t("SaveAndClose")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerQuestionNotification;
function ScoreContainer(props) {
  return (
    <div>
      <hr style={{ border: "4px solid #ddd" }} className="mt-5" />
      <div
        style={{
          marginTop: 30,
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
        className=" mt-5 p-3 "
      >
        <div
          className=" circular-progressbar-answer"
          style={{ width: "30%", paddingRight: 30 }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
