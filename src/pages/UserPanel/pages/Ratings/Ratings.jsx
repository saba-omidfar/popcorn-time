import { act, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Swal from "sweetalert2";

import "./Ratings.css";

import SideMenu from "../../../../Components/SideMenu/SideMenu";
import BottomBar from "../../../../Components/BottomBar/BottomBar";
import CardMovie from "../../Components/CardMovie/CardMovie";

import {
  showToastSuccess,
  showToastError,
} from "../../../../Components/Toast/Toast";

import { useSession } from "../../../../Contexts/sessionContext";

import { IoIosMenu } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { CiViewList } from "react-icons/ci";
import { useGuestSession } from "../../../../Contexts/guestSessionContext";

export default function Ratings() {
  const { accountId, sessionId, apiReadAccessToken } = useSession();
  const { guestSessionId, isGuest } = useGuestSession();

  const [isLoading, setIsLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [ratedTvs, setRatedTvs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activeItem, setActiveItem] = useState("movie");

  const handleItemClick = (value) => {
    setActiveItem(value);
  };

  const addRateMedia = () => {
    if (!sessionId || !accountId) {
      showToastError("برای تغییر امتیاز باید وارد شوید");
      return;
    } else {
      setShowRatingModal(true);
    }
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const getRatedMovies = async () => {
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/rated/movies?language=en-US&page=1&session_id=${sessionId}&sort_by=created_at.asc`,
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

      if (data.success === false) {
        setRatedMovies([]);
        setTotalPages("");
        return;
      }

      if (data.results) {
        setRatedMovies(data.results);
        setTotalPages(data.total_pages);
        return;
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching rated media list:", error);
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  const getGuestRatedMovies = async () => {
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`,
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

      if (data.success === false) {
        setRatedMovies([]);
        setTotalPages("");
        return;
      }

      if (data.results) {
        setRatedMovies(data.results);
        setTotalPages(data.total_pages);
        return;
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching rated media list:", error);
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  const removeMovieFromRatedMovies = async (mediaType, mediaId) => {
    if (!sessionId || !accountId) {
      showToastError("برای حذف باید وارد شوید");
      return;
    }
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${mediaId}/rating`,
        {
          method: "DELETE",
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
      if (data.success) {
        if (mediaType === "movie") {
          setRatedMovies((prevMovies) =>
            prevMovies.filter((movie) => movie.id !== mediaId)
          );
          showToastSuccess("فیلم با موفقیت حذف شد");
        } else {
          setRatedTvs((prevTvs) =>
            prevTvs.filter((movie) => movie.id !== mediaId)
          );
          showToastSuccess("سریال با موفقیت حذف شد");
        }
      } else {
        showToastError("خطایی در حذف فیلم رخ داد");
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      showToastError("خطایی در حذف فیلم رخ داد");
    }
  };

  const updateSetRating = (mediaId, mediaType, newRating) => {
    if (mediaType === "movie") {
      setRatedMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === mediaId ? { ...movie, rating: newRating } : movie
        )
      );
    } else {
      setRatedTvs((prevTvs) =>
        prevTvs.map((tv) =>
          tv.id === mediaId ? { ...tv, rating: newRating } : tv
        )
      );
    }
  };

  const getRatedTvs = async () => {
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/rated/tv?language=en-US&page=1&session_id=${sessionId}&sort_by=created_at.asc`,
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
      console.log(data);

      if (data.success === false) {
        setRatedTvs([]);
        setTotalPages("");
      }

      if (data.results) {
        setRatedTvs(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching rated media list:", error);
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const getGuestRatedTvs = async () => {
    NProgress.start();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/tv?language=en-US&page=1&sort_by=created_at.asc`,
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

      if (data.success === false) {
        setRatedTvs([]);
        setTotalPages("");
      }

      if (data.results) {
        setRatedTvs(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching rated media list:", error);
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      getRatedMovies();
      getRatedTvs();
    }
  }, [accountId]);

  useEffect(() => {
    if (guestSessionId) {
      getGuestRatedMovies();
      getGuestRatedTvs();
    }
  }, [guestSessionId]);

  return (
    <>
      <div className={`overlay ${showRatingModal ? "active" : ""}`}></div>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />

      <div
        className={`rated-media-lists ${sideMenuOpen && "blur-background "}`}
      >
        <div className="change-type__list-wrapper">
          <div className="change-type__list">
            <div
              className={`item_type_list ${
                activeItem === "movie" ? "active" : ""
              }`}
              data-valuetype="movie"
              onClick={() => handleItemClick("movie")}
            >
              <div className="d-flex align-items-center">
                <span>فیلم</span>
                <span className="item_type_count">{ratedMovies.length}</span>
              </div>
            </div>
            <div
              className={`item_type_list ${
                activeItem === "tv" ? "active" : ""
              }`}
              onClick={() => handleItemClick("tv")}
              data-valuetype="tv"
            >
              <div className="d-flex align-items-center">
                <span>سریال</span>
                <span className="item_type_count">{ratedTvs.length}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="lists-results__header">
          <span className="lists-results__title">
            {`${
              activeItem === "movie" ? "فیلم‌هایی" : "سریال‌هایی"
            } که امتیاز داده‌اید`}
          </span>
          <Link to="/my-account">
            <IoArrowBackCircleOutline className="lists-back__icon" />
          </Link>
        </div>
        <div className="rated-media-list-wrapper">
          {activeItem === "movie" ? (
            ratedMovies.length ? (
              ratedMovies.map((movie) => (
                <CardMovie
                  key={movie.id}
                  isGrid={true}
                  {...movie}
                  mediaId={movie.id}
                  mediaType="movie"
                  addRateMedia={addRateMedia}
                  updateSetRating={updateSetRating}
                  removeMovieFromRatedMovies={removeMovieFromRatedMovies}
                />
              ))
            ) : (
              <div className="alert alert-danger">
                به هیچ فیلمی امتیاز نداده‌اید
              </div>
            )
          ) : activeItem === "tv" ? (
            ratedTvs.length ? (
              ratedTvs.map((tv) => (
                <CardMovie
                  key={tv.id}
                  isGrid={true}
                  {...tv}
                  mediaId={tv.id}
                  mediaType="tv"
                  addRateMedia={addRateMedia}
                  updateSetRating={updateSetRating}
                  removeMovieFromRatedMovies={removeMovieFromRatedMovies}
                />
              ))
            ) : (
              <div className="alert alert-danger">
                به هیچ سریالی امتیاز نداده‌اید
              </div>
            )
          ) : null}
        </div>
      </div>
      <BottomBar activeBottom="user" />
    </>
  );
}
