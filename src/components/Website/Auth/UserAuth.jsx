import { Navigate, Outlet } from "react-router-dom";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export default function UserAuth() {
  // Handle Cookies
  const cookies = Cookie();
  const token = cookies.get("edu-caring");

  const decodedToken = jwtDecode(token);

  // Edditting in the token prevent it
  return token && decodedToken.roles.includes("User") && decodedToken.uid ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}
