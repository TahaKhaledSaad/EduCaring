import { Outlet } from "react-router-dom";
import Cookie from "cookie-universal";

export default function RequireBack() {
  const cookie = Cookie();
  const token = cookie.get("edu-caring");
  return token ? window.history.back() : <Outlet />;
}
