import React from "react";
import { Link } from "react-router-dom";
import "./PopularMovieBox.css";

function PopularMovieBox(props) {
  return (
    <div className="popular-movie__box">
      <Link className="popular-movie__link" to="#">
        <img
          className="popular-movie__img"
          src={`images/movies/${props.image}`}
          alt="popular movie image"
        />
      </Link>
    </div>
  );
}

export default PopularMovieBox;
