import { Plus, Edit, Trash2, RefreshCw, Star } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  university?: string;
  description?: string;
  rating?: number;
  conferencecode: string;
  imagePath?: string;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/testimonials';

function Testimonials() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUniversity, setAddUniversity] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addRating, setAddRating] = useState<number | ''>('');
  const [addImage, setAddImage] = useState<File | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRating, setEditRating] = useState<number | ''>('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setTestimonials([]);
      setLoading(false);
      return;
    }

    // GET /api/testimonials/by-conferencecode/{conferencecode}
    const url = `${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Testimonial[]) => {
        if (!mounted) return;
        setTestimonials(data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedEvent, reloadCounter]);

  const reload = () => setReloadCounter((c) => c + 1);

  /* ================= ADD ================= */
  const openAdd = () => {
    setShowAdd(true);
    setAddName('');
    setAddUniversity('');
    setAddDescription('');
    setAddRating('');
    setAddImage(null);
    setAddError(null);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddName('');
    setAddUniversity('');
    setAddDescription('');
    setAddRating('');
    setAddImage(null);
    setAddError(null);
  };

  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('selectedEvent not set');
      return;
    }
    if (!username) {
      setAddError('Username not available');
      return;
    }
    if (!addName.trim()) {
      setAddError('Name is required');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      // POST /api/testimonials with FormData
      const formData = new FormData();
      formData.append('name', addName.trim());
      formData.append('conferencecode', selectedEvent);
      formData.append('username', username);
      if (addUniversity.trim()) {
        formData.append('university', addUniversity.trim());
      }
      if (addDescription.trim()) {
        formData.append('description', addDescription.trim());
      }
      if (addRating !== '') {
        formData.append('rating', String(addRating));
      }
      if (addImage) {
        formData.append('image', addImage);
      }

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      // Reload list to get fresh data including ID
      setReloadCounter((c) => c + 1);
      closeAdd();
    } catch (err: any) {
      setAddError(String(err?.message ?? err));
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setEditName(t.name || '');
    setEditUniversity(t.university || '');
    setEditDescription(t.description || '');
    setEditRating(t.rating || '');
    setEditImage(null);
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingTestimonial(null);
    setEditName('');
    setEditUniversity('');
    setEditDescription('');
    setEditRating('');
    setEditImage(null);
    setEditError(null);
  };

  const submitEdit = async () => {
    if (!editingTestimonial) return;
    if (!selectedEvent) {
      setEditError('selectedEvent not set');
      return;
    }
    if (!username) {
      setEditError('Username not available');
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      // PUT /api/testimonials/{id} with FormData
      const formData = new FormData();
      formData.append('name', editName.trim());
      formData.append('conferencecode', selectedEvent);
      formData.append('username', username);
      if (editUniversity.trim()) {
        formData.append('university', editUniversity.trim());
      }
      if (editDescription.trim()) {
        formData.append('description', editDescription.trim());
      }
      if (editRating !== '') {
        formData.append('rating', String(editRating));
      }
      if (editImage) {
        formData.append('image', editImage);
      }

      const url = `${API_BASE_URL}/${editingTestimonial.id}`;

      const res = await fetch(url, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      setReloadCounter((c) => c + 1);
      closeEdit();
    } catch (err: any) {
      setEditError(String(err?.message ?? err));
    } finally {
      setEditSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteTestimonial = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!window.confirm('Delete this testimonial?')) return;

    try {
      setDeletingIds((s) => [...s, id]);

      // DELETE /api/testimonials/{id} with FormData
      const formData = new FormData();
      formData.append('username', username);

      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + String(err?.message ?? err));
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Testimonials Management</h2>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Add Testimonial
          </button>
          <button onClick={reload} title="Reload testimonials" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* List Display */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading testimonials...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : testimonials.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No testimonials found for <span className="font-semibold">{selectedEvent}</span>.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{testimonial.id}</td>
                    <td className="px-6 py-4">
                      {testimonial.imagePath ? (
                        <img src={testimonial.imagePath} alt={testimonial.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{testimonial.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{testimonial.university || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{testimonial.description || '-'}</td>
                    <td className="px-6 py-4">{renderStars(testimonial.rating)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(testimonial)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          disabled={deletingIds.includes(testimonial.id)}
                          className={`p-2 rounded-lg transition-colors ${deletingIds.includes(testimonial.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Edit Testimonial</h3>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter university"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter testimonial description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">No rating</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {editingTestimonial.imagePath && (
                  <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                )}
              </div>

              {editError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{editError}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={closeEdit} disabled={editSubmitting} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                <button
                  onClick={submitEdit}
                  disabled={editSubmitting}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {editSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Add Testimonial</h3>
              <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  value={addUniversity}
                  onChange={(e) => setAddUniversity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter university"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter testimonial description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <select
                  value={addRating}
                  onChange={(e) => setAddRating(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">No rating</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAddImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {addError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{addError}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={closeAdd} disabled={addSubmitting} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                <button
                  onClick={submitAdd}
                  disabled={addSubmitting}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {addSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
                  {addSubmitting ? 'Adding...' : 'Add Testimonial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonials;