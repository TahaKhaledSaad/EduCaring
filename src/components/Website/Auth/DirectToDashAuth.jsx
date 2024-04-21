import { Navigate, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

export default function DirectToDashAuth() {
  // Handle Cookies
  const cookies = Cookie();
  const token = cookies.get("edu-caring");

  const nav = useNavigate();

  const decodedToken = token ? jwtDecode(token) : {};

  // Edditting in the token prevent it
  return decodedToken.roles.includes("SuperAdmin") ? (
    <Navigate to="/dashboard" replace={true} />
  ) : (
    nav("/login")
  );
}
