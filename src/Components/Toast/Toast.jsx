import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";

const Toast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={1000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="dark"
      transition:Slide
    />
  );
};

export const showToastSuccess = (msg) => {
  toast.success(msg, {
    position: "bottom-right",
    autoClose: 1200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Slide,
    closeButton: false,
    className: "custom-toast",
  });
};

export const showToastError = (msg) => {
  toast.error(msg, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
    transition: Slide,
    closeButton: false,
    className: "custom-toast",
  });
};

export default Toast;
