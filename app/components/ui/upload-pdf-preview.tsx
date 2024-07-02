import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import SheetIcon from "../ui/icons/sheet.svg";
import { Button } from "./button";
import { CsvFile } from "./chat";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { cn } from "./lib/utils";

export interface UploadPdfPreviewProps {
  pdf: CsvFile;
  onRemove?: () => void;
}

export default function UploadPdfPreview(props: UploadPdfPreviewProps) {
  return (
    <div>
      <PDFSummaryCard {...props} />
    </div>
  );
}

function PDFSummaryCard(props: UploadPdfPreviewProps) {
  const { onRemove, pdf } = props;
  return (
    <div className="p-2 w-60 max-w-60 bg-secondary rounded-lg text-sm relative cursor-pointer">
      <div className="flex flex-row items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
          <Image
            className="h-full w-auto"
            priority
            width={40}
            height={40}
            src={"https://media.istockphoto.com/id/1298834280/vector/pdf-icon-major-file-format-vector-icon-illustration.jpg?s=612x612&w=0&k=20&c=uA4lg3z8Od32TGuT6zOhMkEVJqH2kCE-_OI8ybalmac="}
            alt="PDF Image"
          />
        </div>
        <div className="overflow-hidden">
          <div className="truncate font-semibold">
            {pdf.filename} ({inKB(pdf.filesize)} KB)
          </div>
          <div className="truncate text-token-text-tertiary flex items-center gap-2">
            <span>PDF</span>
          </div>
        </div>
      </div>
      {onRemove && (
        <div
          className={cn(
            "absolute -top-2 -right-2 w-6 h-6 z-10 bg-gray-500 text-white rounded-full",
          )}
        >
          <XCircleIcon
            className="w-6 h-6 bg-gray-500 text-white rounded-full"
            onClick={onRemove}
          />
        </div>
      )}
    </div>
  );
}

function inKB(size: number) {
  return Math.round((size / 1024) * 10) / 10;
}
