import { JSONValue } from "ai";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageAnnotation, MessageAnnotationType } from ".";
import { Button } from "../button";
import FileUploader from "../file-uploader";
import { Input } from "../input";
import UploadCsvPreview from "../upload-csv-preview";
import UploadImagePreview from "../upload-image-preview";
import UploadPdfPreview from "../upload-pdf-preview";
import { ChatHandler } from "./chat.interface";
import { useCsv } from "./hooks/use-csv";
import { usePdf } from "./hooks/use-pdf";
import { IoIosSend } from "react-icons/io";
import { doExtractPdf } from "./hooks/extract-pdf";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | "isLoading"
    | "input"
    | "onFileUpload"
    | "onFileError"
    | "handleSubmit"
    | "handleInputChange"
    | "messages"
    | "setInput"
    | "append"
  >,
) {

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { files: csvFiles, upload:uploadCsv, remove:removeCsv, reset:resetCsv } = useCsv();
  const { files: pdfFiles, upload:uploadPdf, remove:removePdf, reset:resetPdf} = usePdf();

  const getAnnotations = () => {
    if (!imageUrl && pdfFiles.length===0 && csvFiles.length === 0 ) return undefined;
    const annotations: MessageAnnotation[] = [];
    if (imageUrl) {
      annotations.push({
        type: MessageAnnotationType.IMAGE,
        data: { url: imageUrl },
      });
    }

    if (pdfFiles.length > 0) {
      annotations.push({
        type: MessageAnnotationType.PDF,
        data: {
          pdfFiles: pdfFiles.map((file) => ({
            id: pdfFiles[0].id, 
            content: pdfFiles[0].content[0],
            filename: pdfFiles[0].filename,
            filesize: pdfFiles[0].filesize,
          })),
        },
      });
    }

    if (csvFiles.length > 0) {
      annotations.push({
        type: MessageAnnotationType.CSV,
        data: {
          csvFiles: csvFiles.map((file) => ({
            id: file.id,
            content: file.content,
            filename: file.filename,
            filesize: file.filesize,
          })),
        },
      });
    }
    return annotations as JSONValue[];
  };

  const handleSubmitWithAnnotations = (
    e: React.FormEvent<HTMLFormElement>,
    annotations: JSONValue[] | undefined,
  ) => {
    e.preventDefault();
    props.append!({
      content: props.input,
      role: "user",
      createdAt: new Date(),
      annotations,
    });
    props.setInput!("");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const annotations = getAnnotations();
    console.log("The annotations are :", annotations)

    if (annotations) {
      handleSubmitWithAnnotations(e, annotations);
      imageUrl && setImageUrl(null);
      pdfFiles.length && resetPdf();
      csvFiles.length && resetCsv();
      return;
    }
    props.handleSubmit(e);
  };

  const onRemovePreviewImage = () => setImageUrl(null);

  const readContent = async (file: File): Promise<string> => {
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      if(file.type.startsWith("image/") || (file.type === "application/pdf")){
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    return content;
  };

  const handleUploadImageFile = async (file: File) => {
    const base64 = await readContent(file);
    setImageUrl(base64);
  };

  const handleUploadCsvFile = async (file: File) => {
    const content = await readContent(file);
    const isSuccess = uploadCsv({
      id: uuidv4(),
      content,
      filename: file.name,
      filesize: file.size,
    });
    if (!isSuccess) {
      alert("File already exists in the list.");
    }
  };

const handleUploadPdfFile = async (file: File) => {
  if (file.size > 5242880) {
    alert("File size exceeds the limit of 5MB. Please upload a smaller file");
    return;
  }
  try {
    const response = await doExtractPdf(file);
    const {file_text} = response;
    const isSuccess = uploadPdf({
      id: uuidv4(),
      content: file_text,
      filename: file.name,
      filesize: file.size,
    });
    if (!isSuccess) {
      alert("File already exists in the list.");
    }
  
  } catch (error) {
    alert('Failed to upload PDF file. Please try again.');
  }
};

const handleUploadFile = async (file: File) => {
    try {
      // if (file.type.startsWith("image/")) {
      //   return await handleUploadImageFile(file);}

      // if (file.type === "text/csv"){
      //   if (csvFiles.length > 0) {
      //     alert("You can only upload one csv file at a time.");
      //     return;
      //   }
      //   return await handleUploadCsvFile(file);}

      if (file.type === "application/pdf"){
          if (pdfFiles.length > 0) {
            alert("You can only upload one csv file at a time.");
            return;
          }
          return await handleUploadPdfFile(file);
        }else{
          alert("Unsupported file format. Only pdf files are supported.");
        }
      
      props.onFileUpload?.(file);
    } catch (error: any) {
      props.onFileError?.(error.message);
    }
  };

  return (
    <div className="fixed bottom-7 left-0 right-0 px-2">
     <div className="max-w-screen-lg mx-auto bg-white rounded-xl shadow-xl p-4 space-y-4">
    <form
      onSubmit={onSubmit}
    >
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={onRemovePreviewImage} />
      )}

      {pdfFiles.length > 0 && (
        <div className="flex gap-4 w-full overflow-auto py-2">
          {pdfFiles.map((pdf) => {
            return (
              <UploadPdfPreview
                key={pdf.id}
                pdf={pdf}
                onRemove={() => removePdf(pdf)}
              />
            );
          })}
        </div>
      )}
      
      {csvFiles.length > 0 && (
        <div className="flex gap-4 w-full overflow-auto py-2">
          {csvFiles.map((csv) => {
            return (
              <UploadCsvPreview
                key={csv.id}
                csv={csv}
                onRemove={() => removeCsv(csv)}
              />
            );
          })}
        </div>
      )}

      <div className="flex w-full items-start justify-between gap-4 ">
        <Input
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        <FileUploader
          onFileUpload={handleUploadFile}
          onFileError={props.onFileError}
        />
         <Button type="submit" disabled={props.isLoading}>
          <span className="hidden lg:flex">Send</span>
          <IoIosSend className="w-6 h-6 lg:hidden" />
        </Button>
      </div>
    </form>
    </div>
    </div>
  );
}
