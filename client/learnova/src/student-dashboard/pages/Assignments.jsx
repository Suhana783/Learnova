import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { uploadAssignment, getAssignments } from '../../services/assignmentService';
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UploadCloud,
  X,
  Loader2,
  FileCheck,
} from 'lucide-react';

export default function Assignments() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [assignments, setAssignments] = useState([]);

  const fetchMyAssignments = useCallback(async () => {
    if (!user?.email) return;
    setIsLoadingList(true);
    try {
      const res = await getAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, [user?.email]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyAssignments();
  }, [fetchMyAssignments]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        setError('Please select a valid file (PDF, PNG, JPG, JPEG).');
        setSelectedFile(null);
        return;
      }
      setError('');
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        setError('Please select a valid file (PDF, PNG, JPG, JPEG).');
        return;
      }
      setError('');
      setSelectedFile(file);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setTitle(cleanName);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('fileType', selectedFile.type || 'application/pdf');
      formData.append('studentEmail', user?.email || '');
      formData.append('studentName', user?.name || '');
      if (user?.id || user?._id) {
        formData.append('userId', user.id || user._id);
      }

      await uploadAssignment(formData);

      setSuccess('Assignment uploaded successfully to Cloudinary!');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await fetchMyAssignments();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to upload assignment. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-8 max-w-5xl">

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-navy-950/80 border border-navy-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/30 text-accent-500 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Upload New Assignment
            </h2>
            <p className="text-xs text-gray-400">
              Submit your work directly. Files are stored securely on Cloudinary.
            </p>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Assignment Title <span className="text-accent-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. JavaScript Async Project Submission"
                required
                className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Notes / Comments (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary or special notes"
                className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-accent-500 placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Assignment File <span className="text-accent-500">*</span>
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? 'border-accent-500/60 bg-accent-500/5'
                  : 'border-navy-700 hover:border-accent-500/50 hover:bg-navy-900/50 bg-navy-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-navy-800 text-accent-400 flex items-center justify-center mx-auto">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">
                      Click to choose a file
                    </span>{' '}
                    <span className="text-sm text-gray-400">or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supports PDF, PNG, JPG, JPEG (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between max-w-md mx-auto p-3 bg-navy-950/80 rounded-xl border border-accent-500/30 text-left">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-accent-500/15 text-accent-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-navy-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-navy-950 font-semibold text-sm transition-all shadow-md hover:shadow-accent-500/20 active:scale-[0.99] cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-navy-950/80 border border-navy-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                My Submitted Assignments
              </h2>
              <p className="text-xs text-gray-400">
                Track all your assignment uploads and Cloudinary links
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-850 border border-navy-700 text-gray-300">
            {assignments.length} Total
          </span>
        </div>

        {isLoadingList ? (
          <div className="py-12 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent-500" />
            <span>Loading submissions...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-navy-800 rounded-xl bg-navy-900/30">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">
              No assignments uploaded yet
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              You haven't uploaded any assignments yet. Use the upload box above to submit your project or homework files.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-navy-800 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Cloudinary File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-850">
                {assignments.map((item) => (
                  <tr key={item._id} className="hover:bg-navy-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">
                        {item.title || 'Assignment Submission'}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2.5 py-1 rounded bg-navy-850 text-gray-300 font-mono">
                        {item.fileType?.split('/')[1] || item.fileType || 'file'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recently'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {item.status || 'Submitted'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 text-xs font-semibold border border-accent-500/25 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
