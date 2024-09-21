import "./MovieBoxBtn.css";
import CustomLink from "../CustomLink/CustomLink";
import { IoIosTrash } from "react-icons/io";

function MovieBoxBtn(props) {
  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (props.original_title) {
      props.deleteMoviefromWatchlist(props.id);
    } else {
      props.deleteTVShowFromWatchlist(props.id);
    }
  };

  return props.isGrid ? (
    <CustomLink
      to={
        props.original_title
          ? `/movie/${props.id}/${props.title}`
          : `/series/${props.id}/${props.name}`
      }
      className="col-4 p-1"
    >
      <div className="movie_card">
        <img
          className="img-fluid object-fit-cover"
          src={`https://media.themoviedb.org/t/p/w300${props.poster_path}`}
          alt={props.title}
        />
        <div className="movie_card__overlay">
          {/* <h3>
            {props.original_title ? props.original_title : props.original_name}
          </h3>
          <span className="release_date">
            {props.original_title
              ? props.release_date.slice(0, 4)
              : props.first_air_date.slice(0, 4)}
          </span>
          <span className="vote_average">
            {Math.round(props.vote_average * 10) / 10}
          </span> */}

          {props.movieList ? (
            <div
              className="movie-remove__btn"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                props.removeMovieFromList(props.id);
              }}
            >
              <IoIosTrash />
              حذف
            </div>
          ) : (
            <div className="movie-remove__btn" style={{ width: "70%" }} onClick={handleDelete}>
              <IoIosTrash />
              حذف
            </div>
          )}
        </div>
      </div>
    </CustomLink>
  ) : (
    <CustomLink
      to={
        props.original_title
          ? `/movie/${props.id}/${props.title}`
          : `/series/${props.id}/${props.name}`
      }
      className="col-12"
    >
      <div className="movie_card movie-card__row p-0" id="tomb">
        <div className="info_section">
          <div className="movie_header">
            <img
              className="movie_img"
              src={`https://media.themoviedb.org/t/p/w300${props.poster_path}`}
              alt={`${props.title} Image`}
            />
            <div className="movie-infos">
              <h1>
                {props.original_title
                  ? props.original_title
                  : props.original_name}
              </h1>
              <h4>
                {props.original_title
                  ? props.release_date.slice(0, 4)
                  : props.first_air_date.slice(0, 4)}
              </h4>
              <span className="rate">
                {Math.round(props.vote_average * 10) / 10}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end w-100">
            <div
              className="movie-remove__btn"
              style={{ width: "25%" }}
              onClick={handleDelete}
            >
              <IoIosTrash />
              حذف
            </div>
          </div>
        </div>
        <div
          className="blur_back image_back"
          style={{
            background: `url("https://media.themoviedb.org/t/p/w300${
              props.backdrop_path ? props.backdrop_path : props.poster_path
            }")`,
          }}
        ></div>
      </div>
    </CustomLink>
  );
}

export default MovieBoxBtn;
