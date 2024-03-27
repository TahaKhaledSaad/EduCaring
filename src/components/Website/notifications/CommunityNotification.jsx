import React from "react";
import logo from "../../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CommunityNotification({ sendTime }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <div className="question" onClick={() => nav("community")}>
      <div className="notif-row">
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6>{t("EventOrganizer")}</h6>
          <p className="new">{t("newUpdateInCommunity")} </p>
          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
      </div>
    </div>
  );
}
