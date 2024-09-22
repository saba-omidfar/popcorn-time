import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function TopRatedSeries() {
  return (
    <>
      <MovieShowFilter
        category="tv"
        path="top_rated"
        genreFilter={null}
        pageTitle="پرفروش‌ترین سریال‌ها"
      />
      <BottomBar />
    </>
  );
}
