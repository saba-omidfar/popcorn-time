import { IoArrowBackCircleOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import "./Profile.css";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function Profile() {
  return (
    <>
      <div className="profile">
        <div className="favorite-results__header">
          <span className="favorite-results__title">Profile</span>
          <IoArrowBackCircleOutline className="favorite-back__icon" />
        </div>
        <div className="user-image__wrapper">
          <img
            className="user-image"
            src="images/user/profile.png"
            alt="User"
          />
        </div>
        <div className="d-flex align-items-center">
          <AiOutlineEdit className="user-image__edit-icon" />
          <div className="username me-2">Fester Adams</div>
        </div>
        <ul className="side-menu__wrapper">
          <div className="side-menu__category-item">
            <span className="section-title">Settings</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Favorites</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Activity</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Data Server</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Language</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Notifications</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title">Share</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title section-title__underline">Support</span>
            <span className="side-menu__category-sub-item">Help Center</span>
            <span className="side-menu__category-sub-item">Reposrt a Problem</span>
          </div>
          <div className="side-menu__category-item">
            <span className="section-title section-title__underline">About</span>
            <span className="side-menu__category-sub-item">Privacy</span>
            <span className="side-menu__category-sub-item">Terms Of Use</span>
          </div>
        </ul>
      </div>
      <BottomBar activeBottom="user" />
    </>
  );
}
