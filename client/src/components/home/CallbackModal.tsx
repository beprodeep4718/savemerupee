import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', age: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setMessage('Request submitted successfully.');
      onClose();
      console.log('Submitted:', data);
    } catch (err) {
      setMessage('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Request a Call Back</h3>
          <button onClick={onClose} aria-label="Close dialog" className="text-gray-600 hover:text-gray-900 bg-gray-100 rounded-md p-2">✕</button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input name="age" value={form.age} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2" />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
          {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
        </div>
      </div>
    </div>
  );
}
