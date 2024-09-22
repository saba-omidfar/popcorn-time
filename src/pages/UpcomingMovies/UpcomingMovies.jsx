import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

export default function UpcomingMovies() {
  return (
    <>
      <MovieShowFilter
        category="movie"
        path="upcoming"
        genreFilter={null}
        pageTitle="جدیدترین فیلم‌ها"
      />
      <BottomBar />
    </>
  );
}
