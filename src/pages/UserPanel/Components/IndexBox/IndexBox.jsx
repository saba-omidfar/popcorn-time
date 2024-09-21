import React from "react";
import { Link } from "react-router-dom";
import { showToastError } from "../../../../Components/Toast/Toast";

export default function IndexBox({ title, href, onClick, isGuest }) {
  const handleClick = (e) => {
    if (isGuest) {
      e.preventDefault();
      showToastError("برای استفاده از این بخش باید ثبت‌نام کنید.");
    } else {
      onClick && onClick();
    }
  };

  return (
    <Link to={href} className="dashboard-links__item" onClick={handleClick}>
      <span className="section-title">{title}</span>
    </Link>
  );
}
