import { createContext, useState, useEffect, useContext } from "react";
import { showToastError, showToastSuccess } from "../Components/Toast/Toast";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

const GuestSessionContext = createContext();

export const GuestSessionProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState("edb5e6a453406f212678f16338a602df");
  const [guestSessionId, setGuestSessionId] = useState(() => {
    return localStorage.getItem("guestSessionId") || null;
  });

  // useEffect(() => {
  //   let activityTimeout;

  //   const resetTimeout = () => {
  //     clearTimeout(activityTimeout);

  //     activityTimeout = setTimeout(() => {
  //       setGuestSessionId(null);
  //       localStorage.removeItem("guestSessionId");
  //       showToastError("حساب مهمان شما بعد از 60 دقیقه عدم فعالیت منقضی شد.");
  //     }, 3600000);
  //   };

  //   window.addEventListener("mousemove", resetTimeout);
  //   window.addEventListener("keydown", resetTimeout);
  //   window.addEventListener("scroll", resetTimeout);

  //   return () => {
  //     clearTimeout(activityTimeout);
  //     window.removeEventListener("mousemove", resetTimeout);
  //     window.removeEventListener("keydown", resetTimeout);
  //     window.removeEventListener("scroll", resetTimeout);
  //   };
  // }, []);

  const createGuestSessionID = () => {
    NProgress.start();
    return fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.guest_session_id) {
          setGuestSessionId(data.guest_session_id);
          localStorage.setItem("guestSessionId", data.guest_session_id);
          showToastSuccess("بصورت مهمان وارد سایت شدید");
          window.location.href = `http://localhost:5173`;
        } else {
          console.error("Guest Session creation failed:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to create guest session:", error);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  const isGuest = () => !!localStorage.getItem("guestSessionId");

  useEffect(() => {
    if (guestSessionId) {
      localStorage.setItem("guestSessionId", guestSessionId);
    } else {
      localStorage.removeItem("guestSessionId");
    }
  }, [guestSessionId]);

  const logoutGuest = () => {
    showToastError(
      "حساب مهمان بعد از 60 دقیقه عدم فعالیت بطور خودکار حذف می‌شود"
    );
  };

  return (
    <GuestSessionContext.Provider
      value={{
        guestSessionId,
        createGuestSessionID,
        logoutGuest,
        isGuest,
      }}
    >
      {children}
    </GuestSessionContext.Provider>
  );
};

export const useGuestSession = () => useContext(GuestSessionContext);
