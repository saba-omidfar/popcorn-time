import MovieShowFilter from "../../Components/MovieShowFilter/MovieShowFilter";
import BottomBar from "../../Components/BottomBar/BottomBar";

import "./Series.css";

export default function Series() {

  return (
    <>
      <MovieShowFilter category="tv" genreFilter={null} pageTitle="سریال‌ها" />
      <BottomBar />
    </>
  );
}
