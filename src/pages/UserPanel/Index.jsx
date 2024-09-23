import { Link, useNavigate } from "react-router-dom";

import BottomBar from "../../Components/BottomBar/BottomBar";
import IndexBox from "../UserPanel/Components/IndexBox/IndexBox";
import SignIn from "../SignIn/SignIn";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

import "./Index.css";

import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";
import { useEffect } from "react";

export default function Index() {
  const { sessionId, userInfos, logout } = useSession();
  const { guestSessionId, logoutGuest, isGuest } = useGuestSession();
  const navigate = useNavigate();

  useEffect(() => {
    isGuest();
  }, []);

  return (
    <>
      {!sessionId && !guestSessionId ? (
        <SignIn />
      ) : (
        <div className="user_dashbord">
          <div className="user_dashbord__header">
            <span className="user_dashbord__title">پروفایل</span>
            <Link to="/">
              <IoArrowBackCircleOutline className="category-back__icon" />
            </Link>
          </div>
          <div className="d-flex w-100 justify-content-center align-items-center">
            <div className="user_dashbord_image__wrapper">
              <img
                className="user_dashbord_image"
                src={
                  "./images/no-profile.png"
                  // sessionId && userInfos.avatar.tmdb.avatar_path
                  //   ? `https://image.tmdb.org/t/p/w500${userInfos.avatar.tmdb.avatar_path}`
                  //   : "./images/no-profile.png"
                }
                alt={
                  sessionId
                    ? `${userInfos.username} Image`
                    : guestSessionId
                    ? `Guest User Image`
                    : `User Image`
                }
              />
            </div>
          </div>
          {sessionId ? (
            <div className="user_dashbord__username">
              {/* <AiOutlineEdit
                className="user_dashbord__icon ms-3"
                onClick={() => navigate("setting")}
              /> */}
              {userInfos.username}
            </div>
          ) : (
            guestSessionId && (
              <div className="username pt-3 pb-3">Guest User</div>
            )
          )}
          <ul className="dashboard-links">
            <IndexBox href="/" title="خانه" />
            <IndexBox href="/my-account" title="پیشخوان" />
            <IndexBox href="rated" title="امتیازهای من" />
            <IndexBox href="lists" title="لیست‌ها" isGuest={isGuest()} />
            <IndexBox href="watchlist" title="لیست تماشا" isGuest={isGuest()} />
            <IndexBox
              href="favorite"
              title="لیست علاقه‌مندی‌ها"
              isGuest={isGuest()}
            />
            {/* <IndexBox href="comments" title="آخرین نظرات" isGuest={isGuest()} /> */}
            {/* <IndexBox
              href="setting"
              title="ویرایش پروفایل"
              isGuest={isGuest()}
            /> */}
            <IndexBox
              href={isGuest() ? "#" : "/"}
              title="خروج از حساب"
              onClick={isGuest() ? () => logoutGuest() : () => logout()}
            />
          </ul>
          <BottomBar activeBottom="user" />
        </div>
      )}
    </>
  );
}
