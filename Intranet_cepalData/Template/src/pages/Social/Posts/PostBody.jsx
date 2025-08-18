import { useState } from "react";
import ImageCarouselModal from "./ImageCarousel";

function PostBody({ content, images }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white flex-col p-2">
      <p className="p-1 text-justify text-gray-600"> {content} </p>

      <div
        className={`grid gap-1 rounded overflow-hidden ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
            ? "grid-cols-2"
            : "grid-cols-2"
        }`}
      >
        {images.slice(0, 4).map((image, index) => {
          const isThirdAndNoFourth = index === 2 && images.length === 3;
          return (
            <div
              key={index}
              onClick={() => setOpenIndex(index)}
              className={`relative cursor-pointer ${
                isThirdAndNoFourth ? "col-span-2 h-60" : "h-60"
              } w-full`}
            >
              <img
                src={image.file_path}
                alt=""
                className="object-cover w-full h-full"
              />
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-2xl font-semibold">
                  +{images.length - 4}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openIndex !== null && (
        <ImageCarouselModal
          images={images}
          currentIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}

export default PostBody;
