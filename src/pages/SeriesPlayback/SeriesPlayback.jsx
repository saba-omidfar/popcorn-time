import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Tab, Alert, Tooltip } from "@mui/material";

import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";
import { useMediaStatus } from "../../hooks/useMediaStatus";

import RatingSlider from "../../Components/RatingSlider/RatingSlider";
import Providers from "../../Components/Providers/Providers";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";
import BottomBar from "../../Components/BottomBar/BottomBar";
import CenteredTabs from "../../Components/CenteredTab/CenteredTab";
import { showToastSuccess, showToastError } from "../../Components/Toast/Toast";

import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { IoIosList, IoIosMenu } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FaChromecast } from "react-icons/fa";
import { MdStarRate, MdStarOutline } from "react-icons/md";

function SeriesPlayback() {
  const { seriesID } = useParams();

  const { userInfos, sessionId, accountId, apiKey, apiReadAccessToken } =
    useSession();
  const { guestSessionId, isGuest } = useGuestSession();
  const { status } = useMediaStatus("tv", seriesID);

  const episodesListRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [videoPlay, setVideoPlay] = useState(false);

  const [seriesDetails, setSeriesDetails] = useState({});
  const [numberOfSeasons, setNumberOfSeasons] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState("01");
  const [selectedEpisodeDetails, setSelectedEpisodeDetails] = useState({});
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]);
  const [seriesTrailer, setSeriesTrailer] = useState({});
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [seriesRecommendations, setSeriesRecommendations] = useState([]);
  const [seriesReviews, setSeriesReviews] = useState([]);
  const [seriesCast, setSeriesCast] = useState([]);
  const [seriesDirector, setSeriesDirector] = useState("");
  const [showEpisodesList, setShowEpisodesList] = useState(false);
  const [showList, setShowList] = useState(false);

  const [addToFavoriteLoading, setAddToFavoriteLoading] = useState(false);
  const [addToWathlistLoading, setAddToWatchlistLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProvidersModal, setShowProvidersModal] = useState(false);

  const getSeriesDetails = async () => {
    const seriesDetailsRes = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return seriesDetailsRes.json();
  };

  const getAllSeasons = async () => {
    const allSeasonRes = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/season/${seasonNumber}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return allSeasonRes.json();
  };

  const getSeriesVideos = async () => {
    const seriesVideosRes = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/videos`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return seriesVideosRes.json();
  };

  const getSeriesRecommendations = async () => {
    const seriesRecommendationRes = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/similar`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return seriesRecommendationRes.json();
  };

  const getSeriesCredits = async () => {
    const seriesCreditsRes = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/credits`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return seriesCreditsRes.json();
  };

  const fetchAllData = () => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    Promise.all([
      getSeriesDetails(),
      getAllSeasons(),
      getSeriesVideos(),
      getSeriesRecommendations(),
      getSeriesCredits(),
    ])
      .then(
        ([
          seriesDetailsData,
          seriesSeasonsData,
          seriesVideosData,
          seriesRecommendationsData,
          seriesCreditsData,
        ]) => {
          setSeriesDetails(seriesDetailsData);
          setSeriesGenres(seriesDetailsData.genres);
          setNumberOfSeasons(seriesDetailsData.number_of_seasons);
          setNumberOfEpisodes(seriesDetailsData.number_of_episodes);

          setSeasonEpisodes(seriesSeasonsData.episodes);
          setSelectedEpisodeDetails(seriesSeasonsData.episodes[0]);

          const officialTrailer = seriesVideosData.results
            ? seriesVideosData.results.filter(
                (video) => video.name === "Official Trailer"
              )
            : null;

          officialTrailer ? setSeriesTrailer(officialTrailer[0]) : null;

          setSeriesRecommendations(seriesRecommendationsData.results);

          setSeriesCast(seriesCreditsData.cast);

          const director = seriesCreditsData.crew.find(
            (member) => member.job === "Director"
          );
          setSeriesDirector(director ? director.original_name : "--");
        }
      )
      .catch((err) => {
        console.error("Error fetching series data:", err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  useEffect(() => {
    fetchAllData();
  }, [seriesID, seasonNumber]);

  const getAllSeriesReviews = (page = 1) => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    fetch(
      `https://api.themoviedb.org/3/tv/${seriesID}/reviews?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((tvReviewsData) => {
        setSeriesReviews(tvReviewsData.results);
        setTotalPages(tvReviewsData.total_pages);
        setCurrentPage(page);
      })
      .catch((err) => {
        console.log("Error fetching movie reviews data:", err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoaded(true);
        NProgress.done();
      });
  };

  useEffect(() => {
    getAllSeriesReviews(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!textareaRef.current.contains(event.target)) {
  //       textareaRef.current.style.height = "18px";
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [textareaRef]);

  const toggleCurrentEpisode = () => {
    setShowEpisodesList((prevState) => !prevState);
  };

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
            ? "از لیست علاقه‌مندی حذف شد"
            : "به لیست علاقه‌مندی اضافه شد"
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
    if (!accountId || !apiReadAccessToken) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

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
      return data.item_present; // برمی‌گرداند که آیا سریال در لیست هست یا نه
    } catch (error) {
      console.error("Error checking movie in list:", error);
    }
  };

  // const handleAddOrRemoveFromList = async () => {
  //   if (isGuest()) {
  //     showToastError("حساب مهمان قابلیت افزودن یا حذف از لیست را ندارد");
  //     return;
  //   }

  //   if (!sessionId) {
  //     showToastError("برای افزودن به لیست وارد شوید");
  //     return;
  //   } else {
  //     const allLists = await getLists();

  //     if (!allLists || allLists.length === 0) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "شما هنوز هیچ لیستی نساخته‌اید.",
  //         text: " آیا می‌خواهید یک لیست جدید بسازید؟",
  //         showCancelButton: true,
  //         confirmButtonText: "ساخت لیست جدید",
  //         cancelButtonText: "خیر",
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           window.location.href = "/my-account/lists";
  //         }
  //       });
  //       return;
  //     }

  //     const inputOptions = allLists.reduce((acc, list) => {
  //       acc[list.id] = list.name;
  //       return acc;
  //     }, {});

  //     const { value: selectedListId } = await Swal.fire({
  //       title: "لیست مورد نظر خود را انتخاب کنید",
  //       input: "select",
  //       inputOptions,
  //       inputPlaceholder: "همه‌ی لیست‌ها",
  //       showCancelButton: true,
  //       inputValidator: (value) => {
  //         if (!value) {
  //           return "لطفا یک لیست را انتخاب کنید!";
  //         }
  //       },
  //     });

  //     if (selectedListId) {
  //       const movieId = seriesDetails.id;
  //       const isMovieInList = await checkMovieInList(movieId, selectedListId);

  //       if (isMovieInList) {
  //         Swal.fire({
  //           title: "این سریال در لیست انتخابی شما وجود دارد",
  //           text: "آیا می‌خواهید آن را از لیست حذف کنید؟",
  //           icon: "warning",
  //           showCancelButton: true,
  //           confirmButtonText: "بله",
  //           cancelButtonText: "خیر",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             removeMovieFromList(selectedListId, movieId);
  //           }
  //         });
  //       } else {
  //         addMovieToList(selectedListId, movieId);
  //       }
  //     }
  //   }
  // };

  // const addMovieToList = async (listId, movieId) => {
  //   if (!sessionId || !accountId) {
  //     showToastError("برای افزودن به لیست باید وارد شوید");
  //     return;
  //   }
  //   try {
  //     const response = await fetch(
  //       `https://api.themoviedb.org/3/list/${listId}/add_item`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${apiReadAccessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           media_id: movieId,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     showToastSuccess("سریال به لیست اضافه شد");
  //   } catch (error) {
  //     showToastError("خطای سیستم!");
  //     console.error("Error adding movie to list:", error);
  //   }
  // };

  // const removeMovieFromList = async (listId, movieId) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.themoviedb.org/3/list/${listId}/remove_item`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${apiReadAccessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           media_id: movieId,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     showToastSuccess("سریال از لیست حذف شد");
  //   } catch (error) {
  //     showToastError("خطای سیستم!");
  //     console.error("Error removing movie from list:", error);
  //   }
  // };

  //Inside your component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        episodesListRef.current &&
        !episodesListRef.current.contains(event.target)
      ) {
        const isClickInside =
          episodesListRef.current.contains(event.target) ||
          event.target.closest(".current-episode");

        if (!isClickInside) {
          setShowEpisodesList(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEpisodesList]);

  const onPlayHandler = () => {
    setVideoPlay(true);
  };

  const onErrorHandler = () => {
    setVideoPlay(true);
  };

  const handleTabClick = (newTab) => {
    setActiveTab(newTab);
  };

  const removeMovieFromRatedMovies = async (mediaType, mediaId) => {
    if (!sessionId || !accountId) {
      showToastError("برای حذف امتیاز باید وارد شوید");
      return;
    }

    if (status.rated === false || status.rated.value === 0) {
      showToastError("هنوز امتیازی به سریال نداده‌اید");
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

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const addRateMedia = () => {
    if (!sessionId && !guestSessionId) {
      showToastError("برای امتیازدهی وارد شوید");
      return;
    } else {
      setShowRatingModal(true);
    }
  };

  return (
    <>
      <div
        className={`overlay ${
          showRatingModal || showProvidersModal ? "active" : ""
        }`}
      ></div>

      {showProvidersModal && (
        <Providers
          mediaType="tv"
          mediaId={seriesID}
          mediaDetails={seriesDetails}
          setShowProvidersModal={setShowProvidersModal}
        />
      )}

      {showRatingModal && (
        <RatingSlider
          mediaType="tv"
          mediaId={seriesDetails.id}
          mediaName={seriesDetails.title}
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
            className="add-to-favorite__icon mt-3 mb-3"
            onClick={() => toggleFavorite(seriesDetails.id, "tv")}
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
            className="add-to-watchlist__icon mt-3 mb-3"
            onClick={() => toggleWatchlist(seriesDetails.id, "tv")}
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

        {/* <Tooltip placement="left-start" title="افزودن به لیست">
          <div
            className="add-to-list__icon mt-2 mb-2"
            onClick={handleAddOrRemoveFromList}
          >
            <IoIosList />
          </div>
        </Tooltip> */}

        <Tooltip
          placement="left-start"
          title={status.rated.value ? "تغییر امتیاز" : "افزودن امتیاز"}
        >
          <div
            className="add-rate__icon mt-3 mb-3"
            onClick={() => addRateMedia()}
          >
            {status.rated.value ? <MdStarRate /> : <MdStarOutline />}
          </div>
        </Tooltip>
      </div>
      {!isLoading && isLoaded && seriesDetails && (
        <div className="playback">
          <div className="side-menu__icon" onClick={toggleSideMenu}>
            <IoIosMenu />
          </div>

          {activeTab !== 3 ? (
            <div className="playback__movie-header">
              {seriesDetails.vote_average !== 0 ? (
                <div className="seriesPlayback-bottom_cover_rate">
                  <div className="imdbRate">
                    <strong>{Math.round(seriesDetails.vote_average)}</strong>
                    <small>/10</small>
                  </div>
                </div>
              ) : null}

              <img
                className="playback__movie-image"
                src={`https://media.themoviedb.org/t/p/original${
                  seriesDetails.backdrop_path
                    ? seriesDetails.backdrop_path
                    : seriesDetails.poster_path
                }`}
                alt={`${seriesDetails.title} Image`}
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
                    {seriesDetails.title || seriesDetails.name}
                  </span>
                  <span className="movie-persian-title">
                    {seriesDetails.tagline}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="playback__movie-header" style={{ zIndex: "2px" }}>
              <div className="comments__movie">
                <div className="comments__movie-wrapper p-0">
                  <ReactPlayer
                    className="comments__movie-video"
                    url="https://www.netflix.com/it-en/title/80002479"
                    width="100%"
                    height="100%"
                    playing={true}
                    controls={true}
                    light={
                      selectedEpisodeDetails.still_path !== null
                        ? `https://media.themoviedb.org/t/p/original${selectedEpisodeDetails.still_path}`
                        : "/images/movies/no-image.png"
                    }
                    onPlay={onPlayHandler}
                    onError={onErrorHandler}
                  />
                  {/* <YouTubeSearch searchQuery={selectedEpisodeDetails.id} /> */}
                </div>
              </div>

              {!videoPlay && (
                <div
                  className="movie-details__wrap justify-content-between align-items-center"
                  style={{ bottom: "10px" }}
                >
                  <div className="d-flex flex-column align-items-start">
                    <div className="movie-content">
                      <span className="movie-seasons">
                        {selectedEpisodeDetails.name}
                      </span>
                    </div>
                  </div>
                  <div
                    className="current-episode"
                    onClick={() => toggleCurrentEpisode()}
                  >
                    <div className="w-100">
                      <span>
                        {`S${seasonNumber.toString().padStart(2, "0")}`}
                        {" : "}
                        {`E${selectedEpisode.toString().padStart(2, "0")}`}
                      </span>
                      <TiArrowSortedDown className="current-apisode__arrow-down" />
                    </div>
                    {showEpisodesList && (
                      <div
                        className="seriesPlayback__episodes"
                        ref={episodesListRef}
                      >
                        {seasonEpisodes.map((episode) => (
                          <Link
                            className="seriesPlayback__episode-item"
                            key={episode.id}
                            to="#"
                            onClick={() => {
                              setShowEpisodesList(false);
                              setSelectedEpisodeDetails(episode);
                              setSelectedEpisode(episode.episode_number);
                              toggleCurrentEpisode();
                            }}
                          >
                            {`S${seasonNumber.toString().padStart(2, "0")}`}
                            {" : "}
                            {`E${episode.episode_number
                              .toString()
                              .padStart(2, "0")}`}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="playback-content">
            <CenteredTabs activeTab={activeTab} handleTabClick={handleTabClick}>
              <Tab label="درباره‌ی سریال" />
              <Tab label="فصل‌ها" />
              <Tab label="سریال‌های پیشنهادی" />
              <Tab label="دیدگاه‌ها" />
            </CenteredTabs>

            {activeTab === 0 && (
              <div className="playback-movie__footer">
                <div className="trailer-infos">
                  <div className="info">
                    <div className="info-title">کارگردان</div>
                    <div className="info-content">{seriesDirector}</div>
                  </div>
                  <div className="info flex-grow-1 align-items-start">
                    <div className="info-title">ستارگان</div>
                    <div className="info-content">
                      {seriesCast.slice(0, 4).map((star) => (
                        <span key={star.id} className="movie_actor">
                          {star.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-title">سال</div>
                    <div className="info-content">
                      {new Date(
                        seriesDetails.release_date ||
                          seriesDetails.first_air_date
                      ).toLocaleDateString("en-US", { year: "numeric" })}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-title">تریلر</div>
                    <div className="info-content">
                      <Link
                        className="trailer-link"
                        to={`/series/${seriesID}/${seriesDetails.name}/trailer`}
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
                        {seriesGenres.map((genre) => (
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
                      {seriesDetails.overview}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="playback-movie__footer">
                <div className="episodes__wrapper">
                  <div className="d-flex w-100 align-items-center justify-content-between">
                    <Tooltip title="تماشای آنلاین" placement="right-start">
                      <span>
                        <FaChromecast
                          className="episode-cast"
                          onClick={() => setShowProvidersModal(true)}
                        />
                      </span>
                    </Tooltip>
                    {/* Season selection */}
                    <div className="seasons-select">
                      <div
                        className="seasons-select__title"
                        onClick={() => setShowList(true)}
                      >
                        <span>{`Season ${selectedSeason
                          .toString()
                          .padStart(2, "0")}`}</span>
                        <TiArrowSortedDown className="seasons-select__icon" />
                      </div>
                      {showList && (
                        <ul
                          className="seasons__selection-list"
                          onMouseLeave={() => setShowList(false)}
                        >
                          {Array.from({ length: numberOfSeasons }, (_, i) => (
                            <li
                              key={i}
                              className="seasons__selection-item"
                              onClick={() => {
                                setSelectedSeason(i + 1);
                                setSeasonNumber(i + 1);
                                setShowList(false);
                              }}
                            >
                              {`S${(i + 1).toString().padStart(2, "0")}`}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Render episodes based on selected season */}
                  <div className="episodes">
                    {seasonEpisodes.map((episode) => (
                      <div
                        key={episode.id}
                        className="episode"
                        onClick={() => {
                          setSelectedEpisode(episode.episode_number);
                          setSelectedEpisodeDetails(episode);
                        }}
                      >
                        {episode.still_path !== null ? (
                          <img
                            className="playback__episode-image"
                            src={`https://media.themoviedb.org/t/p/original${episode.still_path}`}
                            alt={`${episode.name} Image`}
                          />
                        ) : (
                          <img
                            className="playback__episode-image"
                            src="/images/movies/no-image.png"
                            alt="No Image"
                          />
                        )}

                        <div className="episode-details">
                          <span>
                            {`S${seasonNumber.toString().padStart(2, "0")}`}
                            {" : "}
                            {`E${episode.episode_number
                              .toString()
                              .padStart(2, "0")}`}
                          </span>
                          <span
                            className="ellipsis"
                            style={{ width: "200px", textAlign: "right" }}
                          >
                            {episode.name}
                          </span>
                          {episode.runtime && (
                            <span className="episode-duration">
                              {episode.runtime}
                              <span className="me-2">دقیقه</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="playback-movie__footer">
                <div className="similar-movies__wrap">
                  <div className="similar-movies__container">
                    {seriesRecommendations.length ? (
                      <div className="row d-flex flex-wrap">
                        {seriesRecommendations.map((movie) => (
                          <MovieBox
                            key={movie.id}
                            isGrid={true}
                            isSlider={false}
                            {...movie}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-danger">سریالی یافت نشد</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="playback-movie__footer">
                <div className="comments-section p-4">
                  {/* Comment Form */}
                  <div className="comments-form__wrapper">
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
                    {!isLoading && seriesReviews.length !== 0 ? (
                      seriesReviews.map((review) => (
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
                        کامنتی برای این سریال ثبت نشده است
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
            )}
          </div>
        </div>
      )}

      <BottomBar activeBottom="" />
    </>
  );
}

export default SeriesPlayback;
