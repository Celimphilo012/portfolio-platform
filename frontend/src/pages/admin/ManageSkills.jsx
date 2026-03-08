import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { skillService } from '../../services/skillService.js';

const empty = { name: '', category: '', level: 80, sort_order: 0 };

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => skillService.getAll().then(setSkills);
  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await skillService.update(editing, form);
    } else {
      await skillService.create(form);
    }
    setForm(empty);
    setEditing(null);
    load();
  };

  const handleEdit = (s) => {
    setForm(s);
    setEditing(s.id);
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete skill?')) return;
    await skillService.remove(id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-8">Skills</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
      >
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { name: 'name', label: 'Skill Name' },
            { name: 'category', label: 'Category' },
            { name: 'level', label: 'Level (1-100)', type: 'number' },
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
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {editing ? 'Update' : 'Add Skill'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setForm(empty);
                setEditing(null);
              }}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Level</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="border-b border-gray-800 last:border-0">
                <td className="px-5 py-3 text-white">{s.name}</td>
                <td className="px-5 py-3 text-gray-400">{s.category}</td>
                <td className="px-5 py-3 text-gray-400">{s.level}%</td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
