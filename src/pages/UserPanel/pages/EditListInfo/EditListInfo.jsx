import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Swal from "sweetalert2";

import "./EditListInfo.css";

import SideMenu from "../../../../Components/SideMenu/SideMenu";
import BottomBar from "../../../../Components/BottomBar/BottomBar";
import {
  showToastSuccess,
  showToastError,
} from "../../../../Components/Toast/Toast";

import { useSession } from "../../../../Contexts/sessionContext";

import { IoIosMenu } from "react-icons/io";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { CiViewList } from "react-icons/ci";

export default function EditListInfo() {
  const { listId } = useParams();
  const { sessionId, accountId, apiReadAccessToken } = useSession();

  const [isEditListLoading, setIsEditListLoading] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [allList, setAllList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const getListDetails = (listId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }
    NProgress.start();
    fetch(`https://api.themoviedb.org/3/list/${listId}?language=en-US&page=1`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setListName(data.name);
        setListDesc(data.description);
      })
      .catch((error) => {
        console.error("Error Get List Details:", error);
      })
      .finally(() => {
        setIsLoaded(true);
        NProgress.done();
      });
  };

  const EditList = async () => {
    setIsEditListLoading(true);
    NProgress.start();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/4/list/${listId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiReadAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            name: listName,
            description: listDesc,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      showToastSuccess("لیست با موفقیت ویرایش شد");
      setListName(data.name);
      setListDesc(data.description);
    } catch (error) {
      console.error("Error updating list:", error);
      showToastError("خطایی در ویرایش لیست رخ داد");
    } finally {
      setIsEditListLoading(false);
      NProgress.done();
    }
  };

  const getLists = async () => {
    if (!sessionId) {
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
      setAllList(data.results);
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
      NProgress.done();
    }
  };

  const removeList = async (listId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    NProgress.start();
    try {
      const result = await Swal.fire({
        title: "آیا از حذف لیست اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله",
        cancelButtonText: "خیر",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://api.themoviedb.org/3/list/${listId}`,
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

        showToastSuccess("لیست با موفقیت حذف شد");
        setAllList((prevLists) =>
          prevLists.filter((list) => list.id !== listId)
        );
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error removing list:", error);
    } finally {
      NProgress.done();
    }
  };

  const clearAllMoviesList = async (listId) => {
    if (!sessionId) {
      console.error("Account ID or API Read Access Token is missing");
      return;
    }

    NProgress.start();
    try {
      const result = await Swal.fire({
        title: "آیا از حذف همه‌ی آیتم‌ها اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله",
        cancelButtonText: "خیر",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://api.themoviedb.org/3/list/${listId}/clear?confirm=true`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiReadAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        showToastSuccess("همه‌ آیتم‌ها با موفقیت حذف شدند");
        setAllList((prevLists) =>
          prevLists.map((list) =>
            list.id === listId ? { ...list, item_count: 0 } : list
          )
        );
      }
    } catch (error) {
      showToastError("خطای سیستم!");
      console.error("Error removing All Items In list:", error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    getLists();
    getListDetails(listId);
  }, [accountId]);

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className={`lists ${sideMenuOpen && "blur-background "}`}>
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="lists-results__header">
          <span className="lists-results__title">ویرایش لیست</span>
          <Link to="/my-account">
            <IoArrowBackCircleOutline className="lists-back__icon" />
          </Link>
        </div>
        <div className="d-flex align-items-center justify-content-center flex-wrap w-100 mt-5">
          <div className="create_list">
            <form className="create-list__form" action="#">
              <div className="create-list__form-item w-100">
                <label htmlFor="useremail">عنوان لیست</label>
                <div className="form-item__input-wrapper">
                  <input
                    className="form-item__input"
                    type="text"
                    name="userlist_title"
                    id="userlist_title"
                    value={listName}
                    onChange={(event) => setListName(event.target.value)}
                  />
                </div>
              </div>
              <div className="create-list__form-item w-100">
                <label htmlFor="userlist_description">توضیحات</label>
                <div className="form-item__input-wrapper">
                  <textarea
                    className="form-item__textarea"
                    name="userlist_description"
                    id="userlist_description"
                    value={listDesc}
                    onChange={(event) => setListDesc(event.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="bottom_lists">
                <div className="create-lists__btn-wrapper">
                  <button
                    type="button"
                    name="create_list"
                    className="create-list__btn"
                    onClick={EditList}
                    disabled={isEditListLoading}
                  >
                    {!isEditListLoading ? (
                      "ویرایش لیست"
                    ) : (
                      <span className="loading-icon"></span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5">
          <div className="lists-title">لیست‌های شما</div>
          {isLoading ? (
            <span className="loading-icon"></span>
          ) : isLoaded && allList.length ? (
            allList.map((list) => (
              <div key={list.id} className="lists-container mb-4">
                <div className="lists-table">
                  <div className="tbody">
                    <div className="lists-items_row">
                      <div className="lists-items__header">
                        <div className="lists-items__header-right-side">
                          <div className="header__item-right">
                            <span className="header-label__item-right">
                              عنوان
                            </span>
                            <span className="header-value__item-right">
                              {list.name}
                            </span>
                          </div>
                        </div>
                        <div className="lists-items__header-left-side">
                          <div className="header__item-left">
                            <span className="header-label__item-left">
                              آیتم
                            </span>
                            <span className="header-value__item-left">
                              {list.item_count}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="lists-bottom-line">
                        <div className="lists-items__footer-right-side">
                          <Link
                            to={`/my-account/lists/editInfo/${list.id}`}
                            className="ms-3"
                          >
                            <CiViewList className="edit-icon" />
                            ویرایش لیست
                          </Link>
                          <div className="lists-items__footer-right-side ms-3">
                            <Link to={`/my-account/lists/editItems/${list.id}`}>
                              <GoTrash className="remove-link-icon" />
                              ویرایش آیتم‌ها
                            </Link>
                          </div>
                        </div>
                        <div
                          className="lists-items__footer-left-side"
                          onClick={() => removeList(list.id)}
                        >
                          <Link to="#" className="remove-link-btn">
                            <GoTrash className="remove-link-icon" />
                            حذف لیست
                          </Link>
                          <div
                            className="lists-items__footer-right-side ms-3"
                            onClick={() => clearAllMoviesList(list.id)}
                          >
                            <GoTrash className="remove-link-icon" />
                            حذف همه‌ی آیتم‌ها
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger">
              در حال حاضر هیچ لیستی ندارید.
            </div>
          )}
          {/* {isLoaded && allList.length ? (
            allList.map((list) => (
              <div key={list.id} className="lists-container mb-4">
                <div className="lists-table">
                  <div className="tbody">
                    <div className="lists-items_row">
                      <div className="lists-items__header">
                        <div className="lists-items__header-right-side">
                          <div className="header__item-right">
                            <span className="header-label__item-right">
                              عنوان
                            </span>
                            <span className="header-value__item-right">
                              {list.name}
                            </span>
                          </div>
                        </div>
                        <div className="lists-items__header-left-side">
                          <div className="header__item-left">
                            <span className="header-label__item-left">
                              آیتم
                            </span>
                            <span className="header-value__item-left">
                              {list.item_count}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="lists-bottom-line">
                        <div className="lists-items__footer-right-side">
                          <Link
                            to={`/my-account/lists/editInfo/${list.id}`}
                            className="ms-3"
                          >
                            <CiViewList className="edit-icon" />
                            ویرایش لیست
                          </Link>
                          <div className="lists-items__footer-right-side ms-3">
                            <Link to={`/my-account/lists/editItems/${list.id}`}>
                              <GoTrash className="remove-link-icon" />
                              ویرایش آیتم‌ها
                            </Link>
                          </div>
                        </div>
                        <div
                          className="lists-items__footer-left-side"
                          onClick={() => removeList(list.id)}
                        >
                          <Link to="#" className="remove-link-btn">
                            <GoTrash className="remove-link-icon" />
                            حذف لیست
                          </Link>
                          <div
                            className="lists-items__footer-right-side ms-3"
                            onClick={() => clearAllMoviesList(list.id)}
                          >
                            <GoTrash className="remove-link-icon" />
                            حذف همه‌ی آیتم‌ها
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger">
              در حال حاضر هیچ لیستی ندارید.
            </div>
          )} */}
        </div>
      </div>
      <BottomBar activeBottom="user" />
    </>
  );
}
