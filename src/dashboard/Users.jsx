import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE, BLOCK_USER, GET_USERS, UNBLOCK_USER } from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MessageModal from "../DashboardComponents/MessageModal";
import { useTranslation } from "react-i18next";
import ConfirmCheck from "../DashboardComponents/ConfirmCheck";
import { Toast } from "primereact/toast";
import "./style.css";
import Cookies from "universal-cookie";

export default function Users() {
  const cookies = new Cookies();
  const token = cookies.get("edu-caring");
  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageRecivier, setMessageRecivier] = useState("");
  const [runUseEffect, setRunUseEffect] = useState(0);
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const [confirmVisible, setConfirmVisible] = useState(false); // State to manage confirmation dialog visibility
  const [confirmMessage, setConfirmMessage] = useState(""); // State to manage confirmation dialog message
  const [confirmCallback, setConfirmCallback] = useState(() => () => {}); // State to manage confirmation dialog callback function
  const toast = useRef(null);

  // Get all events
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
  }, [runUseEffect]);
  const showConfirmDialog = (message, callback, ref) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setConfirmVisible(true);
    targetRef.current = ref;
  };

  const handleMessageModal = (messageRecivier) => {
    setModalVisible(true);
    setMessageRecivier(messageRecivier);
  };
  const confirmAccept = () => {
    confirmCallback(); // Execute the callback function
    setConfirmVisible(false); // Hide the confirmation dialog

    // Show success toast
    // accept();
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

  // Function to handle rejecting the confirmation dialog
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
  // Block and UnBlock User
  const blockUser = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        let result = await axios.post(
          `${BASE}/${UNBLOCK_USER}?userId=${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (result.status === 200) {
          // If deletion is successful, trigger a re-fetch of events
          setRunUseEffect((prev) => prev + 1);
          accept(result.data.responseText);
        }
      } else if (!isBlocked) {
        let result = await axios.post(`${BASE}/${BLOCK_USER}?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        {t("Users")} {"  "}
        <small className="text-muted mt-3 fw-light fst-italic ">
          {t("AllRegisteredAsUsers")}
        </small>
      </h2>
      <div style={{ overflowX: "auto" }}>
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
        <DataTable
          dataKey="id"
          rowClassName={(data) => (data.isBlocked ? "blocked" : "")}
          value={users}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
          emptyMessage={t("NoUsersFound")}
        >
          <Column
            body={(rowData, index) => index.rowIndex + 1}
            header={t("Count")}
          ></Column>
          <Column
            field="nameEn"
            filterPlaceholder={t("SearchByName")}
            header={t("Name")}
            style={{ textAlign: "center" }}
            filter={true}
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
            field="verified"
            header={t("Active")}
            dataType="boolean"
            style={{ width: "6rem", textAlign: "center" }}
            sortable
            body={(rowData) =>
              rowData.id ? `${t("Yes")} ✅` : ` ${t("No")} ❌`
            }
          />
          <Column
            header={t("Actions")}
            dataType="boolean"
            style={{ width: "10rem" }}
            body={(rowData) => {
              return (
                <>
                  <i
                    onClick={() => handleMessageModal(rowData)}
                    className="fas center fa-paper-plane update"
                  ></i>{" "}
                  <i
                    onClick={(e) =>
                      showConfirmDialog(
                        rowData.isBlocked
                          ? t("ConfirmationMessages.blockUser")
                          : t("ConfirmationMessages.unBlockUser"),
                        () => blockUser(rowData.id, rowData.isBlocked),
                        e.target, // Pass the button reference, so that we can focus it later
                        rowData.isBlocked
                      )
                    }
                    className={`fas center fa-${
                      !rowData.isBlocked
                        ? "fas fa-lock-open update"
                        : "fas fa-lock update"
                    } update`}
                    style={{
                      color: rowData.isBlocked ? "#22c55e" : "#dc3545",
                    }}
                  ></i>
                </>
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
