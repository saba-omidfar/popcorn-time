// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import { IoIosArrowForward } from "react-icons/io";
// import "./Pagination.css";

// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   const location = useLocation();

//   const getLinkWithPage = (page) => {
//     const searchParams = new URLSearchParams(location.search);
//     searchParams.set("page", page);
//     return `${location.pathname}?${searchParams.toString()}`;
//   };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];

//     // مشخص کردن محدوده صفحات که باید نمایش داده شود
//     let startPage = currentPage;
//     let endPage = Math.min(currentPage + 1, totalPages);

//     // افزودن دکمه "صفحه قبل" در صورتی که صفحه جاری از صفحه 1 بیشتر باشد
//     if (currentPage > 1) {
//       pageNumbers.push(
//         <button
//           key="prev"
//           className="items__pagination-btn"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage <= 1}
//         >
//           <IoIosArrowForward className="items__pagination-btn-icon" />
//         </button>
//       );
//     }

//     // افزودن صفحات فعلی
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <li
//           key={i}
//           className={`items__pagination-item ${
//             currentPage === i ? "items__pagination-link--active" : ""
//           }`}
//         >
//           <Link
//             to={getLinkWithPage(i)}
//             className="items__pagination-link"
//             onClick={() => onPageChange(i)}
//           >
//             {i}
//           </Link>
//         </li>
//       );
//     }

//     // افزودن دکمه "..." و دو صفحه آخر در صورتی که صفحات باقی مانده بیشتر از 2 باشد
//     if (endPage < totalPages - 1) {
//       pageNumbers.push(
//         <button key="dots" className="items__pagination-btn" disabled>
//           <span className="items__pagination-link">...</span>
//         </button>
//       );
//     }

//     // افزودن دو صفحه آخر
//     if (endPage < totalPages) {
//       for (let i = totalPages - 1; i <= totalPages; i++) {
//         pageNumbers.push(
//           <li key={i} className="items__pagination-item">
//             <Link
//               to={getLinkWithPage(i)}
//               className={`items__pagination-link ${
//                 currentPage === i ? "items__pagination-link--active" : ""
//               }`}
//               onClick={() => onPageChange(i)}
//             >
//               {i}
//             </Link>
//           </li>
//         );
//       }
//     }

//     return pageNumbers;
//   };

//   return (
//     <div className="pagination">
//       <ul className="items__pagination-list">{renderPageNumbers()}</ul>
//       {currentPage < totalPages && (
//         <button
//           className="items__pagination-btn"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           <IoIosArrowBack className="items__pagination-btn-icon" />
//         </button>
//       )}
//     </div>
//   );
// }

import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";

import "./Pagination.css"

export default function PaginationRounded({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkWithPage = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    return `${location.pathname}?${searchParams.toString()}`;
  };

  const handlePageChange = (event, page) => {
    onPageChange(page);
    navigate(getLinkWithPage(page));
  };

  return (
    <Stack spacing={1} alignItems="center">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
      />
    </Stack>
  );
}
