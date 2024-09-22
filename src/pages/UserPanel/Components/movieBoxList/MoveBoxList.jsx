import "./MovieBoxList.css";

function MovieBoxList(props) {
  return (
    <div
      to="#"
      className="col-4 cursor-pointer"
      onClick={() => props.addMovieToList(props.id)}
    >
      <div className="movie_card">
        <img
          className="img-fluid"
          src={`https://media.themoviedb.org/t/p/w300${props.poster_path}`}
          alt={props.title}
        />
        <div className="movie_card__overlay">
          <h3>
            {props.original_title ? props.original_title : props.original_name}
          </h3>
          <span className="release_date">
            {props.release_date
              ? props.release_date.slice(0, 4)
              : props.first_air_date
              ? props.first_air_date.slice(0, 4)
              : ""}
          </span>

          <span className="vote_average">
            {Math.round(props.vote_average * 10) / 10}
          </span>
          {/* <div className="d-flex align-items-center justify-content-end w-100">
            <div
              className="movie-remove__btn w-100"
              onClick={props.removeMovieFromList}
            >
              حذف از لیست
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MovieBoxList;
