import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");

    // Try to scroll after a short delay to allow DOM rendering
    const timeout = setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // Adjust timing if needed

    return () => clearTimeout(timeout);
  }, [location]);

  return null;
};

export default ScrollToHashElement;
