import React from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";

export const ErrorMessage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="bg-red-500/40 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-red-500">
        <BsExclamationTriangleFill className="w-4 h-4" />
        <p>An unexpected error occurred. Try again later</p>
      </div>
    </div>
  );
}
