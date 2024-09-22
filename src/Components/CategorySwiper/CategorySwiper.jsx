import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import { Swiper, SwiperSlide } from "swiper/react";
import MovieBox from "../MovieBox/MovieBox";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";

import "./CategorySwiper.css";

import { FreeMode, Scrollbar, Mousewheel, Autoplay } from "swiper/modules";
import { PiX } from "react-icons/pi";

function CategorySwiper({ title }) {
  const options = {
    items: 3,
    loop: true,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    // stagePadding: 2,
    nav: false,
    rewind: false,
    dots: false,
    lazyLoad: true,
  };

  return (
    <>
      <div className="category">
        <div className="category-header">
          <span className="category-title">{title}</span>
        </div>
        {/* <Swiper
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          direction={"horizontal"}
          freeMode={true}
          scrollbar={true}
          mousewheel={true}
          draggable={true}
          grabCursor={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          className="mySwiper"
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="ندیمه"
              image="handmaids_tale.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="بوجک"
              image="bojack.png"
            />
          </SwiperSlide>
          <SwiperSlide>
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="پیکی بلایندرز"
              image="PB6_EP01_SC28-32_MS_15.02.21__1995-scaled.jpg"
            />
          </SwiperSlide>
        </Swiper> */}
        <OwlCarousel
          className="owl-theme section"
          loop
          margin={20}
          autoplay
          {...options}
        >
          {/* 1 */}
          <div className="review item">
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="ندیمه"
              image="handmaids_tale.jpg"
            />
          </div>

          {/* 2 */}
          <div className="review item">
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="بوجک"
              image="bojack.png"
            />
          </div>

          {/* 3 */}
          <div className="review item">
            <MovieBox
              isGrid={true}
              isSlider={true}
              title="پیکی بلایندرز"
              image="PB6_EP01_SC28-32_MS_15.02.21__1995-scaled.jpg"
            />
          </div>
        </OwlCarousel>
      </div>
    </>
  );
}

export default CategorySwiper;
