"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/ui/InputWithLabel";
import PageSkeleton from "@/components/ui/PageSkeleton";

export default function Page() {
  const inputRef = useRef(null);

  function handleClick() {
    toast.success("Button clicked!");
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 500);
  }, []);

  return (
    <PageSkeleton title="Test Admin">
      <input
        type="text"
        ref={inputRef}
        className="h-12 w-52 bg-gray-300 p-2"
        onKeyDown={handleKeyDown}
      />
      <InputWithLabel label="Test Input" ref={inputRef} onEnterKeyPressed={handleClick} />
      <Button disabled>test</Button>
    </PageSkeleton>
  );
}
