import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Committee {
  id: number;
  conferencecode: string;
  name: string;
  university: string;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/committees';

function Committees() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();

  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  /* ===== ADD STATE ===== */
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUniversity, setAddUniversity] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  /* ===== EDIT STATE ===== */
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Drag & Drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  /* ===== FETCH ===== */
  useEffect(() => {
    if (!selectedEvent) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Committee[]) => {
        setCommittees(data || []);
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedEvent, reloadCounter]);

  /* ===== ADD ===== */
  const openAdd = () => {
    setShowAdd(true);
    setAddName('');
    setAddUniversity('');
    setAddError(null);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddName('');
    setAddUniversity('');
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

    setAddSubmitting(true);
    setAddError(null);

    try {
      const params = new URLSearchParams();
      params.append('conferencecode', selectedEvent);
      params.append('name', addName);
      params.append('university', addUniversity);
      params.append('username', username);

      const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setReloadCounter((c) => c + 1);
      closeAdd();
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ===== EDIT ===== */
  const openEdit = (c: Committee) => {
    setEditingCommittee(c);
    setEditName(c.name || '');
    setEditUniversity(c.university || '');
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingCommittee(null);
    setEditName('');
    setEditUniversity('');
    setEditError(null);
  };

  const submitEdit = async () => {
    if (!editingCommittee) return;
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
      const params = new URLSearchParams();
      params.append('conferencecode', selectedEvent);
      params.append('name', editName);
      params.append('university', editUniversity);
      params.append('username', username);

      const res = await fetch(`${API_BASE_URL}/${editingCommittee.id}?${params.toString()}`, {
        method: 'PUT',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setReloadCounter((c) => c + 1);
      closeEdit();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  /* ===== DELETE ===== */
  const deleteCommittee = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!window.confirm('Delete this committee?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setReloadCounter((c) => c + 1);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  /* ===== REORDER (Drag & Drop) ===== */
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    // 1. Reorder locally (Optimistic UI update)
    const updatedCommittees = [...committees];
    const [draggedItem] = updatedCommittees.splice(draggedItemIndex, 1);
    updatedCommittees.splice(targetIndex, 0, draggedItem);
    
    setCommittees(updatedCommittees);
    setDraggedItemIndex(null);
    setIsReordering(true);

    try {
      // 2. Prepare payload: Array of IDs in new order
      const committeeIds = updatedCommittees.map((c) => c.id);

      // 3. Send PUT request
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(committeeIds),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to save order: ${text}`);
      }
    } catch (err) {
      // Revert on error (trigger reload)
      console.error('Reorder failed:', err);
      setError('Failed to save new order. Reloading...');
      setReloadCounter((prev) => prev + 1);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-gray-800">Committees</h2>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Add Committee
          </button>
          <button onClick={() => setReloadCounter((c) => c + 1)} title="Reload committees" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">University</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {committees.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No committees found for {selectedEvent}.
                </td>
              </tr>
            ) : (
              committees.map((c, index) => (
                <tr 
                  key={c.id} 
                  className={`hover:bg-gray-50 transition-colors ${draggedItemIndex === index ? 'opacity-50 bg-gray-100' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <td className="p-3 whitespace-nowrap text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5 mx-auto hover:text-gray-600" />
                  </td>
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.university}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteCommittee(c.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Add Committee</h3>

            <input
              placeholder="Name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="border p-2 w-full"
            />

            <input
              placeholder="University"
              value={addUniversity}
              onChange={(e) => setAddUniversity(e.target.value)}
              className="border p-2 w-full"
            />

            {addError && <p className="text-red-600">{addError}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={closeAdd} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={submitAdd} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
                {addSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCommittee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Edit Committee</h3>

            <input
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 w-full"
            />

            <input
              placeholder="University"
              value={editUniversity}
              onChange={(e) => setEditUniversity(e.target.value)}
              className="border p-2 w-full"
            />

            {editError && <p className="text-red-600">{editError}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={closeEdit} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={submitEdit} disabled={editSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
                {editSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Committees;