import MoviePlayback from "./pages/MoviePlayback/MoviePlayback";
import SeriesPlayback from "./pages/SeriesPlayback/SeriesPlayback";
import HomePage from "./pages/HomePage/HomePage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import SearchScreen from "./pages/SearchScreen/SearchScreen";
import Categories from "./pages/Categories/Categories";
import Recommended from "./pages/Recommended/Recommended";
import Profile from "./pages/Profile/Profile";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series";
import TopRatedSeries from "./pages/TopRatedSeries/TopRatedSeries";
import TopRatedMovies from "./pages/TopRatedMovies/TopRatedMovies";
import UpcomingMovies from "./pages/UpcomingMovies/UpcomingMovies";
import UpcomingTvs from "./pages/UpcomingTvs/UpcomingTvs";
import MoviesGenre from "./pages/MoviesGenre/MoviesGenre";
import SeriesGenre from "./pages/SeriesGenre/SeriesGenre";
import Contactus from "./pages/Contactus/Contactus";
import SeriesTrailerPage from "./Components/SeriesTrailerPage/SeriesTrailerPage";
import MoviesTrailerPage from "./Components/MoviesTrailerPage/MoviesTrailerPage";

// User Components
import Watchlist from "./pages/UserPanel/pages/Watchlist/Watchlist";
import Favorite from "./pages/UserPanel/pages/Favorite/Favorite";
import Lists from "./pages/UserPanel/pages/Lists/Lists";
import EditListInfo from "./pages/UserPanel/pages/EditListInfo/EditListInfo";
import EditListItems from "./pages/UserPanel/pages/EditListItems/EditListItems";
import Ratings from "./pages/UserPanel/pages/Ratings/Ratings";
import UserPanel from "./pages/UserPanel/Index";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/search", element: <SearchScreen /> },
  { path: "/categories", element: <Categories /> },
  { path: "/recommended", element: <Recommended /> },
  { path: "/profile", element: <Profile /> },
  { path: "/series/:seriesID/:seriesName", element: <SeriesPlayback /> },
  { path: "/series/:seriesID/:seriesName", element: <SeriesPlayback /> },
  {
    path: "/series/:seriesID/:seriesName/trailer",
    element: <SeriesTrailerPage />,
  },
  {
    path: "/movies/:movieID/:movieName/trailer",
    element: <MoviesTrailerPage />,
  },
  { path: "/series", element: <Series /> },
  { path: "/series/top-rated", element: <TopRatedSeries /> },
  { path: "/movies/top-rated", element: <TopRatedMovies /> },
  { path: "/movies", element: <Movies /> },
  { path: "/movies/upcoming", element: <UpcomingMovies /> },
  { path: "/tv/on-the-air", element: <UpcomingTvs /> },
  { path: "/movie/:movieID/:movieName", element: <MoviePlayback /> },
  { path: "/series-genre/:genreName", element: <SeriesGenre /> },
  { path: "/movie-genre/:genreName", element: <MoviesGenre /> },
  { path: "/contactus", element: <Contactus /> },

  {
    path: "/my-account",
    element: <UserPanel />,
  },
  { path: "/my-account/favorite", element: <Favorite /> },
  { path: "/my-account/watchlist", element: <Watchlist /> },
  { path: "/my-account/lists", element: <Lists /> },
  { path: "/my-account/lists/editInfo/:listId", element: <EditListInfo /> },
  { path: "/my-account/lists/editItems/:listId", element: <EditListItems /> },
  { path: "/my-account/rated", element: <Ratings /> },
];

export default routes;
