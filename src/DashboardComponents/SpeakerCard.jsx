import React from "react";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import SpeakerResorses from "./SpeakerResorses";
import { useTranslation } from "react-i18next";
import "./style.css";

export default function SpeakerCard({
  setVisible,
  visible,
  speaker,
  speakerData,
  isEnglish,
}) {
  const { t } = useTranslation();
  if (speaker === undefined) {
    return null;
  }
  const questionTemplate = (question, pionts) => (
    <div style={{ direction: isEnglish ? "ltr" : "rtl" }}>
      <h6 className="text-muted my-2 mt-2 fw-medium border-bottom border-secondary-subtle pb-2 mx-5 fs-3  ">
        {question}
      </h6>
      <p className="m-0 fw-light px-5 mb-3 fs-6">
        {t("pionts")}: {pionts}
      </p>
    </div>
  );
  return (
    <Dialog
      visible={visible}
      headerClassName="messages-header p-3 mb-0 only-dashboard"
      style={{
        maxWidth: "100rem",
        overflowY: "auto",
        maxHeight: "500px",
        direction: isEnglish ? "ltr" : "rtl",
      }}
      onHide={() => setVisible(false)}
      className="only-dashboard"
    >
      <div className="card flex justify-content-center">
        {speakerData.map((speakerItem, index) => (
          <div key={index}>
            <div className="row g-0">
              <div className="col-md-8 border-right">
                <div className="status p-3">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">{t("Name")}</span>
                            <span className="subheadings">
                              {isEnglish ? speaker.nameEn : speaker.nameAr}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("gender")}
                            </span>
                            <span className="subheadings">
                              {speaker.genderId === 1 ? t("male") : t("Female")}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("Email")}
                            </span>
                            <span className="subheadings">{speaker.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("PhoneNumber")}
                            </span>
                            <span className="subheadings">
                              {speaker.phoneNumber}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("Biography")}
                            </span>
                            <span className="subheadings">{speaker.bio}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("CurrentWorkPlace")}
                            </span>
                            <span className="subheadings">
                              {speaker.currentWorkPlace}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading d-block">
                              {t("DateOfBirth")}
                            </span>
                            <span className="subheadings">
                              {new Date(
                                speaker.dateOfBirth
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-2 text-center">
                  <div className="profile">
                    {speaker.displayProfileImage ? (
                      <img
                        width="100px"
                        height="100px"
                        className="rounded-circle"
                        src={speaker.displayProfileImage}
                        alt="profile"
                      />
                    ) : (
                      <div className="profile_letters ">
                        <p
                          style={{ width: "40px", height: "40px" }}
                          className=" text-center rounded-circle bg-primary text-white d-flex align-items-center justify-content-center m-auto"
                        >
                          {speaker.nameEn.slice(0, 2).toUpperCase()}
                        </p>
                      </div>
                    )}
                    <span className="d-block mt-3 font-weight-bold">
                      {speaker.nameEn}
                    </span>
                  </div>
                  <div className="about-doctor">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="heading d-block">
                                {t("StartSpeakerTime")}
                              </span>
                              <span className="subheadings">
                                {new Date(
                                  speakerData[0].startSpeakTime
                                ).toLocaleString()}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex flex-column">
                              <span className="heading d-block">
                                {t("EndSpeakerTime")}
                              </span>
                              <span className="subheadings">
                                {new Date(
                                  speakerData[0].endSpeakTime
                                ).toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8">
                {" "}
                <div className="status ">
                  <h5 className="mb-3 text-muted my-2 mt-2 fw-bold border-bottom border-secondary pb-5 mx-5 fs-3">
                    {t("QuestionsAnswers")}
                  </h5>
                  {speakerItem.speakerQuestions.map(
                    (questionItem, questionIndex) => (
                      <div key={questionIndex} className="mb-3">
                        <div className="card align-items-start ">
                          <Fieldset
                            legend={questionTemplate(
                              isEnglish
                                ? questionItem.questionEn
                                : questionItem.questionAr,
                              questionItem.point
                            )}
                            style={{ paddingInlineStart: "10px" }}
                            toggleable
                            collapsed
                          >
                            <ul className="list-unstyled">
                              {questionItem.speakerQuestionAnswers.map(
                                (answerItem, answerIndex) => (
                                  <li className="mb-3 " key={answerIndex}>
                                    <p
                                      className={`${
                                        answerItem.isTrueAnswer
                                          ? "text-success fs-4"
                                          : " fs-6"
                                      } `}
                                    >
                                      {isEnglish
                                        ? answerItem.answerEn
                                        : answerItem.answerAr}
                                    </p>
                                  </li>
                                )
                              )}
                            </ul>
                          </Fieldset>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="col-md-4 ">
                <h5 className="mb-3 text-muted my-2 mt-2 fw-bold border-bottom border-secondary pb-5 mx-5 fs-3 ">
                  {t("Resourses")}
                </h5>
                <div className=" d-flex flex-wrap align-items-center justify-content-center card-body gap-5 p-4 border border rounded">
                  {speakerItem.eventDaySpeakerResorses.map((item, index) => (
                    <SpeakerResorses key={index} speakerResorses={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
