import { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    let filteredMovies = [...allMovies];

    // Sort By RateIMDB
    switch (movieRating) {
      case "0":
        setMovies([...allMovies]);
        break;

      case "up9":
        filteredMovies = [...allMovies].filter((movie) => movie.rating >= 9);
        console.log(filteredMovies);

        setMovies(filteredMovies);
        break;

      case "up8":
        filteredMovies = [...allMovies].filter((movie) => movie.rating >= 8);
        setMovies(filteredMovies);
        break;

      case "up7":
        filteredMovies = [...allMovies].filter((movie) => movie.rating >= 7);
        setMovies(filteredMovies);
        break;

      case "up6":
        filteredMovies = [...allMovies].filter((movie) => movie.rating >= 6);
        setMovies(filteredMovies);
        break;

      case "up5":
        filteredMovies = [...allMovies].filter((movie) => movie.rating >= 5);
        setMovies(filteredMovies);
        break;

      case "down5":
        filteredMovies = [...allMovies].filter((movie) => movie.rating < 5);
        setMovies(filteredMovies);
        break;

      default:
        {
          setMovies([...allMovies]);
        }

        setMovies(filteredMovies);
    }

    // Sort By Genre
    if (movieGenre !== "همه") {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genre.includes(movieGenre)
      );
      setMovies(filteredMovies);
    }

    // Sort By Order
    switch (movieOrderby) {
      case "all":
        setMovies([...allMovies]);
        break;

      case "newest":
        {
          const filteredMovies = [...allMovies].slice().reverse();
          setMovies(filteredMovies);
        }
        break;

      case "modified":
        {
          const filteredMovies = [...allMovies].sort(
            (a, b) => new Date(b.dateModified) - new Date(a.dateModified)
          );
          setMovies(filteredMovies);
        }
        break;

      case "release":
        {
          const filteredMovies = [...allMovies].sort((a, b) => b.year - a.year);
          setMovies(filteredMovies);
        }
        break;

      case "imdb_rate":
        {
          const filteredMovies = [...allMovies].sort(
            (a, b) => b.rating - a.rating
          );
          setMovies(filteredMovies);
        }
        break;

      case "popular":
        {
          const filteredMovies = [...allMovies].sort(
            (a, b) => b.popularity - a.popularity
          );
          setMovies(filteredMovies);
        }
        break;

      default:
        {
          setMovies([...allMovies]);
        }

        setMovies(filteredMovies);
    }
  }, [movieRating, movieGenre, movieOrderby]);

  const setmovieRatingTitleHandler = (event) => {
    setMovieRatingTitle(event.target.textContent);
  };

  const setmovieGenreTitleHandler = (event) => {
    setMovieGenreTitle(event.target.textContent);
  };

  const setMovieOrderbyTitleHandler = (event) => {
    setMovieOrderbyTitle(event.target.textContent);
  };

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
