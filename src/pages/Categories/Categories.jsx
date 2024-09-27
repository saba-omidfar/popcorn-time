import React, { useEffect, useState, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import BottomBar from "../../Components/BottomBar/BottomBar";
import SideMenu from "../../Components/SideMenu/SideMenu";
// import MovieBox from "../../Components/MovieBox/MovieBox";

const MovieBox = React.lazy(() => import("../../Components/MovieBox/MovieBox"));

import { IoIosMenu } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { useSession } from "../../Contexts/sessionContext";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

import "swiper/css";
import "./Categories.css";

function Categories() {
  const { apiKey, apiReadAccessToken } = useSession();
  const [allMovies, setAllMovies] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [allTopRatedTvs, setAllTopRatedTvs] = useState([]);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [swiperMoviesProgress, setSwiperMoviesProgress] = useState(0);
  const [swiperSeriesProgress, setSwiperSeriesProgress] = useState(0);
  const [swiperNowPlayingtvsProgress, setSwiperNowPlayingtvsProgress] =
    useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        NProgress.start();
        const [moviesRes, seriesRes, topRatedRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${apiKey}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${apiReadAccessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
          fetch(
            `https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=1&api_key=${apiKey}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${apiReadAccessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${apiReadAccessToken}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        if (moviesRes.ok && seriesRes.ok && topRatedRes.ok) {
          const moviesData = await moviesRes.json();
          const seriesData = await seriesRes.json();
          const topRatedData = await topRatedRes.json();

          setAllMovies(moviesData.results);
          setAllSeries(seriesData.results);
          setAllTopRatedTvs(topRatedData.results);
        } else {
          throw new Error("HTTP error");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoaded(true);
        NProgress.done();
      }
    };

    fetchData();
  }, []);
  

  const swiperOptionsMovies = {
    slidesPerView: 3,
    lazy: true,
    loop: false,
    spaceBetween: 10,
    navigation: false,
    pagination: false,
    scrollbar: { draggable: true },
    dir: "rtl",

    onInit: (swiper) => {
      const totalSlides = swiper.slides.length;
      const initialSlideWidth = 100 / totalSlides;
      setSwiperMoviesProgress(initialSlideWidth);
    },

    onSlideChange: (swiper) => {
      const totalSlides = swiper.slides.length;
      const progressPercentage = ((swiper.activeIndex + 1) / totalSlides) * 100;
      setSwiperMoviesProgress(progressPercentage);
    },
  };

  const swiperOptionsSeries = {
    slidesPerView: 3,
    lazy: true,
    loop: false,
    spaceBetween: 10,
    navigation: false,
    pagination: false,
    scrollbar: { draggable: true },
    dir: "rtl",

    onInit: (swiper) => {
      const totalSlides = swiper.slides.length;
      const initialSlideWidth = 100 / totalSlides;
      setSwiperSeriesProgress(initialSlideWidth);
    },

    onSlideChange: (swiper) => {
      const totalSlides = swiper.slides.length;
      const progressPercentage = ((swiper.activeIndex + 1) / totalSlides) * 100;
      setSwiperSeriesProgress(progressPercentage);
    },
  };

  const swiperOptionsNowPlayingSeries = {
    slidesPerView: 3,
    lazy: true,
    loop: false,
    spaceBetween: 10,
    navigation: false,
    pagination: false,
    scrollbar: { draggable: true },
    dir: "rtl",

    onInit: (swiper) => {
      const totalSlides = swiper.slides.length;
      const initialSlideWidth = 100 / totalSlides;
      setSwiperNowPlayingtvsProgress(initialSlideWidth);
    },

    onSlideChange: (swiper) => {
      const totalSlides = swiper.slides.length;
      const progressPercentage = ((swiper.activeIndex + 1) / totalSlides) * 100;
      setSwiperNowPlayingtvsProgress(progressPercentage);
    },
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      {isLoaded && (
        <div className={`categories ${sideMenuOpen && "blur-background "}`}>
          <div className="side-menu__icon" onClick={toggleSideMenu}>
            <IoIosMenu />
          </div>
          <div className="papcorn-logo">
            <div className="d-flex flex-column ms-3">
              <span className="papcorn">PAPCORNT</span>
              <span className="time">TIME</span>
            </div>
            <img src="/images/logo/papcorn-logo3.png" alt="" />
          </div>
          <div className="category-results__header">
            <span className="category-results__title">دسته‌بندی‌</span>
            <Link to="/">
              <IoArrowBackCircleOutline className="category-back__icon" />
            </Link>
          </div>
          <div className="categories-wrapper">
            <div className="category">
              <div className="category-header">
                <span className="category-title">فیلم</span>
                <Link to="/movies" className="all-categories">
                  همه
                </Link>
              </div>
              <div className="category">
                <div className="category-slider">
                  <Swiper {...swiperOptionsMovies} dir="rtl">
                    {allMovies.slice(0, 10).map((movie) => (
                      <SwiperSlide key={movie.id}>
                        <Suspense
                          fallback={<span className="loading-icon"></span>}
                        >
                          <MovieBox isGrid={true} isSlider={true} {...movie} />
                        </Suspense>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${swiperMoviesProgress}%` }}
                    id={`progress-bar-movies`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="category">
              <div className="category-header">
                <span className="category-title">سریال</span>
                <Link to="/series" className="all-categories">
                  همه
                </Link>
              </div>
              <div className="category">
                <div className="category-slider">
                  <Swiper {...swiperOptionsSeries} dir="rtl">
                    {allSeries.slice(0, 10).map((movie) => (
                      <SwiperSlide key={movie.id}>
                        <MovieBox isGrid={true} isSlider={true} {...movie} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${swiperSeriesProgress}%` }}
                    id={`progress-bar-series`}
                  ></div>
                </div>
              </div>
            </div>
            <div className="category">
              <div className="category-header">
                <span className="category-title">سریال‌های پرفروش</span>
                <Link to="/series/top-rated" className="all-categories">
                  همه
                </Link>
              </div>
              <div className="category">
                <div className="category-slider">
                  <Swiper {...swiperOptionsNowPlayingSeries} dir="rtl">
                    {allTopRatedTvs.slice(0, 10).map((movie) => (
                      <SwiperSlide key={movie.id}>
                        <MovieBox isGrid={true} isSlider={true} {...movie} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${swiperNowPlayingtvsProgress}%` }}
                    id={`progress-bar-series`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomBar activeBottom="favorite" />
    </>
  );
}

export default Categories;
