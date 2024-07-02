"use client";
import { useState } from "react";
import { PdfFile } from "../index";

export function usePdf() {
  const [files, setFiles] = useState<PdfFile[]>([]);

  const pdfEqual = (a: PdfFile, b: PdfFile) => {
    if (a.id === b.id) return true;
    if (a.filename === b.filename && a.filesize === b.filesize) return true;
    return false;
  };

  const upload = (file: PdfFile) => {
    const existedPdf = files.find((f) => pdfEqual(f, file));
    if (!existedPdf) {
      setFiles((prev) => [...prev, file]);
      return true;
    }
    return false;
  };

  const remove = (file: PdfFile) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const reset = () => {
    setFiles([]);
  };

  return { files, upload, remove, reset };
}
