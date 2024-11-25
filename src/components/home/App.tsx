"use client";

import { useEffect, useRef, useState } from "react";
import "./style.scss";
import { LockKeyhole, LockKeyholeOpen, RefreshCw } from "lucide-react";
import { useGesture } from "@use-gesture/react";
import { io } from "socket.io-client";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/contexts/toastContext";
import axios from "axios";

const BackendUrl = process.env.NEXT_PUBLIC_GRAPHQL_API;
const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [lockedScale, setLockedScale] = useState<number | null>(1); // Set default to 1 (locked by default)
  const [loadingScale, setLoadingScale] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [priority, setPriority] = useState<boolean>(false);
  const [loadingPriority, setLoadingPriority] = useState<boolean>(false);
  const [scale, setScale] = useState({ scale: 1 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const toast = useToast();
  //*--> Socket Handling
  const [data, setData] = useState<{
    student: Student;
    fingerData: FingerPrint[];
  } | null>(null);
  const { token } = useAuth();
  useEffect(() => {
    if (token) {
      const newSocket = io((BackendUrl?.split("/graphql")[0] ?? "") + "/cli", {
        extraHeaders: {
          token,
        },
      });
      newSocket.on("connect", () => {
        newSocket.emit("handshake", { type: "WEB" });
        console.log("Socket connected:", newSocket.id);
      });
      newSocket.on(
        "finger_data",
        (data: { data: { student: Student; fingerData: FingerPrint[] } }) => {
          if (imageIndex != 0) {
            setImageIndex(0);
          }
          // console.log("data:", data);
          setData(data.data);
          // console.log((data.data.fingerData[0].scale ?? 0).toString())
          setLockedScale(data.data.fingerData[0].scale ?? 1);
          setScale({ scale: data.data.fingerData[0].scale ?? 1 });
        }
      );
      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  //*----------> Gesture handlers <----------

  useGesture(
    {
      onPinch: ({ offset: [d] }) => {
        if (lockedScale !== null) return; // Prevent scaling when locked

        // Adjust zoom sensitivity by directly using 'd'
        const newScale = parseFloat(Math.min(Math.max(1 + d, 1), 2).toFixed(2));
        setScale({ scale: newScale });
      },
    },
    {
      target: imageRef,
      eventOptions: { passive: false },
    }
  );

  //*----------> Lock/Unlock Scale <----------

  const handleLockScale = () => {
    if (lockedScale === null) {
      setLockedScale(scale.scale); // Lock to the current scale
    } else {
      setLockedScale(null); // Unlock to allow scaling
    }
  };

  //*----------> Next/Prev Functions <----------

  const handlePrev = () => {
    if (data)
      setImageIndex((prev) =>
        prev === 0 ? data.fingerData.length - 1 : prev - 1
      );
  };

  const handleNext = () => {
    if (data)
      setImageIndex((prev) =>
        prev === data.fingerData.length - 1 ? 0 : prev + 1
      );
  };

  //*----------> Priority Functions <----------

  const toggleProbity = () => {
    setPriority(!priority);
  };

  const runForOneSecond = (loader: "priority" | "scale") => {
    const setLoadingState =
      loader === "priority" ? setLoadingPriority : setLoadingScale;

    setLoadingState(true);

    if (loader == "priority") {
      if (!token) {
        toast.addToast("Login again!!", "error");
      }
      axios
        .post(
          (BackendUrl?.split("/graphql")[0] ?? "") + "/set-finger-priority",
          {
            StudentId: data?.student.id,
            fingerId: data?.fingerData[imageIndex].id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          toast.addToast(data.message, "success");
        })
        .catch((e) => {
          console.log(e.response.data);
          toast.addToast(e.response.data, "error");
        })
        .finally(() => {
          setLoading(false);
          setLoadingState(false);
          setPriority(!priority);
        });
    }
    if (loader == "scale") {
      if (!token) {
        toast.addToast("Login again!!", "error");
      }
      axios
        .post(
          (BackendUrl?.split("/graphql")[0] ?? "") + "/set-finger-scale",
          {
            fingerId: data?.fingerData[imageIndex].id,
            scale: scale.scale,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(({ data }) => {
          toast.addToast(data.message, "success");
        })
        .catch((e) => {
          console.log(e.response.data);
          toast.addToast(e.response.data, "error");
        })
        .finally(() => {
          setLoading(false);
          setLoadingState(false);
          setLockedScale(scale.scale);
        });
    }
  };

  //*----------> Conditional rendering <----------
  if (loading)
    return (
      <section id="homePage">
        <div className="fg">
          <p className="condition">Loading..</p>
          <div className="center">
            <RefreshCw size={40} className="loader" />
          </div>
        </div>
      </section>
    );

  if (!data)
    return (
      <section id="homePage">
        <div className="fg">
          <p className="condition">Waiting for server..</p>
          <div className="center">
            <RefreshCw size={40} className="loader" />
          </div>
        </div>
      </section>
    );

  return (
    <section id="homePage">
      <div className="fg">
        <div className="img-container">
          <div className="img" ref={imageRef}>
            <img
              src={
                data.fingerData[imageIndex].image || "/assets/images/01/1.jpeg"
              }
              alt="fingerprint"
              style={{
                transform: `scale(${lockedScale ?? scale.scale})`,
              }}
            />
          </div>
        </div>
        <div className="info text-s">
          <p>
            Name: <span> {data.student.studentName || "No Data"}</span>
          </p>
          <p>
            ID: <span>{data.student.aadhar_number || "No Data"}</span>
          </p>
          <p>
            FD: <span>{data.fingerData[imageIndex].name}</span>
          </p>
          <p>
            Scale: <span>{scale.scale.toFixed(2)}</span>
          </p>
        </div>
        <div className="settings">
          <p className="text-s">Settings:</p>
          <div className="priority">
            <button
              title={`${priority ? "Lock Priority" : "UnLock Priority"}`}
              onClick={toggleProbity}
              className={priority ? "active" : ""}
            >
              {priority ? (
                <>
                  <LockKeyholeOpen size={18} />
                  Priority
                </>
              ) : (
                <>
                  <LockKeyhole size={18} />
                  Priority
                </>
              )}
            </button>
            <div className="set-priority">
              <button
                title="Set Priority"
                disabled={!priority}
                className={priority ? "active" : ""}
                onClick={() => runForOneSecond("priority")}
              >
                {loadingPriority ? (
                  <RefreshCw size={20} className="loader" />
                ) : (
                  "Set Priority"
                )}
              </button>
            </div>
          </div>
          <div className="scale">
            <button
              title={`${lockedScale ? "UnLock Scale" : "Lock Scale"}`}
              onClick={handleLockScale}
              className={lockedScale !== null ? "" : "active"}
            >
              {lockedScale !== null ? (
                <>
                  <LockKeyhole size={18} />
                  Scale
                </>
              ) : (
                <>
                  <LockKeyholeOpen size={18} />
                  Scale
                </>
              )}
            </button>
            <button
              title="Set Scale"
              disabled={lockedScale !== null}
              onClick={() => runForOneSecond("scale")}
            >
              {loadingScale ? (
                <RefreshCw size={20} className="loader" />
              ) : (
                "Set Scale"
              )}
            </button>
          </div>
        </div>
        {data && (
          <div className="change">
            <button title="Previous Fingerprint" onClick={handlePrev}>
              Previous
            </button>
            <button title="Nest Fingerprint" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
