import { useEffect } from "react";

export default function ImageCarouselModal({ images, currentIndex, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        &times;
      </button>
      <img src={images[currentIndex].url} className="max-w-full max-h-[90vh]" />
    </div>
  );
}
