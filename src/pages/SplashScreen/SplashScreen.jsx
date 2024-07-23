// import "./SplashScreen.css";

// export default function SplashScreen() {
//   return (
//     <div className="splash-screen">
//       <div className="splash-screen__logo">
//         <img
//           className="splash-screen__image"
//           src="images/logo/papcorn-logo2.png"
//           alt="Popcorn Logo"
//         />
//         <h2 className="splash-screen__title mt-5">PAPCORN TIME</h2>
//       </div>
//       <div className="splash-screen__buttons">
//         <button className="splash-screen__btn sign-in__btn mt-4">Sign In</button>
//         <button className="splash-screen__btn sign-up__btn mt-4">Sign Up</button>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-screen-logo__container">
        <img src="images/logo/papcorn-logo2.png" alt="Popcorn Time Logo" className="splash-screen__logo" />
        <h1 className="splash-screen__title">POPCORN TIME</h1>
      </div>
      <div className="splash-screen__buttons-container">
        <button className="splash-screen__btn sign-in-btn">Sign In</button>
        <button className="splash-screen__btn sign-up-btn">Sign Up</button>
      </div>
    </div>
  );
};

export default SplashScreen;
