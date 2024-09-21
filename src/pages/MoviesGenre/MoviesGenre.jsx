import { useParams } from "react-router-dom";

import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function MoviesGenre() {
  const { genreName } = useParams();
  return (
    <>
      <MovieShowFilter
        category="movie"
        genreFilter={genreName}
        pageTitle={genreName}
      />
      <BottomBar />
    </>
  );
}
