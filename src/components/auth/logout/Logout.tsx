"use client";

import { useAuth } from "@/contexts/authContext";
import "./style.scss";

const Logout = () => {
  const { logOut } = useAuth();

  const handleLogout = () => {
    logOut();
  };

  return (
    <section id="logoutSec">
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </section>
  );
};

export default Logout;
