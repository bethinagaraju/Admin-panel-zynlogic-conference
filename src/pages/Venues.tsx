// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface Venue {
//   id: number;
//   venue: string;
//   conferencecode: string | null;
// }

// function Venues() {
//   const { selectedEvent } = useSelectedEvent();
//   const [venues, setVenues] = useState<Venue[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   // Add state
//   const [showAdd, setShowAdd] = useState(false);
//   const [addVenue, setAddVenue] = useState('');
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   // Edit state
//   const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
//   const [editVenue, setEditVenue] = useState('');
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   const [deletingIds, setDeletingIds] = useState<number[]>([]);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     if (!selectedEvent) {
//       setVenues([]);
//       setLoading(false);
//       return;
//     }

//     const url = `https://backendconf.roboticsaisummit.com//api/robotics/venues/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: Venue[]) => {
//         if (!mounted) return;
//         setVenues(data || []);
//       })
//       .catch((err) => {
//         if (!mounted) return;
//         setError(String(err));
//       })
//       .finally(() => {
//         if (mounted) setLoading(false);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [selectedEvent, reloadCounter]);

//   const reload = () => setReloadCounter((c) => c + 1);

//   // Add helpers
//   const openAdd = () => {
//     setShowAdd(true);
//     setAddVenue('');
//     setAddError(null);
//   };

//   const closeAdd = () => {
//     setShowAdd(false);
//     setAddVenue('');
//     setAddError(null);
//   };

//   const submitAdd = async () => {
//     if (!selectedEvent) {
//       setAddError('selectedEvent not set');
//       return;
//     }
//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       const url = `https://backendconf.roboticsaisummit.com//api/robotics/venues`;
//       const body = new FormData();
//       body.append('venue', addVenue);
//       body.append('conferencecode', selectedEvent);

//       const res = await fetch(url, { method: 'POST', body });
//       if (!res.ok) {
//         const text = await res.text().catch(() => '');
//         throw new Error(`Status ${res.status} ${text}`);
//       }

//       try {
//         const json = await res.json();
//         if (json && typeof json === 'object') {
//           setVenues((prev) => [json as Venue, ...prev]);
//         } else {
//           setReloadCounter((c) => c + 1);
//         }
//       } catch (_) {
//         setReloadCounter((c) => c + 1);
//       }

//       closeAdd();
//     } catch (err: any) {
//       setAddError(String(err?.message ?? err));
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   // Edit helpers
//   const openEdit = (v: Venue) => {
//     setEditingVenue(v);
//     setEditVenue(v.venue || '');
//     setEditError(null);
//   };

//   const closeEdit = () => {
//     setEditingVenue(null);
//     setEditVenue('');
//     setEditError(null);
//   };

//   const submitEdit = async () => {
//     if (!editingVenue) return;
//     if (!selectedEvent) {
//       setEditError('selectedEvent not set');
//       return;
//     }
//     setEditSubmitting(true);
//     setEditError(null);

//     try {
//       const id = editingVenue.id;
//       const url = `https://backendconf.roboticsaisummit.com//api/robotics/venues/${id}`;

//       const body = new FormData();
//       body.append('venue', editVenue);
//       body.append('conferencecode', selectedEvent);

//       const res = await fetch(url, { method: 'PUT', body });
//       if (!res.ok) {
//         const text = await res.text().catch(() => '');
//         throw new Error(`Status ${res.status} ${text}`);
//       }

//       // update local list with returned object or optimistic update
//       try {
//         const json = await res.json();
//         if (json && typeof json === 'object') {
//           setVenues((prev) => prev.map((v) => (v.id === id ? (json as Venue) : v)));
//         } else {
//           setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, venue: editVenue, conferencecode: selectedEvent } : v)));
//         }
//       } catch (_) {
//         setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, venue: editVenue, conferencecode: selectedEvent } : v)));
//       }

//       closeEdit();
//     } catch (err: any) {
//       setEditError(String(err?.message ?? err));
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   // Delete handler
//   const deleteVenue = async (id: number) => {
//     if (!selectedEvent) {
//       alert('selectedEvent not set');
//       return;
//     }

//     const ok = window.confirm('Delete this venue?');
//     if (!ok) return;

//     try {
//       setDeletingIds((s) => [...s, id]);
//       const url = `https://backendconf.roboticsaisummit.com//api/robotics/venues/${id}`;
//       const res = await fetch(url, { method: 'DELETE' });
//       if (!res.ok) {
//         const text = await res.text().catch(() => '');
//         throw new Error(`Status ${res.status} ${text}`);
//       }

//       // remove from local list
//       setVenues((prev) => prev.filter((v) => v.id !== id));
//     } catch (err: any) {
//       alert('Failed to delete: ' + String(err?.message ?? err));
//     } finally {
//       setDeletingIds((s) => s.filter((x) => x !== id));
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-2">
//         <h2 className="text-3xl font-bold text-gray-800">Venues Management</h2>
//         <div className="flex items-center gap-2">
//           <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
//             <Plus className="w-5 h-5" />
//             Add Venue
//           </button>
//           <button onClick={reload} title="Reload venues" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
//             <RefreshCw className="w-4 h-4 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="p-6 text-center text-gray-500">Loading venues...</div>
//           ) : error ? (
//             <div className="p-6 text-center text-red-500">Error loading venues: {error}</div>
//           ) : venues.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">No venues found.</div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Venue</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {venues.map((venue) => (
//                   <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-sm text-gray-700">{venue.id}</td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{venue.venue}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button onClick={() => openEdit(venue)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteVenue(venue.id)}
//                           disabled={deletingIds.includes(venue.id)}
//                           className={`p-2 rounded-lg transition-colors ${deletingIds.includes(venue.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editingVenue && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Edit Venue #{editingVenue.id}</h3>
//               <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
//                 <input value={editVenue} onChange={(e) => setEditVenue(e.target.value)} className="w-full px-3 py-2 border rounded" />
//               </div>

//               {editError && <div className="text-red-600">{editError}</div>}

//               <div className="flex justify-end gap-2">
//                 <button onClick={closeEdit} disabled={editSubmitting} className="px-4 py-2 rounded border">Cancel</button>
//                 <button onClick={submitEdit} disabled={editSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{editSubmitting ? 'Saving...' : 'Save'}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Add Venue</h3>
//               <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
//                 <input value={addVenue} onChange={(e) => setAddVenue(e.target.value)} className="w-full px-3 py-2 border rounded" />
//               </div>

//               {addError && <div className="text-red-600">{addError}</div>}

//               <div className="flex justify-end gap-2">
//                 <button onClick={closeAdd} disabled={addSubmitting} className="px-4 py-2 rounded border">Cancel</button>
//                 <button onClick={submitAdd} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{addSubmitting ? 'Adding...' : 'Add'}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Venues;









import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Venue {
  id: number;
  venue: string;
  conferencecode: string | null;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/venues';

function Venues() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addVenue, setAddVenue] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editVenue, setEditVenue] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setVenues([]);
      setLoading(false);
      return;
    }

    // GET /api/robotics/venues/by-conferencecode/{conferencecode}
    const url = `${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Venue[]) => {
        if (!mounted) return;
        setVenues(data || []);
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
    setAddVenue('');
    setAddError(null);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddVenue('');
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
    if (!addVenue.trim()) {
      setAddError('Venue name is required');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      // POST /api/robotics/venues?venue=...&conferencecode=...&username=...
      const params = new URLSearchParams();
      params.append('venue', addVenue);
      params.append('conferencecode', selectedEvent);
      params.append('username', username);

      const res = await fetch(`${API_BASE_URL}?${params.toString()}`, { 
        method: 'POST' 
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
  const openEdit = (v: Venue) => {
    setEditingVenue(v);
    setEditVenue(v.venue || '');
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingVenue(null);
    setEditVenue('');
    setEditError(null);
  };

  const submitEdit = async () => {
    if (!editingVenue) return;
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
      // PUT /api/robotics/venues/{id}?venue=...&conferencecode=...&username=...
      const params = new URLSearchParams();
      params.append('venue', editVenue);
      params.append('conferencecode', selectedEvent);
      params.append('username', username);

      const url = `${API_BASE_URL}/${editingVenue.id}?${params.toString()}`;

      const res = await fetch(url, { method: 'PUT' });
      
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
  const deleteVenue = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!window.confirm('Delete this venue?')) return;

    try {
      setDeletingIds((s) => [...s, id]);
      
      // DELETE /api/robotics/venues/{id}?username={username}
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Status ${res.status} ${text}`);
      }

      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + String(err?.message ?? err));
    } finally {
      setDeletingIds((s) => s.filter((x) => x !== id));
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Venues Management</h2>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Add Venue
          </button>
          <button onClick={reload} title="Reload venues" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* List Display */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading venues...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : venues.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No venues found for <span className="font-semibold">{selectedEvent}</span>.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Venue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{venue.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{venue.venue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(venue)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVenue(venue.id)}
                          disabled={deletingIds.includes(venue.id)}
                          className={`p-2 rounded-lg transition-colors ${deletingIds.includes(venue.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
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
      {editingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Edit Venue</h3>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                <input 
                  value={editVenue} 
                  onChange={(e) => setEditVenue(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="Enter venue name"
                />
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
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Add Venue</h3>
              <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                <input 
                  value={addVenue} 
                  onChange={(e) => setAddVenue(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="Enter venue name"
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
                  {addSubmitting ? 'Adding...' : 'Add Venue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Venues;