// // // SignUp.js
// // import React, { useState } from "react";
// // import { Link } from "react-router-dom";

// // import "./SignUp.css";
// // import BottomBar from "../../Components/BottomBar/BottomBar";
// // import { IoEyeOutline } from "react-icons/io5";

// // const Register = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   // const handleSignUp = async (e) => {
// //   //   e.preventDefault();
// //   //   try {
// //   //     await createUserWithEmailAndPassword(auth, email, password);
// //   //     alert("User created successfully");
// //   //   } catch (error) {
// //   //     alert(error.message);
// //   //   }
// //   // };

// //   return (
// //     <>
// //       <section className="login-register">
// //         <div className="login register-form">
// //           {/* <span className="login__subtitle">
// //             خوشحالیم قراره به جمع ما بپیوندی
// //           </span> */}
// //           {/* <div className="login__new-member">
// //             <span className="login__new-member-text">
// //               قبلا ثبت‌نام کرده‌اید؟{" "}
// //             </span>
// //             <Link className="login__new-member-link" to="/sign-in">
// //               وارد شوید
// //             </Link>
// //           </div> */}
// //           <form action="#" className="login-form">
// //             <div className="item_form">
// //               <label htmlFor="user_name">نام یا شناسه کاربری</label>
// //               <div className="inner_item_form">
// //                 <input type="text" name="user_name" id="user_name" />
// //               </div>
// //             </div>
// //             <div className="item_form">
// //               <label htmlFor="user_name">پست الکترونیک</label>
// //               <div className="inner_item_form">
// //                 <input
// //                   type="text"
// //                   name="user_name"
// //                   id="user_name"
// //                   placeholder="بدون www."
// //                 />
// //               </div>
// //             </div>
// //             {/* <div className="item_form">
// //               <label htmlFor="user_name">شماره موبایل</label>
// //               <div className="inner_item_form">
// //                 <input type="text" name="user_name" id="user_name" />
// //               </div>
// //             </div> */}
// //             <div className="item_form">
// //               <label htmlFor="user_name">رمز عبور</label>
// //               <div className="inner_item_form">
// //                 <input type="text" name="user_name" id="user_name" />
// //                 <div className="input_icon">
// //                   <div className="btn_show_password" data-showpass="0">
// //                     <IoEyeOutline className="icon view" />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="item_form">
// //               <label htmlFor="user_name">تکرار رمز عبور</label>
// //               <div className="inner_item_form">
// //                 <input type="text" name="user_name" id="user_name" />
// //                 <div className="input_icon">
// //                   <div className="btn_show_password" data-showpass="0">
// //                     <IoEyeOutline className="icon view" />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="item_form">
// //               <button
// //                 name="doregister"
// //                 id="doregister"
// //                 className="do_register_btn"
// //               >
// //                 عضویت در پاپکورن‌تایم
// //               </button>
// //             </div>
// //             <Link
// //               className="btnregisteronloginpage"
// //               title="ورود به پنل کاربری"
// //               to="/sign-in"
// //             >
// //               ورود به پنل کاربری
// //             </Link>
// //             {/* <div className="login-form__password recaptcha-parent">
// //               <ReCAPTCHA
// //                 sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
// //                 onChange={onChangeHandler}
// //               />
// //             </div> */}
// //           </form>
// //           {/* <div className="login__des">
// //             <span className="login__des-title">سلام کاربر محترم:</span>
// //             <ul className="login__des-list">
// //               <li className="login__des-item">
// //                 لطفا از مرورگر های مطمئن و بروز مانند گوگل کروم و فایرفاکس
// //                 استفاده کنید.
// //               </li>
// //               <li className="login__des-item">
// //                 ما هرگز اطلاعات محرمانه شمارا از طریق ایمیل درخواست نمیکنیم.
// //               </li>
// //               <li className="login__des-item">
// //                 لطفا کلمه عبور خود را در فواصل زمانی کوتاه تغییر دهید.
// //               </li>
// //             </ul>
// //           </div> */}
// //         </div>
// //       </section>
// //       <BottomBar />
// //     </>
// //   );
// // };

// // export default Register;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./SignUp.css";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <>
//       <section className="login-register">
//         <div className="login register-form">
//           <form action="#" className="login-form">
//             <div className="item_form">
//               <label htmlFor="user_name">نام یا شناسه کاربری</label>
//               <div className="inner_item_form">
//                 <input type="text" name="user_name" id="user_name" />
//               </div>
//             </div>
//             <div className="item_form">
//               <label htmlFor="email">پست الکترونیک</label>
//               <div className="inner_item_form">
//                 <input type="email" name="email" id="email" />
//               </div>
//             </div>
//             <div className="item_form">
//               <label htmlFor="password">رمز عبور</label>
//               <div className="inner_item_form">
//                 <input type="password" name="password" id="password" />
//               </div>
//             </div>
//             <div className="item_form">
//               <label htmlFor="confirm_password">تکرار رمز عبور</label>
//               <div className="inner_item_form">
//                 <input type="password" name="confirm_password" id="confirm_password" />
//               </div>
//             </div>
//             <div className="item_form">
//               <button className="do_register_btn">عضویت در پاپکورن‌تایم</button>
//             </div>
//             <Link
//               className="btnregisteronloginpage"
//               title="ورود به پنل کاربری"
//               to="/sign-in"
//             >
//               ورود به پنل کاربری
//             </Link>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Register;

import React from "react";
import { Link } from "react-router-dom";

import BottomBar from "../../Components/BottomBar/BottomBar";
import { Tooltip } from "@mui/material";
import "./SignUp.css";

const Register = () => {
  return (
    <>
      <section className="login-register">
        <div className="login register-form">
          <div className="login__info">
            <p className="register-text">
              به دلیل استفاده این سایت از apiهای آماده، برای عضویت در
              پاپکورن‌تایم
              <br /> باید از طریق سایت
              <Link
                className="register-link"
                to="https://www.themoviedb.org/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
                TMDb
              </Link>
              ثبت‌نام کنید.
              <br />
              پس از ایجاد حساب کاربری، به سایت برگردید و وارد شوید.
            </p>
          </div>
          <div className="d-flex flex-column align-items-start w-100">
            <div className="item_form"></div>
            <button
              type="button"
              className="do_register_btn"
              onClick={() =>
                (window.location.href =
                  "https://www.themoviedb.org/signup")
              }
            >
              ثبت‌نام با TMDb
            </button>
          </div>
          <Tooltip title="وارد شوید">
            <small className="signUp-text">
              ثبت‌نام کرده‌اید؟
              <Link to="/sign-in" className="signUp-link">
                کلیک
              </Link>{" "}
              کنید
            </small>
          </Tooltip>
          {/* <div className="item_form">
            <Link
              className="btnregisteronloginpage"
              title="ورود به پنل کاربری"
              to="/sign-in"
            >
              ورود به پنل کاربری
            </Link>
          </div> */}
        </div>
      </section>
      <BottomBar activeBottom="user" />
    </>
  );
};

export default Register;
