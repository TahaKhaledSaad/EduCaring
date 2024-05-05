import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";
import { BASE, LANDING_TEXT } from "../API/Api";
import LandingPageTextActions from "../DashboardComponents/LandingPageTextActions";
import "./style.css";
import Cookie from "cookie-universal";

export default function LandingText() {
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const [texts, setTexts] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const toast = useRef(null);

  // landing page create
  const [createModalVisible, setCreateModalVisible] = useState(false); // State to manage create modal visibility
  const [createModalData, setCreateModalData] = useState({}); // State to manage create modal data

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${LANDING_TEXT}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setTexts([data.data.responseObject]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [runUseEffect]);

  const handleOpenEditModal = () => {
    // Open the modal with edit mode and pass the speaker data
    setCreateModalData(texts[0]);
    setCreateModalVisible(true);
  };

  return (
    <div className="h-100">
      <div className="d-flex justify-content-between event-page">
        <h2 className="main-title fw-bold text-muted">{t("LandingText")}</h2>
        <div
          onClick={handleOpenEditModal}
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
          <span style={{ paddingRight: "7px" }}>{t("EditText")}</span>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          value={texts}
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
            field="welcomeDescriptionAr"
            header={t("welcomeDescriptionAr")}
            style={{ textAlign: "center", width: "25%" }}
          ></Column>
          <Column
            field="welcomeDescriptionEn"
            header={t("welcomeDescriptionEn")}
            style={{ textAlign: "center", width: "25%" }}
          ></Column>
          <Column
            field="photoAndVideoDescriptionAr"
            header={t("photoAndVideoDescriptionAr")}
            style={{ textAlign: "center", width: "25%" }}
          ></Column>
          <Column
            field="photoAndVideoDescriptionEn"
            header={t("photoAndVideoDescriptionEn")}
            style={{ textAlign: "center", width: "25%" }}
          ></Column>
        </DataTable>

        <Toast ref={toast} />
        <LandingPageTextActions
          visible={createModalVisible}
          onHide={() => setCreateModalVisible(false)}
          setRunUseEffect={setRunUseEffect}
          setCreateModalVisible={setCreateModalVisible}
          setCreateModalData={setCreateModalData}
          createModalData={createModalData}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
