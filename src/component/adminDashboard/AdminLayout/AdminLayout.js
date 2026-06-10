// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar"; // Adjust path to your sidebar file
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-master-layout-wrapper">
      {/* 1. Left Fixed Navigation Column */}
      <AdminSidebar />
      
      {/* 2. Right Dynamic Viewport Section */}
      <main className="admin-viewport-content-container">
        {/* The Outlet component is where your nested sub-pages will mount */}
        <Outlet />
      </main>
    </div>
  );
}