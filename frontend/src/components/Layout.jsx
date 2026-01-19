import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />

      <main className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
