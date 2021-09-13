import { useState } from "react";
import { Router } from "./router";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <Router />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
