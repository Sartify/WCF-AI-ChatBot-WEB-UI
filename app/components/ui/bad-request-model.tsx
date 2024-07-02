import React, { useState } from 'react';

interface ModalProps {
  onSubmit: (feedback: string) => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const BadFeedbackModal: React.FC<ModalProps> = ({ onSubmit, onCancel }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');

  const feedbackOptions = [
    "Not factually correct", "Slow to respond", "Didn't fully follow instructions",
    "Didn't help at all", "Unsafe or problematic", "Other"
  ];

  const handleFeedbackClick = (feedback: string) => {
    setSelectedFeedback(feedback);
    if (feedback !== 'Other') {
      setAdditionalDetails('');
    }
  };

  const handleSubmit = () => {
    onSubmit(`${selectedFeedback}: ${additionalDetails}`);
  };

  return (
    <div className="px-3 lg:px-0 py-2 lg:py-0 fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="lg:text-xl text-[1.2rem] font-bold mb-4 text-center">Please. Tell us more</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {feedbackOptions.map((option) => (
            <button
              key={option}
              className={`p-2 border rounded-md text-sm ${selectedFeedback === option ? 'bg-gray-200' : ''}`}
              onClick={() => handleFeedbackClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <textarea
          className="w-full max-h-32 p-2 border text-sm mb-4 rounded-md border-input bg-background px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Write other options here..."
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          disabled={selectedFeedback !== 'Other'}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-2 py-2 border hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-2 py-2 bg-blue-500  text-white rounded-lg"
            {...((selectedFeedback === 'Other' || !selectedFeedback) && (!additionalDetails ) ? { disabled: true } : {}) }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadFeedbackModal;
