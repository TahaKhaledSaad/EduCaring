import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import ConfirmCheck from "../DashboardComponents/ConfirmCheck";
import { Toast } from "primereact/toast";
import { BASE, DELETE_AFFILIATE_CODE, GET_All_AFFILIATE_CODES } from "../API/Api"; // replace with Affiliate Code API
import "./style.css";
import Cookie from "cookie-universal";
import AffiliateCodeAction from "../DashboardComponents/AffiliateCodeAction";

export default function AffiliateCode() {
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const [affiliateCodes, setAffiliateCodes] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false); // State to manage confirmation dialog visibility
  const [confirmMessage, setConfirmMessage] = useState(""); // State to manage confirmation dialog message
  const [confirmCallback, setConfirmCallback] = useState(() => () => {}); // State to manage confirmation dialog callback function
  const toast = useRef(null);
  const targetRef = useRef(null);

  // landing page create and delete
  const [createModalVisible, setCreateModalVisible] = useState(false); // State to manage create modal visibility
  const [createModalData, setCreateModalData] = useState({}); // State to manage create modal data

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_All_AFFILIATE_CODES}`, { // replace with Affiliate Code API
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setAffiliateCodes(data.data.responseObject);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, [runUseEffect]);

  const confirmAccept = () => {
    confirmCallback(); // Execute the callback function
    setConfirmVisible(false); // Hide the confirmation dialog

    // Show success toast
    // accept();
  };

  console.log(affiliateCodes);

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
  const showConfirmDialog = (message, callback, ref) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setConfirmVisible(true);
    targetRef.current = ref;
  };
  const deleteSpeaker = async (id) => {
    try {
      // Use the provided API endpoint for deletion
      let result = await axios
        .delete(`${BASE}/${DELETE_AFFILIATE_CODE}`, { // replace with Affiliate Code API
          params: {
            id: id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          console.log(data);
          setRunUseEffect((prev) => prev + 1);
          setCreateModalVisible(false);
        })
        .catch((err) => console.log(err));
      if (result.status === 200) {
        // If deletion is successful, trigger a re-fetch of events
        setRunUseEffect((prev) => prev + 1);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: " Affiliate Code deleted successfully.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenCreateModal = () => {
    // Set up initial form data for creating a new speaker
    const initialFormData = {
      id: 0,
      code: null,
      nameAr: null,
      nameEn: null,
      isDeleted: false,
    };
    // Open the modal with create mode
    setCreateModalData(initialFormData);
    setCreateModalVisible(true);
  };
  const handleOpenEditModal = (rowData) => {
    // Open the modal with edit mode and pass the speaker data
    setCreateModalData({ ...rowData });
    setCreateModalVisible(true);
  };
  return (
    <div className="h-100">
      <div className="d-flex justify-content-between event-page">
        <h2 className="main-title fw-bold text-muted">{t("AffiliateCodes")} </h2>
        <div
          onClick={handleOpenCreateModal}
          className="btn link add-event "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "3px",
            gap: "7px",
            textDecoration: "none",
            color: "#555",
            cursor: "pointer",
            borderRadius: "5px",
            padding: "5px 5px",
            border: "1px solid #0077ff25",
            transition: " 0.3s all ease-in-out",
            position: "relative",
            fontSize: "20px",
          }}
        >
          <i className="fas fa-plus-square "></i>
          <span style={{ paddingRight: "7px" }}>{t("AddAffiliateCodes")}</span>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          value={affiliateCodes}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
        >
          <Column
            field="id"
            header={t("id")}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            field="code"
            header={t("Code")}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            field="nameAr"
            header={t("nameAr")}
            style={{ textAlign: "center" }}
          ></Column>
          <Column
            field="nameEn"
            header={t("nameEn")}
            style={{ textAlign: "center" }}
          ></Column>
         
         <Column
            field="usingCount"
            header={t("UsingCount")}
            style={{ textAlign: "center" }}
          ></Column>

          <Column
            header={t("Actions")}
            dataType="boolean"
            style={{ width: "10rem" }}
            body={(rowData) => {
              return (
                <>
                  {/* <i
                    className="fas fa-pen-alt update"
                    onClick={() => handleOpenEditModal(rowData)}
                  ></i> */}

                  <i
                    className="fas fa-trash-alt delete"
                    // onClick={() => deleteEvent(rowData.id)}
                    onClick={(e) =>
                      showConfirmDialog(
                        t("DeleteCodeConfirm"),
                        () => deleteSpeaker(rowData.id),
                        e.target // Pass the button reference, so that we can focus it later
                      )
                    }
                  ></i>
                </>
              );
            }}
          />
        </DataTable>

        <ConfirmCheck
          visible={confirmVisible}
          onHide={() => setConfirmVisible(false)}
          message={confirmMessage}
          target={targetRef.current}
          icon="pi pi-exclamation-triangle"
          accept={confirmAccept}
          reject={confirmReject}
        />

        <Toast ref={toast} />

        <AffiliateCodeAction
          visible={createModalVisible}
          onHide={() => setCreateModalVisible(false)}
          setRunUseEffect={setRunUseEffect}
          setCreateModalVisible={setCreateModalVisible}
          type={createModalData.id ? "edit" : "create"}
          setCreateModalData={setCreateModalData}
          createModalData={createModalData}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
