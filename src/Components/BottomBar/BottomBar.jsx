import "./BottomBar.css";
import { LuHome } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { LuUser } from "react-icons/lu";

import { Link } from "react-router-dom";
import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";

function BottomBar({ activeBottom }) {
  const { sessionId } = useSession();
  const { guestSessionId } = useGuestSession();
  return (
    <div className="bottom-bar">
      <Link to="/">
        <LuHome
          className={`bottom-bar__icon ${
            activeBottom === "home" ? "bottom-bar__active" : ""
          }`}
        />
      </Link>
      <Link to="/search">
        <IoSearch
          className={`bottom-bar__icon ${
            activeBottom === "search" ? "bottom-bar__active" : ""
          }`}
        />
      </Link>
      <Link to="/categories">
        <BiCategory
          className={`bottom-bar__icon ${
            activeBottom === "favorite" ? "bottom-bar__active" : ""
          }`}
        />
      </Link>
      <Link to={sessionId || guestSessionId ? "/my-account" : "/sign-in"}>

        <LuUser
          className={`bottom-bar__icon ${
            activeBottom === "user" ? "bottom-bar__active" : ""
          }`}
        />
      </Link>
    </div>
  );
}

export default BottomBar;
