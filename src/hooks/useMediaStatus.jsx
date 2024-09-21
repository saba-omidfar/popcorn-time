import { useState, useEffect } from "react";
import { useSession } from "../Contexts/sessionContext";

export function useMediaStatus(mediaType, mediaId) {
  const { apiReadAccessToken, sessionId } = useSession();
  const [status, setStatus] = useState({
    favorite: false,
    watchlist: false,
    rated: false,
  });
  const [loading, setLoading] = useState(true);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const fetchMediaStatus = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${mediaId}/account_states`,
          {
            headers: {
              Authorization: `Bearer ${apiReadAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        setStatus({
          favorite: data.favorite || false,
          watchlist: data.watchlist || false,
          rated: data.rated ? data.rated : (status.rated ? status.rated : false),
        });
      } catch (error) {
        console.error("Error fetching media status:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (sessionId) {
      fetchMediaStatus();
    }
  }, [mediaType, mediaId, sessionId, apiReadAccessToken]);
  

  return { status, updateStatus, loading };
}
