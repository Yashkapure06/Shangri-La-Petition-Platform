import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import PetitionerLayout from "./layouts/petitioner";
import Landing from "./views/landing/Landing";
import AuthGuard from "./auth/AuthGuard";
const App = () => {
  return (
    <Routes>
      <Route path="auth/petitioner/*" element={<AuthLayout />} />
      <Route path="auth/admin/*" element={<AuthLayout />} />

      <Route
        path="admin/*"
        element={
          <AuthGuard role="admin">
            <AdminLayout isAdmin={true} />
          </AuthGuard>
        }
      />
      <Route
        path="petitioner/*"
        element={
          <AuthGuard role="petitioner">
            <PetitionerLayout isAdmin={false} />
          </AuthGuard>
        }
      />

      <Route path="/" element={<Landing />} />
    </Routes>
  );
};

export default App;
