import React, { useState } from 'react';
import { X, FileText, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MarksheetNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (marksheetNumber: string) => Promise<void>;
  studentName: string;
}

const MarksheetNumberModal: React.FC<MarksheetNumberModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentName
}) => {
  const [marksheetNumber, setMarksheetNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!marksheetNumber.trim()) {
      toast.error('Please enter a marksheet number');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(marksheetNumber.trim());
      setMarksheetNumber('');
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error in marksheet number confirmation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMarksheetNumber('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Enter Marksheet Number</h2>
              <p className="text-sm text-gray-500">Generate certificate for {studentName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="marksheetNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Marksheet Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="marksheetNumber"
                  value={marksheetNumber}
                  onChange={(e) => setMarksheetNumber(e.target.value)}
                  placeholder="e.g., MS2412001"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  autoFocus
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the marksheet number to generate a certificate from
              </p>
            </div>

            {/* Example marksheet numbers */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Example Format:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• MS2412001 (Marksheet + Year + Month + Number)</p>
                <p>• MS2024001 (Marksheet + Year + Sequential Number)</p>
                <p>• MS2412001 (Marksheet + Academic Year + Number)</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !marksheetNumber.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarksheetNumberModal;
