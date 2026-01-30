// // // import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// // // import { useSelectedEvent } from '../context/SelectedEventContext';
// // // import { useEffect, useState } from 'react';

// // // interface Speaker {
// // //   id: number;
// // //   name: string;
// // //   university: string;
// // //   conferencecode: string | null;
// // //   imagePath?: string;
// // // }
// // // function Speakers() {
// // //   const { selectedEvent } = useSelectedEvent();
// // //   const [speakers, setSpeakers] = useState<Speaker[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
// // //   const [editName, setEditName] = useState('');
// // //   const [editUniversity, setEditUniversity] = useState('');
// // //   const [editImageFile, setEditImageFile] = useState<File | null>(null);
// // //   const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [submitError, setSubmitError] = useState<string | null>(null);
// // //   // Add speaker state
// // //   const [showAdd, setShowAdd] = useState(false);
// // //   const [addName, setAddName] = useState('');
// // //   const [addUniversity, setAddUniversity] = useState('');
// // //   const [addImageFile, setAddImageFile] = useState<File | null>(null);
// // //   const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
// // //   const [addSubmitting, setAddSubmitting] = useState(false);
// // //   const [addError, setAddError] = useState<string | null>(null);
// // //   const [reloadCounter, setReloadCounter] = useState(0);
// // //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// // //   useEffect(() => {
// // //     let mounted = true;
// // //     setLoading(true);
// // //     setError(null);

// // //     if (!selectedEvent) {
// // //       setSpeakers([]);
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     const url = `https://backendconf.roboticsaisummit.com//api/speakers/conference/${encodeURIComponent(selectedEvent)}`;

// // //     fetch(url)
// // //       .then((res) => {
// // //         if (!res.ok) throw new Error(`Status ${res.status}`);
// // //         return res.json();
// // //       })
// // //       .then((data: Speaker[]) => {
// // //         if (!mounted) return;
// // //         setSpeakers(data || []);
// // //       })
// // //       .catch((err) => {
// // //         if (!mounted) return;
// // //         setError(String(err));
// // //       })
// // //       .finally(() => {
// // //         if (mounted) setLoading(false);
// // //       });

// // //     return () => {
// // //       mounted = false;
// // //     };
// // //   }, [selectedEvent, reloadCounter]);

// // //   // Edit handlers
// // //   const openEdit = (s: Speaker) => {
// // //     setEditingSpeaker(s);
// // //     setEditName(s.name || '');
// // //     setEditUniversity(s.university || '');
// // //     setEditImageFile(null);
// // //     setEditImagePreview(s.imagePath || null);
// // //     setSubmitError(null);
// // //   };

// // //   const closeEdit = () => {
// // //     setEditingSpeaker(null);
// // //     setEditName('');
// // //     setEditUniversity('');
// // //     setEditImageFile(null);
// // //     setEditImagePreview(null);
// // //     setSubmitError(null);
// // //   };

// // //   const onImageChange = (file?: File) => {
// // //     if (!file) {
// // //       setEditImageFile(null);
// // //       setEditImagePreview(editingSpeaker?.imagePath || null);
// // //       return;
// // //     }
// // //     setEditImageFile(file);
// // //     const reader = new FileReader();
// // //     reader.onload = () => setEditImagePreview(String(reader.result));
// // //     reader.readAsDataURL(file);
// // //   };

// // //   const submitEdit = async () => {
// // //     if (!editingSpeaker) return;
// // //     setSubmitting(true);
// // //     setSubmitError(null);

// // //     try {
// // //       const id = editingSpeaker.id;
// // //       if (!selectedEvent) throw new Error('selectedEvent not set');
// // //       const url = `https://backendconf.roboticsaisummit.com//api/speakers/${id}`;

// // //       const body = new FormData();
// // //       body.append('name', editName);
// // //       body.append('university', editUniversity);
// // //       body.append('conferencecode', selectedEvent);
// // //       if (editImageFile) {
// // //         body.append('image', editImageFile);
// // //       }

// // //       const res = await fetch(url, {
// // //         method: 'PUT',
// // //         body,
// // //       });

// // //       if (!res.ok) {
// // //         const text = await res.text().catch(() => '');
// // //         throw new Error(`Status ${res.status} ${text}`);
// // //       }

// // //       // optimistic update: update speakers list with returned data if available
// // //       let updated: Speaker | null = null;
// // //       try {
// // //         const json = await res.json();
// // //         if (json && typeof json === 'object') {
// // //           updated = json as Speaker;
// // //         }
// // //       } catch (_) {
// // //         // ignore JSON parse errors
// // //       }

// // //       setSpeakers((prev) => prev.map((sp) => (sp.id === id ? (updated ?? { ...sp, name: editName, university: editUniversity, imagePath: editImagePreview ?? sp.imagePath, conferencecode: selectedEvent }) : sp)));
// // //       closeEdit();
// // //       // trigger a refresh from server to ensure consistency
// // //       setReloadCounter((c) => c + 1);
// // //     } catch (err: any) {
// // //       setSubmitError(String(err?.message ?? err));
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // Add handlers
// // //   const openAdd = () => {
// // //     setShowAdd(true);
// // //     setAddName('');
// // //     setAddUniversity('');
// // //     setAddImageFile(null);
// // //     setAddImagePreview(null);
// // //     setAddError(null);
// // //   };

// // //   const closeAdd = () => {
// // //     setShowAdd(false);
// // //     setAddName('');
// // //     setAddUniversity('');
// // //     setAddImageFile(null);
// // //     setAddImagePreview(null);
// // //     setAddError(null);
// // //   };

// // //   const onAddImageChange = (file?: File) => {
// // //     if (!file) {
// // //       setAddImageFile(null);
// // //       setAddImagePreview(null);
// // //       return;
// // //     }
// // //     setAddImageFile(file);
// // //     const reader = new FileReader();
// // //     reader.onload = () => setAddImagePreview(String(reader.result));
// // //     reader.readAsDataURL(file);
// // //   };

// // //   const submitAdd = async () => {
// // //     if (!selectedEvent) {
// // //       setAddError('selectedEvent not set');
// // //       return;
// // //     }
// // //     setAddSubmitting(true);
// // //     setAddError(null);

// // //     try {
// // //       const url = `https://backendconf.roboticsaisummit.com//api/speakers/${encodeURIComponent(selectedEvent)}`;
// // //       const body = new FormData();
// // //       body.append('name', addName);
// // //       body.append('university', addUniversity);
// // //       body.append('conferencecode', selectedEvent);
// // //       if (addImageFile) body.append('image', addImageFile);

// // //       const res = await fetch(url, { method: 'POST', body });
// // //       if (!res.ok) {
// // //         const text = await res.text().catch(() => '');
// // //         throw new Error(`Status ${res.status} ${text}`);
// // //       }

// // //       // try to parse returned speaker and add, otherwise trigger full reload
// // //       try {
// // //         const json = await res.json();
// // //         if (json && typeof json === 'object') {
// // //           setSpeakers((prev) => [json as Speaker, ...prev]);
// // //         } else {
// // //           setReloadCounter((c) => c + 1);
// // //         }
// // //       } catch (_) {
// // //         setReloadCounter((c) => c + 1);
// // //       }

// // //       closeAdd();
// // //     } catch (err: any) {
// // //       setAddError(String(err?.message ?? err));
// // //     } finally {
// // //       setAddSubmitting(false);
// // //     }
// // //   };

// // //   // Delete handler
// // //   const deleteSpeaker = async (id: number) => {
// // //     if (!selectedEvent) {
// // //       alert('selectedEvent not set');
// // //       return;
// // //     }

// // //     const ok = window.confirm('Delete this speaker?');
// // //     if (!ok) return;

// // //     try {
// // //       setDeletingIds((s) => [...s, id]);
// // //       const url = `https://backendconf.roboticsaisummit.com//api/speakers/${id}`;
// // //       const res = await fetch(url, { method: 'DELETE' });
// // //       if (!res.ok) {
// // //         const text = await res.text().catch(() => '');
// // //         throw new Error(`Status ${res.status} ${text}`);
// // //       }

// // //       // remove from local list
// // //       setSpeakers((prev) => prev.filter((s) => s.id !== id));
// // //     } catch (err: any) {
// // //       alert('Failed to delete: ' + String(err?.message ?? err));
// // //     } finally {
// // //       setDeletingIds((s) => s.filter((x) => x !== id));
// // //     }
// // //   };

// // //   const reload = () => setReloadCounter((c) => c + 1);

// // //   return (
// // //     <div>
// // //       <div className="flex items-center justify-between mb-2">
// // //         <h2 className="text-3xl font-bold text-gray-800">Speakers Management</h2>
// // //         <div className="flex items-center gap-2">
// // //           <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
// // //             <Plus className="w-5 h-5" />
// // //             Add Speaker
// // //           </button>
// // //           <button onClick={reload} title="Reload speakers" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
// // //             <RefreshCw className="w-4 h-4 text-gray-600" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

// // //       <div className="bg-white rounded-xl shadow-md overflow-hidden">
// // //         <div className="overflow-x-auto">
// // //           {loading ? (
// // //             <div className="p-6 text-center text-gray-500">Loading speakers...</div>
// // //           ) : error ? (
// // //             <div className="p-6 text-center text-red-500">Error loading speakers: {error}</div>
// // //           ) : speakers.length === 0 ? (
// // //             <div className="p-6 text-center text-gray-500">No speakers found.</div>
// // //           ) : (
// // //             <table className="w-full">
// // //               <thead className="bg-gray-50 border-b border-gray-200">
// // //                 <tr>
// // //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
// // //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
// // //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">University</th>
// // //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
// // //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-gray-200">
// // //                 {speakers.map((speaker) => (
// // //                   <tr key={speaker.id} className="hover:bg-gray-50 transition-colors">
// // //                     <td className="px-6 py-4 text-sm text-gray-700">{speaker.id}</td>
// // //                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{speaker.name}</td>
// // //                     <td className="px-6 py-4 text-sm text-gray-700">{speaker.university}</td>
// // //                     <td className="px-6 py-4">
// // //                       {speaker.imagePath ? (
// // //                         <img src={speaker.imagePath} alt={speaker.name} className="w-16 h-10 object-cover rounded" />
// // //                       ) : (
// // //                         <span className="text-sm text-gray-500">—</span>
// // //                       )}
// // //                     </td>
// // //                     <td className="px-6 py-4">
// // //                       <div className="flex items-center gap-2">
// // //                           <button onClick={() => openEdit(speaker)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
// // //                             <Edit className="w-4 h-4" />
// // //                           </button>
// // //                         <button
// // //                           onClick={() => deleteSpeaker(speaker.id)}
// // //                           disabled={deletingIds.includes(speaker.id)}
// // //                           className={`p-2 rounded-lg transition-colors ${deletingIds.includes(speaker.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
// // //                         >
// // //                           <Trash2 className="w-4 h-4" />
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Edit Modal (simple) */}
// // //       {editingSpeaker && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// // //           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h3 className="text-lg font-semibold">Edit Speaker #{editingSpeaker.id}</h3>
// // //               <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
// // //             </div>

// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
// // //                 <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border rounded" />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
// // //                 <input value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} className="w-full px-3 py-2 border rounded" />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
// // //                 <input type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0])} />
// // //                 {editImagePreview && <img src={editImagePreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
// // //               </div>

// // //               {submitError && <div className="text-red-600">{submitError}</div>}

// // //               <div className="flex justify-end gap-2">
// // //                 <button onClick={closeEdit} disabled={submitting} className="px-4 py-2 rounded border">Cancel</button>
// // //                 <button onClick={submitEdit} disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white">{submitting ? 'Saving...' : 'Save'}</button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {/* Add Modal (simple) */}
// // //       {showAdd && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// // //           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h3 className="text-lg font-semibold">Add Speaker</h3>
// // //               <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
// // //             </div>

// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
// // //                 <input value={addName} onChange={(e) => setAddName(e.target.value)} className="w-full px-3 py-2 border rounded" />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
// // //                 <input value={addUniversity} onChange={(e) => setAddUniversity(e.target.value)} className="w-full px-3 py-2 border rounded" />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
// // //                 <input type="file" accept="image/*" onChange={(e) => onAddImageChange(e.target.files?.[0])} />
// // //                 {addImagePreview && <img src={addImagePreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded" />}
// // //               </div>

// // //               {addError && <div className="text-red-600">{addError}</div>}

// // //               <div className="flex justify-end gap-2">
// // //                 <button onClick={closeAdd} disabled={addSubmitting} className="px-4 py-2 rounded border">Cancel</button>
// // //                 <button onClick={submitAdd} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{addSubmitting ? 'Adding...' : 'Add'}</button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default Speakers;









// // import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// // import { useSelectedEvent } from '../context/SelectedEventContext';
// // import { useEffect, useState } from 'react';

// // interface Speaker {
// //   id: number;
// //   name: string;
// //   university: string;
// //   conferencecode: string | null;
// //   imagePath?: string;
// //   speakerType?: string | null;
// // }

// // function Speakers() {
// //   const { selectedEvent } = useSelectedEvent();

// //   const [speakers, setSpeakers] = useState<Speaker[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Edit
// //   const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
// //   const [editName, setEditName] = useState('');
// //   const [editUniversity, setEditUniversity] = useState('');
// //   const [editSpeakerType, setEditSpeakerType] = useState('');
// //   const [editImageFile, setEditImageFile] = useState<File | null>(null);
// //   const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [submitError, setSubmitError] = useState<string | null>(null);

// //   // Add
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [addName, setAddName] = useState('');
// //   const [addUniversity, setAddUniversity] = useState('');
// //   const [addSpeakerType, setAddSpeakerType] = useState('');
// //   const [addImageFile, setAddImageFile] = useState<File | null>(null);
// //   const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
// //   const [addSubmitting, setAddSubmitting] = useState(false);
// //   const [addError, setAddError] = useState<string | null>(null);

// //   const [reloadCounter, setReloadCounter] = useState(0);
// //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     if (!selectedEvent) return;

// //     setLoading(true);
// //     setError(null);

// //     fetch(`https://backendconf.roboticsaisummit.com//api/speakers/conference/${encodeURIComponent(selectedEvent)}`)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`Status ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data: Speaker[]) => setSpeakers(data || []))
// //       .catch((err) => setError(String(err)))
// //       .finally(() => setLoading(false));
// //   }, [selectedEvent, reloadCounter]);

// //   /* ================= EDIT ================= */

// //   const openEdit = (s: Speaker) => {
// //     setEditingSpeaker(s);
// //     setEditName(s.name);
// //     setEditUniversity(s.university);
// //     setEditSpeakerType(s.speakerType || '');
// //     setEditImagePreview(s.imagePath || null);
// //     setEditImageFile(null);
// //     setSubmitError(null);
// //   };

// //   const closeEdit = () => {
// //     setEditingSpeaker(null);
// //     setEditName('');
// //     setEditUniversity('');
// //     setEditSpeakerType('');
// //     setEditImageFile(null);
// //     setEditImagePreview(null);
// //   };

// //   const submitEdit = async () => {
// //     if (!editingSpeaker || !selectedEvent) return;

// //     setSubmitting(true);
// //     setSubmitError(null);

// //     try {
// //       const body = new FormData();
// //       body.append('name', editName);
// //       body.append('university', editUniversity);
// //       body.append('conferencecode', selectedEvent);
// //       body.append('speakerType', editSpeakerType);
// //       if (editImageFile) body.append('image', editImageFile);

// //       const res = await fetch(
// //         `https://backendconf.roboticsaisummit.com//api/speakers/${editingSpeaker.id}`,
// //         {
// //           method: 'PUT',
// //           body,
// //         }
// //       );

// //       if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(text);
// //       }

// //       setReloadCounter((c) => c + 1);
// //       closeEdit();
// //     } catch (err: any) {
// //       setSubmitError(err.message);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   /* ================= ADD ================= */

// //   const openAdd = () => {
// //     setShowAdd(true);
// //     setAddName('');
// //     setAddUniversity('');
// //     setAddSpeakerType('');
// //     setAddImageFile(null);
// //     setAddImagePreview(null);
// //     setAddError(null);
// //   };

// //   const closeAdd = () => setShowAdd(false);

// //   const submitAdd = async () => {
// //     if (!selectedEvent) {
// //       setAddError('Event not selected');
// //       return;
// //     }

// //     setAddSubmitting(true);
// //     setAddError(null);

// //     try {
// //       const body = new FormData();
// //       body.append('name', addName);
// //       body.append('university', addUniversity);
// //       body.append('conferencecode', selectedEvent);
// //       body.append('speakerType', addSpeakerType);
// //       if (addImageFile) body.append('image', addImageFile);

// //       const res = await fetch(
// //         `https://backendconf.roboticsaisummit.com//api/speakers/${selectedEvent}`,
// //         {
// //           method: 'POST',
// //           body,
// //         }
// //       );

// //       if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(text);
// //       }

// //       setReloadCounter((c) => c + 1);
// //       closeAdd();
// //     } catch (err: any) {
// //       setAddError(err.message);
// //     } finally {
// //       setAddSubmitting(false);
// //     }
// //   };

// //   /* ================= DELETE ================= */

// //   const deleteSpeaker = async (id: number) => {
// //     if (!window.confirm('Delete this speaker?')) return;

// //     try {
// //       setDeletingIds((d) => [...d, id]);
// //       const res = await fetch(`https://backendconf.roboticsaisummit.com//api/speakers/${id}`, {
// //         method: 'DELETE',
// //       });
// //       if (!res.ok) throw new Error('Delete failed');
// //       setSpeakers((s) => s.filter((x) => x.id !== id));
// //     } finally {
// //       setDeletingIds((d) => d.filter((x) => x !== id));
// //     }
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <div>
// //       <div className="flex justify-between mb-4">
// //         <h2 className="text-3xl font-bold">Speakers Management</h2>
// //         <div className="flex gap-2">
// //           <button
// //             onClick={openAdd}
// //             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
// //           >
// //             <Plus size={18} /> Add Speaker
// //           </button>
// //           <button
// //             onClick={() => setReloadCounter((c) => c + 1)}
// //             className="border px-3 py-2 rounded"
// //           >
// //             <RefreshCw size={16} />
// //           </button>
// //         </div>
// //       </div>

// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : error ? (
// //         <p className="text-red-600">{error}</p>
// //       ) : (
// //         <table className="w-full bg-white rounded shadow">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="p-3 text-left">ID</th>
// //               <th className="p-3 text-left">Name</th>
// //               <th className="p-3 text-left">University</th>
// //               <th className="p-3 text-left">Type</th>
// //               <th className="p-3 text-left">Image</th>
// //               <th className="p-3 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {speakers.map((s) => (
// //               <tr key={s.id} className="border-t">
// //                 <td className="p-3">{s.id}</td>
// //                 <td className="p-3">{s.name}</td>
// //                 <td className="p-3">{s.university}</td>
// //                 <td className="p-3">{s.speakerType ?? '—'}</td>
// //                 <td className="p-3">
// //                   {s.imagePath && (
// //                     <img
// //                       src={s.imagePath}
// //                       alt={s.name}
// //                       className="w-16 h-10 object-cover rounded"
// //                     />
// //                   )}
// //                 </td>
// //                 <td className="p-3 flex gap-2">
// //                   <button onClick={() => openEdit(s)} className="text-blue-600">
// //                     <Edit size={16} />
// //                   </button>
// //                   <button
// //                     onClick={() => deleteSpeaker(s.id)}
// //                     className="text-red-600"
// //                     disabled={deletingIds.includes(s.id)}
// //                   >
// //                     <Trash2 size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {/* ADD & EDIT MODALS */}
// //       {(showAdd || editingSpeaker) && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
// //           <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
// //             <h3 className="text-lg font-semibold">
// //               {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
// //             </h3>

// //             <input
// //               placeholder="Name"
// //               value={editingSpeaker ? editName : addName}
// //               onChange={(e) =>
// //                 editingSpeaker
// //                   ? setEditName(e.target.value)
// //                   : setAddName(e.target.value)
// //               }
// //               className="w-full border p-2 rounded"
// //             />

// //             <input
// //               placeholder="University"
// //               value={editingSpeaker ? editUniversity : addUniversity}
// //               onChange={(e) =>
// //                 editingSpeaker
// //                   ? setEditUniversity(e.target.value)
// //                   : setAddUniversity(e.target.value)
// //               }
// //               className="w-full border p-2 rounded"
// //             />

// //             <input
// //               placeholder="Speaker Type"
// //               value={editingSpeaker ? editSpeakerType : addSpeakerType}
// //               onChange={(e) =>
// //                 editingSpeaker
// //                   ? setEditSpeakerType(e.target.value)
// //                   : setAddSpeakerType(e.target.value)
// //               }
// //               className="w-full border p-2 rounded"
// //             />

// //             <input
// //               type="file"
// //               onChange={(e) =>
// //                 editingSpeaker
// //                   ? setEditImageFile(e.target.files?.[0] || null)
// //                   : setAddImageFile(e.target.files?.[0] || null)
// //               }
// //             />

// //             {(submitError || addError) && (
// //               <p className="text-red-600">{submitError || addError}</p>
// //             )}

// //             <div className="flex justify-end gap-2">
// //               <button
// //                 onClick={editingSpeaker ? closeEdit : closeAdd}
// //                 className="border px-4 py-2 rounded"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={editingSpeaker ? submitEdit : submitAdd}
// //                 className="bg-blue-600 text-white px-4 py-2 rounded"
// //                 disabled={submitting || addSubmitting}
// //               >
// //                 {editingSpeaker ? 'Save' : 'Add'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Speakers;








// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface Speaker {
//   id: number;
//   name: string;
//   university: string;
//   conferencecode: string | null;
//   imagePath?: string;
//   speakerType?: string | null;
// }

// const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/speakers';

// function Speakers() {
//   const { selectedEvent } = useSelectedEvent();

//   const [speakers, setSpeakers] = useState<Speaker[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Edit State
//   const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
//   const [editName, setEditName] = useState('');
//   const [editUniversity, setEditUniversity] = useState('');
//   const [editSpeakerType, setEditSpeakerType] = useState('');
//   const [editImageFile, setEditImageFile] = useState<File | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   // Add State
//   const [showAdd, setShowAdd] = useState(false);
//   const [addName, setAddName] = useState('');
//   const [addUniversity, setAddUniversity] = useState('');
//   const [addSpeakerType, setAddSpeakerType] = useState('');
//   const [addImageFile, setAddImageFile] = useState<File | null>(null);
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   const [reloadCounter, setReloadCounter] = useState(0);
//   const [deletingIds, setDeletingIds] = useState<number[]>([]);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (!selectedEvent) return;

//     setLoading(true);
//     setError(null);

//     // GET /api/speakers/conference/{conferencecode}
//     fetch(`${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: Speaker[]) => setSpeakers(data || []))
//       .catch((err) => setError(String(err)))
//       .finally(() => setLoading(false));
//   }, [selectedEvent, reloadCounter]);

//   /* ================= EDIT ================= */

//   const openEdit = (s: Speaker) => {
//     setEditingSpeaker(s);
//     setEditName(s.name);
//     setEditUniversity(s.university);
//     setEditSpeakerType(s.speakerType || '');
//     setEditImageFile(null); // Reset file input
//     setSubmitError(null);
//   };

//   const closeEdit = () => {
//     setEditingSpeaker(null);
//     setEditName('');
//     setEditUniversity('');
//     setEditSpeakerType('');
//     setEditImageFile(null);
//     setSubmitError(null);
//   };

//   const submitEdit = async () => {
//     if (!editingSpeaker || !selectedEvent) return;

//     setSubmitting(true);
//     setSubmitError(null);

//     try {
//       const body = new FormData();
//       // Add fields only if they have values or are changing
//       if (editName) body.append('name', editName);
//       if (editUniversity) body.append('university', editUniversity);
//       if (editSpeakerType) body.append('speakerType', editSpeakerType);
      
//       // Ensure we keep the speaker associated with the current conference
//       body.append('conferencecode', selectedEvent);
      
//       // Only append file if the user selected a new one
//       if (editImageFile) {
//         body.append('image', editImageFile);
//       }

//       // PUT /api/speakers/{id}
//       const res = await fetch(`${API_BASE_URL}/${editingSpeaker.id}`, {
//         method: 'PUT',
//         body,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text);
//       }

//       setReloadCounter((c) => c + 1);
//       closeEdit();
//     } catch (err: any) {
//       setSubmitError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= ADD ================= */

//   const openAdd = () => {
//     setShowAdd(true);
//     setAddName('');
//     setAddUniversity('');
//     setAddSpeakerType('');
//     setAddImageFile(null);
//     setAddError(null);
//   };

//   const closeAdd = () => setShowAdd(false);

//   const submitAdd = async () => {
//     if (!selectedEvent) {
//       setAddError('Event not selected');
//       return;
//     }

//     // Basic Validation
//     if (!addName || !addUniversity || !addSpeakerType || !addImageFile) {
//       setAddError('Please fill in Name, University, Type, and select an Image.');
//       return;
//     }

//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       const body = new FormData();
//       body.append('name', addName);
//       body.append('university', addUniversity);
//       body.append('conferencecode', selectedEvent);
//       body.append('speakerType', addSpeakerType);
//       body.append('image', addImageFile); // Required in POST

//       // POST /api/speakers/robotics
//       // NOTE: Using '/robotics' as per your requirement, even though conferencecode is passed in body.
//       // If this endpoint changes dynamically based on event type, you might need logic to switch 'robotics' to something else.
//       const res = await fetch(`${API_BASE_URL}/robotics`, {
//         method: 'POST',
//         body,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text);
//       }

//       setReloadCounter((c) => c + 1);
//       closeAdd();
//     } catch (err: any) {
//       setAddError(err.message);
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   /* ================= DELETE ================= */

//   const deleteSpeaker = async (id: number) => {
//     if (!window.confirm('Delete this speaker?')) return;

//     try {
//       setDeletingIds((d) => [...d, id]);
      
//       // DELETE /api/speakers/{id}
//       const res = await fetch(`${API_BASE_URL}/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (!res.ok) throw new Error('Delete failed');
      
//       setSpeakers((s) => s.filter((x) => x.id !== id));
//     } catch (err: any) {
//       alert('Error deleting speaker: ' + err.message);
//     } finally {
//       setDeletingIds((d) => d.filter((x) => x !== id));
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-3xl font-bold">Speakers Management</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={openAdd}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             <Plus size={18} /> Add Speaker
//           </button>
//           <button
//             onClick={() => setReloadCounter((c) => c + 1)}
//             className="border px-3 py-2 rounded hover:bg-gray-50 transition"
//           >
//             <RefreshCw size={16} />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-gray-600">Loading speakers...</p>
//       ) : error ? (
//         <p className="text-red-600 font-medium">{error}</p>
//       ) : (
//         <table className="w-full bg-white rounded shadow border-collapse">
//           <thead className="bg-gray-100 border-b">
//             <tr>
//               <th className="p-3 text-left font-semibold text-gray-700">ID</th>
//               <th className="p-3 text-left font-semibold text-gray-700">Name</th>
//               <th className="p-3 text-left font-semibold text-gray-700">University</th>
//               <th className="p-3 text-left font-semibold text-gray-700">Type</th>
//               <th className="p-3 text-left font-semibold text-gray-700">Image</th>
//               <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {speakers.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="p-4 text-center text-gray-500">
//                   No speakers found for {selectedEvent}.
//                 </td>
//               </tr>
//             ) : (
//               speakers.map((s) => (
//                 <tr key={s.id} className="border-t hover:bg-gray-50 transition">
//                   <td className="p-3 text-gray-600">{s.id}</td>
//                   <td className="p-3 font-medium text-gray-800">{s.name}</td>
//                   <td className="p-3 text-gray-600">{s.university}</td>
//                   <td className="p-3 text-gray-600">{s.speakerType ?? '—'}</td>
//                   <td className="p-3">
//                     {s.imagePath ? (
//                       <img
//                         src={s.imagePath}
//                         alt={s.name}
//                         className="w-16 h-10 object-cover rounded shadow-sm border"
//                       />
//                     ) : (
//                       <span className="text-xs text-gray-400">No Image</span>
//                     )}
//                   </td>
//                   <td className="p-3 flex gap-3">
//                     <button
//                       onClick={() => openEdit(s)}
//                       className="text-blue-600 hover:text-blue-800 transition"
//                       title="Edit"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => deleteSpeaker(s.id)}
//                       className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
//                       disabled={deletingIds.includes(s.id)}
//                       title="Delete"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* ADD & EDIT MODALS */}
//       {(showAdd || editingSpeaker) && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4 animate-in fade-in zoom-in duration-200">
//             <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
//               {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
//             </h3>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 placeholder="Speaker Name"
//                 value={editingSpeaker ? editName : addName}
//                 onChange={(e) =>
//                   editingSpeaker
//                     ? setEditName(e.target.value)
//                     : setAddName(e.target.value)
//                 }
//                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
//               <input
//                 placeholder="University"
//                 value={editingSpeaker ? editUniversity : addUniversity}
//                 onChange={(e) =>
//                   editingSpeaker
//                     ? setEditUniversity(e.target.value)
//                     : setAddUniversity(e.target.value)
//                 }
//                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Type</label>
//               <input
//                 placeholder="Type (e.g., Keynote)"
//                 value={editingSpeaker ? editSpeakerType : addSpeakerType}
//                 onChange={(e) =>
//                   editingSpeaker
//                     ? setEditSpeakerType(e.target.value)
//                     : setAddSpeakerType(e.target.value)
//                 }
//                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {editingSpeaker ? 'Change Image (Optional)' : 'Image (Required)'}
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   editingSpeaker
//                     ? setEditImageFile(e.target.files?.[0] || null)
//                     : setAddImageFile(e.target.files?.[0] || null)
//                 }
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>

//             {(submitError || addError) && (
//               <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
//                 {submitError || addError}
//               </div>
//             )}

//             <div className="flex justify-end gap-3 pt-2">
//               <button
//                 onClick={editingSpeaker ? closeEdit : closeAdd}
//                 className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 border transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={editingSpeaker ? submitEdit : submitAdd}
//                 className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
//                 disabled={submitting || addSubmitting}
//               >
//                 {(submitting || addSubmitting) && <RefreshCw className="animate-spin" size={16} />}
//                 {editingSpeaker ? 'Save Changes' : 'Add Speaker'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Speakers;









import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Speaker {
  id: number;
  name: string;
  university: string;
  conferencecode: string | null;
  imagePath?: string;
  speakerType?: string | null;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/speakers';

function Speakers() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editSpeakerType, setEditSpeakerType] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Add State
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUniversity, setAddUniversity] = useState('');
  const [addSpeakerType, setAddSpeakerType] = useState('');
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [reloadCounter, setReloadCounter] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Drag & Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!selectedEvent) return;

    setLoading(true);
    setError(null);

    // GET /api/speakers/conference/{conferencecode}
    fetch(`${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Speaker[]) => setSpeakers(data || []))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [selectedEvent, reloadCounter]);

  /* ================= REORDER (Drag & Drop) ================= */

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    // 1. Reorder locally (Optimistic UI update)
    const updatedSpeakers = [...speakers];
    const [draggedItem] = updatedSpeakers.splice(draggedItemIndex, 1);
    updatedSpeakers.splice(targetIndex, 0, draggedItem);

    setSpeakers(updatedSpeakers);
    setDraggedItemIndex(null);
    setIsReordering(true);

    try {
      // 2. Prepare payload: Array of IDs in new order
      const speakerIds = updatedSpeakers.map((s) => s.id);

      // 3. Send PUT request
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speakerIds),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to save order: ${text}`);
      }
    } catch (err) {
      console.error('Reorder failed:', err);
      setError('Failed to save new order. Reloading...');
      setReloadCounter((prev) => prev + 1);
    } finally {
      setIsReordering(false);
    }
  };

  /* ================= EDIT ================= */

  const openEdit = (s: Speaker) => {
    setEditingSpeaker(s);
    setEditName(s.name);
    setEditUniversity(s.university);
    setEditSpeakerType(s.speakerType || '');
    setEditImageFile(null); // Reset file input
    setSubmitError(null);
  };

  const closeEdit = () => {
    setEditingSpeaker(null);
    setEditName('');
    setEditUniversity('');
    setEditSpeakerType('');
    setEditImageFile(null);
    setSubmitError(null);
  };

  const submitEdit = async () => {
    if (!editingSpeaker || !selectedEvent) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const body = new FormData();
      if (editName) body.append('name', editName);
      if (editUniversity) body.append('university', editUniversity);
      if (editSpeakerType) body.append('speakerType', editSpeakerType);
      
      body.append('conferencecode', selectedEvent);
      body.append('username', username || '');
      
      if (editImageFile) {
        body.append('image', editImageFile);
      }

      // PUT /api/speakers/{id}
      const res = await fetch(`${API_BASE_URL}/${editingSpeaker.id}`, {
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
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= ADD ================= */

  const openAdd = () => {
    setShowAdd(true);
    setAddName('');
    setAddUniversity('');
    setAddSpeakerType('');
    setAddImageFile(null);
    setAddError(null);
  };

  const closeAdd = () => setShowAdd(false);

  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('Event not selected');
      return;
    }

    if (!addName || !addUniversity || !addSpeakerType || !addImageFile) {
      setAddError('Please fill in Name, University, Type, and select an Image.');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      const body = new FormData();
      body.append('name', addName);
      body.append('university', addUniversity);
      body.append('conferencecode', selectedEvent);
      body.append('speakerType', addSpeakerType);
      body.append('image', addImageFile);
      body.append('username', username || '');

      // POST /api/speakers/robotics
      const res = await fetch(`${API_BASE_URL}/robotics`, {
        method: 'POST',
        body,
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

  /* ================= DELETE ================= */

  const deleteSpeaker = async (id: number) => {
    if (!window.confirm('Delete this speaker?')) return;

    try {
      setDeletingIds((d) => [...d, id]);
      
      // DELETE /api/speakers/{id}?username={username}
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username || '')}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      setSpeakers((s) => s.filter((x) => x.id !== id));
    } catch (err: any) {
      alert('Error deleting speaker: ' + err.message);
    } finally {
      setDeletingIds((d) => d.filter((x) => x !== id));
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">Speakers Management</h2>
          <p className="text-sm text-gray-500">Drag items to reorder</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add Speaker
          </button>
          <button
            onClick={() => setReloadCounter((c) => c + 1)}
            className="border px-3 py-2 rounded hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} className={isReordering || loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading speakers...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <table className="w-full bg-white rounded shadow border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="w-12 p-3"></th> {/* Drag Handle Column */}
              <th className="p-3 text-left font-semibold text-gray-700">ID</th>
              <th className="p-3 text-left font-semibold text-gray-700">Name</th>
              <th className="p-3 text-left font-semibold text-gray-700">University</th>
              <th className="p-3 text-left font-semibold text-gray-700">Type</th>
              <th className="p-3 text-left font-semibold text-gray-700">Image</th>
              <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No speakers found for {selectedEvent}.
                </td>
              </tr>
            ) : (
              speakers.map((s, index) => (
                <tr 
                  key={s.id} 
                  className={`border-t hover:bg-gray-50 transition ${draggedItemIndex === index ? 'opacity-50 bg-gray-100' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <td className="p-3 text-gray-400 cursor-move" title="Drag to reorder">
                    <GripVertical size={20} className="mx-auto" />
                  </td>
                  <td className="p-3 text-gray-600">{s.id}</td>
                  <td className="p-3 font-medium text-gray-800">{s.name}</td>
                  <td className="p-3 text-gray-600">{s.university}</td>
                  <td className="p-3 text-gray-600">{s.speakerType ?? '—'}</td>
                  <td className="p-3">
                    {s.imagePath ? (
                      <img
                        src={s.imagePath}
                        alt={s.name}
                        className="w-16 h-10 object-cover rounded shadow-sm border"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteSpeaker(s.id)}
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                      disabled={deletingIds.includes(s.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ADD & EDIT MODALS */}
      {(showAdd || editingSpeaker) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                placeholder="Speaker Name"
                value={editingSpeaker ? editName : addName}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditName(e.target.value)
                    : setAddName(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                placeholder="University"
                value={editingSpeaker ? editUniversity : addUniversity}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditUniversity(e.target.value)
                    : setAddUniversity(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Type</label>
              <input
                placeholder="Type (e.g., Keynote)"
                value={editingSpeaker ? editSpeakerType : addSpeakerType}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditSpeakerType(e.target.value)
                    : setAddSpeakerType(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingSpeaker ? 'Change Image (Optional)' : 'Image (Required)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  editingSpeaker
                    ? setEditImageFile(e.target.files?.[0] || null)
                    : setAddImageFile(e.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {(submitError || addError) && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                {submitError || addError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={editingSpeaker ? closeEdit : closeAdd}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 border transition"
              >
                Cancel
              </button>
              <button
                onClick={editingSpeaker ? submitEdit : submitAdd}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
                disabled={submitting || addSubmitting}
              >
                {(submitting || addSubmitting) && <RefreshCw className="animate-spin" size={16} />}
                {editingSpeaker ? 'Save Changes' : 'Add Speaker'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Speakers;