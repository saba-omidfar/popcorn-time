import { useState } from "react";
import CustomLink from "../../../../Components/CustomLink/CustomLink";
import Modal from "../../../../Components/Modal/Modal";
import RatingSlider from "../../../../Components/RatingSlider/RatingSlider";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import { useMediaStatus } from "../../../../hooks/useMediaStatus";
import { useSession } from "../../../../Contexts/sessionContext";
import {
  showToastSuccess,
  showToastError,
} from "../../../../Components/Toast/Toast";
import "./CardMovie.css";

import { IoIosClose, IoIosList, IoIosPlay } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

function CardMovie(props) {
  const { status } = useMediaStatus(props.mediaType, props.id);
  const { sessionId, accountId, apiReadAccessToken } = useSession();

  const [addToFavoriteLoading, setAddToFavoriteLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(null);

  const handleRating = (newRating) => {
    setRating(newRating);
    props.updateSetRating(mediaId, mediaType, newRating);
  };

  const toggleFavorite = async (mediaId, mediaType) => {
    if (!sessionId || !accountId) {
      showToastError("برای افزودن به لیست علاقه‌مندی باید وارد شوید");
      return;
    }

    setAddToFavoriteLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: mediaType,
            media_id: mediaId,
            favorite: !status.favorite,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        status.favorite = !status.favorite;
        showToastSuccess(
          !status.favorite
            ? "به لیست علاقه‌مندی اضافه شد"
            : "از لیست علاقه‌مندی حذف شد"
        );
      } else {
        console.error("Failed to toggle favorite status:", data);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    } finally {
      setAddToFavoriteLoading(false);
    }
  };

  const getLists = async () => {
    if (!accountId || !apiReadAccessToken) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    NProgress.start();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/lists`,
        {
          method: "Get",
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
      return data.results;
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      NProgress.done();
    }
  };

  const checkMovieInList = async (movieId, listId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/list/${listId}/item_status?movie_id=${movieId}`,
        {
          method: "GET",
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
      return data.item_present;
    } catch (error) {
      console.error("Error checking movie in list:", error);
    }
  };

  const handleAddOrRemoveFromList = async () => {
    if (!sessionId || !accountId) {
      showToastError("برای افزودن به لیست باید وارد شوید");
      return;
    }
    const allLists = await getLists();

    if (!allLists || allLists.length === 0) {
      Swal.fire({
        icon: "error",
        title: "شما هنوز هیچ لیستی نساخته‌اید.",
        text: " آیا می‌خواهید یک لیست جدید بسازید؟",
        showCancelButton: true,
        confirmButtonText: "ساخت لیست جدید",
        cancelButtonText: "خیر",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/my-account/lists";
        }
      });
      return;
    }

    const inputOptions = allLists.reduce((acc, list) => {
      acc[list.id] = list.name;
      return acc;
    }, {});

    const { value: selectedListId } = await Swal.fire({
      title: "لیست مورد نظر خود را انتخاب کنید",
      input: "select",
      inputOptions,
      inputPlaceholder: "همه‌ی لیست‌ها",
      showCancelButton: true,
      confirmButtonText: "افزودن به لیست",
      cancelButtonText: "لغو",
      inputValidator: (value) => {
        if (!value) {
          return "لطفا یک لیست را انتخاب کنید!";
        }
      },
    });

    if (selectedListId) {
      const isMovieInList = await checkMovieInList(props.id, selectedListId);

      if (isMovieInList) {
        Swal.fire({
          title: "این فیلم در لیست انتخابی شما وجود دارد",
          text: "آیا می‌خواهید آن را از لیست حذف کنید؟",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "بله",
          cancelButtonText: "خیر",
        }).then((result) => {
          if (result.isConfirmed) {
            removeMovieFromList(selectedListId, props.id);
          }
        });
      } else {
        addMovieToList(selectedListId, props.id);
      }
    }
  };

  const addMovieToList = async (listId, movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/list/${listId}/add_item`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_id: movieId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToastSuccess("فیلم به لیست اضافه شد");
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error adding movie to list:", error);
    }
  };

  const removeMovieFromList = async (listId, movieId) => {
    if (!sessionId || !accountId) {
      showToastError("برای حذف از لیست باید وارد شوید");
      return;
    }
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/list/${listId}/remove_item`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_id: movieId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showToastSuccess("فیلم از لیست حذف شد");
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error removing movie from list:", error);
    }
  };

  return (
    <>
      {showRatingModal && (
        <RatingSlider
          mediaType={props.mediaType}
          mediaId={props.mediaId}
          mediaName={props.title}
          handleRating={handleRating}
          showRatingModal={showRatingModal}
          setShowRatingModal={setShowRatingModal}
          updateSetRating={props.updateSetRating}
          removeMovieFromRatedMovies={props.removeMovieFromRatedMovies}
        />
      )}
      <div className="card-movie">
        <div className="info_section">
          <div className="card-movie_header">
            <img
              className="card-movie__image img-fluid"
              src={`https://media.themoviedb.org/t/p/w300${props.poster_path}`}
              alt="movie image"
            />

            <h1>{props.original_title}</h1>
          </div>
          <div className="movie-content">
            <div className="movie_desc ellipsis">
              <p className="text">{props.overview}</p>
            </div>
            <div className="action-bar">
              <div
                title="امتیاز شما"
                className="rating-btn yourRating-btn"
                onClick={() => {
                  setShowRatingModal(true);
                }}
              >
                <span className="rating-wrapper">{props.rating * 10}</span>
              </div>

              <div
                title={
                  status.favorite
                    ? "حذف از علاقه‌مندی‌ها"
                    : "افزودن به علاقه‌مندی‌ها"
                }
                className="rating-btn favorite-btn"
                onClick={() => toggleFavorite(props.id, props.mediaType)}
              >
                <span className="favorite-wrapper">
                  {addToFavoriteLoading ? (
                    <span className="loading-icon"></span>
                  ) : !status.favorite ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </span>
              </div>

              <div
                className="rating-btn addToList-btn"
                onClick={handleAddOrRemoveFromList}
                title="افزودن به لیست"
              >
                <span className="addToList-wrapper">
                  <IoIosList className="movie-card__icon" />
                </span>
              </div>
              <div
                className="rating-btn remove-btn"
                onClick={() =>
                  props.removeMovieFromRatedMovies(props.mediaType, props.id)
                }
                title="حذف فیلم"
              >
                <span className="remove-wrapper">
                  <IoIosClose className="movie-card__icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="blur_back image_back"
          style={{
            background: `url(https://media.themoviedb.org/t/p/w300${props.backdrop_path})`,
          }}
        ></div>
      </div>
    </>
  );
}

export default CardMovie;
