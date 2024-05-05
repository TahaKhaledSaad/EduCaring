import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE, PRIVATE_MESSAGES, SUPPORT } from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import MessageModal from "../DashboardComponents/MessageModal";
import "./style.css";
import Cookie from "cookie-universal";

export default function Support() {
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageRecivier, setMessageRecivier] = useState("");
  const [support, setSupport] = useState([]);
  const { t } = useTranslation();
  const [oldMessages, setOldMessages] = useState([]);
  const [showOldMessages, setShowOldMessages] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  console.log(messageRecivier, "messageRecivier");
  // Get all support messages
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${SUPPORT}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setSupport(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
  const handleMessageModal = (messageRecivier) => {
    setMessageModalVisible(true);
    setMessageRecivier(messageRecivier);
  };
  // Fetch old messages for the user
  const handleFetchButton = (user) => {
    setShowOldMessages((prevState) => !prevState);
    setMessageRecivier(user);
    axios
      .get(`${BASE}/${PRIVATE_MESSAGES}?userId=${user.user.id}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOldMessages(response.data.responseObject);
      })
      .catch((error) => {
        console.error("Error fetching old messages:", error);
      });
  };

  const renderProfileImage = (user) => {
    if (
      user.user.displayProfileImage &&
      !user.user.displayProfileImage.endsWith("null")
    ) {
      return (
        <img
          src={user.user.displayProfileImage}
          style={{ maxWidth: "50px" }}
          alt={user.user.name}
        />
      );
    } else {
      return (
        <div className="profile_letters">
          <p className="text-center rounded-circle text-white d-flex align-items-center justify-content-center m-auto">
            {user.user.nameEn.slice(0, 2).toUpperCase()}
          </p>
        </div>
      );
    }
  };
  const renderOldMessages = (oldMessages) => {
    if (oldMessages?.length > 0) {
      return (
        <div
          className="old-messages message-footer-content"
          style={{ maxHeight: "300px", overflow: "auto" }}
        >
          <div className="container">
            <div className="card">
              <div className="card-body">
                {oldMessages.map((message, index) => {
                  const shouldRenderImage =
                    message.imageUrl && !message.imageUrl.endsWith("/");
                  return (
                    <div key={index} className="message mb-4">
                      <div className="message-header">
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div
                        style={{ textAlign: "left" }}
                        className="message-content d-flex align-items-center gap-1 row justify-content-start"
                      >
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
        </div>
      );
    }
  };

  const header = function (messageRecivier) {
    return (
      <div className="user-profile p-3 d-flex justify-content-between align-items-center  border-bottom gap-3">
        {renderProfileImage(messageRecivier)}
        <div className="user-details">
          <span className="user-name">{messageRecivier.user.nameEn}</span>
          <span className="user-email px-2">
            {messageRecivier.user.phoneNumber}
          </span>
        </div>
        <i
          onClick={() => handleMessageModal(messageRecivier)}
          className="  m-auto fas center fa-paper-plane update"
          style={{
            cursor: "pointer",
            color: "#6366f1",
            fontSize: "25px",
          }}
        ></i>
      </div>
    );
  };

  const footer = (messageRecivier) => {
    return (
      <div className="message-footer">
        <div
          className="card-header p-3 d-flex justify-content-between align-items-center message-footer-header"
          onClick={() => handleFetchButton(messageRecivier)}
          style={{
            marginBottom: "20px",
            position: "sticky",
            top: "0",
            zIndex: "1",
            backgroundColor: "#6366f1",
            color: "white",
            textAlign: "left",
            padding: "10px 20px",
            borderRadius: "10px 10px 0 0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          <p>
            Old Conversation with{" "}
            {messageRecivier ? messageRecivier.user.nameEn : "Unknown User"}
          </p>
          <p>
            {showOldMessages ? (
              <i className="fas fa-chevron-down"></i>
            ) : (
              <i className="fas fa-chevron-up"></i>
            )}
          </p>
        </div>
        {showOldMessages && renderOldMessages(oldMessages)}
      </div>
    );
  };

  return (
    <div className="h-100 only-dashboard">
      <h2 className="main-title fw-bold text-muted">
        {t("Support")} {"  "}
        <small className="text-muted mt-3 fw-light fst-italic ">
          {t("AllSupportMessages")}
        </small>
      </h2>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          rowClassName={(data) =>
            (data.user.isBlocked ? "blocked" : "") + " support-row"
          }
          value={support}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
          emptyMessage={t("NoUsersFound")}
          onRowClick={(event) => {
            setModalVisible(true);
            setMessageRecivier(event.data);
          }}
        >
          <Column
            body={(rowData, index) => index.rowIndex + 1}
            header="#"
          ></Column>
          <Column
            field="user.nameEn"
            filterPlaceholder={t("SearchByName")}
            filterHeaderStyle={{ width: "100%" }}
            header={t("Name")}
            style={{ textAlign: "center" }}
            filter={true}
            showFilterMenu={false}
            sortable
            filterMatchMode="contains"
          ></Column>

          <Column
            field="user.phoneNumber"
            header={t("PhoneNumber")}
            filter={true}
            sortable
            filterMatchMode="contains"
            filterPlaceholder={t("SearchByPhoneNumber")}
            showFilterMenu={false}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            field="user.email"
            header={t("Email")}
            filterPlaceholder={t("SearchByEmail")}
            filter={true}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ textAlign: "center" }}
          ></Column>

          <Column
            field="user.isBlocked"
            header={t("Active")}
            dataType="boolean"
            style={{ width: "6rem", textAlign: "center" }}
            sortable
            body={(rowData) =>
              !rowData.user.isBlocked ? `${t("Yes")} ✅` : ` ${t("No")} ❌`
            }
          />
          <Column
            field="title"
            header={t("Title")}
            dataType="text"
            style={{ width: "15rem", textAlign: "center" }}
            sortable
          />
          <Column
            field="content"
            filterPlaceholder={t("SearchByName")}
            header={t("Content")}
            style={{ textAlign: "center", width: "25%" }}
            filterMatchMode="contains"
          ></Column>
        </DataTable>
        <Dialog
          visible={modalVisible}
          modal
          headerClassName="p-1 "
          draggable
          maximizable
          className="p-0 border-bottom border-secondary-subtle supp-dialog"
          onHide={() => {
            setModalVisible(false);
            setMessageRecivier(null);
            setOldMessages([]);
            setShowOldMessages(false);
          }}
          footer={messageRecivier ? footer(messageRecivier) : null}
          header={messageRecivier ? header(messageRecivier) : null}
          style={{ maxWidth: "80vw", width: " 450px" }}
        >
          <h2 className="p-3 " style={{ fontSize: "1.5rem" }}>
            {messageRecivier && <strong>{messageRecivier.title}</strong>}
          </h2>
          {messageRecivier && (
            <div className="supp-dialog-content support-message mx-5">
              <div className="supp-message-content">
                <p className="text-muted">{messageRecivier.content}</p>
              </div>
            </div>
          )}
        </Dialog>

        {messageRecivier && (
          <MessageModal
            setVisible={setMessageModalVisible}
            visible={messageModalVisible}
            messageRecivier={messageRecivier.user}
            reciverType="user"
          />
        )}
      </div>
    </div>
  );
}
