import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Tab from "@mui/material/Tab";

import Swal from "sweetalert2";

import { Alert, Tooltip } from "@mui/material";

import { useSession } from "../../Contexts/sessionContext";
import { useMediaStatus } from "../../hooks/useMediaStatus";

import CenteredTabs from "../../Components/CenteredTab/CenteredTab";
import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";
import BottomBar from "../../Components/BottomBar/BottomBar";
import { showToastSuccess, showToastError } from "../../Components/Toast/Toast";
import RatingSlider from "../../Components/RatingSlider/RatingSlider";
import Providers from "../../Components/Providers/Providers";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

import "swiper/css";
import "swiper/css/effect-fade";
import "./MoviePlayback.css";

import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { MdStarRate, MdStarOutline } from "react-icons/md";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { IoIosList, IoIosMenu } from "react-icons/io";
import { FaChromecast } from "react-icons/fa6";
import { useGuestSession } from "../../Contexts/guestSessionContext";

function PlaybackPage() {
  const { movieID } = useParams();

  const { userInfos, sessionId, accountId, apiKey, apiReadAccessToken } =
    useSession();
  const { guestSessionId, isGuest } = useGuestSession();
  const { status } = useMediaStatus("movie", movieID);

  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  const [movieDetails, setMovieDetails] = useState({});
  const [movieCast, setMovieCast] = useState([]);
  const [movieStars, setMovieStars] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [movieTrailer, setMovieTrailer] = useState({});
  const [movieImages, setMovieImages] = useState({});
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [movieDirector, setMovieDirector] = useState("");
  const [movieReviews, setMovieReviews] = useState([]);

  const [addToFavoriteLoading, setAddToFavoriteLoading] = useState(false);
  const [addToWathlistLoading, setAddToWatchlistLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProvidersModal, setShowProvidersModal] = useState(false);

  const fetchMovieDetails = async () => {
    const movieDetailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return movieDetailsRes.json();
  };

  const fetchMovieVideos = async () => {
    const movieVideosRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/videos`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return movieVideosRes.json();
  };

  const fetchMovieImages = async () => {
    const movieImagesRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/images`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return movieImagesRes.json();
  };

  const fetchMovieRecommendations = async () => {
    const movieRecommendationsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/similar`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return movieRecommendationsRes.json();
  };

  const fetchMovieCredits = async () => {
    const movieCreditsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/credits`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return movieCreditsRes.json();
  };

  const getAllMovieReviews = (page = 1) => {
    setIsLoading(true);
    setIsLoaded(false);

    fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/reviews?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((movieReviewsData) => {
        setMovieReviews(movieReviewsData.results);
        setTotalPages(movieReviewsData.total_pages);
        setCurrentPage(page);
      })
      .catch((err) => {
        console.log("Error fetching movie reviews data:", err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
      });
  };

  const fetchAllData = () => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    Promise.all([
      fetchMovieDetails(),
      fetchMovieVideos(),
      fetchMovieImages(),
      fetchMovieRecommendations(),
      fetchMovieCredits(),
    ])
      .then(
        ([
          movieDetailsData,
          movieVideosData,
          movieImagesData,
          movieRecommendationsData,
          movieCreditsData,
        ]) => {
          setMovieDetails(movieDetailsData);
          setMovieGenres(movieDetailsData.genres);

          const officialTrailer = movieVideosData.results.find(
            (video) => video.name === "Official Trailer"
          );
          setMovieTrailer(officialTrailer);

          setMovieImages(movieImagesData);
          setMovieRecommendations(movieRecommendationsData.results);

          setMovieCast(movieCreditsData.cast);
          const stars = movieCreditsData.cast.filter(
            (cast) => cast.known_for_department === "Acting"
          );
          setMovieStars(stars);

          const director = movieCreditsData.crew.find(
            (member) => member.job === "Director"
          );
          setMovieDirector(director ? director.original_name : "");
        }
      )
      .catch((err) => {
        console.error("Error fetching movie data:", err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  useEffect(() => {
    fetchAllData();
  }, [movieID]);

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
          status.favorite
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

  const toggleWatchlist = async (mediaId, mediaType) => {
    if (!sessionId || !accountId) {
      showToastError("برای افزودن به لیست تماشا باید وارد شوید");
      return;
    }

    setAddToWatchlistLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist?api_key=${apiKey}&session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: mediaType,
            media_id: mediaId,
            watchlist: !status.watchlist,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        status.watchlist = !status.watchlist;
        showToastSuccess(
          status.watchlist ? "به لیست تماشا اضافه شد" : "از لیست تماشا حذف شد"
        );
      } else {
        console.error("Failed to toggle favorite status:", data);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    } finally {
      setAddToWatchlistLoading(false);
    }
  };

  const getLists = async () => {
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
    if (!sessionId) {
      showToastError("برای افزودن به لیست باید وارد شوید");
    } else {
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
        return data.item_present; // برمی‌گرداند که آیا فیلم در لیست هست یا نه
      } catch (error) {
        console.error("Error checking movie in list:", error);
      }
    }
  };

  const handleAddOrRemoveFromList = async () => {
    if (isGuest()) {
      showToastError("حساب مهمان قابلیت افزودن یا حذف از لیست را ندارد");
      return;
    }

    if (!sessionId) {
      showToastError("برای افزودن به لیست وارد شوید");
      return;
    } else {
      const allLists = await getLists();

      if (!allLists || allLists.length === 0) {
        Swal.fire({
          icon: "error",
          title: "شما هنوز هیچ لیستی نساخته‌اید.",
          text: " آیا می‌خواهید یک لیست جدید بسازید؟",
          showCancelButton: true,
          confirmButtonText: "ساخت لیست جدید",
          cancelButtonText: "خیر",
          showCloseButton: true,
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
        showCloseButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "لطفا یک لیست را انتخاب کنید!";
          }
        },
      });

      if (selectedListId) {
        const movieId = movieDetails.id;
        const isMovieInList = await checkMovieInList(movieId, selectedListId);

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
              removeMovieFromList(selectedListId, movieId);
            }
          });
        } else {
          addMovieToList(selectedListId, movieId);
        }
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
    if (isGuest()) {
      showToastError("حساب مهمان قابلیت حذف فیلم را ندارد");
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

  const removeMovieFromRatedMovies = async (mediaType, mediaId) => {
    if (isGuest()) {
      showToastError("حساب مهمان قابلیت حذف امتیاز را ندارد");
      return;
    }

    if (!status.rated) {
      showToastError("هنوز امتیازی به فیلم نداده‌اید");
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
        showToastSuccess("امتیاز شما حذف شد");
        setShowRatingModal(false);
      } else {
        showToastError("خطایی در حذف امتیاز رخ داد");
      }
    } catch (error) {
      console.error("Error removing rate movie:", error);
      showToastError("خطایی در حذف امتیاز رخ داد");
    }
  };

  const addRateMedia = () => {
    if (!sessionId && !guestSessionId) {
      showToastError("برای امتیازدهی وارد شوید");
      return;
    } else {
      setShowRatingModal(true);
    }
  };

  const handleTabClick = (newTab) => {
    setActiveTab(newTab);
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  useEffect(() => {
    getLists();
  }, [accountId]);

  useEffect(() => {
    getAllMovieReviews(currentPage);
  }, [currentPage]);

  return (
    <>
      <div
        className={`overlay ${
          showRatingModal || showProvidersModal ? "active" : ""
        }`}
      ></div>

      {showProvidersModal && (
        <Providers
          mediaType="movie"
          mediaId={movieID}
          mediaDetails={movieDetails}
          setShowProvidersModal={setShowProvidersModal}
        />
      )}

      {showRatingModal && (
        <RatingSlider
          mediaType="movie"
          mediaId={movieDetails.id}
          mediaName={movieDetails.title}
          setShowRatingModal={setShowRatingModal}
          removeMovieFromRatedMovies={removeMovieFromRatedMovies}
        />
      )}

      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />

      <div className="reaction__selector">
        <Tooltip
          placement="left-start"
          title={
            status.favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
        >
          <div
            className="add-to-favorite__icon mt-2 mb-2"
            onClick={() => toggleFavorite(movieDetails.id, "movie")}
          >
            {addToFavoriteLoading ? (
              <span className="loading-icon"></span>
            ) : status.favorite ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </div>
        </Tooltip>
        <Tooltip
          placement="left-start"
          title={
            status.watchlist ? "حذف از لیست تماشا" : "افزودن به لیست تماشا"
          }
        >
          <div
            className="add-to-watchlist__icon mt-2 mb-2"
            onClick={() => toggleWatchlist(movieDetails.id, "movie")}
          >
            {addToWathlistLoading ? (
              <span className="loading-icon"></span>
            ) : status.watchlist ? (
              <GoBookmarkFill />
            ) : (
              <GoBookmark />
            )}
          </div>
        </Tooltip>
        <Tooltip placement="left-start" title="افزودن به لیست">
          <div
            className="add-to-list__icon mt-2 mb-2"
            onClick={handleAddOrRemoveFromList}
          >
            <IoIosList />
          </div>
        </Tooltip>
        <Tooltip
          placement="left-start"
          title={status.rated ? "تغییر امتیاز" : "افزودن امتیاز"}
        >
          <div
            className="add-rate__icon mt-2 mb-2"
            onClick={() => addRateMedia()}
          >
            {status.rated ? <MdStarRate /> : <MdStarOutline />}
          </div>
        </Tooltip>
      </div>
      {!isLoading && isLoaded && movieDetails && (
        <div className="playback">
          <div className="side-menu__icon" onClick={toggleSideMenu}>
            <IoIosMenu />
          </div>
          <div className="playback__movie-header">
            {movieDetails.vote_average !== 0 ? (
              <div className="seriesPlayback-bottom_cover_rate">
                <div className="imdbRate">
                  <strong>
                    {Math.round(movieDetails.vote_average * 10) / 10}
                  </strong>
                  <small>/10</small>
                </div>
              </div>
            ) : null}
            <img
              className="playback__movie-image"
              src={`https://media.themoviedb.org/t/p/original${
                movieDetails.backdrop_path
                  ? movieDetails.backdrop_path
                  : movieDetails.poster_path
              }`}
              alt={`${movieDetails.title} Image`}
            />

            <div className="site-title">
              <h1 className="section-heading">Watch</h1>
              <hr className="title-hr"></hr>
            </div>
            {/* 
            <FiPlayCircle className="play-icon" /> */}
            <div className="movie-details__wrap">
              {/* <div className="movie__rate-average">
              <Link to="https://www.imdb.com/title/tt2442560/?ref_=fn_al_tt_1">
                <div className="d-flex align-items-baseline">
                  <span>8.8</span>
                  <small>/ 10</small>
                </div>
              </Link>
              <div className="stars-icon__wrapper">
                <IoStarSharp className="star-icon" />
                <IoStarSharp className="star-icon" />
                <IoStarSharp className="star-icon" />
                <IoStarSharp className="star-icon" />
                <IoStarSharp className="star-icon" />
              </div>
            </div> */}
              <div className="d-flex flex-column align-items-center">
                <span className="movie-english-title">
                  {movieDetails.title}
                </span>
                <span className="movie-persian-title">
                  {movieDetails.tagline}
                </span>
              </div>
            </div>
          </div>
          <div className="playback-content">
            <CenteredTabs activeTab={activeTab} handleTabClick={handleTabClick}>
              <Tab label="درباره‌ی فیلم" />
              <Tab label="فیلم‌های پیشنهادی" />
              <Tab label="دیدگاه‌ها" />
            </CenteredTabs>
            {activeTab === 0 && (
              <div className="playback-movie__footer">
                <div className="trailer-infos">
                  <div className="info">
                    <div className="info-title">کارگردان</div>
                    <div className="info-content">{movieDirector}</div>
                    <Tooltip title={"تماشای آنلاین"} placement="right-start">
                      <div>
                        <FaChromecast
                          className="movie-cast"
                          onClick={() => setShowProvidersModal(true)}
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="info flex-grow-1 align-items-start">
                    <div className="info-title">ستارگان</div>
                    <div className="info-content">
                      {movieCast.slice(0, 4).map((star) => (
                        <span key={star.id} className="movie_actor">
                          {star.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-title">سال</div>
                    <div className="info-content">
                      {new Date(movieDetails.release_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric" }
                      )}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-title">تریلر</div>
                    <div className="info-content">
                      <Link
                        className="trailer-link"
                        to={`/movies/${movieID}/${movieDetails.title}/trailer`}
                        target="_blank"
                      >
                        Watch Trailer
                      </Link>
                    </div>
                  </div>

                  <div className="info">
                    <div className="info-title">ژانر</div>
                    <div className="info-content">
                      <div className="movie-genre">
                        {movieGenres.map((genre) => (
                          <Link
                            key={genre.id}
                            to="#"
                            className="movie__genre-item"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="info flex-grow-1 align-items-start">
                    <div className="info-title">خلاصه داستان</div>
                    <div className="info-content playback__movie-story ellipsis">
                      {movieDetails.overview}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* {activeTab === 1 && (
              <div className="playback-movie__footer">
                <div className="movie-trailer">
                  <div className="trailer-link__wrapper">
                    <Link
                      className="trailer-link"
                      to={`/movies/${movieID}/${movieDetails.title}/trailer`}
                      target="_blank"
                    >
                      Watch Trailer
                    </Link>
                  </div>
                </div>
                <div className="movie-stars">
                  <div className="movie-stars__header">
                    <AvatarGroup total={movieStars.length - 4}>
                      {movieStars.map((star) => (
                        <Tooltip key={star.id} title={star.name}>
                          <Avatar
                            alt={star.name}
                            src={`https://media.themoviedb.org/t/p/original${star.profile_path}`}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </div>
                </div>
              </div>
            )} */}

            {activeTab === 1 && (
              <div className="playback-movie__footer">
                <div className="similar-movies__wrap">
                  <div className="similar-movies__container">
                    {!isLoading && movieRecommendations.length !== 0 ? (
                      <div className="row d-flex flex-wrap">
                        {movieRecommendations.map((movie) => (
                          <MovieBox
                            key={movie.id}
                            isGrid={true}
                            isSlider={false}
                            {...movie}
                          />
                        ))}
                      </div>
                    ) : isLoaded ? (
                      <Alert
                        className="text-error"
                        variant="filled"
                        severity="error"
                      >
                        فیلمی یافت نشد
                      </Alert>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <>
                {/* <div className="playback__movie-header">
              <div className="comments__movie">
                <div className="comments__movie-wrapper p-0">
                  <ReactPlayer
                    className="comments__movie-video"
                    url="https://www.netflix.com/it-en/title/80002479"
                    width="100%"
                    height="100%"
                    playing={true}
                    controls={true}
                    light={`/images/movies/${movieDetails.cover}`}
                    onPlay={onPlayHandler}
                    onError={onErrorHandler}
                  />
                </div>
              </div>

              {!videoPlay && (
                <div className="movie-details__wrap align-items-end">
                  <div className="d-flex flex-column align-items-start">
                    <span className="movie-title">{movieDetails.title}</span>
                  </div>
                  <span className="movie-runtime">
                    {movieDetails.runtime}
                    <span className="me-1">دقیقه</span>
                  </span>
                </div>
              )}
            </div> */}
                <div className="playback-movie__footer">
                  <div className="comments-section p-4">
                    {/* Comment Form */}
                    <div className="comments-form__wrapper">
                      {/* <label className="comment__username" htmlFor="text_comments">
                    sabaaa
                  </label> */}
                      <div className="username-icon__wrapper">
                        <CiUser className="username-icon" />
                      </div>
                      <div className="reply-comment px-3">
                        <span className="comment-username">
                          {userInfos.username}
                        </span>
                      </div>
                      {/* <div className="d-flex flex-column align-items-end flex-grow-1">
                      {showReply ? (
                        <div className="reply-comment px-3 mb-3">
                          <span className="comment-username">saba</span>
                          <span className="comment-add__title">
                            ثبت نظر جدید
                          </span>
                        </div>
                      ) : (
                        <div className="w-100 d-flex flex-row-reverse align-items-center justify-content-between px-3 mb-3">
                          <div className="reply-comment">
                            <span className="comment-username">saba</span>
                            <span className="comment-add__title">
                              navaro در پاسخ به
                            </span>
                          </div>
                          <FcCancel
                            className="cancel-reply__btn"
                            onClick={() => {
                              setShowReply(true);
                            }}
                          />
                        </div>
                      )}

                      <form action="submit" className="comments-form">
                        <div className="comments__textarea-wrapper">
                          <textarea
                            ref={textareaRef}
                            name="text_comments"
                            placeholder="نظرت در مورد فیلم چیه؟"
                            className="comment__text"
                            onClick={handleChangingTextareaHeight}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="comments-form__send-btn"
                        >
                          <LuSendHorizonal className="comments-form__send-icon" />
                        </button>
                      </form>
                    </div> */}
                    </div>

                    {/* Comments List */}
                    <div className="comments-wrapper py-4">
                      {!isLoading && movieReviews.length !== 0 ? (
                        movieReviews.map((review) => (
                          <div key={review.id} className="comment-box">
                            {review.author_details.avatar_path ? (
                              <div className="username-img__wrapper">
                                <img
                                  className="username-img"
                                  src={`https://media.themoviedb.org/t/p/original${review.author_details.avatar_path}`}
                                  alt={`${
                                    review.author_details.username ||
                                    review.author
                                  } Profile Image`}
                                />
                              </div>
                            ) : (
                              <div className="username-icon__wrapper">
                                <CiUser className="username-icon" />
                              </div>
                            )}
                            <div className="comment-box__content">
                              <div className="comment-box__header pb-3 mb-3">
                                <div className="d-flex align-items-center">
                                  <div className="d-flex align-items-center">
                                    <div className="d-flex flex-column align-items-start gap-1">
                                      <div className="d-flex align-items-center gap-1">
                                        <span className="comment-box__username">
                                          {review.author_details.username ||
                                            review.author}
                                        </span>
                                        {review.author_details.rating !==
                                          null && (
                                          <div className="rating_border comment-rating">
                                            <span className="percent">%</span>
                                            {(review.author_details.rating *
                                              100) /
                                              10}
                                            <cMdStarRate className="me-2" />
                                          </div>
                                        )}

                                        {/* <strong className="comment-box__role">
                                    | کاربر
                                  </strong> */}
                                      </div>
                                      <small className="comment-box__date">
                                        {`نوشته ‌شده توسط ${
                                          review.author_details.username ||
                                          review.author
                                        } در تاریخ ${review.created_at
                                          .toString()
                                          .slice(0, 10)}`}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                {/* <button
                                  className="comment__reply-btn"
                                  onClick={() => {
                                    setShowReply(false);
                                  }}
                                >
                                  <GoReply />
                                </button> */}
                              </div>
                              <p className="comment__body">{review.content}</p>

                              {/* Replies */}
                              {/* <div className="mt-4 w-100 d-flex">
                          <div className="comment-box__reply">
                            <div className="comment-box__header pb-3 mb-3">
                              <div className="w-100 d-flex align-items-center">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center gap-1">
                                    <span className="comment-box__username">
                                      saba
                                    </span>
                                    <strong className="comment-box__role">
                                      | ادمین
                                    </strong>
                                  </div>
                                  <small className="comment-box__date">
                                    1403/06/05
                                  </small>
                                </div>
                              </div>
                            </div>
                            <p className="comment__reply-body">
                              دوشنبه‌ها پخش می‌شه
                            </p>
                          </div>
                        </div> */}
                            </div>
                          </div>
                        ))
                      ) : isLoaded ? (
                        <Alert
                          className="text-error"
                          variant="filled"
                          severity="error"
                        >
                          کامنتی برای این فیلم ثبت نشده است
                        </Alert>
                      ) : null}
                      {/* {totalPages > 1 && (
                    <div className="pagination rtl">
                      {currentPage !== 1 && (
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          قبلی
                        </button>
                      )}
                      <span>
                        صفحه {currentPage} از {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        بعدی
                      </button>
                    </div>
                  )} */}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <BottomBar activeBottom="" />
    </>
  );
}

export default PlaybackPage;
