import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import "./style.css";

import axios from "axios";
import {
  BASE,
  COMMUNITY,
  EVENT_RESORSES,
  PRIVATE_MESSAGES,
  UPLOAD,
} from "../API/Api";

import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";
import { Image } from "primereact/image";
import Cookie from "cookie-universal";

export default function MessageModal({
  messageRecivier,
  setVisible,
  visible = false,
  reciverType = "user",
  speakers = [],
  users = [],
  eventDayId = null,
}) {
  const [messageValue, setMessageValue] = useState("");
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const fileUploadRef = useRef(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const { t } = useTranslation();
  const [fetchMessagesTrigger, setFetchMessagesTrigger] = useState(false);
  console.log(messageRecivier);
  useEffect(() => {
    if (messageRecivier && messageRecivier.id) {
      axios
        .get(`${BASE}/${PRIVATE_MESSAGES}?userId=${messageRecivier.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPrivateMessages(response.data.responseObject || []);
        })
        .catch((error) => {
          console.error("Error fetching private messages:", error);
        });
    }
  }, [messageRecivier, fetchMessagesTrigger]);
  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };
  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
        <div className="stat-bar ml-auto">
          <span>{formatedValue} / 5 MB</span>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    const formData = new FormData();
    formData.append("Content", file);

    return (
      <div
        style={{ position: "relative" }}
        className="flex align-items-start flex-wrap gap-1 item-template-container-upload"
      >
        <div
          className={`flex ${
            reciverType === "user" ? "flex-column" : " "
          } align-items-center`}
        >
          <Image
            alt={file.name}
            preview
            role="presentation"
            src={file.objectURL}
            height={70}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name.length > 5 ? <>{file.name.slice(0, 5)}..</> : file.name}
            <small style={{ textAlign: "center" }}>
              {new Date().toLocaleDateString()}
            </small>
            <Tag
              value={props.formatSize}
              severity="warning"
              className="px-3 py-2 size-up-tag"
            />
          </span>
        </div>
        <div className="d-felx row align-items-center  ">
          <Button
            type="button"
            icon="fas fa-times"
            className="p-button-outlined p-button-rounded p-button-danger item-template-cancelbtn m-auto"
            style={{
              right: 0,
              top: 0,
            }}
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div
        style={{ height: "100px" }}
        className="flex align-items-center  justify-content-center"
      >
        <i
          className="far fa-images mt-3 p-4 m-auto"
          style={{
            fontSize: "2.5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        ></span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "fas fa-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "fas fa-file-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "fas fa-times-circle",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const headerElement =
    reciverType === "user" ? (
      <div className="inline-flex align-items-center justify-content-center gap-2 ">
        <span className="font-bold white-space-nowrap">
          {messageRecivier.nameEn}
        </span>
      </div>
    ) : (
      <div className="d-flex justify-content-center gap-3">
        <MultiSelect
          value={selectedSpeakers}
          onChange={(e) => setSelectedSpeakers(e.value)}
          options={speakers}
          optionLabel="name"
          filter
          placeholder="Select Speakers"
          className="w-full md:w-20rem"
        />
        <MultiSelect
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(e.value)}
          options={users}
          optionLabel="name"
          filter
          placeholder="Select Users"
          className="w-full md:w-20rem"
        />
      </div>
    );

  const handleSubmit = () => {
    //the uploaded files using the ref of the FileUpload component
    const uploadedFiles = fileUploadRef.current.getFiles();
    if (uploadedFiles.length === 0 && messageValue.length === 0) {
      return;
    }

    // a FormData object to send files and text to the backend
    const formData = new FormData();
    formData.append("Message", messageValue);

    // Append each uploaded file to the FormData
    uploadedFiles.forEach((file) => {
      formData.append("ImageFile", file);
    });

    const timestamp = new Date().toISOString();
    formData.append("Timestamp", timestamp);

    // Conditionally handle the UserIds and EventDayId fields based on the reciverType
    if (reciverType === "user") {
      formData.append("UserIds", messageRecivier.id);
    } else {
      if (selectedSpeakers.length === 0 && selectedUsers.length === 0) return;
      formData.append("EventDayId", eventDayId);
      if (selectedSpeakers.length > 0 && selectedUsers.length > 0) {
        selectedSpeakers.forEach((user) => {
          formData.append("UserIds", user.id);
        });
        selectedUsers.forEach((user) => {
          formData.append("UserIds", user.id);
        });
      } else if (selectedSpeakers.length > 0) {
        selectedSpeakers.forEach((user) => {
          formData.append("UserIds", user.id);
        });
      } else if (selectedUsers.length > 0) {
        // userAndSpeakerIds = selectedUsers.map((user) => user.id).join(",");
        selectedUsers.forEach((user) => {
          formData.append("UserIds", user.id);
        });
      }
    }

    // Make a POST request to your backend endpoint
    axios
      .post(`${BASE}/${COMMUNITY}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle response
        if (response.status === 200) {
          setFetchMessagesTrigger(!fetchMessagesTrigger);

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Message and files sent successfully!",
            life: 3000,
          });
          // Reset form values and close the modal
          setMessageValue("");
          fileUploadRef.current.clear();
          if (reciverType !== "user") setVisible(false);
        } else {
          console.error("Failed to send message and files");
        }
      })
      .catch((error) => {
        console.error("Error during sending:", error);
      });
  };

  const uploadStyle =
    reciverType === "user"
      ? {
          overflow: "auto",
          position: "absolute",
          bottom: " 0",
          width: "100%",

          backgroundColor: "white",
        }
      : {};

  return (
    <Dialog
      style={
        reciverType === "user" && privateMessages.length > 0
          ? {
              minWidth: "50rem",
              backgroundColor: "white",
              borderRadius: "10px",
              height: "900px",
            }
          : reciverType === "user"
          ? {
              minWidth: "50rem",
              backgroundColor: "white",
              borderRadius: "10px",
              height: "500px",
            }
          : {
              minWidth: "50rem",
              backgroundColor: "white",
              borderRadius: "10px",
            }
      }
      className="message-modal only-dashboard"
      visible={visible}
      headerClassName="messages-header p-3 only-dashboard"
      modal
      maximizable
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      header={headerElement}
      onHide={() => setVisible(false)}
    >
      <div
        style={
          reciverType === "user"
            ? { paddingBottom: "350px", position: "relative" }
            : {}
        }
      >
        {reciverType === "user" && privateMessages.length > 0 && (
          <div className="container">
            <div className="card">
              <div
                className="card-header p-3"
                style={{
                  marginBottom: "20px",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                  backgroundColor: "#0885da",
                  color: "white",
                }}
              >
                Old Conversation with{" "}
                {messageRecivier ? messageRecivier.nameEn : "Unknown User"}
              </div>
              <div className="card-body">
                {privateMessages.map((message, index) => {
                  const shouldRenderImage =
                    message.imageUrl && !message.imageUrl.endsWith("/");
                  return (
                    <div key={index} className="message mb-4">
                      <div className="message-header">
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="message-content d-flex align-items-center gap-1 row justify-content-start">
                        <p
                          style={{
                            wordWrap: "break-word",
                            padding: message?.message?.length > 0 ? "" : "0",
                          }}
                        >
                          {message.message}
                        </p>
                        {message.imageUrl &&
                          shouldRenderImage &&
                          (message.imageUrl.includes(".pdf") ? (
                            <a
                              href={message.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                height={120}
                                src="/pdf.png"
                                className="img-fluid imggg"
                                style={{ objectFit: "contain" }}
                                alt="PDF"
                              />
                            </a>
                          ) : (
                            <Image
                              src={message.imageUrl}
                              alt="Image"
                              height={120}
                              preview
                              className="imggg "
                              style={{ objectFit: "contain" }}
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className=" container mt-5 only-dashboard" style={uploadStyle}>
        <div className="custom-upload-modal">
          <Toast ref={toast}></Toast>

          <Tooltip
            target=".custom-choose-btn"
            content={t("Choose")}
            position="bottom"
          />
          <Tooltip
            target=".custom-upload-btn"
            content="Upload"
            position="bottom"
          />
          <Tooltip
            target=".custom-cancel-btn"
            content={t("Clear")}
            position="bottom"
          />

          <FileUpload
            ref={fileUploadRef}
            name="message"
            url={`${BASE}/${UPLOAD}/${EVENT_RESORSES}`}
            multiple
            accept="image/*,video/*,.pdf"
            maxFileSize={5000000}
            onSelect={onTemplateSelect}
            onClear={onTemplateClear}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            className="container mt-5"
            contentClassName="content-upload-files"
          />
        </div>
        <div className="d-flex align-items-center justify-between gap-2 p-3 footer-upload-modal">
          <div className="d-flex align-items-center justify-between gap-2 flex-grow-1 ">
            <div className="justify-content-between align-self-start d-inline-flex messages-attach footer-upload-modal"></div>
            <InputTextarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="flex-grow-1 footer-upload-modal-input"
              rows={3}
              cols={30}
              placeholder={t("EnterMessage")}
              maxLength={1000}
              autoResize={false}
            />
          </div>
          <div>
            <Button
              label={t("Send")}
              style={{
                width: "80px",
                borderRadius: "5px",
              }}
              iconPos="right"
              icon="fas fa-share"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
