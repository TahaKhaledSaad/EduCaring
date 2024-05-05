import React, { useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./style.css";

import axios from "axios";
import {
  BASE,
  SPEAKER_QUESTION,
  NIGHT_EVENT,
  SPEAKERS_RATING,
  SURVEY,
  QUESTION,
} from "../API/Api";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import Cookie from "cookie-universal";

export default function DeclarativeConfirmDialog({
  confirmDialogVisible = null,
  setConfirmDialogVisible,
  users,
  eventDayId,
  notificationType,
  speakers = [],
  spIndex = null,
}) {
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const toast = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const { t } = useTranslation();

  const cookies = new Cookie();
  const token = cookies.get("edu-caring");

  const surveyType = notificationType === "survey";
  const questionType = notificationType === "question";
  const spQuestionType = notificationType === "speakerQuestion";
  const spRatingType = notificationType === "speakerRating";
  const nightEventType = notificationType === "nightEvent";
  const startNotification = async () => {
    const notificationUrl = surveyType
      ? `${BASE}/${SURVEY}`
      : questionType
      ? `${BASE}/${QUESTION}`
      : spQuestionType
      ? `${BASE}/${SPEAKER_QUESTION}`
      : spRatingType
      ? `${BASE}/${SPEAKERS_RATING}`
      : nightEventType
      ? `${BASE}/${NIGHT_EVENT}`
      : null;
    let nightEventIds = [];

    if (nightEventType) {
      const speakerIds = selectedSpeakers.map((speaker) => speaker.id);
      const userIds = selectedUsers.map((user) => user.id);
      nightEventIds = [...speakerIds, ...userIds];
    }
    try {
      const response = await axios.post(
        notificationUrl,
        {
          requestedId: `${eventDayId}`,
          title: nightEventType
            ? "Night Event Notification"
            : surveyType
            ? "Survey Notification"
            : questionType
            ? "Question Notification"
            : spQuestionType
            ? "Speaker Question Notification"
            : "Speaker Rating Notification",
          body: nightEventType
            ? "You have received a notification for the night event."
            : surveyType
            ? "You have received a notification for the survey."
            : spQuestionType
            ? "You have received a notification for the speaker question."
            : questionType
            ? "You have received a notification for the questions"
            : "You have received a notification for the speaker rating.",
          userIds: nightEventType
            ? nightEventIds
            : spQuestionType
            ? [users.speakerId]
            : users.map((user) => user.id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: t("Confirmed"),
          detail: `${t("YouHaveStarted")} ${
            nightEventType
              ? t("NightEvent")
              : spQuestionType
              ? t("SpeakerQuestion")
              : surveyType
              ? t("Survey")
              : questionType
              ? t("Question")
              : t("SpeakerRating")
          } ${t("Notification")}`,
          life: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "warn",
        summary: "Rejected",
        detail: error.message,
        life: 3000,
      });
    }
  };
  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const header = (
    <div className="d-flex justify-content-center gap-3 only-dashboard">
      <MultiSelect
        value={selectedSpeakers}
        onChange={(e) => setSelectedSpeakers(e.value)}
        options={speakers}
        optionLabel="name"
        filter
        placeholder={t("SelectSpeakers")}
        className="w-full md:w-20rem"
      />
      <MultiSelect
        value={selectedUsers}
        onChange={(e) => setSelectedUsers(e.value)}
        options={users}
        optionLabel="name"
        filter
        placeholder={t("SelectUsers")}
        className="w-full md:w-20rem"
      />
    </div>
  );
  return (
    <>
      <Toast
        ref={toast}
        severity="success"
        summary="Notification Sent"
        detail="Your notification has been sent successfully!"
        life={3000}
        onClose={() => setShowToast(false)}
        className={showToast ? "p-toast-visible" : "p-toast-hidden"}
      />

      <ConfirmDialog
        key={eventDayId}
        group="declarative"
        className=" only-dashboard"
        visible={confirmDialogVisible}
        headerClassName="confirmdialog-header"
        contentClassName="confirmdialog-content"
        onHide={() => setConfirmDialogVisible(spIndex)}
        message={`${t("AreYouSure")} ${
          surveyType
            ? "survey"
            : spQuestionType
            ? "Speaker Question"
            : spRatingType
            ? "speakers Rating"
            : nightEventType
            ? "Night Event"
            : questionType
            ? "question"
            : null
        }?`}
        header={nightEventType ? header : t("Confirmation")}
        icon="pi pi-exclamation-triangle"
        accept={startNotification}
        reject={reject}
      />
    </>
  );
}
