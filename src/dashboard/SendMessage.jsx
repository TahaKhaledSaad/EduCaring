import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BASE, COMMUNITY, GET_SPEAKERS, GET_USERS } from "../API/Api";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import "./style.css";
import Cookie from "cookie-universal";

export default function SendMessage() {
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const [speakers, setSpeakers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [messageValue, setMessageValue] = useState("");
  const fileUploadRef = useRef(null);
  const { t } = useTranslation();
  const toast = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_USERS}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setUsers(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
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

    if (selectedSpeakers.length === 0 && selectedUsers.length === 0) return;
    // formData.append("EventDayId", eventDayId);
    // Map selectedSpeakers and selectedUsers and construct UserIds string

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
          console.log("Message and files sent successfully!");
          // Reset form values and close the modal
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Message and files sent successfully!",
            life: 3000,
          });
          setMessageValue("");
          fileUploadRef.current.clear();
        } else {
          console.error("Failed to send message and files");
        }
      })
      .catch((error) => {
        console.error("Error during sending:", error);
      });
  };
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
        className="flex align-items-center flex-wrap"
      >
        <div className={`flex  align-items-center`}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>

        <Button
          type="button"
          icon="fas fa-times"
          className="p-button-outlined p-button-rounded p-button-danger  ml-auto"
          style={{
            right: 0,
            top: 0,
          }}
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="far fa-images mt-3 p-5"
          style={{
            fontSize: "5em",
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
  return (
    <div className="send-message">
      <div className="d-flex flex-wrap justify-content-center gap-5 p-5">
        <MultiSelect
          value={selectedSpeakers}
          onChange={(e) => setSelectedSpeakers(e.value)}
          options={speakers}
          optionLabel="nameEn"
          filter
          placeholder="Select Speakers"
          className="w-full md:w-20rem send-message-select"
        />
        <MultiSelect
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(e.value)}
          options={users}
          optionLabel="nameEn"
          filter
          placeholder="Select Users"
          className="w-full md:w-20rem send-message-select"
        />
      </div>
      <div className="card flex justify-content-center">
        <FileUpload
          ref={fileUploadRef}
          name="message"
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
        />
      </div>
      <div className="d-flex align-items-center justify-between gap-5 p-3 ">
        <div className="d-flex flex-wrap align-items-center justify-between gap-5 flex-grow-1 ">
          <InputTextarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="flex-grow-1"
            rows={4}
            cols={30}
            maxLength={1000}
            autoResize={true}
          />{" "}
          <div>
            <Button
              label={t("Send")}
              style={{
                width: "100px",
                borderRadius: "5px",
              }}
              iconPos="right"
              icon="fas fa-share"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
      <Toast ref={toast}></Toast>
    </div>
  );
}
