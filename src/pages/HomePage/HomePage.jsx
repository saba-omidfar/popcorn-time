import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import "./HomePage.css";

import { IoIosMenu } from "react-icons/io";
import {
  MdOutlineStarOutline,
  MdOutlineStarHalf,
  MdOutlineStarPurple500,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

import BottomBar from "../../Components/BottomBar/BottomBar";
import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";

import { useSession } from "../../Contexts/sessionContext";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import SwitchBtn from "../../Components/SwitchBtn/SwitchBtn";

function HomePage() {
  const { apiKey } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isWeek, setIsWeek] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeMovie, setActiveMovie] = useState({});

  const getAllTrendingMoviesAndSeries = () => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    const timePeriod = isWeek ? "week" : "day";

    const trendingMovieFetch = fetch(
      `https://api.themoviedb.org/3/trending/movie/${timePeriod}?language=en-US&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const trendingTvFetch = fetch(
      `https://api.themoviedb.org/3/trending/tv/${timePeriod}?language=en-US&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    Promise.all([trendingMovieFetch, trendingTvFetch])
      .then(async ([movieRes, tvRes]) => {
        if (movieRes.ok && tvRes.ok) {
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();

          const combinedResults = [...movieData.results, ...tvData.results];

          setTrendingMovies(combinedResults);
          setActiveMovie(combinedResults[0]);
        } else {
          throw new Error(
            `Http error! movie status: ${movieRes.status}, tv status: ${tvRes.status}`
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching watchlist movies and tvs:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const handleSwitchChange = (e) => {
    setIsWeek(e.target.checked);
  };

  const swiperOptions = {
    slidesPerView: 3,
    loop: true,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    observer: true,
    observeParents: true,
    modules: [Autoplay, EffectFade],
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    onSlideChange: (swiper) => {
      const currentMovie = trendingMovies[swiper.realIndex];
      if (currentMovie) {
        setActiveMovie(currentMovie);
      }
    },
  };

  useEffect(() => {
    getAllTrendingMoviesAndSeries();
  }, [isWeek]);

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`home ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="movie-intro__wrap">
          {activeMovie && (
            <img
              src={`https://media.themoviedb.org/t/p/w300${activeMovie.poster_path}`}
              className="movie__image"
              alt={`${activeMovie.title || activeMovie.name} Image`}
            />
          )}
        </div>

        {isLoaded && activeMovie ? (
          <div className="slide_data_text">
            <h2>
              <Link href="#">{activeMovie.name || activeMovie.title}</Link>
            </h2>
            {activeMovie.vote_average !== 0 ? (
              <div className="imdb_rate">
                <strong className="me-2">
                  {Math.round(activeMovie.vote_average * 10) / 10}
                </strong>
                <small>/10</small>
              </div>
            ) : null}
            <div className="summary_text ellipsis">{activeMovie.overview}</div>
            <div className="d-flex flex-column align-items-end mt-3">
              {activeMovie.adult ? (
                <div className="movie-age">
                  <FaPlus /> 18
                </div>
              ) : (
                ""
              )}

              <div className="d-flex">
                {Array(
                  Math.max(
                    5 -
                      Math.floor(activeMovie.vote_average / 2) -
                      (activeMovie.vote_average % 2 >= 1 ? 1 : 0),
                    0
                  )
                )
                  .fill(0)
                  .map((_, index) => (
                    <MdOutlineStarOutline
                      key={index}
                      style={{ color: "orange" }}
                    />
                  ))}
                {(activeMovie.vote_average % 2 >= 1 ? 1 : 0) === 1 && (
                  <MdOutlineStarHalf style={{ color: "orange" }} />
                )}
                {Array(Math.max(Math.floor(activeMovie.vote_average / 2), 0))
                  .fill(0)
                  .map((_, index) => (
                    <MdOutlineStarPurple500
                      key={index}
                      style={{ color: "orange" }}
                    />
                  ))}
              </div>
            </div>
            {/* <div className="btnmoreHolder">
              <a
                href="https://filmkio.run/series/the-lord-of-the-rings-v6/"
                className="btnmore"
              >
                دانلود + ادامه
              </a>
            </div> */}
          </div>
        ) : (
          <p>در حال بارگذاری اطلاعات فیلم...</p>
        )}

        <div className="popular-movies__wrap">
          <div className="d-flex flex-column flex-grow-1 h-100">
            <div className="movie-title d-flex justify-content-between align-items-center mb-4">
              <span>جدیدترین فیلم‌ها و سریال‌ها</span>
              <SwitchBtn checked={isWeek} onChange={handleSwitchChange} />
            </div>
            <div className="popular-movies__container">
              <Swiper {...swiperOptions} dir="rtl">
                {trendingMovies.map((movie) => (
                  <SwiperSlide key={movie.id}>
                    <MovieBox isGrid={true} isSlider={false} {...movie} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <BottomBar activeBottom="home" />
    </>
  );
}

export default HomePage;
