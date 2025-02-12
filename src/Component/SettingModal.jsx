import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronDown, FaPlus, FaMinus } from "react-icons/fa";

const SettingsModal = ({ show, mode, initialValues, onSave }) => {
  const [settings, setSettings] = useState({
    color: "color",
    pageType: "A4",
    orientation: "portrait",
    quantity: 1,
  });

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      ...initialValues,
      quantity: Number(initialValues.quantity) || 1,
    }));
  }, [initialValues]);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {mode === "global" ? "Print Settings" : "File Configuration"}
            </h2>
            <button
              onClick={() => onSave(settings)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <FaTimes className="text-white w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Print Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Print Mode
            </label>
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={settings.color}
                onChange={(e) => handleChange("color", e.target.value)}
              >
                <option value="color">Color Printing</option>
                <option value="bw">Black &amp; White</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChange("orientation", "portrait")}
                className={`p-4 rounded-lg border-2 flex items-center justify-center transition-all ${
                  settings.orientation === "portrait"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 hover:border-indigo-200 text-gray-600"
                }`}
              >
                <span className="text-sm font-medium">Portrait</span>
              </button>
              <button
                onClick={() => handleChange("orientation", "landscape")}
                className={`p-4 rounded-lg border-2 flex items-center justify-center transition-all ${
                  settings.orientation === "landscape"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 hover:border-indigo-200 text-gray-600"
                }`}
              >
                <span className="text-sm font-medium">Landscape</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Paper Size
            </label>
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={settings.pageType}
                onChange={(e) => handleChange("pageType", e.target.value)}
              >
                <option value="A4">A4 (210 × 297mm)</option>
                <option value="Letter">Letter (8.5 × 11in)</option>
                <option value="Legal">Legal (8.5 × 14in)</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {mode === "file" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Copies
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      quantity: Math.max(1, settings.quantity - 1),
                    })
                  }
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <FaMinus className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-2xl font-medium w-12 text-center">
                  {settings.quantity}
                </span>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      quantity: settings.quantity + 1,
                    })
                  }
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <FaPlus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onSave(settings)}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => onSave(settings)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
