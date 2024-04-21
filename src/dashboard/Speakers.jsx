import axios from "axios";
import { useEffect, useState } from "react";
import { BASE, GET_SPEAKERS } from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MessageModal from "../DashboardComponents/MessageModal";
import { useTranslation } from "react-i18next";
import "./style.css";

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
  }, [setSpeakers, setLoading]);

  const handleMessageModal = (messageRecivier) => {
    setModalVisible(true);
    setMessageRecivier(messageRecivier);
  };
  return (
    <div className="h-100">
      <h2 className="main-title fw-bold text-muted">
        {t("Speakers")}{" "}
        <small className="text-muted mt-3 fw-light fst-italic ">
          {t("AllRegisteredAsSpeakers")}
        </small>
      </h2>

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
                <i
                  onClick={() => handleMessageModal(rowData)}
                  className="fas center fa-paper-plane update"
                ></i>
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
