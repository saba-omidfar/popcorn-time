import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";


export default function TopRatedMovies() {

  return (
    <>
      <MovieShowFilter category="movie" path="top_rated" genreFilter={null} pageTitle="پرفروش‌ترین فیلم‌ها" />
      <BottomBar />
    </>
  );
}
