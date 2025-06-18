"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./button";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus the input when modal opens
      const input = document.getElementById("search-input");
      if (input) {
        input.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      // Small delay to ensure modal closes before navigation
      setTimeout(() => {
        onSearch(searchTerm.trim());
      }, 100);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onClose();
    // Small delay to ensure modal closes before navigation
    setTimeout(() => {
      onSearch(suggestion);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tìm kiếm sản phẩm
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close search modal"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!searchTerm.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-500">
            <p>Gợi ý tìm kiếm:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "Bánh trung thu",
                "Thiên Hương",
                "Nguyệt Dạ",
                "Truyền thống",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
            <p>💡 Mẹo: Nhấn ESC để đóng • Enter để tìm kiếm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
