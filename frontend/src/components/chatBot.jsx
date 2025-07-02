import React, { useState } from "react";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className="
            bg-white
            border border-gray-300
            rounded-lg
            shadow-lg
            flex flex-col
            mb-2
            resize
            overflow-auto
          "
          style={{
            width: "320px",
            height: "480px",
            minWidth: "250px",
            minHeight: "300px",
            maxWidth: "90vw",
            maxHeight: "90vh"
          }}
        >
          <div className="bg-indigo-600 text-white flex justify-between items-center p-2">
            <span className="font-semibold">StudyMate AI</span>
            <button
              onClick={toggleWidget}
              className="text-white text-lg hover:text-gray-200"
            >
              ✖
            </button>
          </div>
          <div className="flex-1">
            <iframe
              title="StudyMate AI Assistant"
              src="https://studymate-ai-assistant.onrender.com"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
      <button
        onClick={toggleWidget}
        className="
          bg-indigo-600 
          text-white 
          w-14 h-14 
          rounded-full 
          shadow-lg 
          flex items-center justify-center 
          text-2xl 
          hover:bg-indigo-700
        "
      >
        💬
      </button>
    </div>
  );
};

export default ChatbotWidget;
