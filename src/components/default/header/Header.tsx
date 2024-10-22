"use client";

import Link from "next/link";
import "./style.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
type Role = "superAdmin" | "admin" | "user" | null;

const Header = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authData = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRole = localStorage.getItem("role") as Role;
        setRole(storedRole);
      } catch (err) {
        console.error("Failed to retrieve role from localStorage:", err);
        setError("Failed to retrieve user role.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [authData.token]);

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

  if (isLoading) {
    return (
      <header>
        {" "}
        <div className="fg">Loading...</div>
      </header>
    );
  }

  if (error) {
    return (
      <header>
        <div className="fg">{error}</div>
      </header>
    );
  }

  return (
    <header id="Header">
      <div className="fg">
        <Link title="Go to Fingers App" href="/">
          Fingers
        </Link>
        <Link title="Go to dashboard" href={handleRoutes()}>
          Dash
        </Link>
      </div>
    </header>
  );
};

export default Header;
