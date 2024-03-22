import { Navigate, Outlet } from "react-router-dom";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE } from "../../../Api";

export default function VirfyAuth() {
  //
  const [user, setUser] = useState({});

  // Handle Cookies
  const cookies = Cookie();
  const token = cookies.get("edu-caring");

  const decodedToken = token ? jwtDecode(token) : {};
  console.log(decodedToken);

  useEffect(() => {
    axios
      .post(
        `${BASE}/Auth/GetProfile`,
        {
          userId: decodedToken.uid,
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
  }, [decodedToken.uid]);

  console.log(user);

  // Edditting in the token prevent it
  return token && decodedToken.uid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}
