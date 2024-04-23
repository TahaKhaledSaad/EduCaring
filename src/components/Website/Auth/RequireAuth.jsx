import { Navigate, Outlet } from "react-router-dom";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export default function RequireAuth() {
  // Handle Cookies
  const cookies = Cookie();
  const token = cookies.get("edu-caring");

  const decodedToken = token ? jwtDecode(token) : {};

  // Edditting in the token prevent it
  return token && decodedToken.uid && !decodedToken.roles.includes("SuperAdmin") ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
