import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaCog,
  FaSpinner,
  FaTimesCircle,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";

const FilePreview = ({ selectedFile, openFileModal, files }) => {
  const [convertedPreview, setConvertedPreview] = useState(null);
  const [loadingConversion, setLoadingConversion] = useState(false);

  const cacheKey = selectedFile?.file
    ? `converted_${selectedFile.file.name}`
    : null;

  useEffect(() => {
    if (selectedFile?.file) {
      const cachedUrl = cacheKey && localStorage.getItem(cacheKey);
      if (cachedUrl) {
        setConvertedPreview(cachedUrl);
        setLoadingConversion(false);
        return;
      }

      setConvertedPreview(null);
      setLoadingConversion(true);

      const uploadAndConvertFile = async () => {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile.file);

          const response = await axios.post(
            "https://fileuploadbackend-iwbq.onrender.com/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );

          if (response.data.imageUrl) {
            const url = `https://fileuploadbackend-iwbq.onrender.com${response.data.imageUrl}`;
            setConvertedPreview(url);
            if (cacheKey) localStorage.setItem(cacheKey, url);
          }
        } catch (error) {
          console.error("File conversion failed", error);
        } finally {
          setLoadingConversion(false);
        }
      };

      uploadAndConvertFile();
    }
  }, [selectedFile, cacheKey]);

  const style = {
    transform:
      selectedFile?.orientation === "landscape" ? "rotate(90deg)" : "none",
    filter: selectedFile?.color === "bw" ? "grayscale(100%)" : "none",
  };

  const renderPreview = () => {
    if (!selectedFile || !selectedFile.file) return null;

    if (loadingConversion) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <FaSpinner className="animate-spin text-indigo-500 w-12 h-12" />
          <p className="text-gray-600 text-lg font-semibold">
            Converting file...
          </p>
          <p className="text-sm text-gray-400">
            Please wait while we process your file.
          </p>
        </div>
      );
    }


    if (selectedFile.file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center p-6">
          <img
            src={selectedFile.preview}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-transform duration-300 hover:scale-105"
            style={style}
          />
        </div>
      );
    }

    if (selectedFile.file.type === "application/pdf") {
      if (convertedPreview) {
        return (
          <div className="flex items-center justify-center p-6">
            <img
              src={convertedPreview}
              alt="Converted Preview"
              className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-transform duration-300 hover:scale-105"
              style={style}
            />
          </div>
        );
      }
    }

  
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <FaTimesCircle className="w-16 h-16 text-red-400" />
        <p className="text-xl font-bold text-gray-700">Conversion failed</p>
        <p className="text-sm text-gray-500 text-center">
          We couldn’t convert this file format. Please try another file.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
      
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white truncate">
            {selectedFile?.file?.name || "No File Selected"}
          </h2>
          {selectedFile?.file && (
            <p className="text-xs text-indigo-200 mt-1">
              {selectedFile.file.type} •{" "}
              {(selectedFile.file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {convertedPreview && (
            <a
              href={convertedPreview}
              download={`${
                selectedFile?.file?.name?.split(".")[0]
              }_converted.png`}
              className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-100 transition"
            >
              <FaDownload />
            </a>
          )}
          <button
            onClick={() =>
              openFileModal(
                files.findIndex((f) => f.preview === selectedFile.preview)
              )
            }
            className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-100 transition"
          >
            <FaCog />
          </button>
        </div>
      </div>
    
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-4xl transition-transform duration-300">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
