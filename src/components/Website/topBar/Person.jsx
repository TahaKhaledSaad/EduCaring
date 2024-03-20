import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
// Translation Work
import { useTranslation } from "react-i18next";

export default function Person() {
  // Translation Work
  const { i18n } = useTranslation();

  const [user, setUser] = useState([]);

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = jwtDecode(token);

  useEffect(() => {
    axios
      .post(
        `${BASE}/Auth/GetProfile`,
        {
          userId: decodedToken.uid,
          Language: i18n.language,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      )
      .then((data) => {
        setUser(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [i18n.language]);

  return (
    <>
      <div className="person d-flex gap-3 align-items-center">
        {user.displayProfileImage && (
          <img src={user.displayProfileImage} alt="person" />
        )}
        {!user.displayProfileImage && (
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#ddd",
            }}
            className="d-flex justify-content-center align-items-center text-white fs-5"
          >
            <span
              className="text-dark fs-3 fw-bold"
              style={{ userSelect: "none" }}
            >
              {user.nameEn && user.nameEn.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="details mt-2">
          <span className="name">
            {i18n.language === "en" ? user.nameEn : user.nameAr}
          </span>
          <p className="email">{user.email}</p>
        </div>
      </div>
    </>
  );
}
