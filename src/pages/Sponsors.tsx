// // import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// // import { useSelectedEvent } from '../context/SelectedEventContext';
// // import { useEffect, useState } from 'react';

// // interface Sponsor {
// //   id: number;
// //   name: string;
// //   type: string;
// //   conferencecode: string | null;
// //   imagePath?: string;
// // }

// // function Sponsors() {
// //   const { selectedEvent } = useSelectedEvent();
// //   const [sponsors, setSponsors] = useState<Sponsor[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [reloadCounter, setReloadCounter] = useState(0);
// //   // Add sponsor state
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [addName, setAddName] = useState('');
// //   const [addType, setAddType] = useState('');
// //   const [addFile, setAddFile] = useState<File | null>(null);
// //   const [addPreview, setAddPreview] = useState<string | null>(null);
// //   const [addSubmitting, setAddSubmitting] = useState(false);
// //   const [addError, setAddError] = useState<string | null>(null);
// //   // Edit state
// //   const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
// //   const [editName, setEditName] = useState('');
// //   const [editType, setEditType] = useState('');
// //   const [editFile, setEditFile] = useState<File | null>(null);
// //   const [editPreview, setEditPreview] = useState<string | null>(null);
// //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// //   useEffect(() => {
// //     let mounted = true;
// //     setLoading(true);
// //     setError(null);

// //     if (!selectedEvent) {
// //       setSponsors([]);
// //       setLoading(false);
// //       return;
// //     }

// //     const url = `https://backendconf.roboticsaisummit.com//api/robotics/sponsors/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

// //     fetch(url)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`Status ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data: Sponsor[]) => {
// //         if (!mounted) return;
// //         setSponsors(data || []);
// //       })
// //       .catch((err) => {
// //         if (!mounted) return;
// //         setError(String(err));
// //       })
// //       .finally(() => {
// //         if (mounted) setLoading(false);
// //       });

// //     return () => {
// //       mounted = false;
// //     };
// //   }, [selectedEvent, reloadCounter]);

// //   const reload = () => setReloadCounter((c) => c + 1);

// //   // Edit helpers
// //   const openEdit = (s: Sponsor) => {
// //     setEditingSponsor(s);
// //     setEditName(s.name || '');
// //     setEditType(s.type || '');
// //     setEditFile(null);
// //     setEditPreview(s.imagePath || null);
// //     setEditError(null);
// //   };

// //   const closeEdit = () => {
// //     setEditingSponsor(null);
// //     setEditName('');
// //     setEditType('');
// //     setEditFile(null);
// //     setEditPreview(null);
// //     setEditError(null);
// //   };

// //   const onEditFileChange = (file?: File) => {
// //     if (!file) {
// //       setEditFile(null);
// //       setEditPreview(editingSponsor?.imagePath || null);
// //       return;
// //     }
// //     setEditFile(file);
// //     const reader = new FileReader();
// //     reader.onload = () => setEditPreview(String(reader.result));
// //     reader.readAsDataURL(file);
// //   };

// //   const submitEdit = async () => {
// //     if (!editingSponsor) return;
// //     if (!selectedEvent) {
// //       setEditError('selectedEvent not set');
// //       return;
// //     }
// //     setEditSubmitting(true);
// //     setEditError(null);

// //     try {
// //       const id = editingSponsor.id;
// //       // PUT to: https://backendconf.roboticsaisummit.com//{selectedEvent}/api/robotics/sponsors/{id}
// //       const url = `https://backendconf.roboticsaisummit.com//api/robotics/sponsors/${id}`;

// //       const body = new FormData();
// //       body.append('name', editName);
// //       body.append('type', editType);
// //       body.append('conferencecode', selectedEvent);
// //       if (editFile) body.append('file', editFile);

// //       const res = await fetch(url, { method: 'PUT', body });
// //       if (!res.ok) {
// //         const text = await res.text().catch(() => '');
// //         throw new Error(`Status ${res.status} ${text}`);
// //       }

// //       // update local list with returned object or optimistic update
// //       try {
// //         const json = await res.json();
// //         if (json && typeof json === 'object') {
// //           setSponsors((prev) => prev.map((sp) => (sp.id === id ? (json as Sponsor) : sp)));
// //         } else {
// //           setSponsors((prev) => prev.map((sp) => (sp.id === id ? { ...sp, name: editName, type: editType, imagePath: editPreview ?? sp.imagePath, conferencecode: selectedEvent } : sp)));
// //         }
// //       } catch (_) {
// //         setSponsors((prev) => prev.map((sp) => (sp.id === id ? { ...sp, name: editName, type: editType, imagePath: editPreview ?? sp.imagePath, conferencecode: selectedEvent } : sp)));
// //       }

// //       closeEdit();
// //     } catch (err: any) {
// //       setEditError(String(err?.message ?? err));
// //     } finally {
// //       setEditSubmitting(false);
// //     }
// //   };

// //   // Delete handler
// //   const deleteSponsor = async (id: number) => {
// //     if (!selectedEvent) {
// //       alert('selectedEvent not set');
// //       return;
// //     }

// //     const ok = window.confirm('Delete this sponsor?');
// //     if (!ok) return;

// //     try {
// //       setDeletingIds((s) => [...s, id]);
// //       const url = `https://backendconf.roboticsaisummit.com//api/robotics/sponsors/${id}`;
// //       const res = await fetch(url, { method: 'DELETE' });
// //       if (!res.ok) {
// //         const text = await res.text().catch(() => '');
// //         throw new Error(`Status ${res.status} ${text}`);
// //       }

// //       // remove from local list
// //       setSponsors((prev) => prev.filter((s) => s.id !== id));
// //     } catch (err: any) {
// //       alert('Failed to delete: ' + String(err?.message ?? err));
// //     } finally {
// //       setDeletingIds((s) => s.filter((x) => x !== id));
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="flex items-center justify-between mb-2">
// //         <h2 className="text-3xl font-bold text-gray-800">Sponsors Management</h2>
// //       <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //           <button onClick={() => { setShowAdd(true); setAddError(null); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
// //             <Plus className="w-5 h-5" />
// //             Add Sponsor
// //           </button>
// //           <button onClick={reload} title="Reload sponsors" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
// //             <RefreshCw className="w-4 h-4 text-gray-600" />
// //           </button>
// //         </div>
// //       </div>

// //       <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

// //       <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //         <div className="overflow-x-auto">
// //           {loading ? (
// //             <div className="p-6 text-center text-gray-500">Loading sponsors...</div>
// //           ) : error ? (
// //             <div className="p-6 text-center text-red-500">Error loading sponsors: {error}</div>
// //           ) : sponsors.length === 0 ? (
// //             <div className="p-6 text-center text-gray-500">No sponsors found.</div>
// //           ) : (
// //             <table className="w-full">
// //               <thead className="bg-gray-50 border-b border-gray-200">
// //                 <tr>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {sponsors.map((sponsor) => (
// //                   <tr key={sponsor.id} className="hover:bg-gray-50 transition-colors">
// //                     <td className="px-6 py-4 text-sm text-gray-700">{sponsor.id}</td>
// //                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{sponsor.name}</td>
// //                     <td className="px-6 py-4 text-sm text-gray-700">{sponsor.type}</td>
// //                     <td className="px-6 py-4">
// //                       {sponsor.imagePath ? (
// //                         <img src={sponsor.imagePath} alt={sponsor.name} className="w-24 h-12 object-cover rounded" />
// //                       ) : (
// //                         <span className="text-sm text-gray-500">—</span>
// //                       )}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <div className="flex items-center gap-2">
// //                           <button onClick={() => openEdit(sponsor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
// //                             <Edit className="w-4 h-4" />
// //                           </button>
// //                         <button
// //                           onClick={() => deleteSponsor(sponsor.id)}
// //                           disabled={deletingIds.includes(sponsor.id)}
// //                           className={`p-2 rounded-lg transition-colors ${deletingIds.includes(sponsor.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>
// //       </div>
// //         {/* Edit Modal */}
// //         {editingSponsor && (
// //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// //             <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h3 className="text-lg font-semibold">Edit Sponsor #{editingSponsor.id}</h3>
// //                 <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
// //               </div>

// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
// //                   <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
// //                   <input value={editType} onChange={(e) => setEditType(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Image/File</label>
// //                   <input type="file" accept="image/*" onChange={(e) => onEditFileChange(e.target.files?.[0])} />
// //                   {editPreview && <img src={editPreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
// //                 </div>

// //                 {editError && <div className="text-red-600">{editError}</div>}

// //                 <div className="flex justify-end gap-2">
// //                   <button onClick={closeEdit} disabled={editSubmitting} className="px-4 py-2 rounded border">Cancel</button>
// //                   <button onClick={submitEdit} disabled={editSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{editSubmitting ? 'Saving...' : 'Save'}</button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //         {/* Add Modal */}
// //         {showAdd && (
// //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// //             <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h3 className="text-lg font-semibold">Add Sponsor</h3>
// //                 <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">Close</button>
// //               </div>

// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
// //                   <input value={addName} onChange={(e) => setAddName(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
// //                   <input value={addType} onChange={(e) => setAddType(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Image/File</label>
// //                   <input type="file" accept="image/*" onChange={(e) => {
// //                     const f = e.target.files?.[0];
// //                     if (!f) { setAddFile(null); setAddPreview(null); return; }
// //                     setAddFile(f);
// //                     const reader = new FileReader();
// //                     reader.onload = () => setAddPreview(String(reader.result));
// //                     reader.readAsDataURL(f);
// //                   }} />
// //                   {addPreview && <img src={addPreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
// //                 </div>

// //                 {addError && <div className="text-red-600">{addError}</div>}

// //                 <div className="flex justify-end gap-2">
// //                   <button onClick={() => setShowAdd(false)} disabled={addSubmitting} className="px-4 py-2 rounded border">Cancel</button>
// //                   <button onClick={async () => {
// //                     if (!selectedEvent) { setAddError('selectedEvent not set'); return; }
// //                     setAddSubmitting(true);
// //                     setAddError(null);
// //                     try {
// //                       const url = `https://backendconf.roboticsaisummit.com//api/robotics/sponsors`;
// //                       const body = new FormData();
// //                       body.append('name', addName);
// //                       body.append('type', addType);
// //                       body.append('conferencecode', selectedEvent);
// //                       if (addFile) body.append('file', addFile);

// //                       const res = await fetch(url, { method: 'POST', body });
// //                       if (!res.ok) {
// //                         const text = await res.text().catch(() => '');
// //                         throw new Error(`Status ${res.status} ${text}`);
// //                       }

// //                       try {
// //                         const json = await res.json();
// //                         if (json && typeof json === 'object') {
// //                           setSponsors((prev) => [json as Sponsor, ...prev]);
// //                         } else {
// //                           setReloadCounter((c) => c + 1);
// //                         }
// //                       } catch (_) {
// //                         setReloadCounter((c) => c + 1);
// //                       }

// //                       setShowAdd(false);
// //                     } catch (err: any) {
// //                       setAddError(String(err?.message ?? err));
// //                     } finally {
// //                       setAddSubmitting(false);
// //                     }
// //                   }} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{addSubmitting ? 'Adding...' : 'Add'}</button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //     </div>
// //   );
// // }

// // export default Sponsors;









// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface Sponsor {
//   id: number;
//   name: string;
//   type: string;
//   conferencecode: string | null;
//   imagePath?: string;
// }

// function Sponsors() {
//   const { selectedEvent } = useSelectedEvent();

//   const [sponsors, setSponsors] = useState<Sponsor[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   /* ===== ADD STATE ===== */
//   const [showAdd, setShowAdd] = useState(false);
//   const [addName, setAddName] = useState('');
//   const [addType, setAddType] = useState('');
//   const [addFile, setAddFile] = useState<File | null>(null);
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   /* ===== EDIT STATE ===== */
//   const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
//   const [editName, setEditName] = useState('');
//   const [editType, setEditType] = useState('');
//   const [editFile, setEditFile] = useState<File | null>(null);
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   /* ===== FETCH ===== */
//   useEffect(() => {
//     if (!selectedEvent) return;

//     setLoading(true);
//     setError(null);

//     fetch(`https://backendconf.roboticsaisummit.com//api/robotics/sponsors/by-conferencecode/${encodeURIComponent(selectedEvent)}`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: Sponsor[]) => setSponsors(data || []))
//       .catch((err) => setError(String(err)))
//       .finally(() => setLoading(false));
//   }, [selectedEvent, reloadCounter]);

//   /* ===== ADD ===== */
//   const submitAdd = async () => {
//     if (!selectedEvent) {
//       setAddError('Event not selected');
//       return;
//     }

//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       const body = new FormData();
//       body.append('name', addName);
//       body.append('type', addType);
//       body.append('conferencecode', selectedEvent);
//       if (addFile) body.append('file', addFile);

//       const res = await fetch(
//         `https://backendconf.roboticsaisummit.com//api/robotics/sponsors`,
//         { method: 'POST', body }
//       );

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text);
//       }

//       setReloadCounter((c) => c + 1);
//       setShowAdd(false);
//       setAddName('');
//       setAddType('');
//       setAddFile(null);

//     } catch (err: any) {
//       setAddError(err.message);
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   /* ===== EDIT ===== */
//   const openEdit = (s: Sponsor) => {
//     setEditingSponsor(s);
//     setEditName(s.name);
//     setEditType(s.type);
//     setEditFile(null);
//     setEditError(null);
//   };

//   const closeEdit = () => {
//     setEditingSponsor(null);
//     setEditName('');
//     setEditType('');
//     setEditFile(null);
//     setEditError(null);
//   };

//   const submitEdit = async () => {
//     if (!editingSponsor || !selectedEvent) return;

//     setEditSubmitting(true);
//     setEditError(null);

//     try {
//       const body = new FormData();
//       body.append('name', editName);
//       body.append('type', editType);
//       body.append('conferencecode', selectedEvent);
//       if (editFile) body.append('file', editFile);

//       const res = await fetch(
//         `https://backendconf.roboticsaisummit.com//api/robotics/sponsors/${editingSponsor.id}`,
//         { method: 'PUT', body }
//       );

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text);
//       }

//       setReloadCounter((c) => c + 1);
//       closeEdit();

//     } catch (err: any) {
//       setEditError(err.message);
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   /* ===== DELETE ===== */
//   const deleteSponsor = async (id: number) => {
//     if (!window.confirm('Delete this sponsor?')) return;

//     await fetch(`https://backendconf.roboticsaisummit.com//api/robotics/sponsors/${id}`, { method: 'DELETE' });
//     setSponsors((s) => s.filter((x) => x.id !== id));
//   };

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-3xl font-bold">Sponsors Management</h2>
//         <div className="flex gap-2">
//           <button onClick={() => setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2">
//             <Plus size={18} /> Add Sponsor
//           </button>
//           <button onClick={() => setReloadCounter((c) => c + 1)} className="border px-3 py-2 rounded">
//             <RefreshCw size={16} />
//           </button>
//         </div>
//       </div>

//       <table className="w-full bg-white rounded shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3">ID</th>
//             <th className="p-3">Name</th>
//             <th className="p-3">Type</th>
//             <th className="p-3">Image</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sponsors.map((s) => (
//             <tr key={s.id}>
//               <td className="p-3">{s.id}</td>
//               <td className="p-3">{s.name}</td>
//               <td className="p-3">{s.type}</td>
//               <td className="p-3">
//                 {s.imagePath && <img src={s.imagePath} className="w-24 h-12 object-cover rounded" />}
//               </td>
//               <td className="p-3 flex gap-2">
//                 <button onClick={() => openEdit(s)} className="text-blue-600"><Edit size={16} /></button>
//                 <button onClick={() => deleteSponsor(s.id)} className="text-red-600"><Trash2 size={16} /></button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ADD MODAL */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
//             <h3 className="text-lg font-semibold">Add Sponsor</h3>

//             <input placeholder="Name" value={addName} onChange={(e) => setAddName(e.target.value)} className="border p-2 w-full" />
//             <input placeholder="Type" value={addType} onChange={(e) => setAddType(e.target.value)} className="border p-2 w-full" />
//             <input type="file" onChange={(e) => setAddFile(e.target.files?.[0] || null)} />

//             {addError && <p className="text-red-600">{addError}</p>}

//             <div className="flex justify-end gap-2">
//               <button onClick={() => setShowAdd(false)} className="border px-4 py-2 rounded">Cancel</button>
//               <button onClick={submitAdd} disabled={addSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {addSubmitting ? 'Adding...' : 'Add'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT MODAL */}
//       {editingSponsor && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
//             <h3 className="text-lg font-semibold">Edit Sponsor</h3>

//             <input value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-2 w-full" />
//             <input value={editType} onChange={(e) => setEditType(e.target.value)} className="border p-2 w-full" />
//             <input type="file" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />

//             {editError && <p className="text-red-600">{editError}</p>}

//             <div className="flex justify-end gap-2">
//               <button onClick={closeEdit} className="border px-4 py-2 rounded">Cancel</button>
//               <button onClick={submitEdit} disabled={editSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {editSubmitting ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Sponsors;









import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Sponsor {
  id: number;
  name: string;
  type: string;
  conferencecode: string | null;
  imagePath?: string;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/sponsors';

function Sponsors() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  /* ===== ADD STATE ===== */
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addType, setAddType] = useState('');
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  /* ===== EDIT STATE ===== */
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ===== FETCH ===== */
  useEffect(() => {
    if (!selectedEvent) return;

    setLoading(true);
    setError(null);

    // GET /api/robotics/sponsors/by-conferencecode/{conferencecode}
    fetch(`${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Sponsor[]) => setSponsors(data || []))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [selectedEvent, reloadCounter]);

  /* ===== ADD ===== */
  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('Event not selected');
      return;
    }
    if (!username) {
      setAddError('Username not available');
      return;
    }

    // Basic validation
    if (!addName || !addType || !addFile) {
      setAddError('Please fill in Name, Type, and select a File.');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      const body = new FormData();
      body.append('name', addName);
      body.append('type', addType);
      body.append('conferencecode', selectedEvent);
      body.append('file', addFile); // File is required for POST
      body.append('username', username);

      // POST /api/robotics/sponsors
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setReloadCounter((c) => c + 1);
      setShowAdd(false);
      // Reset form
      setAddName('');
      setAddType('');
      setAddFile(null);
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ===== EDIT ===== */
  const openEdit = (s: Sponsor) => {
    setEditingSponsor(s);
    setEditName(s.name);
    setEditType(s.type);
    setEditFile(null); // Reset file input
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingSponsor(null);
    setEditName('');
    setEditType('');
    setEditFile(null);
    setEditError(null);
  };

  const submitEdit = async () => {
    if (!editingSponsor || !selectedEvent) return;
    if (!username) {
      setEditError('Username not available');
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      const body = new FormData();
      // Add fields if they have values. The API treats them as optional params.
      if (editName) body.append('name', editName);
      if (editType) body.append('type', editType);
      
      // Ensure we keep the sponsor associated with the current conference
      body.append('conferencecode', selectedEvent);
      
      // Only append file if the user selected a new one
      if (editFile) {
        body.append('file', editFile);
      }

      body.append('username', username);

      // PUT /api/robotics/sponsors/{id}
      const res = await fetch(`${API_BASE_URL}/${editingSponsor.id}`, {
        method: 'PUT',
        body,
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
  const deleteSponsor = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!window.confirm('Delete this sponsor?')) return;

    try {
      // DELETE /api/robotics/sponsors/{id}?username={username}
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }

      setSponsors((s) => s.filter((x) => x.id !== id));
    } catch (err: any) {
      alert('Error deleting sponsor: ' + err.message);
    }
  };

  /* ===== UI ===== */
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">Sponsors Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2"
          >
            <Plus size={18} /> Add Sponsor
          </button>
          <button
            onClick={() => setReloadCounter((c) => c + 1)}
            className="border px-3 py-2 rounded"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading && <p>Loading sponsors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No sponsors found for {selectedEvent}.
                </td>
              </tr>
            ) : (
              sponsors.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.type}</td>
                  <td className="p-3">
                    {/* Assuming imagePath is a full URL or relative path. 
                        If relative, prepend your base URL (e.g. https://backendconf.roboticsaisummit.com/) */}
                    {s.imagePath ? (
                      <img
                        src={s.imagePath}
                        alt={s.name}
                        className="w-24 h-12 object-contain rounded border bg-gray-50"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteSponsor(s.id)}
                      className="text-red-600 hover:text-red-800"
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
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Add Sponsor</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                placeholder="Sponsor Name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                placeholder="Type (e.g., Gold, Silver)"
                value={addType}
                onChange={(e) => setAddType(e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
              />
            </div>

            {addError && <p className="text-red-600 text-sm">{addError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAdd}
                disabled={addSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {addSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingSponsor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Edit Sponsor</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="border p-2 w-full rounded mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep existing image.
              </p>
            </div>

            {editError && <p className="text-red-600 text-sm">{editError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={closeEdit}
                className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                disabled={editSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {editSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sponsors;