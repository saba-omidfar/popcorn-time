import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { IoGridOutline, IoListOutline } from "react-icons/io5";
import BottomBar from "../../Components/BottomBar/BottomBar";
import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";
import Pagination from "../../Components/Pagination/Pagination";

import allMovies from "../../data";

import { IoIosMenu } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

import "./Movies.css";

export default function Movies() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const imdbRate = searchParams.get("imdbRate");

  const moviesFiltersRef = useRef([null, null, null]);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [moviesDisplayType, setMoviesDisplayType] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("");
  const [movies, setMovies] = useState(allMovies);
  const [shownMovies, setShownMovies] = useState([]);
  const [movieRatingTitle, setMovieRatingTitle] = useState("همه");
  const [movieRating, setMovieRating] = useState("0");
  const [movieGenreTitle, setMovieGenreTitle] = useState("همه");
  const [movieGenre, setMovieGenre] = useState("همه");
  const [movieOrderbyTitle, setMovieOrderbyTitle] = useState("همه");
  const [movieOrderby, setMovieOrderby] = useState("all");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    console.log(query);

    const genre = query.get("genre") || "همه";
    const rating = query.get("imdbRate") || "0";
    const orderby = query.get("sortby") || "all";

    setMovieGenre(genre);
    setMovieRating(rating);
    setMovieOrderby(orderby);

    setMovieGenreTitle(genre === "همه" ? "همه" : genre);
    setMovieRatingTitle(
      rating === "0" ? "همه" : `بالای ${rating.replace("up", "")}`
    );
    setMovieOrderbyTitle(orderby === "all" ? "همه" : orderby);
  }, [location.search]);

  // Upadte URL
  const updateUrl = (genre, rating, orderby) => {
    const query = new URLSearchParams();
    if (genre && genre !== "همه") query.set("genre", genre);
    if (rating && rating !== "0") query.set("imdbRate", rating);
    if (orderby && orderby !== "all") query.set("sortby", orderby);
    navigate({
      pathname: "/movies/1",
      search: query.toString(),
    });
  };

  // Handle Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = moviesFiltersRef.current.some(
        (filterRef) => filterRef && filterRef.contains(event.target)
      );
      if (!isClickInside) {
        setActiveFilter("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleActiveFilter = (filterType) => {
    setActiveFilter((prevState) =>
      prevState === filterType ? "" : filterType
    );
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const setmovieRatingTitleHandler = (event) => {
    const selectedRating =
      event.target.textContent === "همه"
        ? "0"
        : `up${event.target.textContent.slice(-1)}`;
    setMovieRatingTitle(event.target.textContent);
    setMovieRating(selectedRating);
    updateUrl(movieGenre, selectedRating, movieOrderby);
  };

  const setmovieGenreTitleHandler = (event) => {
    const selectedGenre = event.target.textContent;
    setMovieGenreTitle(selectedGenre);
    setMovieGenre(selectedGenre);
    updateUrl(selectedGenre, movieRating, movieOrderby);
  };

  const setMovieOrderbyTitleHandler = (event) => {
    const selectedOrderby =
      event.target.textContent === "همه"
        ? "all"
        : event.target.textContent.toLowerCase();
    setMovieOrderbyTitle(event.target.textContent);
    setMovieOrderby(selectedOrderby);
    updateUrl(movieGenre, movieRating, selectedOrderby);
  };

  useEffect(() => {
    let filteredMovies = [...allMovies];

    if (movieRating !== "0") {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.rating >= movieRating
      );
    }

    if (movieGenre !== "همه") {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genre.includes(movieGenre)
      );
    }

    switch (movieOrderby) {
      case "newest":
        filteredMovies = filteredMovies.slice().reverse();
        break;
      case "modified":
        filteredMovies = filteredMovies.sort(
          (a, b) => new Date(b.dateModified) - new Date(a.dateModified)
        );
        break;
      case "release":
        filteredMovies = filteredMovies.sort((a, b) => b.year - a.year);
        break;
      case "imdb_rate":
        filteredMovies = filteredMovies.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filteredMovies = filteredMovies.sort(
          (a, b) => b.popularity - a.popularity
        );
        break;
      default:
        break;
    }

    setMovies(filteredMovies);
  }, [movieRating, movieGenre, movieOrderby]);

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`movies ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>

        <span className="movies__title">فیلم‌ها</span>
        <div className="movies__header">
          <div className="movies__row-archive">
            <div
              className={`movies__filter-orderby ${
                activeFilter === "orderby" ? "active" : ""
              }`}
              onClick={() => toggleActiveFilter("orderby")}
              ref={(el) => (moviesFiltersRef.current[0] = el)}
            >
              <div className="label-orderby">مرتب‌سازی</div>
              <div className="title-select">
                <div className="right-text">{movieOrderbyTitle}</div>
                <div className="down-arrow">
                  <MdKeyboardArrowDown className="down-arrow__icon" />
                </div>
              </div>
              <ul className="movies-filters__selection-list">
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("all");
                  }}
                >
                  همه
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("newest");
                  }}
                >
                  جدیدترین
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("modified");
                  }}
                >
                  بروزترین
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("release");
                  }}
                >
                  سال انتشار
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("imdb_rate");
                  }}
                >
                  امتیاز IMDB
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setMovieOrderbyTitleHandler(event);
                    setMovieOrderby("popular");
                  }}
                >
                  محبوب‌ترین
                </li>
              </ul>
            </div>
            <div
              className={`movies__filter-orderby ${
                activeFilter === "imdb" ? "active" : ""
              }`}
              onClick={() => toggleActiveFilter("imdb")}
              ref={(el) => (moviesFiltersRef.current[1] = el)}
            >
              <div className="label-orderby">امتیاز IMDB</div>
              <div className="title-select">
                <div className="right-text">{movieRatingTitle}</div>
                <div className="down-arrow">
                  <MdKeyboardArrowDown className="down-arrow__icon" />
                </div>
              </div>
              <ul className="movies-filters__selection-list">
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("0");
                  }}
                >
                  همه
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("up9");
                  }}
                >
                  بالای ۹
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("up8");
                  }}
                >
                  بالای ۸
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("up7");
                  }}
                >
                  بالای ۷
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("up6");
                  }}
                >
                  بالای ۶
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("up5");
                  }}
                >
                  بالای ۵
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieRatingTitleHandler(event);
                    setMovieRating("down5");
                  }}
                >
                  زیر ۵
                </li>
              </ul>
            </div>
            <div
              className={`movies__filter-orderby ${
                activeFilter === "genre" ? "active" : ""
              }`}
              onClick={() => toggleActiveFilter("genre")}
              ref={(el) => (moviesFiltersRef.current[2] = el)}
            >
              <div className="label-orderby">ژانر</div>
              <div className="title-select">
                <div className="right-text">{movieGenreTitle}</div>
                <div className="down-arrow">
                  <MdKeyboardArrowDown className="down-arrow__icon" />
                </div>
              </div>
              <ul className="movies-filters__selection-list">
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("همه");
                  }}
                >
                  همه
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("درام");
                  }}
                >
                  درام
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("جنگی");
                  }}
                >
                  جنگی
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("اکشن");
                  }}
                >
                  اکشن
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("انیمیشن");
                  }}
                >
                  انیمیشن
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("جنایی");
                  }}
                >
                  جنایی
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("فانتزی");
                  }}
                >
                  فانتزی
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("مهیج");
                  }}
                >
                  مهیج
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("ترسناک");
                  }}
                >
                  ترسناک
                </li>
                <li
                  className="movies-filters__selection-item"
                  onClick={(event) => {
                    setmovieGenreTitleHandler(event);
                    setMovieGenre("رازآلود");
                  }}
                >
                  رازآلود
                </li>
                {/* <li className="movies-filters__selection-item">علمی تخیلی</li>
                <li className="movies-filters__selection-item">بیوگرافی</li>
                <li className="movies-filters__selection-item">انیمیشن</li>
                <li className="movies-filters__selection-item">خانوادگی</li>
                <li className="movies-filters__selection-item">تاریخی</li>
                <li className="movies-filters__selection-item">جنگی</li>
                <li className="movies-filters__selection-item">مستند</li>
                <li className="movies-filters__selection-item">ورزشی</li>
                <li className="movies-filters__selection-item">موزیکال</li>
                <li className="movies-filters__selection-item">وسترن</li>
                <li className="movies-filters__selection-item">دلهره‌آور</li>
                <li className="movies-filters__selection-item">true crime</li>
                <li className="movies-filters__selection-item">اکشن</li> */}
              </ul>
            </div>
          </div>
        </div>
        {shownMovies.length !== 0 && (
          <div className="movies__view-toggle">
            <IoGridOutline
              className={`movies__view-icon ${
                moviesDisplayType === "grid" ? "movies__icon--active" : ""
              }`}
              onClick={() => setMoviesDisplayType("grid")}
            />
            <IoListOutline
              className={`movies__view-icon ${
                moviesDisplayType === "list" ? "movies__icon--active" : ""
              }`}
              onClick={() => setMoviesDisplayType("list")}
            />
          </div>
        )}
        <div className="movies__container">
          {moviesDisplayType === "grid" ? (
            <>
              <div className="movies__list">
                <div className="row">
                  {shownMovies.length !== 0 ? (
                    shownMovies.map((movie) => (
                      <MovieBox
                        key={movie.id}
                        {...movie}
                        isGrid={true}
                        isSlider={false}
                      />
                    ))
                  ) : (
                    <div className="alert">هیچ فیلمی پیدا نشد.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="row">
              {shownMovies.length !== 0 ? (
                shownMovies.map((movie) => (
                  <MovieBox
                    key={movie.id}
                    {...movie}
                    isGrid={false}
                    isSlider={false}
                  />
                ))
              ) : (
                <div className="alert">هیچ فیلمی پیدا نشد.</div>
              )}
            </div>
          )}
        </div>
        {shownMovies.length !== movies.length && (
          <Pagination
            className="movies__pagination"
            items={movies}
            itemsCount={6}
            pathname="/movies"
            setShownItems={setShownMovies}
          />
        )}
      </div>
      <BottomBar activeBottom="search" />
    </>
  );
}
