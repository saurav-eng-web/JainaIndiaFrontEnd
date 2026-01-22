import clsx from "clsx";
import { X } from "lucide-react";
import Image from "next/image";

export default function ImagePreview({ images, onRemove, size = "14" }) {
  // console.log("images: ", images);
  return (
    <div className="w-full">
      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((src, index) => (
            <div
              key={index}
              className={clsx(
                `relative size-${size} overflow-hidden rounded border border-gray-400`
              )}
            >
              <Image
                src={src}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove && onRemove(index)}
                className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/60 p-1 text-xs text-white hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
