import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";
import Pagination from "../../Components/Pagination/Pagination";

import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

import "./MovieShowFilter.css";
import { useSession } from "../../Contexts/sessionContext";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

function MovieShowFilter({ category, path, pageTitle, genreFilter }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { page } = useParams();
  const { apiKey, apiReadAccessToken } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const moviesFiltersRef = useRef([null, null, null]);

  const [shownMovies, setShownMovies] = useState([]);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [moviesDisplayType, setMoviesDisplayType] = useState("grid");

  const [activeFilter, setActiveFilter] = useState("");
  const [titles, setTitles] = useState({
    rating: "همه",
    genre: "همه",
    orderby: "همه",
  });

  const [allGenres, setAllGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMoviesWithFilters = () => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    const queryParams = new URLSearchParams(location.search);
    const rating = queryParams.get("rating");
    const genre = queryParams.get("genre");
    const orderby = queryParams.get("orderby");

    let apiUrl;

    if (path === "upcoming" && category === "movie") {
      apiUrl = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${currentPage}`;
    } else if (path === "upcoming" && category === "tv") {
      apiUrl = `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${currentPage}`;
    } else if (path === "top_rated" && category === "tv") {
      apiUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`;
    } else if (path === "top_rated" && category === "movie") {
      apiUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
    } else {
      apiUrl = `https://api.themoviedb.org/3/discover/${category}?language=en-US&page=${currentPage}&sort_by=popularity.desc&api_key=${apiKey}`;
    }

    // اضافه کردن فیلترهای امتیاز
    if (rating) {
      const ratingValue = rating.includes("up")
        ? rating.replace("up", "")
        : rating.replace("down", "");
      const ratingParam = rating.includes("up")
        ? `&vote_average.gte=${ratingValue}`
        : `&vote_average.lte=${ratingValue}`;
      apiUrl += ratingParam;
    }

    // اضافه کردن فیلتر ژانر
    if (genre && genre !== "همه") {
      const genreId = allGenres.find((g) => g.name === genre)?.id || "";
      apiUrl += `&with_genres=${genreId}`;
    } else if (genreFilter) {
      const genreId =
        allGenres.find(
          (g) => g.name.toLowerCase() === genreFilter.toLowerCase()
        )?.id || "";
      apiUrl += `&with_genres=${genreId}`;
    }

    // اضافه کردن مرتب‌سازی
    if (orderby && orderby !== "همه") {
      let sortParam = "";
      switch (orderby) {
        case "newest":
          sortParam = "release_date.desc";
          break;
        case "modified":
          sortParam = "popularity.desc";
          break;
        case "release":
          sortParam = "primary_release_date.desc";
          break;
        case "imdbRate":
          sortParam = "vote_average.desc";
          break;
        case "popularity":
          sortParam = "popularity.desc";
          break;
        default:
          break;
      }
      if (sortParam) {
        apiUrl += `&sort_by=${sortParam}`;
      }
    }

    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Http error! status: ${res.status}`);
        }
      })
      .then((data) => {
        setShownMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  const getAllGenres = () => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    const genreUrl =
      category === "movie"
        ? `https://api.themoviedb.org/3/genre/movie/list?language=en`
        : `https://api.themoviedb.org/3/genre/tv/list?language=en`;

    fetch(genreUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllGenres(data.genres);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  useEffect(() => {
    fetchMoviesWithFilters();
  }, [location.search, currentPage, genreFilter, allGenres]);

  useEffect(() => {
    setCurrentPage(parseInt(page) || 1);
  }, [page]);

  useEffect(() => {
    getAllGenres();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const toggleActiveFilter = (filterType) => {
    setActiveFilter((prevState) =>
      prevState === filterType ? "" : filterType
    );
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  //Handle Clicking Outside
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

  const setQueryParams = (filterName, value) => {
    const queryParams = new URLSearchParams(location.search);

    if (value !== "همه") {
      queryParams.set(filterName, value);

      if (!queryParams.has("page")) {
        queryParams.set("page", currentPage);
      }
    } else {
      queryParams.delete(filterName);
    }

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentFilters = {
      rating: queryParams.get("rating") || "همه",
      genre: queryParams.get("genre") || "همه",
      orderby: queryParams.get("orderby") || "همه",
    };

    setTitles({
      rating: currentFilters.rating,
      genre: currentFilters.genre,
      orderby: currentFilters.orderby,
    });
  }, [location.search]);

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`movies ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <span className="movies__title">{pageTitle}</span>

        {path !== "top_rated" && path !== "upcoming" && (
          <div className="movies__header">
            <div
              className={`movies__row-archive ${
                genreFilter ? "justify-content-between" : "justify-content-end"
              }`}
            >
              {/* Ordetby Filter */}
              <div
                className={`movies__filter-orderby ${
                  activeFilter === "orderby" ? "active" : ""
                }`}
                onClick={() => toggleActiveFilter("orderby")}
                ref={(el) => (moviesFiltersRef.current[0] = el)}
              >
                <div className="label-orderby">مرتب‌سازی</div>
                <div className="title-select">
                  <div className="right-text">{titles.orderby}</div>
                  <div className="down-arrow">
                    <MdKeyboardArrowDown className="down-arrow__icon" />
                  </div>
                </div>
                <ul className="movies-filters__selection-list">
                  <li
                    className="movies-filters__selection-item"
                    data-orderby="همه"
                    onClick={() => {
                      setQueryParams("orderby", "همه");
                      setTitles((prev) => ({ ...prev, orderby: "همه" }));
                    }}
                  >
                    همه
                  </li>
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("orderby", "newest");
                      setTitles((prev) => ({ ...prev, orderby: "جدیدترین" }));
                    }}
                  >
                    جدیدترین
                  </li>
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("orderby", "modified");
                      setTitles((prev) => ({ ...prev, orderby: "بروزترین" }));
                    }}
                  >
                    بروزترین
                  </li>
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("orderby", "release");
                      setTitles((prev) => ({ ...prev, orderby: "سال انتشار" }));
                    }}
                  >
                    سال انتشار
                  </li>
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("orderby", "imdbRate");
                      setTitles((prev) => ({
                        ...prev,
                        orderby: "امتیاز IMDB",
                      }));
                    }}
                  >
                    امتیاز IMDB
                  </li>
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("orderby", "popularity");
                      setTitles((prev) => ({ ...prev, orderby: "محبوب‌ترین" }));
                    }}
                  >
                    محبوب‌ترین
                  </li>
                </ul>
              </div>

              {/* Rating Filter */}
              <div
                className={`movies__filter-orderby ${
                  activeFilter === "imdb" ? "active" : ""
                }`}
                onClick={() => toggleActiveFilter("imdb")}
                ref={(el) => (moviesFiltersRef.current[1] = el)}
              >
                <div className="label-orderby">امتیاز IMDB</div>
                <div className="title-select">
                  <div className="right-text">{titles.rating}</div>
                  <div className="down-arrow">
                    <MdKeyboardArrowDown className="down-arrow__icon" />
                  </div>
                </div>

                <ul className="movies-filters__selection-list">
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("rating", "همه");
                      setTitles((prev) => ({
                        ...prev,
                        rating: `همه`,
                      }));
                    }}
                  >
                    همه
                  </li>
                  {Array.from({ length: 5 }, (_, i) => i + 5)
                    .reverse()
                    .map((rating) => (
                      <li
                        key={rating}
                        className="movies-filters__selection-item"
                        onClick={() => {
                          setQueryParams("rating", `up${rating}`);
                          setTitles((prev) => ({
                            ...prev,
                            rating: `بالای ${rating}`,
                          }));
                        }}
                      >
                        بالای {rating}
                      </li>
                    ))}
                  <li
                    className="movies-filters__selection-item"
                    onClick={() => {
                      setQueryParams("rating", `down5`);
                      setTitles((prev) => ({
                        ...prev,
                        rating: "زیر 5",
                      }));
                    }}
                  >
                    زیر 5
                  </li>
                </ul>
              </div>

              {/* Genre Filter */}
              {!genreFilter && (
                <div
                  className={`movies__filter-orderby ${
                    activeFilter === "genre" ? "active" : ""
                  }`}
                  onClick={() => toggleActiveFilter("genre")}
                  ref={(el) => (moviesFiltersRef.current[2] = el)}
                >
                  <div className="label-orderby">ژانر</div>
                  <div className="title-select">
                    <div className="right-text">{titles.genre}</div>
                    <div className="down-arrow">
                      <MdKeyboardArrowDown className="down-arrow__icon" />
                    </div>
                  </div>
                  <ul className="movies-filters__selection-list">
                    <li
                      className="movies-filters__selection-item"
                      onClick={() => {
                        setQueryParams("genre", "همه");
                        setTitles((prev) => ({
                          ...prev,
                          genre: `همه`,
                        }));
                      }}
                    >
                      همه
                    </li>
                    {allGenres.map((genre) => (
                      <li
                        key={genre.id}
                        className="movies-filters__selection-item"
                        onClick={() => {
                          setQueryParams("genre", genre.name);
                          setTitles((prev) => ({
                            ...prev,
                            genre: genre.name,
                          }));
                        }}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* moviesDisplayType */}
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

        {/* Showing Movies By Filter */}
        <div className="movies__container">
          <div className="movies__list">
            <div className="row">
              {!isLoading && shownMovies.length !== 0 ? (
                shownMovies.map((movie) => (
                  <MovieBox
                    key={movie.id}
                    {...movie}
                    isGrid={moviesDisplayType === "grid"}
                    isSlider={false}
                  />
                ))
              ) : isLoaded ? (
                <div className="alert">هیچ محتوایی پیدا نشد.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {shownMovies.length && totalPages !== 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </>
  );
}

export default MovieShowFilter;
