// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface ImportantDate {
//   id: number;
//   type: string;
//   date: string;
//   conferencecode: string | null;
// }

// const dateTypes = [
//   'Conference Dates',
//   'Submission Deadline',
//   'Notification of Acceptance',
//   'Final Paper Submission',
//   'First Round of Abstract Submission Closes',
//   'Early Bird Registration Closes',
// ];

// function ImportantDates() {
//   const { selectedEvent } = useSelectedEvent();
//   const [dates, setDates] = useState<ImportantDate[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   // Add state
//   const [showAdd, setShowAdd] = useState(false);
//   const [addType, setAddType] = useState('');
//   const [addDate, setAddDate] = useState('');
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   // Edit state
//   const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
//   const [editDate, setEditDate] = useState('');
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

// // function ImportantDates() {
// //   const { selectedEvent } = useSelectedEvent();
// //   const [dates, setDates] = useState<ImportantDate[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [reloadCounter, setReloadCounter] = useState(0);

// //   // Add state
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [addDate, setAddDate] = useState('');
// //   const [addSubmitting, setAddSubmitting] = useState(false);
// //   const [addError, setAddError] = useState<string | null>(null);

// //   // Edit state
// //   const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
// //   const [editDate, setEditDate] = useState('');
// //   const [editSubmitting, setEditSubmitting] = useState(false);
// //   const [editError, setEditError] = useState<string | null>(null);

// //   useEffect(() => {
// //     let mounted = true;
// //     setLoading(true);
// //     setError(null);

// //     if (!selectedEvent) {
// //       setDates([]);
// //       setLoading(false);
// //       return;
// //     }

// //     const url = `https://backendconf.roboticsaisummit.com//api/robotics/important-dates/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

// //     fetch(url)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`Status ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data: ImportantDate[]) => {
// //         if (!mounted) return;
// //         setDates(data || []);
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

// //   // Add helpers
// //   const openAdd = () => {
// //     setShowAdd(true);
// //     setAddDate('');
// //     setAddError(null);
// //   };

// //   const closeAdd = () => {
// //     setShowAdd(false);
// //     setAddDate('');
// //     setAddError(null);
// //   };

// //   const submitAdd = async () => {
// //     if (!selectedEvent) {
// //       setAddError('selectedEvent not set');
// //       return;
// //     }
// //     setAddSubmitting(true);
// //     setAddError(null);

// //     try {
// //       const url = `https://backendconf.roboticsaisummit.com//api/robotics/important-dates`;
// //       const body = new FormData();
// //       body.append('date', addDate);
// //       body.append('conferencecode', selectedEvent);

// //       const res = await fetch(url, { method: 'POST', body });
// //       if (!res.ok) {
// //         const text = await res.text().catch(() => '');
// //         throw new Error(`Status ${res.status} ${text}`);
// //       }

// //       try {
// //         const json = await res.json();
// //         if (json && typeof json === 'object') {
// //           setDates((prev) => [json as ImportantDate, ...prev]);
// //         } else {
// //           setReloadCounter((c) => c + 1);
// //         }
// //       } catch (_) {
// //         setReloadCounter((c) => c + 1);
// //       }

// //       closeAdd();
// //     } catch (err: any) {
// //       setAddError(String(err?.message ?? err));
// //     } finally {
// //       setAddSubmitting(false);
// //     }
// //   };

// //   // Edit helpers
// //   const openEdit = (d: ImportantDate) => {
// //     setEditingDate(d);
// //     setEditDate(d.date || '');
// //     setEditError(null);
// //   };

// //   const closeEdit = () => {
// //     setEditingDate(null);
// //     setEditDate('');
// //     setEditError(null);
// //   };

// //   const submitEdit = async () => {
// //     if (!editingDate) return;
// //     if (!selectedEvent) {
// //       setEditError('selectedEvent not set');
// //       return;
// //     }
// //     setEditSubmitting(true);
// //     setEditError(null);

// //     try {
// //       const id = editingDate.id;
// //       const url = `https://backendconf.roboticsaisummit.com//api/robotics/important-dates/${id}`;

// //       const body = new FormData();
// //       body.append('date', editDate);
// //       body.append('conferencecode', selectedEvent);

// //       const res = await fetch(url, { method: 'PUT', body });
// //       if (!res.ok) {
// //         const text = await res.text().catch(() => '');
// //         throw new Error(`Status ${res.status} ${text}`);
// //       }

// //       // update local list with returned object or optimistic update
// //       try {
// //         const json = await res.json();
// //         if (json && typeof json === 'object') {
// //           setDates((prev) => prev.map((d) => (d.id === id ? (json as ImportantDate) : d)));
// //         } else {
// //           setDates((prev) => prev.map((d) => (d.id === id ? { ...d, date: editDate, conferencecode: selectedEvent } : d)));
// //         }
// //       } catch (_) {
// //         setDates((prev) => prev.map((d) => (d.id === id ? { ...d, date: editDate, conferencecode: selectedEvent } : d)));
// //       }

// //       closeEdit();
// //     } catch (err: any) {
// //       setEditError(String(err?.message ?? err));
// //     } finally {
// //       setEditSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="flex items-center justify-between mb-2">
// //         <h2 className="text-3xl font-bold text-gray-800">Important Dates</h2>
// //         <div className="flex items-center gap-2">
// //           <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
// //             <Plus className="w-5 h-5" />
// //             Add Date
// //           </button>
// //           <button onClick={reload} title="Reload dates" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
// //             <RefreshCw className="w-4 h-4 text-gray-600" />
// //           </button>
// //         </div>
// //       </div>
// //       <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

// //       <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full">
// //             <thead className="bg-gray-50 border-b border-gray-200">
// //               <tr>
// //                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
// //                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
// //                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading dates...</td>
// //                 </tr>
// //               ) : error ? (
// //                 <tr>
// //                   <td colSpan={3} className="px-6 py-4 text-center text-red-500">Error loading dates: {error}</td>
// //                 </tr>
// //               ) : dates.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No dates found.</td>
// //                 </tr>
// //               ) : (
// //                 dates.map((dateItem) => (
// //                   <tr key={dateItem.id} className="hover:bg-gray-50 transition-colors">
// //                     <td className="px-6 py-4 text-sm text-gray-700">{dateItem.id}</td>
// //                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{dateItem.date}</td>
// //                     <td className="px-6 py-4">
// //                       <div className="flex items-center gap-2">
// //                         <button onClick={() => openEdit(dateItem)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
// //                           <Edit className="w-4 h-4" />
// //                         </button>
// //                         <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Edit Modal */}
// //       {editingDate && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// //           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-lg font-semibold">Edit Date #{editingDate.id}</h3>
// //               <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">Close</button>
// //             </div>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
// //                 <input value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //               </div>

// //               {editError && <div className="text-red-600">{editError}</div>}

// //               <div className="flex justify-end gap-2">
// //                 <button onClick={closeEdit} disabled={editSubmitting} className="px-4 py-2 rounded border">Cancel</button>
// //                 <button onClick={submitEdit} disabled={editSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{editSubmitting ? 'Saving...' : 'Save'}</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Add Modal */}
// //       {showAdd && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// //           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-lg font-semibold">Add Date</h3>
// //               <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700">Close</button>
// //             </div>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
// //                 <input value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full px-3 py-2 border rounded" />
// //               </div>

// //               {addError && <div className="text-red-600">{addError}</div>}

// //               <div className="flex justify-end gap-2">
// //                 <button onClick={closeAdd} disabled={addSubmitting} className="px-4 py-2 rounded border">Cancel</button>
// //                 <button onClick={submitAdd} disabled={addSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{addSubmitting ? 'Adding...' : 'Add'}</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default ImportantDates;




// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface ImportantDate {
//   id: number;
//   date: string;
//   dateType?: string | null;
//   conferencecode: string | null;
// }

// function ImportantDates() {
//   const { selectedEvent } = useSelectedEvent();

//   const [dates, setDates] = useState<ImportantDate[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   /* ===== ADD STATE ===== */
//   const [showAdd, setShowAdd] = useState(false);
//   const [addDate, setAddDate] = useState('');
//   const [addDateType, setAddDateType] = useState('');
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   /* ===== EDIT STATE ===== */
//   const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
//   const [editDate, setEditDate] = useState('');
//   const [editDateType, setEditDateType] = useState('');
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   /* ===== FETCH ===== */
//   useEffect(() => {
//     if (!selectedEvent) return;

//     setLoading(true);
//     setError(null);

//     fetch(
//       `https://backendconf.roboticsaisummit.com//api/robotics/important-dates/by-conferencecode/${encodeURIComponent(
//         selectedEvent
//       )}`
//     )
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: ImportantDate[]) => setDates(data || []))
//       .catch((err) => setError(String(err)))
//       .finally(() => setLoading(false));
//   }, [selectedEvent, reloadCounter]);

//   const reload = () => setReloadCounter((c) => c + 1);

//   /* ===== ADD ===== */
//   const openAdd = () => {
//     setShowAdd(true);
//     setAddDate('');
//     setAddDateType('');
//     setAddError(null);
//   };

//   const closeAdd = () => setShowAdd(false);

//   const submitAdd = async () => {
//     if (!selectedEvent) {
//       setAddError('selectedEvent not set');
//       return;
//     }

//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       const body = new FormData();
//       body.append('date', addDate);
//       body.append('dateType', addDateType);
//       body.append('conferencecode', selectedEvent);

//       const res = await fetch(
//         `https://backendconf.roboticsaisummit.com//api/robotics/important-dates`,
//         { method: 'POST', body }
//       );

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

//   /* ===== EDIT ===== */
//   const openEdit = (d: ImportantDate) => {
//     setEditingDate(d);
//     setEditDate(d.date || '');
//     setEditDateType(d.dateType || '');
//     setEditError(null);
//   };

//   const closeEdit = () => {
//     setEditingDate(null);
//     setEditDate('');
//     setEditDateType('');
//     setEditError(null);
//   };

//   const submitEdit = async () => {
//     if (!editingDate || !selectedEvent) return;

//     setEditSubmitting(true);
//     setEditError(null);

//     try {
//       const body = new FormData();
//       body.append('date', editDate);
//       body.append('dateType', editDateType);
//       body.append('conferencecode', selectedEvent);

//       const res = await fetch(
//         `https://backendconf.roboticsaisummit.com//api/robotics/important-dates/${editingDate.id}`,
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
//   const deleteDate = async (id: number) => {
//     if (!window.confirm('Delete this date?')) return;

//     await fetch(`https://backendconf.roboticsaisummit.com//api/robotics/important-dates/${id}`, {
//       method: 'DELETE',
//     });

//     setDates((d) => d.filter((x) => x.id !== id));
//   };

//   /* ===== UI ===== */
//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-3xl font-bold">Important Dates</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={openAdd}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             <Plus size={18} /> Add Date
//           </button>
//           <button onClick={reload} className="border px-3 py-2 rounded">
//             <RefreshCw size={16} />
//           </button>
//         </div>
//       </div>

//       <table className="w-full bg-white rounded shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">ID</th>
//             <th className="p-3 text-left">Date</th>
//             <th className="p-3 text-left">Type</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dates.map((d) => (
//             <tr key={d.id} className="border-t">
//               <td className="p-3">{d.id}</td>
//               <td className="p-3">{d.date}</td>
//               <td className="p-3">{d.dateType ?? '—'}</td>
//               <td className="p-3 flex gap-2">
//                 <button onClick={() => openEdit(d)} className="text-blue-600">
//                   <Edit size={16} />
//                 </button>
//                 <button onClick={() => deleteDate(d.id)} className="text-red-600">
//                   <Trash2 size={16} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ADD MODAL */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
//             <h3 className="text-lg font-semibold">Add Important Date</h3>

//             <input
//               placeholder="Date"
//               value={addDate}
//               onChange={(e) => setAddDate(e.target.value)}
//               className="border p-2 w-full"
//             />

//             <input
//               placeholder="Date Type"
//               value={addDateType}
//               onChange={(e) => setAddDateType(e.target.value)}
//               className="border p-2 w-full"
//             />

//             {addError && <p className="text-red-600">{addError}</p>}

//             <div className="flex justify-end gap-2">
//               <button onClick={closeAdd} className="border px-4 py-2 rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={submitAdd}
//                 disabled={addSubmitting}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 {addSubmitting ? 'Adding...' : 'Add'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT MODAL */}
//       {editingDate && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
//             <h3 className="text-lg font-semibold">Edit Important Date</h3>

//             <input
//               value={editDate}
//               onChange={(e) => setEditDate(e.target.value)}
//               className="border p-2 w-full"
//             />

//             <input
//               value={editDateType}
//               onChange={(e) => setEditDateType(e.target.value)}
//               className="border p-2 w-full"
//             />

//             {editError && <p className="text-red-600">{editError}</p>}

//             <div className="flex justify-end gap-2">
//               <button onClick={closeEdit} className="border px-4 py-2 rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={submitEdit}
//                 disabled={editSubmitting}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 {editSubmitting ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImportantDates;




import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface ImportantDate {
  id: number;
  date: string;
  dateType?: string | null;
  conferencecode: string | null;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/important-dates';
// const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/important-dates';
const dateTypes = [
  'Conference Dates',
  'Submission Deadline',
  'Notification of Acceptance',
  'Final Paper Submission',
  'First Round of Abstract Submission Closes',
  'Early Bird Registration Closes',
];

function ImportantDates() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();

  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  /* ===== ADD STATE ===== */
  const [showAdd, setShowAdd] = useState(false);
  const [addDate, setAddDate] = useState('');
  const [addDateType, setAddDateType] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  /* ===== EDIT STATE ===== */
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editDateType, setEditDateType] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  /* ===== FETCH ===== */
  useEffect(() => {
    if (!selectedEvent) return;

    setLoading(true);
    setError(null);

    // Fetch all dates and filter client-side based on the selectedEvent (conferencecode)
    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: ImportantDate[]) => {
        // Filter the data to show only items for the current conference
        const filtered = (data || []).filter(
          (d) => d.conferencecode === selectedEvent
        );
        setDates(filtered);
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [selectedEvent, reloadCounter]);

  const reload = () => setReloadCounter((c) => c + 1);

  /* ===== ADD ===== */
  const openAdd = () => {
    setShowAdd(true);
    setAddDate('');
    setAddDateType('');
    setAddError(null);
  };

  const closeAdd = () => setShowAdd(false);

  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('selectedEvent not set');
      return;
    }
    if (!username) {
      setAddError('Username not available');
      return;
    }

    if (!addDateType) {
      setAddError('Please select a date type');
      return;
    }

    if (dates.some(d => d.dateType === addDateType)) {
      setAddError('This date type is already used');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      // Construct URL with query parameters matching your POST example
      const params = new URLSearchParams();
      params.append('date', addDate);
      params.append('conferencecode', selectedEvent);
      if (addDateType) params.append('dateType', addDateType);
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
  const openEdit = (d: ImportantDate) => {
    setEditingDate(d);
    setEditDate(d.date || '');
    setEditDateType(d.dateType || '');
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingDate(null);
    setEditDate('');
    setEditDateType('');
    setEditError(null);
  };

  const submitEdit = async () => {
    if (!editingDate || !selectedEvent) return;
    if (!username) {
      setEditError('Username not available');
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      // Construct URL with query parameters for PUT
      const params = new URLSearchParams();
      params.append('date', editDate);
      params.append('conferencecode', selectedEvent);
      if (editDateType) params.append('dateType', editDateType);
      params.append('username', username);

      const res = await fetch(
        `${API_BASE_URL}/${editingDate.id}?${params.toString()}`,
        { method: 'PUT' }
      );

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
  const deleteDate = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!window.confirm('Delete this date?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }

      setDates((d) => d.filter((x) => x.id !== id));
    } catch (err) {
      alert('Error deleting date: ' + err);
    }
  };

  /* ===== UI ===== */
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">Important Dates</h2>
        <div className="flex gap-2">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus size={18} /> Add Date
          </button>
          <button onClick={reload} className="border px-3 py-2 rounded">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  No dates found for {selectedEvent}.
                </td>
              </tr>
            ) : (
              dates.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.id}</td>
                  <td className="p-3">{d.date}</td>
                  <td className="p-3">{d.dateType ?? '—'}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(d)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteDate(d.id)}
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
            <h3 className="text-lg font-semibold">Add Important Date</h3>

            <input
              placeholder="Date (e.g., 15 march2026)"
              value={addDate}
              onChange={(e) => setAddDate(e.target.value)}
              className="border p-2 w-full"
            />

            <select
              value={addDateType}
              onChange={(e) => setAddDateType(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select Date Type</option>
              {dateTypes.map((type) => (
                <option key={type} value={type} disabled={dates.some(d => d.dateType === type)}>
                  {type}
                </option>
              ))}
            </select>

            {addError && <p className="text-red-600">{addError}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={closeAdd} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={submitAdd}
                disabled={addSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {addSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Edit Important Date</h3>

            <input
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border p-2 w-full"
            />

            <input
              value={editDateType}
              disabled
              className="border p-2 w-full bg-gray-100"
            />

            {editError && <p className="text-red-600">{editError}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={closeEdit} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={submitEdit}
                disabled={editSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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

export default ImportantDates;