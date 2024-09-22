import React from "react";
import Box from "@mui/material/Box";
import { IoIosClose } from "react-icons/io";

import "./Modal.css";

function Modal({
  title,
  headerContent,
  bodyContent,
  footerContent,
  setShowModal,
}) {
  return (
    <div className="modal-container">
      <Box
        sx={{
          width: 300,
          padding: 2,
        }}
      >
        {/* Header Section */}
        <header className="modal-container-header">
          {headerContent ? (
            headerContent
          ) : (
            <>
              <IoIosClose
                className="modal-container-close-icon"
                onClick={() => setShowModal(false)}
              />
              <h1 className="modal-container-title">{title}</h1>
            </>
          )}
        </header>

        {/* Body Section */}
        <section className="modal-container-section">{bodyContent}</section>

        {/* Footer Section */}
        <div className="modal-container-footer">{footerContent}</div>
      </Box>
    </div>
  );
}

export default Modal;
