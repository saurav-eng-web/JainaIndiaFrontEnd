import clsx from "clsx";
import { Video, X } from "lucide-react";
import Image from "next/image";

export default function ImagePreview({ images, onRemove, size = "14" }) {
  const items = (images || []).map((item) =>
    typeof item === "string" ? { type: "image", src: item } : item
  );

  return (
    <div className="w-full">
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={clsx(
                `relative size-14 overflow-hidden rounded border border-gray-400`
              )}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-[#f1e9ef] text-[#714b67]">
                  <Video size={18} />
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}

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
