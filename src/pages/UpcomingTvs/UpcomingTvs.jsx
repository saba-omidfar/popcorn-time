import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function UpcomingTvs() {
  return (
    <>
      <MovieShowFilter
        category="tv"
        path="upcoming"
        genreFilter={null}
        pageTitle="جدیدترین سریال‌ها"
      />
      <BottomBar />
    </>
  );
}
