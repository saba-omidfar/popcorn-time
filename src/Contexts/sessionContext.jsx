import { createContext, useState, useEffect, useContext } from "react";
import { showToastSuccess, showToastError } from "../Components/Toast/Toast";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

const SessionContext = createContext();
const apiReadAccessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZGI1ZTZhNDUzNDA2ZjIxMjY3OGYxNjMzOGE2MDJkZiIsIm5iZiI6MTcyNzA4NDkwNS4xNzMxNzMsInN1YiI6IjY2YmYwODdkOWNjZjFjZGVmZTUwZWFlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XEYf3IbSkqZVY4n6UmBN2bAs4e3bX0ECxqJ3acOhIVo";

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("sessionId") || null;
  });
  const [userInfos, setUserInfos] = useState({});
  const [accountId, setAccountId] = useState(null);
  const [apiKey, setApiKey] = useState("edb5e6a453406f212678f16338a602df");

  const createNewRequestToken = () => {
    NProgress.start();
    return fetch(`https://api.themoviedb.org/3/authentication/token/new`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.request_token) {
          window.location.href = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=https://popcorntime-mu.vercel.app/`;
        } else {
          console.error("Token creation failed:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch request token:", error);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  const createSessionID = (requestToken) => {
    NProgress.start();
    return fetch(`https://api.themoviedb.org/3/authentication/session/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_token: requestToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data:", data);

        if (data.session_id) {
          setSessionId(data.session_id);
          localStorage.setItem("sessionId", data.session_id);
        } else {
          console.error("Session creation failed:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch create sessionID:", error);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  const fetchAccountId = () => {
    if (!sessionId) {
      console.error("No session ID available");
      return;
    }
    NProgress.start();
    fetch(
      `https://api.themoviedb.org/3/account?session_id=${sessionId}&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setAccountId(data.id);
          setUserInfos(data);
        } else {
          console.error("Failed to fetch user details:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  const logout = () => {
    NProgress.start();
    fetch("https://api.themoviedb.org/3/authentication/session", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setSessionId(null);
          setAccountId(null);
          localStorage.removeItem("sessionId");
          showToastSuccess("با موفقیت از حساب کاربری خود خارج شدید");
        } else {
          showToastError("خروج از حساب ناموفق بود");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        showToastError("خطا در خروج از حساب");
      })
      .finally(() => {
        NProgress.done();
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestToken = urlParams.get("request_token");
    const approved = urlParams.get("approved");

    if (requestToken && approved === "true") {
      createSessionID(requestToken).then(() => {
        window.history.replaceState(null, null, window.location.pathname);
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (sessionId) {
      fetchAccountId();
    }
  }, [sessionId]);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedSessionId && storedIsLoggedIn === "true") {
      setSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId);
    } else {
      localStorage.removeItem("sessionId");
    }
  }, [sessionId]);

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        setSessionId,
        createNewRequestToken,
        createSessionID,
        apiKey,
        apiReadAccessToken,
        userInfos,
        accountId,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
