import React, { useState } from "react";
import { 
  FaCog, 
  FaImage, 
  FaFilePdf, 
  FaFile, 
  FaFileWord, 
  FaFilePowerpoint,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const FileList = ({ files, selectedFile, onSelectFile, onOpenFileModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const filesPerSlide = 2;
  const totalSlides = Math.ceil(files.length / filesPerSlide);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/"))
      return <FaImage className="text-purple-500" />;
    if (fileType === "application/pdf")
      return <FaFilePdf className="text-red-500" />;
    if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return <FaFileWord className="text-blue-500" />;
    if (
      fileType === "application/vnd.ms-powerpoint" ||
      fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return <FaFilePowerpoint className="text-orange-500" />;
    return <FaFile className="text-gray-500" />;
  };

  const startIndex = currentSlide * filesPerSlide;
  const currentFiles = files.slice(startIndex, startIndex + filesPerSlide);

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(currentSlide + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentFiles.map((fileObj, index) => (
          <div
            key={startIndex + index}
            onClick={() => onSelectFile(fileObj)}
            className={`group p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-4
              ${
                selectedFile?.preview === fileObj.preview
                  ? "border-indigo-300 bg-indigo-50 shadow-md"
                  : "border-gray-100 hover:border-indigo-200 bg-white"
              }`}
          >
            <div className="flex-shrink-0 text-xl p-3 bg-indigo-100 rounded-lg text-indigo-600">
              {getFileIcon(fileObj.file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-800 truncate">
                {fileObj.file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 font-medium">
                  {fileObj.quantity} copy{fileObj.quantity > 1 ? "ies" : ""}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFileModal(startIndex + index);
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <FaCog className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      {totalSlides > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide >= totalSlides - 1}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            <FaChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileList;
