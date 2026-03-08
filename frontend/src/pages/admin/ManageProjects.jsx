import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { projectService } from '../../services/projectService.js';

const empty = {
  title: '',
  slug: '',
  description: '',
  technologies: '',
  github_url: '',
  demo_url: '',
  featured: false,
  sort_order: 0,
  problem: '',
  solution: '',
  architecture: '',
  challenges: '',
  lessons: '',
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => projectService.getAll().then(setProjects);
  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      let saved;
      if (editing) {
        saved = await projectService.update(editing, payload);
      } else {
        saved = await projectService.create(payload);
      }
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        await projectService.uploadImage(saved.id, fd);
      }
      setForm(empty);
      setEditing(null);
      setImageFile(null);
      setShowForm(false);
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      ...p,
      technologies: p.technologies?.join(', ') || '',
      problem: p.problem || '',
      solution: p.solution || '',
      architecture: p.architecture || '',
      challenges: p.challenges || '',
      lessons: p.lessons || '',
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await projectService.remove(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={() => {
            setForm(empty);
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + New Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4"
        >
          <h2 className="text-white font-semibold mb-2">
            {editing ? 'Edit Project' : 'New Project'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'title', label: 'Title *' },
              { name: 'slug', label: 'Slug *' },
              { name: 'github_url', label: 'GitHub URL' },
              { name: 'demo_url', label: 'Demo URL' },
              { name: 'technologies', label: 'Technologies (comma separated)' },
              { name: 'sort_order', label: 'Sort Order', type: 'number' },
            ].map(({ name, label, type = 'text' }) => (
              <div key={name}>
                <label className="block text-xs text-gray-400 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured project
          </label>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-sm text-gray-400"
            />
          </div>

          {/* Case study */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-white font-medium text-sm mb-3">Case Study</p>
            {['problem', 'solution', 'architecture', 'challenges', 'lessons'].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                <textarea
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">Featured</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-gray-800 last:border-0">
                <td className="px-5 py-3 text-white">{p.title}</td>
                <td className="px-5 py-3 text-gray-400 font-mono">{p.slug}</td>
                <td className="px-5 py-3 text-gray-400">{p.featured ? '✓' : '—'}</td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-600">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
