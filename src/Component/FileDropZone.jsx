// FileDropZone.jsx
import React from "react";
import { useDropzone } from "react-dropzone";
import { FaPlusCircle } from "react-icons/fa";

const FileDropZone = ({ onFilesAdded }) => {
  const { getInputProps, open } = useDropzone({
    noClick: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "text/plain": [".txt"],
      "text/html": [".html", ".htm"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/oxps": [".xps"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/heif": [".heif"],
      "image/heic": [".heic"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    onDrop: async (acceptedFiles) => {
      const newFiles = await Promise.all(
        acceptedFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                file,
                preview: reader.result,
                color: "color",
                quantity: 1,
                pageType: "A4",
                orientation: "portrait",
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      onFilesAdded(newFiles);
    },
  });

  return (
    <div
      onClick={open}
      className="group flex flex-col items-center justify-center border-2 border-dashed border-indigo-100 rounded-xl p-8 cursor-pointer mb-6 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
    >
      <div className="relative">
        <FaPlusCircle className="text-indigo-500 text-5xl mb-4 transition-transform group-hover:scale-110" />
      </div>
      <p className="text-indigo-600 text-xl font-semibold mb-1">Add Files</p>
      <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
      <input {...getInputProps()} />
    </div>
  );
};

export default FileDropZone;
