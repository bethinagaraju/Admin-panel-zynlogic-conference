import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useEffect, useState } from 'react';

interface University {
  id: number;
  name: string;
  conferencecode: string | null;
  imagePath?: string;
}

function Universities() {
  const { selectedEvent } = useSelectedEvent();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setUniversities([]);
      setLoading(false);
      return;
    }

    const url = `https://backendconf.roboticsaisummit.com//api/robotics/universities/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: University[]) => {
        if (!mounted) return;
        setUniversities(data || []);
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

  // Edit state
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [editName, setEditName] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Edit helpers
  const openEdit = (u: University) => {
    setEditingUniversity(u);
    setEditName(u.name || '');
    setEditImageFile(null);
    setEditImagePreview(u.imagePath || null);
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingUniversity(null);
    setEditName('');
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditError(null);
  };

  const onEditImageChange = (file?: File) => {
    if (!file) {
      setEditImageFile(null);
      setEditImagePreview(editingUniversity?.imagePath || null);
      return;
    }
    setEditImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setEditImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submitEdit = async () => {
    if (!editingUniversity) return;
    if (!selectedEvent) {
      setEditError('selectedEvent not set');
      return;
    }
    setEditSubmitting(true);
    setEditError(null);

    try {
      const id = editingUniversity.id;
      const url = `https://backendconf.roboticsaisummit.com//api/robotics/universities/${id}`;

      const body = new FormData();
      body.append('name', editName);
      body.append('conferencecode', selectedEvent);
      if (editImageFile) body.append('image', editImageFile);

      const res = await fetch(url, { method: 'PUT', body });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      // update local list with returned object or optimistic update
      try {
        const json = await res.json();
        if (json && typeof json === 'object') {
          setUniversities((prev) => prev.map((u) => (u.id === id ? (json as University) : u)));
        } else {
          setUniversities((prev) => prev.map((u) => (u.id === id ? { ...u, name: editName, imagePath: editImagePreview ?? u.imagePath, conferencecode: selectedEvent } : u)));
        }
      } catch (_) {
        setUniversities((prev) => prev.map((u) => (u.id === id ? { ...u, name: editName, imagePath: editImagePreview ?? u.imagePath, conferencecode: selectedEvent } : u)));
      }

      closeEdit();
    } catch (err: any) {
      setEditError(String(err?.message ?? err));
    } finally {
      setEditSubmitting(false);
    }
  };

  // Add helpers
  const openAdd = () => {
    setShowAdd(true);
    setAddName('');
    setAddImageFile(null);
    setAddImagePreview(null);
    setAddError(null);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddName('');
    setAddImageFile(null);
    setAddImagePreview(null);
    setAddError(null);
  };

  const onAddImageChange = (file?: File) => {
    if (!file) {
      setAddImageFile(null);
      setAddImagePreview(null);
      return;
    }
    setAddImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setAddImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('selectedEvent not set');
      return;
    }
    setAddSubmitting(true);
    setAddError(null);

    try {
      const url = `https://backendconf.roboticsaisummit.com//api/robotics/universities`;
      const body = new FormData();
      body.append('name', addName);
      body.append('conferencecode', selectedEvent);
      if (addImageFile) body.append('image', addImageFile);

      const res = await fetch(url, { method: 'POST', body });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      try {
        const json = await res.json();
        if (json && typeof json === 'object') {
          setUniversities((prev) => [json as University, ...prev]);
        } else {
          setReloadCounter((c) => c + 1);
        }
      } catch (_) {
        setReloadCounter((c) => c + 1);
      }

      closeAdd();
    } catch (err: any) {
      setAddError(String(err?.message ?? err));
    } finally {
      setAddSubmitting(false);
    }
  };

  // Delete handler
  const deleteUniversity = async (id: number) => {
    if (!selectedEvent) {
      alert('selectedEvent not set');
      return;
    }

    const ok = window.confirm('Delete this university?');
    if (!ok) return;

    try {
      setDeletingIds((s) => [...s, id]);
      const url = `https://backendconf.roboticsaisummit.com//api/robotics/universities/${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      // remove from local list
      setUniversities((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + String(err?.message ?? err));
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-gray-800">Universities Management</h2>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Add University
          </button>
          <button onClick={reload} title="Reload universities" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading universities...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-red-500">Error loading universities: {error}</td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No universities found.</td>
                </tr>
              ) : (
                universities.map((university) => (
                  <tr key={university.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{university.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{university.name}</td>
                    <td className="px-6 py-4">
                      {university.imagePath ? (
                        <img src={university.imagePath} alt={university.name} className="w-16 h-10 object-cover rounded" />
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(university)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUniversity(university.id)}
                          disabled={deletingIds.includes(university.id)}
                          className={`p-2 rounded-lg transition-colors ${deletingIds.includes(university.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUniversity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit University #{editingUniversity.id}</h3>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => onEditImageChange(e.target.files?.[0])} />
                {editImagePreview && <img src={editImagePreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
              </div>

              {editError && <div className="text-red-600">{editError}</div>}

              <div className="flex justify-end gap-2">
                <button onClick={closeEdit} disabled={editSubmitting} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={submitEdit} disabled={editSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{editSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add University</h3>
              <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={addName} onChange={(e) => setAddName(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => onAddImageChange(e.target.files?.[0])} />
                {addImagePreview && <img src={addImagePreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
              </div>

              {addError && <div className="text-red-600">{addError}</div>}

              <div className="flex justify-end gap-2">
                <button onClick={closeAdd} disabled={addSubmitting} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={submitAdd} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{addSubmitting ? 'Adding...' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Universities;
