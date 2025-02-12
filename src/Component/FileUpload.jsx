import React, { useState } from "react";
import axios from "axios";
import FileDropZone from "./FileDropZone";
import FileList from "./FileList";
import FilePreview from "./FilePreview";
import SettingsModal from "./SettingModal";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    color: "color",
    pageType: "A4",
    orientation: "portrait",
  });
  const [modalConfig, setModalConfig] = useState({
    show: false,
    mode: "",
    initialValues: {},
    fileIndex: null,
  });
  const [loading, setLoading] = useState(false);

  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      if (!selectedFile && updatedFiles.length > 0) {
        setSelectedFile(updatedFiles[0]);
      }
      return updatedFiles;
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach((fileObj, index) => {
        formData.append("files", fileObj.file);
        formData.append(`color_${index}`, fileObj.color);
        formData.append(`quantity_${index}`, fileObj.quantity);
        formData.append(`pageType_${index}`, fileObj.pageType);
      });
      const response = await axios.post(
        "https://fileuploadbackend-3rs9.onrender.com/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        alert("Files uploaded successfully!");
        setFiles([]);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-0 max-w-7xl bg-white min-h-screen">
  
      <div className="mb-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Document Manager
        </h1>
        <p className="text-gray-600 text-lg font-light">
          Upload, manage, and preview documents with professional precision
        </p>
      </div>

      
      <div className="flex flex-col lg:flex-row gap-8">
    
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <FileDropZone onFilesAdded={addFiles} />
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-indigo-600 w-2 h-2 rounded-full"></span>
              Uploaded Files
            </h3>
            <FileList
              files={files}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              onOpenFileModal={(index) =>
                setModalConfig({
                  show: true,
                  mode: "file",
                  initialValues: {
                    ...files[index],
                    quantity: Number(files[index].quantity),
                  },
                  fileIndex: index,
                })
              }
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-white p-3 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-600 w-2 h-2 rounded-full"></span>
              Document Preview
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {files.length} item{files.length !== 1 && "s"}
              </span>
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <FilePreview
              selectedFile={selectedFile}
              openFileModal={(index) =>
                setModalConfig({
                  show: true,
                  mode: "file",
                  initialValues: {
                    ...files[index],
                    quantity: Number(files[index].quantity),
                  },
                  fileIndex: index,
                })
              }
              files={files}
            />
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="fixed bottom-8 right-8 animate-slide-up">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-2xl hover:shadow-3xl flex items-center gap-3 transform hover:scale-105"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                <span className="font-semibold">Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-white/90" viewBox="0 0 24 24">
                  <path
                    d="M12 4v16m8-8H4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-lg">Upload Documents</span>
              </>
            )}
          </button>
        </div>
      )}

      <SettingsModal
        show={modalConfig.show}
        mode={modalConfig.mode}
        initialValues={modalConfig.initialValues}
        onSave={(updatedValues) => {
          if (modalConfig.mode === "global") {
            setGlobalSettings(updatedValues);
            setFiles(
              files.map((f) => ({
                ...f,
                color: updatedValues.color,
                pageType: updatedValues.pageType,
                orientation: updatedValues.orientation,
              }))
            );
          } else if (
            modalConfig.mode === "file" &&
            modalConfig.fileIndex !== null
          ) {
            setFiles(
              files.map((f, i) =>
                i === modalConfig.fileIndex ? { ...f, ...updatedValues } : f
              )
            );
            setSelectedFile((prev) => ({ ...prev, ...updatedValues }));
          }
          setModalConfig({
            show: false,
            mode: "",
            initialValues: {},
            fileIndex: null,
          });
        }}
        onClose={() =>
          setModalConfig({
            show: false,
            mode: "",
            initialValues: {},
            fileIndex: null,
          })
        }
      />
    </div>
  );
};

export default FileUpload;
