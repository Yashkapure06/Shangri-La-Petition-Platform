import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import PetitionerLayout from "./layouts/petitioner";
import Landing from "./views/landing/Landing";
const App = () => {
  return (
    <Routes>
      <Route path="auth/petitioner/*" element={<AuthLayout />} />
      <Route path="auth/admin/*" element={<AuthLayout />} />

      <Route path="admin/*" element={<AdminLayout isAdmin={true} />} />
      <Route
        path="petitioner/*"
        element={<PetitionerLayout isAdmin={false} />}
      />

      <Route path="/" element={<Landing />} />
    </Routes>
  );
};

export default App;
