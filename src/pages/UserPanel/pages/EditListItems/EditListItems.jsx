import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./EditListItems.css";

import "nprogress/nprogress.css";
import NProgress from "nprogress";

import "../../../../pages/SearchScreen/SearchScreen.css";

import SideMenu from "../../../../Components/SideMenu/SideMenu";
import BottomBar from "../../../../Components/BottomBar/BottomBar";
import MovieBoxList from "../../Components/movieBoxList/MoveBoxList";
import MovieBoxBtn from "../../../../Components/MovieBoxBtn/MovieBoxBtn";

import {
  showToastSuccess,
  showToastError,
} from "../../../../Components/Toast/Toast";

import { useSession } from "../../../../Contexts/sessionContext";

import { IoIosClose, IoIosMenu } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";

export default function EditListInfo() {
  const { listId } = useParams();

  const { accountId, sessionId, apikey, apiReadAccessToken } = useSession();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [allList, setAllList] = useState([]);
  const [listDetails, setListDetails] = useState({});
  const [listDetailsItems, setListDetailsItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [shownMovies, setShownMovies] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchValueChangeHandler = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const searchMovieAndSeries = () => {
    if (!searchValue) {
      showToastError("ابتدا فیلم یا سریال موردنظر خود را سرچ کنید");
      setShownMovies([]);
      return;
    }

    setIsSearched(true);
    NProgress.start();
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchValue}&language=en-US`,
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
        console.log("data:", data);
        
        if (data.results.length === 0) {
          showToastError("جستجوی شما با هیچ نتیجه ای همراه نبود!");
        }
        setShownMovies(data.results);
      })
      .catch((error) => {
        showToastError("خطای سیستم!");
        console.error("Error fetching movies:", error);
      })
      .finally(() => {
        setIsSearched(false);
        NProgress.done();
      });
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const getLists = async () => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    setIsLoading(true);
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
      setAllList(data.results);
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  const getListDetails = (listId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }
    setIsLoading(true);
    NProgress.start();
    fetch(`https://api.themoviedb.org/3/list/${listId}?api_key=${apikey}`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setListDetails(data);
        setListDetailsItems(data.items);
      })
      .catch((error) => {
        console.error("Error Get List Details:", error);
      })
      .finally(() => {
        setIsLoading(false);
        NProgress.done();
      });
  };

  const checkMovieInList = async (movieId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return false;
    }

    NProgress.start();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/list/${listId}?api_key=${apikey}`,
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
      const isMovieInList = data.items.some((item) => item.id === movieId);
      return isMovieInList;
    } catch (error) {
      console.error("Error checking movie in list:", error);
      return false;
    } finally {
      NProgress.done();
    }
  };

  const addMovieToList = async (movieId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    const isMovieInList = await checkMovieInList(movieId);
    if (isMovieInList) {
      showToastError("فیلم قبلاً به لیست اضافه شده است");
      return;
    }

    NProgress.start();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apikey}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_id: movieId
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      showToastSuccess("فیلم به لیست اضافه شد");
      getListDetails(listId);
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error adding movie to list:", error);
    } finally {
      NProgress.done();
    }
  };

  const removeMovieFromList = async (movieId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    const isMovieInList = await checkMovieInList(movieId);

    if (!isMovieInList) {
      showToastError("فیلم در لیست وجود ندارد");
      return;
    }

    NProgress.start();
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

      const data = await response.json();
      showToastSuccess("فیلم از لیست حذف شد");
      setListDetailsItems(prevItems => prevItems.filter((item) => item.id !== movieId));
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error removing movie from list:", error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    getLists();
    getListDetails(listId);
  }, [accountId]);

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

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`lists ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="lists-results__header">
          <span className="lists-results__title">ویرایش لیست</span>
          <Link to="/my-account/lists">
            <IoArrowBackCircleOutline className="lists-back__icon" />
          </Link>
        </div>
        <div className="search-screen__searchbar mt-3">
          <input
            type="text"
            className="search-screen__searchbar-input"
            placeholder="تنها جستجو و افزودن فیلم امکان‌پذیر است ..."
            value={searchValue}
            onChange={searchValueChangeHandler}
          />
          <IoSearch
            className="search-screen__search-icon"
            onClick={searchMovieAndSeries}
          />
        </div>

        {!isSearched && shownMovies.length ? (
          <>
            <div className="search-results__header">
              <span className="search-results__title">
                نتایج({shownMovies.length})
              </span>
              <span
                className="search-results__title"
                onClick={() => {
                  setSearchValue("");
                  setShownMovies([]);
                  setIsSearched(false);
                }}
              >
                <IoIosClose className="close-searchbox-icon" />
              </span>
            </div>
            <div className="search-results__container">
              <div className="row w-100">
                {shownMovies.map((movie) => (
                  <MovieBoxList
                    key={movie.id}
                    isGrid={true}
                    {...movie}
                    addMovieToList={addMovieToList}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        <div className="mt-5">
          <div className="lists-title">لیست شما</div>
          {listDetails ? (
            <div key={listDetails.id} className="lists-container mb-4">
              <div className="lists-table">
                <div className="tbody">
                  <div className="lists-items_row">
                    <div className="lists-items__header">
                      <div className="lists-items__header-right-side">
                        <div className="header__item-right">
                          <span className="header-label__item-right">
                            عنوان لیست
                          </span>
                          <span className="header-value__item-right">
                            {listDetails.name}
                          </span>
                        </div>
                      </div>
                      <div className="lists-items__header-left-side">
                        {/* <div className="header__item-left">
                            <span className="header-label__item-left">نوع</span>
                            <span className="header-value__item-left">
                              فیلم
                            </span>
                          </div> */}
                        <div className="header__item-left">
                          <span className="header-label__item-left">آیتم</span>
                          <span className="header-value__item-left">
                            {listDetails.items && listDetailsItems.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="lists-bottom-line justify-content-center"></div>
                    {!isLoading && !listDetailsItems.length && (
                      <div className="w-100 alert alert-danger">
                        هنوز فیلمی به لیست اضافه نکرده‌اید
                      </div>
                    )}
                    {isLoading ? (
                      <>
                        <span className="loading-icon"></span>
                      </>
                    ) : !isLoading && listDetails && listDetailsItems ? (
                      <div className="movies-list row w-100">
                        {listDetailsItems.map((listItem) => (
                          <MovieBoxBtn
                            key={listItem.id}
                            {...listItem}
                            isGrid={true}
                            movieList={true}
                            removeMovieFromList={removeMovieFromList}
                          />
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger">هنوز لیستی نساخته‌اید</div>
          )}
        </div>
      </div>
      <BottomBar activeBottom="user" />
    </>
  );
}
