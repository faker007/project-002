import { Router } from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";

export const App = () => {
  return (
    <>
      <Router />
      <ToastContainer position="bottom-right" />
    </>
  );
};
