import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./SideMenu.css";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

import { showToastError } from "../Toast/Toast";

const SideMenu = ({ isOpen, setSideMenuOpen }) => {
  const { sessionId, userInfos, apiReadAccessToken, logout } = useSession();
  const { guestSessionId, logoutGuest } = useGuestSession();
  const sidebarRef = useRef(null);
  const [moviesgenres, setMovieGenres] = useState([]);
  const [seriesgenres, setSerieGenres] = useState([]);
  const [isMovieGenreOpen, setIsMovieGenreOpen] = useState(false);
  const [isSeriesGenreOpen, setIsSeriesGenreOpen] = useState(false);
  const [isMediaListOpen, setIsMediaListOpen] = useState(false);

  const getAllSeriesGenres = async () => {
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list`,
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
      setSerieGenres(data.genres);
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching genre list tv:", error);
    } finally {
      NProgress.done();
    }
  };

  const getAllMoviesGenres = async () => {
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list`,
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
      setMovieGenres(data.genres);
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error fetching genre list tv:", error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    getAllSeriesGenres();
    getAllMoviesGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSideMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMovieGenre = (event) => {
    event.preventDefault();
    setIsMovieGenreOpen((prev) => !prev);
  };

  const toggleSeriesGenre = (event) => {
    event.preventDefault();
    setIsSeriesGenreOpen((prev) => !prev);
  };

  const toggleMediaList = (event) => {
    event.preventDefault();
    setIsMediaListOpen((prev) => !prev);
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      <div className="d-flex w-100 p-4 justify-content-end">
        <IoCloseOutline
          className="side-menu__close-icon"
          onClick={() => setSideMenuOpen(false)}
        />
      </div>
      <div className="user-image__wrapper">
        <img
          className="user-image"
          src={
            // sessionId && userInfos.avatar.tmdb.avatar_path
            //   ? `https://image.tmdb.org/t/p/w500${userInfos.avatar.tmdb.avatar_path}`
            //   : "./images/no-profile.png"
            "/images/no-profile.png"
          }
          alt={
            sessionId
              ? `${userInfos.username} Image`
              : guestSessionId
              ? `Guest User Image`
              : `User Image`
          }
        />
      </div>
      <div className="username">
        {sessionId ? (
          <div>{userInfos.username}</div>
        ) : guestSessionId ? (
          <div>Guest User</div>
        ) : (
          <Link to="/sign-in" className="sign-in__link">
            ورود به حساب کاربری
          </Link>
        )}
      </div>
      <ul className="side-menu__wrapper">
        <li className="side-menu__category-item">
          <Link to="/">
            <span className="section-title">خانه</span>
          </Link>
        </li>
        <li className="side-menu__category-item">
          <Link to="/categories">
            <span className="section-title">دسته‌بندی</span>
          </Link>
        </li>

        <li
          className={`side-menu__category-item ${
            isMovieGenreOpen ? "side-menu__category-item-active" : ""
          }`}
        >
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={toggleMovieGenre}
          >
            <span className="section-title">ژانر فیلم</span>
            {!isMovieGenreOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </div>
          <span
            className={`line ${isMovieGenreOpen ? "line_active" : ""}`}
          ></span>

          <ul
            className={`side-menu__genre-links ${
              isMovieGenreOpen ? "active" : ""
            }`}
          >
            {moviesgenres.map((genre) => (
              <li key={genre.id}>
                <Link
                  className="side-menu__genre-item"
                  to={`/movie-genre/${genre.name.toLowerCase()}`}
                  onClick={() => setSideMenuOpen(false)}
                >
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li
          className={`side-menu__category-item ${
            isSeriesGenreOpen ? "side-menu__category-item-active" : ""
          }`}
        >
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={toggleSeriesGenre}
          >
            <span className="section-title">ژانر سریال</span>
            {!isSeriesGenreOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </div>

          <span
            className={`line ${isSeriesGenreOpen ? "line_active" : ""}`}
          ></span>
          <ul
            className={`side-menu__genre-links ${
              isSeriesGenreOpen ? "active" : ""
            }`}
          >
            {seriesgenres.map((genre) => (
              <Link
                className="side-menu__genre-item"
                to={`/series-genre/${genre.name.toLowerCase()}`}
                key={genre.id}
                onClick={() => setSideMenuOpen(false)}
              >
                {genre.name}
              </Link>
            ))}
          </ul>
        </li>

        <li
          className={`side-menu__category-item ${
            isMediaListOpen ? "side-menu__category-item-active" : ""
          }`}
        >
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={toggleMediaList}
          >
            <span className="section-title">لیست‌ها</span>
            {!isMediaListOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </div>

          <span
            className={`line ${isMediaListOpen ? "line_active" : ""}`}
          ></span>
          <ul
            className={`side-menu__genre-links ${
              isMediaListOpen ? "active" : ""
            }`}
          >
            <li className="side-menu__category-item">
              <Link to="/movies/upcoming" className="side-menu__list-item">
                جدیدترین فیلم‌ها
              </Link>
            </li>
            <li className="side-menu__category-item">
              <Link to="/tv/on-the-air" className="side-menu__list-item">
                جدیدترین سریال‌ها
              </Link>
            </li>
            <li className="side-menu__category-item">
              <Link to="/movies/top-rated" className="side-menu__list-item">
                پرفروش‌ترین فیلم‌ها
              </Link>
            </li>
            <li className="side-menu__category-item">
              <Link to="/series/top-rated" className="side-menu__list-item">
                پرفروش‌ترین سریال‌ها
              </Link>
            </li>
          </ul>
        </li>
        <li className="side-menu__category-item">
          <Link to="/search">
            <span className="section-title">جستجو فیلم و سریال</span>
          </Link>
        </li>
        <li className="side-menu__category-item">
          <Link to="/contactus">
            <span className="section-title">تماس با ما</span>
          </Link>
        </li>
        {sessionId && (
          <li className="side-menu__category-item">
            <Link to="/my-account">
              <span className="section-title">ورود به پنل</span>
            </Link>
          </li>
        )}
        {sessionId ? (
          <Link
            to="/"
            className="side-menu__category-item"
            onClick={() => {
              setSideMenuOpen(false);
              logout();
            }}
          >
            <span className="section-title">خروج از حساب کاربری</span>
          </Link>
        ) : guestSessionId ? (
          <Link
            to="/"
            className="side-menu__category-item"
            onClick={() => {
              setSideMenuOpen(false);
              logoutGuest();
            }}
          >
            <span className="section-title">خروج از حساب کاربری مهمان</span>
          </Link>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default SideMenu;
