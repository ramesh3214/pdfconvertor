import React, { useState, useEffect } from "react";
import { FaFile, FaCog, FaSpinner, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const FilePreview = ({ selectedFile, openFileModal, files }) => {
  const [convertedPreview, setConvertedPreview] = useState(null);
  const [loadingConversion, setLoadingConversion] = useState(false);

  useEffect(() => {
    if (
      selectedFile &&
      !selectedFile.file.type.startsWith("image/") &&
      selectedFile.file.type !== "application/pdf"
    ) {
      setConvertedPreview(null);
      setLoadingConversion(true);

      const convertFile = async () => {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile.file);
          const response = await axios.post(
            "https://fileuploadbackend-3rs9.onrender.com/api/convertFile",
            formData
          );
          console.log(response);

          if (response.data.convertedFile) {
            const fileUrl = `https://fileuploadbackend-3rs9.onrender.com${response.data.convertedFile}`;
            setConvertedPreview(fileUrl);
          }
        } catch (error) {
          console.error("Conversion failed", error);
        } finally {
          setLoadingConversion(false);
        }
      };

      convertFile();
    }
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="p-8 bg-white rounded-2xl shadow-lg transform transition-all hover:scale-105">
          <FaFile className="text-6xl mb-4 text-indigo-400 mx-auto" />
          <p className="text-xl font-semibold text-gray-600 text-center">
            Select a file to begin preview
          </p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Supported formats: images, PDF, and convertible documents
          </p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    const style = {
      transform:
        selectedFile.orientation === "landscape" ? "rotate(90deg)" : "none",
      filter: selectedFile.color === "bw" ? "grayscale(100%)" : "none",
    };

    if (selectedFile.file.type.startsWith("image/")) {
      return (
        <div className="h-full w-full flex items-center justify-center p-8">
          <img
            src={selectedFile.preview}
            alt="preview"
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
            style={style}
          />
        </div>
      );
    } else if (
      selectedFile.file.type === "application/pdf" ||
      convertedPreview
    ) {
      return (
        <div className="w-full h-full  overflow-hidden ">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <div className="w-full h-full">
              <Viewer fileUrl={convertedPreview || selectedFile.preview} />
            </div>
          </Worker>
        </div>
      );
    } else if (loadingConversion) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="relative">
            <FaSpinner className="animate-spin w-12 h-12 text-indigo-500" />
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Converting to PDF...
          </p>
          <p className="text-sm text-gray-400">This may take a moment</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <FaTimesCircle className="w-16 h-16 text-red-400" />
          <p className="text-xl font-medium text-gray-600">Conversion failed</p>
          <p className="text-sm text-gray-400 text-center">
            Unable to convert this file format
          </p>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {selectedFile.file.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {selectedFile.file.type} •{" "}
            {(selectedFile.file.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <button
          onClick={() =>
            openFileModal(
              files.findIndex((f) => f.preview === selectedFile.preview)
            )
          }
          className="p-3 bg-white rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg ring-2 ring-transparent hover:ring-indigo-100"
        >
          <FaCog className="text-indigo-500 w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full h-full max-w-5xl transform transition-all duration-300">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
