import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { IoSearch } from "react-icons/io5";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import BottomBar from "../../Components/BottomBar/BottomBar";
import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";
import { useSession } from "../../Contexts/sessionContext";
import { showToastError } from "../../Components/Toast/Toast";
import { Alert } from "@mui/material";

import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

import "./SearchScreen.css";

function SearchScreen() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [moviesDisplayType, setMoviesDisplayType] = useState("grid");
  const [shownMovies, setShownMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isError, setIsError] = useState(false);

  const { apiReadAccessToken } = useSession();

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const searchValueChangeHandler = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const getUpcomingMovies = () => {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUpcomingMovies(data.results);
      })
      .catch((error) =>
        console.error("Error fetching Upcoming movies:", error)
      );
  };

  const searchMovieAndSeries = () => {
    if (!searchValue) {
      showToastError("ابتدا فیلم یا سریال موردنظر خود را سرچ کنید");
      setShownMovies([]);
      return;
    }

    setIsSearched(true);
    setIsError(false);
    NProgress.start();

    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${searchValue}&language=en-US`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Http error! status: ${res.status}`);
        }
      })
      .then((data) => {
        if (data.results.length === 0) {
          setShownMovies([]);
          setIsError(true);
        }
        setShownMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      })
      .finally(() => {
        setIsSearched(false);
        NProgress.done();
      });
  };

  // Search By Press Enter
  useEffect(() => {
    const handleSearchByPressEnter = (event) => {
      if (event.key === "Enter") {
        searchMovieAndSeries();
      }
    };

    document.addEventListener("keyup", handleSearchByPressEnter);

    return () => {
      document.removeEventListener("keyup", handleSearchByPressEnter);
    };
  }, [searchValue]);

  useEffect(() => {
    if (!isSearched && !isError) {
      getUpcomingMovies();
    }
  }, [isSearched, isError, searchValue]);

  useEffect(() => {
    if (searchValue.length === 0) {
      setIsSearched(false);
      setIsError(false);
      setShownMovies([]);
      getUpcomingMovies();
    }
  }, [searchValue]);
  ``;

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`search-screen ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="search-screen__searchbar">
          <input
            type="text"
            className="search-screen__searchbar-input"
            placeholder="جستجوی فیلم، سریال و ..."
            value={searchValue}
            onChange={searchValueChangeHandler}
          />
          <IoSearch
            className="search-screen__search-icon"
            onClick={searchMovieAndSeries}
          />
        </div>
        {isError ? (
          <Alert className="text-error" variant="filled" severity="error">
            جستجوی شما هیچ نتیجه‌ای به همراه نداشت
          </Alert>
        ) : shownMovies.length > 0 ? (
          <>
            <div className="search-results__header">
              <span className="search-results__title">
                نتایج ({shownMovies.length})
              </span>
              <div className="d-flex align-items-center">
                <span
                  className="search-back__icon"
                  onClick={() => {
                    setSearchValue("");
                    setShownMovies([]);
                    setIsSearched(false);
                    setIsError(false);
                  }}
                >
                  <IoIosClose className="close-searchbox-icon" />
                </span>
                <Link to="/">
                  <IoArrowBackCircleOutline className="search-back__icon" />
                </Link>
              </div>
            </div>
            <div className="search-result__view-toggle">
              <IoGridOutline
                className={`search-result__view-icon ${
                  moviesDisplayType === "grid"
                    ? "search-result__icon--active"
                    : ""
                }`}
                onClick={() => setMoviesDisplayType("grid")}
              />
              <IoListOutline
                className={`search-result__view-icon ${
                  moviesDisplayType === "list"
                    ? "search-result__icon--active"
                    : ""
                }`}
                onClick={() => setMoviesDisplayType("list")}
              />
            </div>
            <div className="search-results__container">
              <div className="row w-100">
                {shownMovies.map((movie) => (
                  <MovieBox
                    key={movie.id}
                    {...movie}
                    isGrid={moviesDisplayType === "grid"}
                    isSlider={false}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          !isSearched && (
            <div className="popular-movies__wrapper">
              <div className="category-header mb-4">
                <span className="category-title">جدیدترین فیلم‌ها</span>
                <Link to="/movies/upcoming" className="all-categories ps-2 ">
                  همه
                </Link>
              </div>
              <div className="row ps-3">
                {upcomingMovies &&
                  upcomingMovies.map((upcomingMovie) => (
                    <MovieBox
                      key={upcomingMovie.id}
                      {...upcomingMovie}
                      isGrid={true}
                      isSlider={false}
                    />
                  ))}
              </div>
            </div>
          )
        )}
      </div>
      <BottomBar activeBottom="search" />
    </>
  );
}

export default SearchScreen;
