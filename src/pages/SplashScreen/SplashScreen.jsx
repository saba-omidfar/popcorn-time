import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="splash-screen">
        <div className="splash-screen-logo__container">
          <img
            src="/images/logo/papcorn-logo2.png"
            alt="Popcorn Time Logo"
            className="splash-screen__logo"
          />
          <h1 className="splash-screen__title">POPCORN TIME</h1>
        </div>
        <div className="splash-screen__buttons-container">
          <button
            className="splash-screen__btn sign-in-btn"
            onClick={() => navigate("/sign-in")}
          >
            ورود
          </button>
          <button
            className="splash-screen__btn sign-up-btn"
            onClick={() => navigate("/sign-up")}
          >
            ثبت‌نام
          </button>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
