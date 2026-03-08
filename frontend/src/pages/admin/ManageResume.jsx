import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { resumeService } from '../../services/resumeService.js';

export default function ManageResume() {
  const [current, setCurrent] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    resumeService.get().then(setCurrent);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('title', title);
      fd.append('description', description);
      const updated = await resumeService.upload(fd);
      setCurrent(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-8">Resume</h1>

      {current && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{current.title || 'Resume'}</p>
            <p className="text-gray-500 text-xs mt-1">
              Uploaded {new Date(current.uploaded_at).toLocaleDateString()}
            </p>
          </div>
          <a
            href={resumeService.download()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            Download current
          </a>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg space-y-4"
      >
        <h2 className="text-white font-medium">Upload New Resume</h2>
        {[
          { label: 'Title', value: title, set: setTitle },
          { label: 'Description', value: description, set: setDesc },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-400 mb-1">PDF File *</label>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {success ? '✓ Uploaded' : loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>
    </AdminLayout>
  );
}
