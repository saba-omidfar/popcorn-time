import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

import "./Movies.css";

export default function Movies() {
  return (
    <>
      <MovieShowFilter
        category="movie"
        genreFilter={null}
        pageTitle="فیلم‌ها"
      />
      <BottomBar />
    </>
  );
}
