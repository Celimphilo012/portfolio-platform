import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { messageService } from '../../services/messageService.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await messageService.send(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Contact</h1>
        <p className="text-gray-400 mb-10">Have a project in mind? Let's talk.</p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-900/40 border border-green-700 rounded-lg text-green-300">
            Message sent! I'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300">
            Something went wrong. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'subject', label: 'Subject', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={name !== 'subject'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}
