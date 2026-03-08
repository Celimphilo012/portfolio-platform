import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { aboutService } from '../../services/aboutService.js';

export default function ManageAbout() {
  const [form, setForm] = useState({ headline: '', bio: '', avatar_url: '', location: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    aboutService.get().then((d) => d && setForm(d));
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await aboutService.update(form);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-8">About</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl space-y-4"
      >
        {[
          { name: 'headline', label: 'Headline' },
          { name: 'location', label: 'Location' },
          { name: 'avatar_url', label: 'Avatar URL' },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saved ? '✓ Saved' : loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </AdminLayout>
  );
}
