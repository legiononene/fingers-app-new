"use client";

import Link from "next/link";
import "./style.scss";
import { useEffect, useState } from "react";

const Header = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  //console.log("role->", role);

  const handleRoutes = () => {
    if (role === "superAdmin") {
      return "/superAdmin-dashboard";
    } else if (role === "admin") {
      return "/admin-dashboard";
    } else if (role === "user") {
      return "/user-dashboard";
    }
    return "/";
  };

  return (
    <header>
      <div className="fg">
        <Link href="/">Fingers</Link>
        <Link href={handleRoutes()} passHref>
          Dash
        </Link>
      </div>
    </header>
  );
};

export default Header;
