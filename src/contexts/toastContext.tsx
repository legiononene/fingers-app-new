"use client";
import { X } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

interface ToastContextProps {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let idCounter = 0;

  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const newToast = { id: idCounter++, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  //console.log("toasts->", toasts);

  return (
    <ToastContext.Provider value={{ addToast, toasts }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <p>{toast.message}</p>
              <button
                title="Close Toast Notification"
                onClick={() => removeToast(toast.id)}
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
