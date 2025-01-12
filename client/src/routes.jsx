import React, { lazy } from "react";

import Dashboard from "./views/admin/dashboard";
import Profile from "./views/admin/profile";

// Auth Imports
import SignIn from "./views/auth/SignIn";

// Icon Imports
import { MdHome, MdPerson, MdLock } from "react-icons/md";
import SignUp from "./views/auth/SignUp";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard isAdmin={true} />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile isAdmin={true} />,
  },
  {
    name: "Sign In",
    layout: "/auth/petitioner",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign In",
    layout: "/auth/admin",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth/petitioner",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
  {
    name: "Main Dashboard",
    layout: "/petitioner",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard isAdmin={false} />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/petitioner",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile isAdmin={false} />,
  },
];
export default routes;
