import { useParams } from "react-router-dom";

import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function SeriesGenre() {
  const { genreName } = useParams();
  return (
    <>
      <MovieShowFilter
        category="tv"
        genreFilter={genreName}
        pageTitle={genreName}
      />
      <BottomBar />
    </>
  );
}
