import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ADD_SUPER_ADMIN,
  BASE,
  BLOCK_USER,
  DELETE_USER,
  GET_ADMINS,
  UNBLOCK_USER,
} from "../API/Api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useTranslation } from "react-i18next";
import ConfirmCheck from "../DashboardComponents/ConfirmCheck";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "./style.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import Cookie from "cookie-universal";
import { ScrollPanel } from "primereact/scrollpanel";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const [confirmVisible, setConfirmVisible] = useState(false); // State to manage confirmation dialog visibility
  const [confirmMessage, setConfirmMessage] = useState(""); // State to manage confirmation dialog message
  const [confirmCallback, setConfirmCallback] = useState(() => () => {}); // State to manage confirmation dialog callback function
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [fetchAdminsList, setFetchAdminsList] = useState(true);

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  //register new Admin
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPermission, setSelectedPermission] = useState(null);

  // Get all events
  useEffect(() => {
    if (admins.length === 0 && fetchAdminsList === true) {
      setFetchAdminsList(false);
      axios
        .get(`${BASE}/${GET_ADMINS}`, {
          params: {
            limite: 1000,
            skip: 0,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          setAdmins(data.data.responseObject);
          setLoading(false);
        })
        .catch((err) => console.error(err))
        .finally(() => setFetchAdminsList(false));
    }
  }, [runUseEffect, fetchAdminsList, runUseEffect, admins]);

  // Handle upload data
  const handleSubmit = () => {
    //the uploaded files using the ref of the FileUpload component
    const uploadedFiles = fileUploadRef.current.getFiles();
    if (
      selectedPermission?.length === 0 ||
      !nameAr ||
      !nameEn ||
      !email ||
      !phone ||
      phone?.length < 10 ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      toast.current.show({
        severity: "warn",
        summary: t("Error"),
        detail: t("fillAllFields"),
        life: 3000,
      });
      return;
    }

    // a FormData object to send files and text to the backend
    const formData = new FormData();
    formData.append("NameEn", nameEn);
    formData.append("NameAr", nameAr);
    formData.append("Email", email);
    formData.append("PhoneNumber", phone);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);
    formData.append("GenderId", gender === "Male" ? 1 : 2);
    formData.append("ProfileImage", uploadedFiles[0]);

    selectedPermission.forEach((permission) => {
      formData.append("Premissions", permission.type);
    });

    // Make a POST request to your backend endpoint
    axios
      .post(
        `${BASE}/${ADD_SUPER_ADMIN}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        formData
      )
      .then((response) => {
        // Handle response
        if (response.status === 200) {
          setFetchAdminsList(!fetchAdminsList);

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Admin Added Successfuly",
            life: 3000,
          });
          // Reset form values and close the modal
          fileUploadRef.current.clear();
          hideModal();
        } else {
          console.error("Failed to send message and files");
        }
      })
      .catch((error) => {
        const messages = [];
        for (const key in error.response.data.errors) {
          if (
            Object.prototype.hasOwnProperty.call(
              error.response.data.errors,
              key
            )
          ) {
            const errorMessages = error.response.data.errors[key];
            errorMessages.forEach((message, index) => {
              const life = 3000 + index * 50; // Increment life for each message
              messages.push({
                severity: "error",
                summary: t("Error"),
                detail: `${key}: ${message}`,
                life,
              });
            });
          }
        }
        console.error("Error during sending:", error);
        toast.current.show(messages);
      });
  };
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
      : text === "User deleted successfully"
      ? toast.current.show({
          severity: "success",
          summary: t("Confirmed"),
          detail: t("AdminDeletedSucc"),
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
  const blockAdmin = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        let result = await axios.post(
          `${BASE}/${UNBLOCK_USER}?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          formData
        );
        if (result.status === 200) {
          // If deletion is successful, trigger a re-fetch of events
          setRunUseEffect((prev) => prev + 1);
          setFetchAdminsList(true);
          accept(result.data.responseText);
        }
      } else if (!isBlocked) {
        let result = await axios.post(
          `${BASE}/${BLOCK_USER}?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          formData
        );
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

  // delete Admin
  const deleteAdmin = async (userId) => {
    try {
      let result = await axios.delete(`${BASE}/${DELETE_USER}?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result.status === 200) {
        // If deletion is successful, trigger a re-fetch of events
        setRunUseEffect((prev) => prev + 1);
        setFetchAdminsList(true);
        accept(result.data.responseText);
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
  const hideModal = () => {
    setVisibleDialog(false);
    fileUploadRef.current.clear();
    setSelectedPermission([]);
    setNameAr("");
    setNameEn("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setGender("Male");
  };
  const headerPassword = (
    <div className="fw-bolder fs-5 m-2">Pick a password</div>
  );
  const footerPassword = (
    <>
      <Divider className="mt-2" />
      <p
        className="mt-2 mx-2  text-muted "
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        Suggestions
      </p>
      <ul
        className="pl-2 ml-2 mt-0 line-height-3 "
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#495057",
          listStyle: "disc",
          marginLeft: "10px",
          marginRight: "5px",
        }}
      >
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );
  const adminRoleTemplate = (option) => {
    return (
      <div className="flex align-items-center" style={{ margin: ".5rem" }}>
        <div>{option.name}</div>
      </div>
    );
  };
  const panelFooterTemplate = () => {
    const length = selectedPermission ? selectedPermission.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> {t("Role")}
        {length > 1 ? "s" : ""} {t("Selected")}.
      </div>
    );
  };

  const adminRoles = [
    { name: t("Event"), type: "Event" },
    { name: t("LandingPage"), type: "Landing" },
    { name: t("UserPage"), type: "PUser" },
    { name: t("AdminPage"), type: "PAdmin" },
    { name: t("SendMessage"), type: "SendMessage" },
    { name: t("Support"), type: "Support" },
    { name: t("ContactUs"), type: "ContactUs" },
  ];
  const genderOptions = [t("Male"), t("Female")];

  const chooseOptions = {
    icon: "fas fa-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "fas fa-times-circle",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined ",
  };

  const picHeaderTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;

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
      </div>
    );
  };
  return (
    <div className="h-100 admin-page">
      <div className="d-flex justify-content-between event-page">
        <h2 className="main-title fw-bold text-muted">
          {t("Admins")}{" "}
          <small className="text-muted mt-3 fw-light fst-italic ">
            {t("AllRegisteredAsAdmins")}
          </small>
        </h2>
        <div
          onClick={() => setVisibleDialog(true)}
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
          <span style={{ paddingRight: "7px" }}>{t("AddAdmin")}</span>
        </div>
      </div>
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
          value={admins}
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
          />
          <Column
            field="email"
            header={t("Email")}
            filterPlaceholder={t("SearchByEmail")}
            filter={true}
            sortable
            filterMatchMode="contains"
            showFilterMenu={false}
            style={{ width: "25% ", textAlign: "center" }}
          />
          <Column
            field="premissions"
            header={t("premissions")}
            dataType="boolean"
            style={{
              textAlign: "center",

              whiteSpace: "nowrap",
              textOverflow: "clip",
            }}
            sortable
            body={(rowData, index) => {
              return (
                <ScrollPanel style={{ width: "100%", height: "3rem" }}>
                  {rowData.premissions.length > 0 ? (
                    rowData.premissions.map((premission, index) => {
                      {
                        if (premission.length > 0) {
                          return (
                            <Tag
                              security="Contrast"
                              value={premission}
                              className="p-2 me-1"
                              rounded
                              key={index}
                            ></Tag>
                          );
                        }
                      }
                    })
                  ) : (
                    <Chip className="p-2" label={t("NoPremissions")} />
                  )}
                </ScrollPanel>
              );
            }}
          />
          <Column
            header={t("Actions")}
            dataType="boolean"
            style={{ width: "10rem" }}
            className="d-flex justify-content-center align-items-center"
            body={(rowData) => {
              return (
                <>
                  <i
                    onClick={(e) =>
                      showConfirmDialog(
                        rowData.isBlocked
                          ? t("ConfirmationMessages.unBlockUserblockUser")
                          : t("ConfirmationMessages.blockUser"),
                        () => blockAdmin(rowData.id, rowData.isBlocked),
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
                  <i
                    className="fas fa-trash delete d-flex justify-content-center align-items-center"
                    onClick={(e) =>
                      showConfirmDialog(
                        t("ConfirmationMessages.delete"),
                        () => deleteAdmin(rowData.id),
                        e.target
                      )
                    }
                  ></i>
                </>
              );
            }}
          />
        </DataTable>
      </div>

      <Dialog
        visible={visibleDialog}
        modal
        onHide={hideModal}
        className="admin-registration "
        content={({ hide }) => (
          <div
            className="d-flex flex-column px-5 py-5 gap-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "white",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <div className="d-flex admin-data-container">
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="nameAr"
                  className="text-primary-50 font-semibold"
                >
                  {t("NameAr")}
                </label>
                <InputText
                  id="nameAr"
                  label="nameAr"
                  className="bg-white-alpha-20 border-primary border p-3 text-primary-50"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="nameEn"
                  className="text-primary-50 font-semibold"
                >
                  {t("NameEn")}
                </label>
                <InputText
                  id="nameEn"
                  label="nameEn"
                  className="bg-white-alpha-20  border-primary border p-3 text-primary-50"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex admin-data-container">
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="password"
                  className="text-primary-50 font-semibold"
                >
                  {t("Password")}
                </label>

                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  header={headerPassword}
                  footer={footerPassword}
                  id="password"
                  label="Password"
                  className="bg-white-alpha-20 border-none px-3 text-primary-50 pass-inp"
                  type="password"
                  toggleMask
                ></Password>
              </div>
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="confirmpassword"
                  className="text-primary-50 font-semibold"
                >
                  {t("ConfirmPassword")}
                </label>

                <Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  header={headerPassword}
                  footer={footerPassword}
                  id="confirmpassword"
                  label="ConfirmPassword"
                  className="bg-white-alpha-20 border-none px-3 text-primary-50 pass-inp "
                  type="password"
                  toggleMask
                ></Password>
              </div>
            </div>
            <div className="d-flex admin-data-container">
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="email"
                  className="text-primary-50 font-semibold"
                >
                  {t("Email")}
                </label>
                <InputText
                  id="email"
                  label="email"
                  type="email"
                  className="bg-white-alpha-20 border-primary border p-3 text-primary-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <label
                  htmlFor="nameAr"
                  className="text-primary-50 font-semibold"
                >
                  {t("phone")}
                </label>
                <InputText
                  value={phone}
                  type="number"
                  onChange={(e) => setPhone(e.target.value)}
                  mask="99-999999?99999"
                  id="phone"
                  placeholder="99-99999999999"
                  className="bg-white-alpha-20 border-primary border p-3 text-primary-50"
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="nameAr" className="text-primary-50 font-semibold">
                {t("gender")}
              </label>
              <SelectButton
                value={gender}
                onChange={(e) => setGender(e.value)}
                options={genderOptions}
                className="w-full gender-btn bg-white-alpha-20"
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="nameAr" className="text-primary-50 font-">
                {t("Permissions")}
              </label>
              <div className="card flex justify-content-center">
                <MultiSelect
                  value={selectedPermission}
                  options={adminRoles}
                  onChange={(e) => setSelectedPermission(e.value)}
                  optionLabel="name"
                  placeholder={t("SelectRoles")}
                  itemTemplate={adminRoleTemplate}
                  panelFooterTemplate={panelFooterTemplate}
                  className="w-full admin-permissions"
                  display="chip"
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="nameAr" className="text-primary-50 font-">
                {t("UploadProfilePic")}
              </label>
              <div className=" flex justify-content-center">
                <FileUpload
                  name="profilePic"
                  ref={fileUploadRef}
                  accept="image/*"
                  maxFileSize={1000000}
                  headerTemplate={picHeaderTemplate}
                  chooseOptions={chooseOptions}
                  cancelOptions={cancelOptions}
                  className="container "
                  contentClassName="content-upload-files"
                  emptyTemplate={
                    <p className=" mt-3 mb-3 text-center">
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
              </div>
            </div>
            <div className="flex align-items-center gap-2">
              <Button
                label={t("Submit")}
                onClick={handleSubmit}
                text
                className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
              ></Button>
              <Button
                label={t("Cancel")}
                onClick={hide}
                text
                className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
              ></Button>
            </div>
          </div>
        )}
      ></Dialog>
    </div>
  );
}
