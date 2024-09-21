import "./SignIn.css";
import { Link } from "react-router-dom";
import { useSession } from "../../Contexts/sessionContext";
import { useGuestSession } from "../../Contexts/guestSessionContext";
import BottomBar from "../../Components/BottomBar/BottomBar";
import { Tooltip } from "@mui/material";

const SignIn = () => {
  const { createNewRequestToken } = useSession();
  const { createGuestSessionID } = useGuestSession();

  return (
    <>
      <section className="login-register">
        <div className="login register-form">
          <p className="login-title">
            برای دسترسی به پروفایل، ابتدا وارد حساب کاربری خود شوید
          </p>
          <form className="login-form">
            <div className="d-flex flex-column align-items-start">
              <div className="item_form">
                <p>ورود از طریق سایت TMDB</p>
                <small className="login-text">
                  در صفحه باز شده دکمه Approve را فشار دهید
                </small>
              </div>
              <button
                type="button"
                className="do_register_btn"
                onClick={createNewRequestToken}
              >
                ورود با TMDb
              </button>
            </div>

            <Tooltip title="ثبت‌نام کنید">
              <small className="signUp-text">
                ثبت‌نام نکرده‌اید؟
                <Link to="/sign-up" className="signUp-link">کلیک</Link> کنید
              </small>
            </Tooltip>

            {/* Gusets User */}
            <div className="d-flex flex-column align-items-start mt-5">
              <div className="item_form">
                <p>ورود بصورت مهمان</p>
              </div>
              <button
                type="button"
                className="do_register_btn"
                onClick={createGuestSessionID}
              >
                ورود بصورت مهمان
              </button>
              <div className="mt-3 d-flex flex-column align-items-start">
                <small className="logout-error">
                  حساب مهمان بعد از 60 دقیقه عدم فعالیت بطور خودکار حذف می‌شود
                </small>
                <small className="logout-error">
                  * محدودیت در استفاده از امکانات سایت
                </small>
              </div>
            </div>
          </form>
        </div>
      </section>
      <BottomBar activeBottom="user" />
    </>
  );
};

export default SignIn;
