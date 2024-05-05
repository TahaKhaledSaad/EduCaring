import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE, GET_EVENT } from "../../API/Api";
import { Link, NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import ConfirmCheck from "../../DashboardComponents/ConfirmCheck";
import { Toast } from "primereact/toast";
import Cookie from "cookie-universal";

export default function Events() {
  // States
  const [events, setEvents] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false); // State to manage confirmation dialog visibility
  const [confirmMessage, setConfirmMessage] = useState(""); // State to manage confirmation dialog message
  const [confirmCallback, setConfirmCallback] = useState(() => () => {}); // State to manage confirmation dialog callback function
  const toast = useRef(null);
  const targetRef = useRef(null);

  // Get the token from the cookies
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");

  // Get all events
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_EVENT}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setEvents(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [runUseEffect]);

  const confirmAccept = () => {
    confirmCallback(); // Execute the callback function
    setConfirmVisible(false); // Hide the confirmation dialog

    // Show success toast
    // accept();
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
  const showConfirmDialog = (message, callback, ref) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setConfirmVisible(true);
    targetRef.current = ref;
  };

  // Function to format date
  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    ).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = date.getHours() >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year}  ${hours}:${minutes} ${period}`;
  };

  // Delete Event Day
  const deleteEvent = async (evenId) => {
    try {
      // Use the provided API endpoint for deletion
      let result = await axios.delete(`${BASE}/Event/DeleteEvent`, {
        params: {
          id: evenId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        // If deletion is successful, trigger a re-fetch of events
        setRunUseEffect((prev) => prev + 1);
        toast.current.show({
          severity: "success",
          summary: t("Success"),
          detail: t("EventDeletedSucc"),
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sort All Events
  function getEventStatus(startDateStr, endDateStr) {
    // Convert date strings to Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Get the current date
    const currentDate = new Date();

    // Compare dates to determine event status
    if (currentDate < startDate) {
      return `${t("Upcoming")} 🟦`;
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return `${t("Running")} 🟩`;
    } else {
      return `${t("Ended")}  ⭕`;
    }
  }

  return (
    <div className="h-100">
      <div className="d-flex justify-content-between event-page">
        <h2 className="main-title fw-bold text-muted">
          {t("Events")}{" "}
          <small className="text-muted mt-3 fw-light fst-italic ">
            {t("AllEnteredEvents")}
          </small>
        </h2>
        <NavLink
          to="/dashboard/event/create"
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
          <span style={{ paddingRight: "7px" }}>{t("AddEvent")}</span>
        </NavLink>
      </div>
      <div style={{ overflowX: "auto" }}>
        <DataTable
          dataKey="id"
          value={events}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          paginatorClassName="justify-content-center align-items-center pagination rounded"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          rows={10}
          filterDisplay="row"
          emptyMessage={t("NoEventsFound")}
        >
          <Column
            body={(rowData, index) => index.rowIndex + 1}
            header={t("Count")}
          ></Column>
          <Column
            field="nameEn"
            filterPlaceholder={t("SearchByName")}
            header={t("Name")}
            style={{ width: "25% ", textAlign: "center" }}
            filter={true}
            showFilterMenu={false}
            sortable
            filterMatchMode="contains"
          ></Column>
          <Column
            field="descriptionEn"
            header={t("Description")}
            filter={true}
            sortable
            style={{ textAlign: "center" }}
            filterMatchMode="contains"
            filterPlaceholder={t("SearchByDiscribtion")}
            showFilterMenu={false}
          ></Column>
          <Column
            body={(rowData) => convertDate(rowData.startDay)}
            header={t("StartDay")}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ width: "15% ", textAlign: "center" }}
          ></Column>
          <Column
            body={(rowData) => convertDate(rowData.endDay)}
            header={t("EndDay")}
            headerStyle={{ textAlign: "center", alignContent: "center" }}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ width: "15% ", textAlign: "center" }}
          ></Column>
          <Column
            body={(rowData) => getEventStatus(rowData.startDay, rowData.endDay)}
            header={t("EventsStates")}
            sortable
            style={{ width: "10% ", textAlign: "center" }}
          ></Column>

          <Column
            header={t("Actions")}
            dataType="boolean"
            style={{ width: "10rem" }}
            body={(rowData) => {
              return (
                <>
                  <Link to={`${rowData.id}`}>
                    <i className="fas fa-pen-alt update"></i>
                  </Link>
                  <i
                    className="fas fa-trash-alt delete"
                    // onClick={() => deleteEvent(rowData.id)}
                    onClick={(e) =>
                      showConfirmDialog(
                        t("DeleteEventConfirm"),
                        () => deleteEvent(rowData.id),
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
      </div>
    </div>
  );
}
