import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Modal from "../Modal/Modal";
import { useSession } from "../../Contexts/sessionContext";
import { IoIosClose } from "react-icons/io";
import { showToastSuccess, showToastError } from "../Toast/Toast";
import { useMediaStatus } from "../../hooks/useMediaStatus";

import "./RatingSlider.css";
import { useGuestSession } from "../../Contexts/guestSessionContext";

const ratingLabels = {
  0: "بدون امتیاز",
  1: "مزخرف",
  2: "خیلی بد",
  3: "ضعیف",
  4: "متوسط",
  5: "قابل قبول",
  6: "خوب",
  7: "خیلی خوب",
  8: "عالی",
  9: "فوق‌العاده",
  10: "شاهکار",
};

function RatingSlider({
  mediaId,
  mediaType,
  setShowRatingModal,
  removeMovieFromRatedMovies,
}) {
  const { status, updateStatus } = useMediaStatus(mediaType, mediaId);
  const { sessionId, apiReadAccessToken, apiKey } = useSession();
  const { guestSessionId, isGuest } = useGuestSession();
  const [isLoadingSubmitBtn, setIsLoadingSubmitBtn] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (status.rated && status.rated.value !== undefined) {
      setRating(status.rated.value);
    } else {
      setRating(false);
    }
  }, [status.rated, mediaId, mediaType]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRateMovie = async () => {
    if (rating === 0) {
      showToastError("امتیاز شما باید بیشتر از 0 باشد");
      return;
    }

    try {
      setIsLoadingSubmitBtn(true);

      const url = isGuest()
        ? `https://api.themoviedb.org/3/${mediaType}/${mediaId}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`
        : `https://api.themoviedb.org/3/${mediaType}/${mediaId}/rating?api_key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: rating }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        updateStatus((prevState) => ({
          ...prevState,
          rated: { value: rating },
        }));
        showToastSuccess(
          rating ? "امتیاز شما تغییر داده شد" : "امتیاز شما ثبت شد"
        );
      }

      setShowRatingModal(false);
    } catch (error) {
      showToastError("خطایی در ثبت امتیاز رخ داد.");
      console.error("Error rating media:", error);
    } finally {
      setIsLoadingSubmitBtn(false);
    }
  };

  // Custom Header
  const customHeader = (
    <>
      <IoIosClose
        className="modal-container-close-icon"
        onClick={() => setShowRatingModal(false)}
      />
      <h1 className="modal-container-title">Rating</h1>
    </>
  );

  // Custom Body
  const customBody = (
    <>
      {rating !== null && (
        <Slider
          aria-label="Rating"
          value={rating}
          onChange={(event, newValue) => handleRatingChange(newValue)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => ratingLabels[value]}
          step={1}
          marks
          min={0}
          max={10}
          sx={{
            "& .MuiSlider-track": {
              background: `linear-gradient(
                to right,
                ${
                  rating < 3
                    ? "rgba(219, 35, 96, 0.3)"
                    : rating >= 3 && rating <= 6
                    ? "rgba(210, 213, 49, 0.3)"
                    : "rgba(33, 208, 122, 0.3)"
                },
                ${
                  rating < 3
                    ? "rgba(219, 35, 96, 1)"
                    : rating >= 3 && rating <= 6
                    ? "rgba(210, 213, 49, 1)"
                    : "rgba(33, 208, 122, 1)"
                }
              )`,
            },
          }}
        />
      )}
      <p className="clear-rate" onClick={() => setRating(0)}>
        تغییر امتیاز
      </p>
      <p
        className="clear-rate"
        onClick={() => removeMovieFromRatedMovies(mediaType, mediaId)}
      >
        حذف امتیاز
      </p>
    </>
  );

  // Custom Footer
  const customFooter = (
    <button onClick={() => handleRateMovie()} className="rate-button">
      {isLoadingSubmitBtn ? (
        <span className="loading-icon"></span>
      ) : (
        "ثبت امتیاز"
      )}
    </button>
  );

  return (
    <Modal
      headerContent={customHeader}
      bodyContent={customBody}
      footerContent={customFooter}
      setShowModal={setShowRatingModal}
    />
  );
}

export default RatingSlider;
