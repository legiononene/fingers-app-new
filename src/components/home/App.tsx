"use client";

import { useRef, useState } from "react";
import "./style.scss";
import { LockKeyhole, LockKeyholeOpen, RefreshCw } from "lucide-react";
import { useGesture } from "@use-gesture/react";
import appDB from "@/database/appDS";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [lockedScale, setLockedScale] = useState<number | null>(1); // Set default to 1 (locked by default)
  const [loadingScale, setLoadingScale] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [priority, setPriority] = useState<boolean>(false);
  const [loadingPriority, setLoadingPriority] = useState<boolean>(false);
  const [scale, setScale] = useState({ scale: 1 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  //*----------> Gesture handlers <----------

  useGesture(
    {
      onPinch: ({ offset: [d] }) => {
        if (lockedScale !== null) return; // Prevent scaling when locked
        const newScale = Math.min(Math.max(1 + d / 5, 1), 2);
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
    setImageIndex((prev) =>
      prev === 0 ? appDB[0].images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setImageIndex((prev) =>
      prev === appDB[0].images.length - 1 ? 0 : prev + 1
    );
  };

  //*----------> Priority Functions <----------

  const togglePrority = () => {
    setPriority(!priority);
  };

  const runForOneSecond = (loader: string) => {
    const setLoadingState =
      loader === "priority" ? setLoadingPriority : setLoadingScale;

    setLoadingState(true);

    setTimeout(() => {
      setLoadingState(false);
    }, 2000);
  };

  //*----------> Conditional rendering <----------
  if (loading)
    return (
      <section id="homePage">
        <div className="fg">
          <p>Loading..</p>
          <div className="center">
            <RefreshCw size={40} className="loader" />
          </div>
        </div>
      </section>
    );

  if (appDB.length === 0)
    return (
      <section id="homePage">
        <div className="fg">
          <p>Waiting for server..</p>
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
                appDB[0]?.images[imageIndex]?.image ||
                "/assets/images/01/1.jpeg"
              }
              alt="fingerprint"
              style={{
                transform: `scale(${
                  lockedScale !== null ? lockedScale : scale.scale
                })`,
              }}
            />
          </div>
        </div>
        <div className="info text-s">
          <p>
            Name: <span> {appDB[0]?.name || "No Data"}</span>
          </p>
          <p>
            ID: <span>{appDB[0]?._id || "No Data"}</span>
          </p>
          <p>
            FD: <span>{appDB[0]?.images[imageIndex]?.fd}</span>
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
              onClick={togglePrority}
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
        {appDB[0]?.images && (
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
