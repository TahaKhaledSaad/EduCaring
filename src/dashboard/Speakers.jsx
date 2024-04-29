import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE, BLOCK_USER, GET_SPEAKERS, UNBLOCK_USER } from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MessageModal from "../DashboardComponents/MessageModal";
import { useTranslation } from "react-i18next";
import "./style.css";
import { Toast } from "primereact/toast";
import ConfirmCheck from "../DashboardComponents/ConfirmCheck";

export default function Speakers({
  speakers,
  setSpeakers,
  loading,
  setLoading,
}) {
  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [messageRecivier, setMessageRecivier] = useState("");
  const { t } = useTranslation();
  const toast = useRef(null);
  const targetRef = useRef(null);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false); // State to manage confirmation dialog visibility
  const [confirmMessage, setConfirmMessage] = useState(""); // State to manage

  const [confirmCallback, setConfirmCallback] = useState(() => () => {}); // State to manage confirmation dialog callback function
  const showConfirmDialog = (message, callback, ref) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setConfirmVisible(true);
    targetRef.current = ref;
  };
  const confirmAccept = () => {
    confirmCallback(); // Execute the callback function
    setConfirmVisible(false); // Hide the confirmation dialog
  };
  const accept = (text) => {
    text === "User UnBlocked Successfuly"
      ? toast.current.show({
          severity: "success",
          summary: t("Confirmed"),
          detail: t("UserUnBlocked"),
          life: 3000,
        })
      : toast.current.show({
          severity: "warn",
          summary: t("Confirmed"),
          detail: t("UserBlocked"),
          life: 3000,
        });
  };
  const confirmReject = () => {
    setConfirmVisible(false); // Hide the confirmation dialog

    // Show warning toast
    reject();
  };
  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: t("rejectRemoving"),
      detail: t("rejectBlockChange"),
      life: 3000,
    });
  };
  // Get all speakers
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_SPEAKERS}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setSpeakers(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [setSpeakers, setLoading, runUseEffect]);

  const handleMessageModal = (messageRecivier) => {
    setModalVisible(true);
    setMessageRecivier(messageRecivier);
  };

  const blockUser = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        let result = await axios.post(
          `${BASE}/${UNBLOCK_USER}?userId=${userId}`
        );
        if (result.status === 200) {
          // If deletion is successful, trigger a re-fetch of events
          setRunUseEffect((prev) => prev + 1);
          accept(result.data.responseText);
        }
      } else if (!isBlocked) {
        let result = await axios.post(`${BASE}/${BLOCK_USER}?userId=${userId}`);
        if (result.status === 200) {
          // If deletion is successful, trigger a re-fetch of events
          accept();
          setRunUseEffect((prev) => prev + 1);
        }
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: t("Error"),
        detail: error.response.data.message,
        life: 3000,
      });
    }
  };
  return (
    <div className="h-100">
      <h2 className="main-title fw-bold text-muted">
        {t("Speakers")}{" "}
        <small className="text-muted mt-3 fw-light fst-italic ">
          {t("AllRegisteredAsSpeakers")}
        </small>
      </h2>
      <Toast ref={toast} />
      <ConfirmCheck
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        message={confirmMessage}
        target={targetRef.current}
        icon="pi pi-exclamation-triangle"
        accept={confirmAccept}
        reject={confirmReject}
      />
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          value={speakers}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
          emptyMessage="No Speakers found."
        >
          <Column
            body={(rowData, index) => index.rowIndex + 1}
            header={"Count"}
          ></Column>
          <Column
            field="nameEn"
            filterPlaceholder={t("SearchByName")}
            header={t("Name")}
            filter={true}
            style={{ textAlign: "center" }}
            showFilterMenu={false}
            sortable
            filterMatchMode="contains"
          ></Column>
          <Column
            field="phoneNumber"
            header={t("PhoneNumber")}
            filter={true}
            sortable
            filterMatchMode="contains"
            filterPlaceholder={t("SearchByPhoneNumber")}
            showFilterMenu={false}
            style={{ width: "25% ", textAlign: "center" }}
          ></Column>
          <Column
            field="email"
            header={t("Email")}
            filterPlaceholder={t("SearchByEmail")}
            filter={true}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ width: "25% ", textAlign: "center" }}
          ></Column>
          <Column
            header={t("SendMessage")}
            dataType="boolean"
            style={{ width: "10rem" }}
            body={(rowData) => {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <i
                    onClick={() => handleMessageModal(rowData)}
                    className="fas center fa-paper-plane update"
                  ></i>
                  <i
                    onClick={(e) =>
                      showConfirmDialog(
                        rowData.isBlocked
                          ? t("ConfirmationMessages.unBlockUser")
                          : t("ConfirmationMessages.blockUser"),
                        () => blockUser(rowData.id, rowData.isBlocked),
                        e.target, // Pass the button reference, so that we can focus it later
                        rowData.isBlocked
                      )
                    }
                    className={`fas center fa-${
                      !rowData.isBlocked
                        ? "fas fa-lock-open update"
                        : "fas fa-lock update"
                    } update d-flex justify-content-center align-items-center`}
                    style={{
                      color: rowData.isBlocked ? "#22c55e" : "#dc3545",
                    }}
                  ></i>
                </div>
              );
            }}
          />
        </DataTable>
        <MessageModal
          setVisible={setModalVisible}
          visible={modalVisible}
          messageRecivier={messageRecivier}
          reciverType="user"
        />
      </div>
    </div>
  );
}
