import { useState } from "react";

import { IoIosMenu } from "react-icons/io";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import BottomBar from "../../Components/BottomBar/BottomBar";
import MovieBox from "../../Components/MovieBox/MovieBox";
import SideMenu from "../../Components/SideMenu/SideMenu";

import "./Recommended.css";

export default function Recommended() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className="favorites">
        <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
        <div className="favorite-results__header">
          <span className="favorite-results__title">Recommended For You</span>
          <IoArrowBackCircleOutline className="favorite-back__icon" />
        </div>
        <div className="favorite-result__view-toggle">
          <IoGridOutline className="favorite-result__view-icon" />
          <IoListOutline className="favorite-result__view-icon" />
        </div>
        <div className="recommended-movies__wrapper">
          <div className="row">
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
            <MovieBox
              title="Handmaid Tale"
              image="handmaids_tale.jpg"
              isSlider={false}
            />
          </div>
        </div>
      </div>
      <BottomBar activeBottom="" />
    </>
  );
}
