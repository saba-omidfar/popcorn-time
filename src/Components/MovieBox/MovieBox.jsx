import CustomLink from "../CustomLink/CustomLink";

import "./MovieBox.css";

import { IoIosPlay } from "react-icons/io";

function MovieBox(props) {
  let isIncategories = window.location.href.includes("categories");

  return (
    <>
      {props.isGrid ? (
        <CustomLink
          to={
            props.original_title
              ? `/movie/${props.id}/${props.title}`
              : `/series/${props.id}/${props.name}`
          }
          className="col-4"
          style={{ width: `${props.isSlider && "95%"}`, cursor: "pointer" }}
        >
          <div className="movie-card">
            <div
              className="movie-card__content"
              style={isIncategories ? { height: "125px" } : {}}
            >
              <div className="w-100 h-100 movie-card__image-wrapper">
                <img
                  className="movie-card__image"
                  src={`https://media.themoviedb.org/t/p/w300_and_h450_multi_faces/${props.poster_path}`}
                  alt={`${props.title || props.name} Image`}
                />
              </div>
              <div className="movie-card__play-btn">
                <IoIosPlay className="movie-card__play-icon" />
              </div>
              {props.vote_average !== 0.0 ? (
                <div className="bottom_cover_rate">
                  <div className="imdbRate">
                    <strong>{Math.round(props.vote_average * 10) / 10}</strong>
                    <small>/10</small>
                  </div>
                </div>
              ) : null}
            </div>
            <span className="movie-card__title">
              {props.title || props.name}
            </span>
          </div>
        </CustomLink>
      ) : (
        <CustomLink
          to={
            props.original_title
              ? `/movie/${props.id}/${props.title}`
              : `/series/${props.id}/${props.name}`
          }
          className="col-12 my-2"
          style={{ cursor: "pointer" }}
        >
          <div className="movie-card__wrapper" style={{ height: "100px" }}>
            <div className="col-8 h-100">
              <div className="d-flex flex-column align-items-end me-3 p-3 h-100">
                <span className="movie-card__title-list">
                  {props.original_title || props.original_name}
                </span>
                <div className="movie__storyline mt-4">{props.overview}</div>
              </div>
            </div>
            <div className="col-4 px-2 h-100">
              <div className="movie-card h-100 mb-0">
                <div className="movie-card__content h-100">
                  <div className="w-100 h-100 movie-card__image-wrapper">
                    <img
                      className="movie-card__image"
                      src={`https://media.themoviedb.org/t/p/w300${props.poster_path}`}
                      alt="movie image"
                    />
                  </div>
                  <div className="movie-card__play-btn">
                    <IoIosPlay className="movie-card__play-icon" />
                  </div>
                  {props.vote_average !== 0.0 ? (
                    <div className="bottom_cover_rate">
                      <div className="imdbRate">
                        <strong>
                          {Math.round(props.vote_average * 10) / 10}
                        </strong>
                        <small>/10</small>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </CustomLink>
      )}
    </>
  );
}

export default MovieBox;
