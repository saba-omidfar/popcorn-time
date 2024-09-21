import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./SideMenu.css";

import { IoIosArrowDown } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";

const SideMenu = ({ isOpen, setSideMenuOpen }) => {
  const { sessionId, userInfos, apiReadAccessToken, logout } = useSession();
  const { guestSessionId, logoutGuest } = useGuestSession();
  const sidebarRef = useRef(null);
  const [moviesgenres, setMovieGenres] = useState([]);
  const [seriesgenres, setSerieGenres] = useState([]);
  const [isMovieGenreOpen, setIsMovieGenreOpen] = useState(false);
  const [isSeriesGenreOpen, setIsSeriesGenreOpen] = useState(false);

  const getAllSeriesGenres = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSerieGenres(data.genres));
  };

  const getAllMoviesGenres = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMovieGenres(data.genres));
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

  const toggleMovieGenre = () => {
    setIsMovieGenreOpen((prev) => !prev);
  };

  const toggleSeriesGenre = () => {
    setIsSeriesGenreOpen((prev) => !prev);
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
      {/* <div className="searchbar">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="searchbar__input"
          placeholder="جستجوی فیلم، سریال و ..."
        />
        <CustomLink to={`/search/${searchValue}`}>
          <IoSearch className="search-icon" />
        </CustomLink>
      </div> */}
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
            //   : "/images/no-profile.png"
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
      {sessionId ? (
        <div className="username">{userInfos.username}</div>
      ) : guestSessionId ? (
        <div className="username">Guest User</div>
      ) : (
        <Link to="/sign-in" className="sign-in__link">
          ورود به حساب کاربری
        </Link>
      )}
      <ul className="side-menu__wrapper">
        <Link to="/" className="side-menu__category-item">
          <span className="section-title">خانه</span>
        </Link>
        <Link to="/categories" className="side-menu__category-item">
          <span className="section-title">دسته‌بندی</span>
        </Link>
        <div className="side-menu__category-item">
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={toggleMovieGenre}
          >
            <span className="section-title">ژانر فیلم</span>
            <IoIosArrowDown />
          </div>
          <span
            className={`line ${isMovieGenreOpen ? "line_active" : ""}`}
          ></span>
          {isMovieGenreOpen && (
            <ul className="side-menu__genre-links">
              {moviesgenres.map((genre) => (
                <Link
                  className="side-menu__genre-item"
                  to={`/movie-genre/${genre.name.toLowerCase()}`}
                  key={genre.id}
                  onClick={() => setSideMenuOpen(false)}
                >
                  {genre.name}
                </Link>
              ))}
            </ul>
          )}
        </div>
        <div className="side-menu__category-item">
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            onClick={toggleSeriesGenre}
          >
            <span className="section-title">ژانر سریال</span>
            <IoIosArrowDown />
          </div>

          <span
            className={`line ${isSeriesGenreOpen ? "line_active" : ""}`}
          ></span>
          {isSeriesGenreOpen && (
            <ul className="side-menu__genres-wrapper">
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
          )}
        </div>
        <Link to="/movies/upcoming" className="side-menu__category-item">
          <span className="section-title">جدیدترین فیلم‌ها</span>
        </Link>
        <Link to="/tv/on-the-air" className="side-menu__category-item">
          <span className="section-title">جدیدترین سریال‌ها</span>
        </Link>
        <Link to="/movies/top-rated" className="side-menu__category-item">
          <span className="section-title">پرفروش‌ترین فیلم‌ها</span>
        </Link>
        <Link to="/series/top-rated" className="side-menu__category-item">
          <span className="section-title">پرفروش‌ترین سریال‌ها</span>
        </Link>
        <Link to="/search" className="side-menu__category-item">
          <span className="section-title">جستجو فیلم و سریال</span>
        </Link>
        <Link to="/contactus" className="side-menu__category-item">
          <span className="section-title">تماس با ما</span>
        </Link>
        {sessionId && (
          <Link to="/my-account" className="side-menu__category-item">
            <span className="section-title">ورود به پنل</span>
          </Link>
        )}
      </ul>
      {sessionId ? (
        <div className="side-menu__footer">
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
        </div>
      ) : guestSessionId ? (
        <div className="side-menu__footer">
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SideMenu;
