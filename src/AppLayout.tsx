import { Outlet } from "react-router-dom";
import Navbar from "./components/navBar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}