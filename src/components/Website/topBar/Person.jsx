import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Person() {
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
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        setUser(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [i18n.language]);

  const isValidImageUrl = (url) => {
    return (
      url &&
      !url.toLowerCase().endsWith("/null") &&
      (url.toLowerCase().startsWith("http://") ||
        url.toLowerCase().startsWith("https://"))
    );
  };

  return (
    <>
      <Link
        to={`${
          decodedToken.roles.includes("User")
            ? "update-user-profile"
            : "update-speaker-profile"
        }`}
      >
        <div className="person d-flex gap-3 align-items-center">
          {isValidImageUrl(user.displayProfileImage) && (
            <img
              src={user.displayProfileImage}
              alt="person"
              style={{ objectFit: "cover" }}
            />
          )}
          {!isValidImageUrl(user.displayProfileImage) && (
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
      </Link>
    </>
  );
}
