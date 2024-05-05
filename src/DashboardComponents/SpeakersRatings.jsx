import React, { useState, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { BASE, BEST_SPEAKERS } from "../API/Api";
import "./style.css";
import { Badge } from "primereact/badge";
import Cookie from "cookie-universal";

export default function SpeakersRatings({
  isBestSpeakersModalOpen = false,
  setIsBestSpeakersModalOpen,
  eventDayId,
}) {
  const [bestSpeakers, setBestSpeakers] = useState([]);
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  useEffect(() => {
    const fetchBestSpeakers = async () => {
      try {
        const response = await axios.get(
          `${BASE}/${BEST_SPEAKERS}/?eventDayId=${eventDayId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.responseObject)
          setBestSpeakers(response.data.responseObject);
      } catch (error) {
        console.error("Error fetching best speakers:", error);
      }
    };
    fetchBestSpeakers();
  }, [eventDayId]);

  const renderProfileImage = (speaker) => {
    if (
      speaker.speaker.displayProfileImage &&
      !speaker.speaker.displayProfileImage.endsWith("null")
    ) {
      return (
        <img
          src={speaker.speaker.displayProfileImage}
          alt={speaker.speaker.name}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      );
    } else {
      return (
        <div className="profile_letters ">
          <p className="text-center rounded-circle text-white d-flex align-items-center justify-content-center m-auto">
            {speaker.speaker.name.slice(0, 2).toUpperCase()}
          </p>
        </div>
      );
    }
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    return items.map((speaker, index) => itemTemplate(speaker, index));
  };

  const itemTemplate = (speaker, index) => {
    const rankClassName =
      index === 0
        ? "first-place"
        : index === 1
        ? "second-place"
        : index === 2
        ? "third-place"
        : "other-place";

    return (
      <div
        className={`col-12 p-3 p-md-3 ${rankClassName}`}
        key={speaker.speakerId}
        style={{
          borderRadius: "8px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          margin: "10px 0px",
          position: "relative",
        }}
      >
        <div className="speaker-card only-dashboard">
          <Badge
            value={index + 1}
            severity={index === 0 ? "info" : "warning"}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          />
          <div className="profile-image">{renderProfileImage(speaker)}</div>
          <div className="speaker-details">
            <div className="d-flex justify-content-between">
              <h3 className="name">{speaker.speaker.name}</h3>
              <span
                className="rate"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                }}
              >
                {Math.floor(speaker.ratePercentage)}%
              </span>
            </div>
            <div className="rating gap-2">
              <Rating
                value={Number(Math.floor(speaker.ratePercentage)) / 10}
                style={{ fontSize: "1.5rem" }}
                readOnly
                cancel={false}
                stars={10}
              />
              <span style={{ marginLeft: "5px" }}>{speaker.totalRate}</span>
            </div>
            <div className="other-details">
              <div>
                Date of Birth:{" "}
                <span>
                  <strong>
                    {new Date(speaker.speaker.dateOfBirth).toLocaleDateString()}
                  </strong>
                </span>
              </div>
              <div>
                Phone Number:{" "}
                <span>
                  <strong>{speaker.speaker.phoneNumber}</strong>
                </span>
              </div>
              <div>
                Email:{" "}
                <span>
                  <strong>{speaker.speaker.email}</strong>
                </span>
              </div>
              <div>
                Health Authority Number:{" "}
                <span>
                  <strong>{speaker.speaker.healthAuthorityNumber}</strong>
                </span>
              </div>
              <div>
                Current Work Place:{" "}
                <span>
                  <strong>{speaker.speaker.currentWorkPlace}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      style={{
        minWidth: "30rem",
        backgroundColor: "white",
        borderRadius: "10px",
        maxHeight: "80vh",
        overflow: "auto",
        padding: "0 20px 20px 20px",
      }}
      visible={isBestSpeakersModalOpen}
      headerClassName="messages-header p-3"
      className="only-dashboard"
      modal
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onHide={() => setIsBestSpeakersModalOpen(false)}
    >
      <DataView value={bestSpeakers} listTemplate={listTemplate} />
    </Dialog>
  );
}
