import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Watchlist.css";

import { useSession } from "../../../../Contexts/sessionContext";

import BottomBar from "../../../../Components/BottomBar/BottomBar";
import SideMenu from "../../../../Components/SideMenu/SideMenu";
import Pagination from "../../../../Components/Pagination/Pagination";
import MovieBoxBtn from "../../../../Components/MovieBoxBtn/MovieBoxBtn";

import { showToastSuccess } from "../../../../Components/Toast/Toast";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Swal from "sweetalert2";

import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";

export default function Watchlist() {
  const navigate = useNavigate();

  const { apiKey, sessionId, accountId, apiReadAccessToken } = useSession();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [moviesDisplayType, setMoviesDisplayType] = useState("grid");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const getWatchlistMoviesAndTvs = () => {
    if (!accountId || !apiReadAccessToken) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    const movieFetch = fetch(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const tvFetch = fetch(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?language=en-US&page=${currentPage}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    Promise.all([movieFetch, tvFetch])
      .then(async ([movieRes, tvRes]) => {
        if (movieRes.ok && tvRes.ok) {
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();

          const combinedResults = [...movieData.results, ...tvData.results];

          combinedResults.sort((a, b) =>
            new Date(a.created_at) > new Date(b.created_at) ? 1 : -1
          );

          setMovies(combinedResults);
          setTotalPages(Math.max(movieData.total_pages, tvData.total_pages));
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

  useEffect(() => {
    getWatchlistMoviesAndTvs();
  }, [currentPage, accountId]);

  const deleteMoviefromWatchlist = async (mediaId) => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    try {
      const result = await Swal.fire({
        title: "آیا از حذف فیلم اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله",
        cancelButtonText: "خیر",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://api.themoviedb.org/3/account/${accountId}/watchlist?api_key=${apiKey}&session_id=${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              media_type: "movie",
              media_id: mediaId,
              watchlist: false,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToastSuccess("فیلم از لیست تماشا حذف شد");
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== mediaId)
        );
      }
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
      NProgress.done();
    }
  };

  const deleteTVShowFromWatchlist = async (mediaId) => {
    setIsLoading(true);
    setIsLoaded(false);
    NProgress.start();

    try {
      const result = await Swal.fire({
        title: "آیا از حذف سریال اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله",
        cancelButtonText: "خیر",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://api.themoviedb.org/3/account/${accountId}/watchlist?api_key=${apiKey}&session_id=${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              media_type: "tv",
              media_id: mediaId,
              watchlist: false,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToastSuccess("سریال از لیست تماشا حذف شد");
        setMovies((prevMovies) => prevMovies.filter((tv) => tv.id !== mediaId));
      }
    } catch (error) {
      console.error("Error removing TV show from watchlist:", error);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
      NProgress.done();
    }
  };

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      {isLoaded && (
        <div className={`favorite ${sideMenuOpen && "blur-background "}`}>
          <div className="side-menu__icon" onClick={toggleSideMenu}>
            <IoIosMenu />
          </div>
          <div className="favorite-results__header">
            <span className="favorite-results__title">لیست تماشا</span>
            <Link to="/my-account">
              <IoArrowBackCircleOutline className="category-back__icon" />
            </Link>
          </div>

          {isLoading ? (
            <div>در حال بارگذاری...</div>
          ) : movies.length !== 0 ? (
            <>
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

              <div className="movies__wrapper mt-4 mb-4">
                <div className="row w-100 h-100">
                  {isLoaded &&
                    movies.map((movie) => (
                      <MovieBoxBtn
                        key={movie.id}
                        {...movie}
                        isGrid={moviesDisplayType === "grid"}
                        deleteMoviefromWatchlist={deleteMoviefromWatchlist}
                        deleteTVShowFromWatchlist={deleteTVShowFromWatchlist}
                      />
                    ))}
                </div>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="alert alert-danger">
              هنوز محتوایی به لیست تماشا شما اضافه نشده است
            </div>
          )}
        </div>
      )}
      <BottomBar activeBottom="user" />
    </>
  );
}
