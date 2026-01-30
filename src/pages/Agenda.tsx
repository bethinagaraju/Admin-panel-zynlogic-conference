// // // import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
// // // import { useSelectedEvent } from '../context/SelectedEventContext';
// // // import { useEffect, useState } from 'react';

// // // interface AgendaItem {
// // //   id: number;
// // //   conferencecode: string;
// // //   day: string;
// // //   time: string;
// // //   title: string;
// // //   description: string;
// // //   speaker?: string;
// // //   room: string;
// // //   orderIndex: number;
// // // }

// // // const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/agendas';

// // // function Agenda() {
// // //   const { selectedEvent } = useSelectedEvent();
// // //   const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [reloadCounter, setReloadCounter] = useState(0);

// // //   // Group by day
// // //   const groupedItems = agendaItems.reduce((acc, item) => {
// // //     if (!acc[item.day]) acc[item.day] = [];
// // //     acc[item.day].push(item);
// // //     return acc;
// // //   }, {} as Record<string, AgendaItem[]>);

// // //   // Sort each day's items by orderIndex
// // //   Object.keys(groupedItems).forEach(day => {
// // //     groupedItems[day].sort((a, b) => a.orderIndex - b.orderIndex);
// // //   });

// // //   // Add state
// // //   const [showAdd, setShowAdd] = useState(false);
// // //   const [addForm, setAddForm] = useState({
// // //     day: 'day1',
// // //     time: '',
// // //     title: '',
// // //     description: '',
// // //     speaker: '',
// // //     room: ''
// // //   });
// // //   const [addSubmitting, setAddSubmitting] = useState(false);
// // //   const [addError, setAddError] = useState<string | null>(null);

// // //   // Edit state
// // //   const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
// // //   const [editForm, setEditForm] = useState({
// // //     day: '',
// // //     time: '',
// // //     title: '',
// // //     description: '',
// // //     speaker: '',
// // //     room: ''
// // //   });
// // //   const [editSubmitting, setEditSubmitting] = useState(false);
// // //   const [editError, setEditError] = useState<string | null>(null);

// // //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// // //   // Drag & Drop state
// // //   const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
// // //   const [isReordering, setIsReordering] = useState(false);

// // //   /* ================= FETCH ================= */
// // //   useEffect(() => {
// // //     let mounted = true;
// // //     setLoading(true);
// // //     setError(null);

// // //     if (!selectedEvent) {
// // //       setAgendaItems([]);
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     // GET /api/agendas/conference/{conferencecode}
// // //     const url = `${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`;

// // //     fetch(url)
// // //       .then((res) => {
// // //         if (!res.ok) throw new Error(`Status ${res.status}`);
// // //         return res.json();
// // //       })
// // //       .then((data: AgendaItem[]) => {
// // //         if (!mounted) return;
// // //         setAgendaItems(data || []);
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

// // //   /* ================= ADD ================= */
// // //   const handleAdd = async () => {
// // //     if (!addForm.title.trim() || !addForm.time.trim() || !addForm.room.trim()) {
// // //       setAddError('Title, time, and room are required');
// // //       return;
// // //     }

// // //     setAddSubmitting(true);
// // //     setAddError(null);

// // //     try {
// // //       const params = new URLSearchParams({
// // //         conferencecode: selectedEvent!,
// // //         day: addForm.day,
// // //         time: addForm.time.trim(),
// // //         title: addForm.title.trim(),
// // //         description: addForm.description.trim(),
// // //         speaker: addForm.speaker.trim(),
// // //         room: addForm.room.trim()
// // //       });

// // //       const response = await fetch(`${API_BASE_URL}?${params}`, {
// // //         method: 'POST',
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to add agenda item: ${response.status}`);
// // //       }

// // //       setAddForm({
// // //         day: 'day1',
// // //         time: '',
// // //         title: '',
// // //         description: '',
// // //         speaker: '',
// // //         room: ''
// // //       });
// // //       setShowAdd(false);
// // //       setReloadCounter((prev) => prev + 1);
// // //     } catch (err) {
// // //       setAddError(String(err));
// // //     } finally {
// // //       setAddSubmitting(false);
// // //     }
// // //   };

// // //   /* ================= EDIT ================= */
// // //   const openEdit = (item: AgendaItem) => {
// // //     setEditingItem(item);
// // //     setEditForm({
// // //       day: item.day,
// // //       time: item.time,
// // //       title: item.title,
// // //       description: item.description,
// // //       speaker: item.speaker || '',
// // //       room: item.room
// // //     });
// // //   };

// // //   const handleEdit = async () => {
// // //     if (!editingItem) return;

// // //     if (!editForm.title.trim() || !editForm.time.trim() || !editForm.room.trim()) {
// // //       setEditError('Title, time, and room are required');
// // //       return;
// // //     }

// // //     setEditSubmitting(true);
// // //     setEditError(null);

// // //     try {
// // //       const params = new URLSearchParams({
// // //         day: editForm.day,
// // //         time: editForm.time.trim(),
// // //         title: editForm.title.trim(),
// // //         description: editForm.description.trim(),
// // //         speaker: editForm.speaker.trim(),
// // //         room: editForm.room.trim()
// // //       });

// // //       const response = await fetch(`${API_BASE_URL}/${editingItem.id}?${params}`, {
// // //         method: 'PUT',
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to update agenda item: ${response.status}`);
// // //       }

// // //       setEditingItem(null);
// // //       setReloadCounter((prev) => prev + 1);
// // //     } catch (err) {
// // //       setEditError(String(err));
// // //     } finally {
// // //       setEditSubmitting(false);
// // //     }
// // //   };

// // //   /* ================= DELETE ================= */
// // //   const handleDelete = async (id: number) => {
// // //     if (!confirm('Are you sure you want to delete this agenda item?')) return;

// // //     setDeletingIds((prev) => [...prev, id]);

// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/${id}`, {
// // //         method: 'DELETE',
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to delete agenda item: ${response.status}`);
// // //       }

// // //       setReloadCounter((prev) => prev + 1);
// // //     } catch (err) {
// // //       alert(`Error deleting agenda item: ${err}`);
// // //     } finally {
// // //       setDeletingIds((prev) => prev.filter((delId) => delId !== id));
// // //     }
// // //   };

// // //   /* ================= DRAG & DROP ================= */
// // //   const handleDragStart = (item: AgendaItem) => {
// // //     setDraggedItem(item);
// // //   };

// // //   const handleDragOver = (e: React.DragEvent, targetItem: AgendaItem) => {
// // //     e.preventDefault();
// // //     if (!draggedItem || draggedItem.day !== targetItem.day) return;

// // //     const dayItems = groupedItems[draggedItem.day];
// // //     const draggedIndex = dayItems.findIndex(i => i.id === draggedItem.id);
// // //     const targetIndex = dayItems.findIndex(i => i.id === targetItem.id);

// // //     if (draggedIndex === targetIndex) return;

// // //     const newItems = [...dayItems];
// // //     newItems.splice(draggedIndex, 1);
// // //     newItems.splice(targetIndex, 0, draggedItem);

// // //     setAgendaItems(prev => {
// // //       const others = prev.filter(i => i.day !== draggedItem.day);
// // //       return [...others, ...newItems];
// // //     });
// // //   };

// // //   const handleDragEnd = async () => {
// // //     if (!draggedItem) return;

// // //     const dayItems = groupedItems[draggedItem.day];
// // //     const ids = dayItems.map(item => item.id);

// // //     setIsReordering(true);
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/reorder`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({
// // //           day: draggedItem.day,
// // //           ids
// // //         }),
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`Failed to reorder: ${response.status}`);
// // //       }

// // //       setReloadCounter((prev) => prev + 1);
// // //     } catch (err) {
// // //       alert(`Error reordering: ${err}`);
// // //       setReloadCounter((prev) => prev + 1); // Reload to revert
// // //     } finally {
// // //       setIsReordering(false);
// // //       setDraggedItem(null);
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div>
// // //           <h2 className="text-3xl font-bold text-gray-800">Agenda</h2>
// // //           <p className="text-sm text-gray-600">Manage conference agenda</p>
// // //         </div>
// // //         <div className="flex gap-3">
// // //           <button
// // //             onClick={() => setReloadCounter((prev) => prev + 1)}
// // //             className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
// // //           >
// // //             <RefreshCw className="w-4 h-4" />
// // //             Refresh
// // //           </button>
// // //           <button
// // //             onClick={() => setShowAdd(true)}
// // //             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // //           >
// // //             <Plus className="w-4 h-4" />
// // //             Add Session
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {error && (
// // //         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// // //           <p className="text-red-800">{error}</p>
// // //         </div>
// // //       )}

// // //       {loading ? (
// // //         <div className="flex justify-center items-center py-12">
// // //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// // //         </div>
// // //       ) : (
// // //         <div className="space-y-6">
// // //           {Object.keys(groupedItems).length === 0 ? (
// // //             <div className="text-center py-12 text-gray-500">
// // //               No agenda items found
// // //             </div>
// // //           ) : (
// // //             Object.entries(groupedItems).map(([day, items]) => (
// // //               <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// // //                 <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{day.replace('day', 'Day ')}</h3>
// // //                 <div className="space-y-3">
// // //                   {items.map((item) => (
// // //                     <div
// // //                       key={item.id}
// // //                       draggable
// // //                       onDragStart={() => handleDragStart(item)}
// // //                       onDragOver={(e) => handleDragOver(e, item)}
// // //                       onDragEnd={handleDragEnd}
// // //                       className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
// // //                     >
// // //                       <GripVertical className="w-5 h-5 text-gray-400" />
// // //                       <div className="flex-1">
// // //                         <div className="flex items-center gap-4">
// // //                           <span className="font-medium text-gray-900">{item.time}</span>
// // //                           <span className="text-gray-700">{item.title}</span>
// // //                           {item.speaker && <span className="text-sm text-gray-500">by {item.speaker}</span>}
// // //                           <span className="text-sm text-gray-500">{item.room}</span>
// // //                         </div>
// // //                         {item.description && (
// // //                           <p className="text-sm text-gray-600 mt-1">{item.description}</p>
// // //                         )}
// // //                       </div>
// // //                       <div className="flex gap-2">
// // //                         <button
// // //                           onClick={() => openEdit(item)}
// // //                           className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
// // //                           title="Edit"
// // //                         >
// // //                           <Edit className="w-4 h-4" />
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDelete(item.id)}
// // //                           disabled={deletingIds.includes(item.id)}
// // //                           className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
// // //                           title="Delete"
// // //                         >
// // //                           <Trash2 className="w-4 h-4" />
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             ))
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* Add Modal */}
// // //       {showAdd && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// // //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Session</h3>
// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
// // //                 <input
// // //                   type="text"
// // //                   value={addForm.day}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, day: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="e.g., day1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
// // //                 <input
// // //                   type="text"
// // //                   value={addForm.time}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, time: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="e.g., 09:00-10:00"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// // //                 <input
// // //                   type="text"
// // //                   value={addForm.title}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Session title"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // //                 <textarea
// // //                   value={addForm.description}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   rows={3}
// // //                   placeholder="Session description"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Speaker (optional)</label>
// // //                 <input
// // //                   type="text"
// // //                   value={addForm.speaker}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, speaker: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Speaker name"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
// // //                 <input
// // //                   type="text"
// // //                   value={addForm.room}
// // //                   onChange={(e) => setAddForm(prev => ({ ...prev, room: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Room name"
// // //                 />
// // //               </div>
// // //               {addError && (
// // //                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
// // //                   <p className="text-red-800 text-sm">{addError}</p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <div className="flex justify-end gap-3 mt-6">
// // //               <button
// // //                 onClick={() => setShowAdd(false)}
// // //                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleAdd}
// // //                 disabled={addSubmitting}
// // //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
// // //               >
// // //                 {addSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
// // //                 {addSubmitting ? 'Adding...' : 'Add Session'}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Edit Modal */}
// // //       {editingItem && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// // //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Session</h3>
// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
// // //                 <input
// // //                   type="text"
// // //                   value={editForm.day}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, day: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="e.g., day1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
// // //                 <input
// // //                   type="text"
// // //                   value={editForm.time}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="e.g., 09:00-10:00"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
// // //                 <input
// // //                   type="text"
// // //                   value={editForm.title}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Session title"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // //                 <textarea
// // //                   value={editForm.description}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   rows={3}
// // //                   placeholder="Session description"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Speaker (optional)</label>
// // //                 <input
// // //                   type="text"
// // //                   value={editForm.speaker}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, speaker: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Speaker name"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
// // //                 <input
// // //                   type="text"
// // //                   value={editForm.room}
// // //                   onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))}
// // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Room name"
// // //                 />
// // //               </div>
// // //               {editError && (
// // //                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
// // //                   <p className="text-red-800 text-sm">{editError}</p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <div className="flex justify-end gap-3 mt-6">
// // //               <button
// // //                 onClick={() => setEditingItem(null)}
// // //                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleEdit}
// // //                 disabled={editSubmitting}
// // //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
// // //               >
// // //                 {editSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
// // //                 {editSubmitting ? 'Updating...' : 'Update Session'}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default Agenda;





// // import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
// // import { useSelectedEvent } from '../context/SelectedEventContext';
// // import { useEffect, useState } from 'react';

// // interface AgendaItem {
// //   id: number;
// //   conferencecode: string;
// //   day: string;
// //   time: string;
// //   title: string;
// //   description: string;
// //   speaker?: string;
// //   room: string;
// //   orderIndex: number;
// // }

// // const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/agendas';

// // function Agenda() {
// //   const { selectedEvent } = useSelectedEvent();
// //   const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [reloadCounter, setReloadCounter] = useState(0);

// //   // Group by day and sort by orderIndex
// //   const groupedItems = agendaItems.reduce((acc, item) => {
// //     if (!acc[item.day]) acc[item.day] = [];
// //     acc[item.day].push(item);
// //     return acc;
// //   }, {} as Record<string, AgendaItem[]>);

// //   Object.keys(groupedItems).forEach(day => {
// //     groupedItems[day].sort((a, b) => a.orderIndex - b.orderIndex);
// //   });

// //   // Add state
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [addForm, setAddForm] = useState({
// //     day: 'day1',
// //     time: '',
// //     title: '',
// //     description: '',
// //     speaker: '',
// //     room: ''
// //   });
// //   const [addSubmitting, setAddSubmitting] = useState(false);
// //   const [addError, setAddError] = useState<string | null>(null);

// //   // Edit state
// //   const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
// //   const [editForm, setEditForm] = useState({
// //     day: '',
// //     time: '',
// //     title: '',
// //     description: '',
// //     speaker: '',
// //     room: ''
// //   });
// //   const [editSubmitting, setEditSubmitting] = useState(false);
// //   const [editError, setEditError] = useState<string | null>(null);

// //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// //   // Drag & Drop state
// //   const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
// //   const [isReordering, setIsReordering] = useState(false);

// //   /* ================= FETCH ================= */
// //   useEffect(() => {
// //     let mounted = true;
// //     setLoading(true);
// //     setError(null);

// //     if (!selectedEvent) {
// //       setAgendaItems([]);
// //       setLoading(false);
// //       return;
// //     }

// //     const url = `${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`;

// //     fetch(url)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`Status ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data: AgendaItem[]) => {
// //         if (!mounted) return;
// //         setAgendaItems(data || []);
// //       })
// //       .catch((err) => {
// //         if (!mounted) return;
// //         setError(String(err));
// //       })
// //       .finally(() => {
// //         if (mounted) setLoading(false);
// //       });

// //     return () => { mounted = false; };
// //   }, [selectedEvent, reloadCounter]);

// //   /* ================= ADD ================= */
// //   const handleAdd = async () => {
// //     if (!addForm.title.trim() || !addForm.time.trim() || !addForm.room.trim()) {
// //       setAddError('Title, time, and room are required');
// //       return;
// //     }
// //     setAddSubmitting(true);
// //     setAddError(null);

// //     try {
// //       const params = new URLSearchParams({
// //         conferencecode: selectedEvent!,
// //         day: addForm.day,
// //         time: addForm.time.trim(),
// //         title: addForm.title.trim(),
// //         description: addForm.description.trim(),
// //         speaker: addForm.speaker.trim(),
// //         room: addForm.room.trim()
// //       });

// //       const response = await fetch(`${API_BASE_URL}?${params}`, { method: 'POST' });
// //       if (!response.ok) throw new Error(`Failed to add agenda item: ${response.status}`);

// //       setAddForm({ day: 'day1', time: '', title: '', description: '', speaker: '', room: '' });
// //       setShowAdd(false);
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       setAddError(String(err));
// //     } finally {
// //       setAddSubmitting(false);
// //     }
// //   };

// //   /* ================= EDIT ================= */
// //   const openEdit = (item: AgendaItem) => {
// //     setEditingItem(item);
// //     setEditForm({
// //       day: item.day,
// //       time: item.time,
// //       title: item.title,
// //       description: item.description,
// //       speaker: item.speaker || '',
// //       room: item.room
// //     });
// //   };

// //   const handleEdit = async () => {
// //     if (!editingItem) return;
// //     if (!editForm.title.trim() || !editForm.time.trim() || !editForm.room.trim()) {
// //       setEditError('Title, time, and room are required');
// //       return;
// //     }
// //     setEditSubmitting(true);
// //     setEditError(null);

// //     try {
// //       const params = new URLSearchParams({
// //         day: editForm.day,
// //         time: editForm.time.trim(),
// //         title: editForm.title.trim(),
// //         description: editForm.description.trim(),
// //         speaker: editForm.speaker.trim(),
// //         room: editForm.room.trim()
// //       });

// //       const response = await fetch(`${API_BASE_URL}/${editingItem.id}?${params}`, { method: 'PUT' });
// //       if (!response.ok) throw new Error(`Failed to update agenda item: ${response.status}`);

// //       setEditingItem(null);
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       setEditError(String(err));
// //     } finally {
// //       setEditSubmitting(false);
// //     }
// //   };

// //   /* ================= DELETE ================= */
// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure you want to delete this agenda item?')) return;
// //     setDeletingIds((prev) => [...prev, id]);
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
// //       if (!response.ok) throw new Error(`Failed to delete agenda item: ${response.status}`);
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       alert(`Error deleting agenda item: ${err}`);
// //     } finally {
// //       setDeletingIds((prev) => prev.filter((delId) => delId !== id));
// //     }
// //   };

// //   /* ================= DRAG & DROP ================= */
// //   const handleDragStart = (item: AgendaItem) => {
// //     setDraggedItem(item);
// //   };

// //   const handleDragOver = (e: React.DragEvent, targetItem: AgendaItem) => {
// //     e.preventDefault();
// //     if (!draggedItem || draggedItem.day !== targetItem.day) return;

// //     const dayItems = [...groupedItems[draggedItem.day]];
// //     const draggedIndex = dayItems.findIndex(i => i.id === draggedItem.id);
// //     const targetIndex = dayItems.findIndex(i => i.id === targetItem.id);

// //     if (draggedIndex === targetIndex) return;

// //     dayItems.splice(draggedIndex, 1);
// //     dayItems.splice(targetIndex, 0, draggedItem);

// //     setAgendaItems(prev => {
// //       const others = prev.filter(i => i.day !== draggedItem.day);
// //       return [...others, ...dayItems];
// //     });
// //   };

// //   const handleDragEnd = async () => {
// //     if (!draggedItem) return;

// //     const dayItems = groupedItems[draggedItem.day];
// //     const ids = dayItems.map(item => item.id);

// //     setIsReordering(true);
// //     try {
// //       // Matches: PUT /api/agendas/reorder with { "day": "day1", "ids": [2, 1, 3] }
// //       const response = await fetch(`${API_BASE_URL}/reorder`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           day: draggedItem.day,
// //           ids: ids
// //         }),
// //       });

// //       if (!response.ok) throw new Error(`Failed to reorder: ${response.status}`);
      
// //       // Refresh to confirm server-side orderIndex updates
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       console.error(err);
// //       setReloadCounter((prev) => prev + 1); 
// //     } finally {
// //       setIsReordering(false);
// //       setDraggedItem(null);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h2 className="text-3xl font-bold text-gray-800">Agenda</h2>
// //           <p className="text-sm text-gray-600">Manage conference agenda (Drag items within a day to reorder)</p>
// //         </div>
// //         <div className="flex gap-3">
// //           <button
// //             onClick={() => setReloadCounter((prev) => prev + 1)}
// //             className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
// //           >
// //             <RefreshCw className={`w-4 h-4 ${isReordering ? 'animate-spin' : ''}`} />
// //             Refresh
// //           </button>
// //           <button
// //             onClick={() => setShowAdd(true)}
// //             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             <Plus className="w-4 h-4" />
// //             Add Session
// //           </button>
// //         </div>
// //       </div>

// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// //           <p className="text-red-800">{error}</p>
// //         </div>
// //       )}

// //       {loading ? (
// //         <div className="flex justify-center items-center py-12">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //         </div>
// //       ) : (
// //         <div className="space-y-6">
// //           {Object.keys(groupedItems).length === 0 ? (
// //             <div className="text-center py-12 text-gray-500">No agenda items found</div>
// //           ) : (
// //             Object.entries(groupedItems).map(([day, items]) => (
// //               <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
// //                 <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{day.replace('day', 'Day ')}</h3>
// //                 <div className="space-y-3">
// //                   {items.map((item) => (
// //                     <div
// //                       key={item.id}
// //                       draggable
// //                       onDragStart={() => handleDragStart(item)}
// //                       onDragOver={(e) => handleDragOver(e, item)}
// //                       onDragEnd={handleDragEnd}
// //                       className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors ${draggedItem?.id === item.id ? 'opacity-50 border-2 border-blue-200' : ''}`}
// //                     >
// //                       <GripVertical className="w-5 h-5 text-gray-400" />
// //                       <div className="flex-1">
// //                         <div className="flex items-center gap-4 flex-wrap">
// //                           <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-sm">{item.time}</span>
// //                           <span className="font-semibold text-gray-900">{item.title}</span>
// //                           {item.speaker && <span className="text-sm text-gray-600 px-2 border-l border-gray-300">Speaker: {item.speaker}</span>}
// //                           <span className="text-sm text-gray-500 px-2 border-l border-gray-300">Room: {item.room}</span>
// //                         </div>
// //                         {item.description && <p className="text-sm text-gray-600 mt-2 italic">{item.description}</p>}
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Edit size={16} /></button>
// //                         <button onClick={() => handleDelete(item.id)} disabled={deletingIds.includes(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"><Trash2 size={16} /></button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       )}

// //       {/* Add Modal */}
// //       {showAdd && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
// //             <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Session</h3>
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="col-span-1">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
// //                 <input type="text" value={addForm.day} onChange={(e) => setAddForm(prev => ({ ...prev, day: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="day1" />
// //               </div>
// //               <div className="col-span-1">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
// //                 <input type="text" value={addForm.time} onChange={(e) => setAddForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="09:00 - 10:00" />
// //               </div>
// //               <div className="col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
// //                 <input type="text" value={addForm.title} onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Session Title" />
// //               </div>
// //               <div className="col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
// //                 <input type="text" value={addForm.speaker} onChange={(e) => setAddForm(prev => ({ ...prev, speaker: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
// //               </div>
// //               <div className="col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
// //                 <input type="text" value={addForm.room} onChange={(e) => setAddForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Hall A" />
// //               </div>
// //               <div className="col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
// //                 <textarea value={addForm.description} onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="..." />
// //               </div>
// //             </div>
// //             {addError && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{addError}</div>}
// //             <div className="flex justify-end gap-3 mt-8">
// //               <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
// //               <button onClick={handleAdd} disabled={addSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{addSubmitting ? 'Adding...' : 'Add Session'}</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Edit Modal (Simpler version for brevity, mirroring Add structure) */}
// //       {editingItem && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl p-8 w-full max-w-lg">
// //             <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Session</h3>
// //             <div className="space-y-4">
// //               <input type="text" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Title" />
// //               <input type="text" value={editForm.time} onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Time" />
// //               <input type="text" value={editForm.room} onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Room" />
// //             </div>
// //             <div className="flex justify-end gap-3 mt-8">
// //               <button onClick={() => setEditingItem(null)} className="px-6 py-2 bg-gray-100 rounded-lg">Cancel</button>
// //               <button onClick={handleEdit} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Update Session</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Agenda;



// import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface AgendaItem {
//   id: number;
//   conferencecode: string;
//   day: string;
//   time: string;
//   title: string;
//   description: string;
//   speaker?: string;
//   room: string;
//   orderIndex: number;
// }

// const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/agendas';

// function Agenda() {
//   const { selectedEvent } = useSelectedEvent();
//   const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   // Group by day 
//   // FIX: We do NOT sort here anymore. We trust the order of 'agendaItems' state.
//   const groupedItems = agendaItems.reduce((acc, item) => {
//     if (!acc[item.day]) acc[item.day] = [];
//     acc[item.day].push(item);
//     return acc;
//   }, {} as Record<string, AgendaItem[]>);

//   // Add state
//   const [showAdd, setShowAdd] = useState(false);
//   const [addForm, setAddForm] = useState({
//     day: 'day1',
//     time: '',
//     title: '',
//     description: '',
//     speaker: '',
//     room: ''
//   });
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   // Edit state
//   const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
//   const [editForm, setEditForm] = useState({
//     day: '',
//     time: '',
//     title: '',
//     description: '',
//     speaker: '',
//     room: ''
//   });
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   const [deletingIds, setDeletingIds] = useState<number[]>([]);

//   // Drag & Drop state
//   const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
//   const [isReordering, setIsReordering] = useState(false);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     if (!selectedEvent) {
//       setAgendaItems([]);
//       setLoading(false);
//       return;
//     }

//     const url = `${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`;

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: AgendaItem[]) => {
//         if (!mounted) return;
//         // The backend returns them sorted by orderIndex, so we just set state.
//         setAgendaItems(data || []);
//       })
//       .catch((err) => {
//         if (!mounted) return;
//         setError(String(err));
//       })
//       .finally(() => {
//         if (mounted) setLoading(false);
//       });

//     return () => { mounted = false; };
//   }, [selectedEvent, reloadCounter]);

//   /* ================= ADD ================= */
//   const handleAdd = async () => {
//     if (!addForm.title.trim() || !addForm.time.trim() || !addForm.room.trim()) {
//       setAddError('Title, time, and room are required');
//       return;
//     }
//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       const params = new URLSearchParams({
//         conferencecode: selectedEvent!,
//         day: addForm.day,
//         time: addForm.time.trim(),
//         title: addForm.title.trim(),
//         description: addForm.description.trim(),
//         speaker: addForm.speaker.trim(),
//         room: addForm.room.trim()
//       });

//       const response = await fetch(`${API_BASE_URL}?${params}`, { method: 'POST' });
//       if (!response.ok) throw new Error(`Failed to add agenda item: ${response.status}`);

//       setAddForm({ day: 'day1', time: '', title: '', description: '', speaker: '', room: '' });
//       setShowAdd(false);
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       setAddError(String(err));
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   /* ================= EDIT ================= */
//   const openEdit = (item: AgendaItem) => {
//     setEditingItem(item);
//     setEditForm({
//       day: item.day,
//       time: item.time,
//       title: item.title,
//       description: item.description,
//       speaker: item.speaker || '',
//       room: item.room
//     });
//   };

//   const handleEdit = async () => {
//     if (!editingItem) return;
//     if (!editForm.title.trim() || !editForm.time.trim() || !editForm.room.trim()) {
//       setEditError('Title, time, and room are required');
//       return;
//     }
//     setEditSubmitting(true);
//     setEditError(null);

//     try {
//       const params = new URLSearchParams({
//         day: editForm.day,
//         time: editForm.time.trim(),
//         title: editForm.title.trim(),
//         description: editForm.description.trim(),
//         speaker: editForm.speaker.trim(),
//         room: editForm.room.trim()
//       });

//       const response = await fetch(`${API_BASE_URL}/${editingItem.id}?${params}`, { method: 'PUT' });
//       if (!response.ok) throw new Error(`Failed to update agenda item: ${response.status}`);

//       setEditingItem(null);
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       setEditError(String(err));
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this agenda item?')) return;
//     setDeletingIds((prev) => [...prev, id]);
//     try {
//       const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
//       if (!response.ok) throw new Error(`Failed to delete agenda item: ${response.status}`);
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       alert(`Error deleting agenda item: ${err}`);
//     } finally {
//       setDeletingIds((prev) => prev.filter((delId) => delId !== id));
//     }
//   };

//   /* ================= DRAG & DROP ================= */
//   const handleDragStart = (item: AgendaItem) => {
//     setDraggedItem(item);
//   };

//   const handleDragOver = (e: React.DragEvent, targetItem: AgendaItem) => {
//     e.preventDefault();
//     if (!draggedItem || draggedItem.day !== targetItem.day) return;

//     // We must work on the full flat list 'agendaItems' to preserve updates across renders
//     const currentIndex = agendaItems.findIndex(i => i.id === draggedItem.id);
//     const targetIndex = agendaItems.findIndex(i => i.id === targetItem.id);

//     if (currentIndex === targetIndex) return;

//     // Create a new copy of the array
//     const newItems = [...agendaItems];
//     // Remove dragged item
//     const [movedItem] = newItems.splice(currentIndex, 1);
//     // Insert at new position
//     newItems.splice(targetIndex, 0, movedItem);

//     // Update state immediately so the UI reflects the drag
//     setAgendaItems(newItems);
//   };

//   const handleDragEnd = async () => {
//     if (!draggedItem) return;

//     // Get the specific day's items from the CURRENT state (which is already reordered by DragOver)
//     const currentDayItems = agendaItems.filter(item => item.day === draggedItem.day);
//     const ids = currentDayItems.map(item => item.id);

//     setIsReordering(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/reorder`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           day: draggedItem.day,
//           ids: ids
//         }),
//       });

//       if (!response.ok) throw new Error(`Failed to reorder: ${response.status}`);
      
//       // We don't necessarily need to reload if we trust our local state, 
//       // but reloading confirms the DB saved it correctly.
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       console.error(err);
//       setReloadCounter((prev) => prev + 1); // Revert on error
//     } finally {
//       setIsReordering(false);
//       setDraggedItem(null);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-800">Agenda</h2>
//           <p className="text-sm text-gray-600">Manage conference agenda (Drag items within a day to reorder)</p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setReloadCounter((prev) => prev + 1)}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             <RefreshCw className={`w-4 h-4 ${isReordering ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowAdd(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             Add Session
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-800">{error}</p>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {Object.keys(groupedItems).length === 0 ? (
//             <div className="text-center py-12 text-gray-500">No agenda items found</div>
//           ) : (
//             Object.entries(groupedItems).map(([day, items]) => (
//               <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{day.replace('day', 'Day ')}</h3>
//                 <div className="space-y-3">
//                   {items.map((item) => (
//                     <div
//                       key={item.id}
//                       draggable
//                       onDragStart={() => handleDragStart(item)}
//                       onDragOver={(e) => handleDragOver(e, item)}
//                       onDragEnd={handleDragEnd}
//                       className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors ${draggedItem?.id === item.id ? 'opacity-50 border-2 border-blue-200' : ''}`}
//                     >
//                       <GripVertical className="w-5 h-5 text-gray-400" />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-4 flex-wrap">
//                           <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-sm">{item.time}</span>
//                           <span className="font-semibold text-gray-900">{item.title}</span>
//                           {item.speaker && <span className="text-sm text-gray-600 px-2 border-l border-gray-300">Speaker: {item.speaker}</span>}
//                           <span className="text-sm text-gray-500 px-2 border-l border-gray-300">Room: {item.room}</span>
//                         </div>
//                         {item.description && <p className="text-sm text-gray-600 mt-2 italic">{item.description}</p>}
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Edit size={16} /></button>
//                         <button onClick={() => handleDelete(item.id)} disabled={deletingIds.includes(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"><Trash2 size={16} /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Session</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="col-span-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
//                 <input type="text" value={addForm.day} onChange={(e) => setAddForm(prev => ({ ...prev, day: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="day1" />
//               </div>
//               <div className="col-span-1">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
//                 <input type="text" value={addForm.time} onChange={(e) => setAddForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="09:00 - 10:00" />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
//                 <input type="text" value={addForm.title} onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Session Title" />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
//                 <input type="text" value={addForm.speaker} onChange={(e) => setAddForm(prev => ({ ...prev, speaker: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
//                 <input type="text" value={addForm.room} onChange={(e) => setAddForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Hall A" />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
//                 <textarea value={addForm.description} onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="..." />
//               </div>
//             </div>
//             {addError && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{addError}</div>}
//             <div className="flex justify-end gap-3 mt-8">
//               <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
//               <button onClick={handleAdd} disabled={addSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{addSubmitting ? 'Adding...' : 'Add Session'}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal (Simpler version for brevity, mirroring Add structure) */}
//       {editingItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-8 w-full max-w-lg">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Session</h3>
//             <div className="space-y-4">
//               <input type="text" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Title" />
//               <input type="text" value={editForm.time} onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Time" />
//               <input type="text" value={editForm.room} onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Room" />
//             </div>
//             <div className="flex justify-end gap-3 mt-8">
//               <button onClick={() => setEditingItem(null)} className="px-6 py-2 bg-gray-100 rounded-lg">Cancel</button>
//               <button onClick={handleEdit} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Update Session</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Agenda;












import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface AgendaItem {
  id: number;
  conferencecode: string;
  day: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  room: string;
  orderIndex: number;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/agendas';

function Agenda() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('day1');

  // Group by day 
  const groupedItems = agendaItems.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, AgendaItem[]>);

  // Available days for tabs (always ensure at least day1-day3 exist for selection/tabs)
  const availableDays = Array.from(new Set([...Object.keys(groupedItems), 'day1', 'day2', 'day3'])).sort();

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    day: 'day1',
    time: '',
    title: '',
    description: '',
    speaker: '',
    room: ''
  });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [editForm, setEditForm] = useState({
    day: '',
    time: '',
    title: '',
    description: '',
    speaker: '',
    room: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Drag & Drop state
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setAgendaItems([]);
      setLoading(false);
      return;
    }

    const url = `${API_BASE_URL}/conference/${encodeURIComponent(selectedEvent)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: AgendaItem[]) => {
        if (!mounted) return;
        setAgendaItems(data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [selectedEvent, reloadCounter]);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!addForm.title.trim() || !addForm.time.trim() || !addForm.room.trim()) {
      setAddError('Title, time, and room are required');
      return;
    }
    if (!username) {
      setAddError('Username not available');
      return;
    }
    setAddSubmitting(true);
    setAddError(null);

    try {
      const params = new URLSearchParams({
        conferencecode: selectedEvent!,
        day: addForm.day,
        time: addForm.time.trim(),
        title: addForm.title.trim(),
        description: addForm.description.trim(),
        speaker: addForm.speaker.trim(),
        room: addForm.room.trim(),
        username: username
      });

      const response = await fetch(`${API_BASE_URL}?${params}`, { method: 'POST' });
      if (!response.ok) throw new Error(`Failed to add agenda item: ${response.status}`);

      // Reset form but keep the active tab day
      setAddForm({ day: activeTab, time: '', title: '', description: '', speaker: '', room: '' });
      setShowAdd(false);
      setReloadCounter((prev) => prev + 1);
    } catch (err) {
      setAddError(String(err));
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (item: AgendaItem) => {
    setEditingItem(item);
    setEditForm({
      day: item.day,
      time: item.time,
      title: item.title,
      description: item.description,
      speaker: item.speaker || '',
      room: item.room
    });
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    if (!editForm.title.trim() || !editForm.time.trim() || !editForm.room.trim()) {
      setEditError('Title, time, and room are required');
      return;
    }
    if (!username) {
      setEditError('Username not available');
      return;
    }
    setEditSubmitting(true);
    setEditError(null);

    try {
      const params = new URLSearchParams({
        conferencecode: selectedEvent!,
        day: editForm.day,
        time: editForm.time.trim(),
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        speaker: editForm.speaker.trim(),
        room: editForm.room.trim(),
        username: username
      });

      const response = await fetch(`${API_BASE_URL}/${editingItem.id}?${params}`, { method: 'PUT' });
      if (!response.ok) throw new Error(`Failed to update agenda item: ${response.status}`);

      setEditingItem(null);
      setReloadCounter((prev) => prev + 1);
    } catch (err) {
      setEditError(String(err));
    } finally {
      setEditSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!username) {
      alert('Username not available');
      return;
    }
    if (!confirm('Are you sure you want to delete this agenda item?')) return;
    setDeletingIds((prev) => [...prev, id]);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete agenda item: ${response.status}`);
      setReloadCounter((prev) => prev + 1);
    } catch (err) {
      alert(`Error deleting agenda item: ${err}`);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  /* ================= DRAG & DROP ================= */
  const handleDragStart = (item: AgendaItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: AgendaItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.day !== targetItem.day) return;

    const currentIndex = agendaItems.findIndex(i => i.id === draggedItem.id);
    const targetIndex = agendaItems.findIndex(i => i.id === targetItem.id);

    if (currentIndex === targetIndex) return;

    const newItems = [...agendaItems];
    const [movedItem] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    setAgendaItems(newItems);
  };

  const handleDragEnd = async () => {
    if (!draggedItem) return;

    const currentDayItems = agendaItems.filter(item => item.day === draggedItem.day);
    const ids = currentDayItems.map(item => item.id);

    setIsReordering(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: draggedItem.day,
          ids: ids
        }),
      });

      if (!response.ok) throw new Error(`Failed to reorder: ${response.status}`);
      setReloadCounter((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setReloadCounter((prev) => prev + 1); 
    } finally {
      setIsReordering(false);
      setDraggedItem(null);
    }
  };

  // Helper to format "day1" -> "Day 1"
  const formatDay = (d: string) => d.replace(/day/i, 'Day ');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Agenda</h2>
          <p className="text-sm text-gray-600">Manage conference agenda</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setReloadCounter((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isReordering ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              // Set the modal default to currently active tab
              setAddForm(prev => ({ ...prev, day: activeTab }));
              setShowAdd(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {availableDays.map((day) => (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === day 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {formatDay(day)}
              {activeTab === day && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
          {/* Render ONLY the active tab's items */}
          {!groupedItems[activeTab] || groupedItems[activeTab].length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No sessions found for {formatDay(activeTab)}. Click "Add Session" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {groupedItems[activeTab].map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  onDragOver={(e) => handleDragOver(e, item)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 ${draggedItem?.id === item.id ? 'opacity-50 border-blue-200 bg-blue-50' : ''}`}
                >
                  <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-sm whitespace-nowrap">
                        {item.time}
                      </span>
                      <span className="font-semibold text-gray-900 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                       {item.speaker && <span className="truncate">🎤 {item.speaker}</span>}
                       <span className="truncate">📍 {item.room}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingIds.includes(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Session</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
                <select 
                  value={addForm.day} 
                  onChange={(e) => setAddForm(prev => ({ ...prev, day: e.target.value }))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="day1">Day 1</option>
                  <option value="day2">Day 2</option>
                  <option value="day3">Day 3</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input type="text" value={addForm.time} onChange={(e) => setAddForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="09:00 - 10:00" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input type="text" value={addForm.title} onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Session Title" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
                <input type="text" value={addForm.speaker} onChange={(e) => setAddForm(prev => ({ ...prev, speaker: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
                <input type="text" value={addForm.room} onChange={(e) => setAddForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Hall A" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="..." />
              </div>
            </div>
            {addError && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{addError}</div>}
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={addSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">{addSubmitting ? 'Adding...' : 'Add Session'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
                <select 
                  value={editForm.day} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, day: e.target.value }))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="day1">Day 1</option>
                  <option value="day2">Day 2</option>
                  <option value="day3">Day 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Title" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input type="text" value={editForm.time} onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Time" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
                <input type="text" value={editForm.room} onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Room" />
              </div>
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Speaker</label>
                 <input type="text" value={editForm.speaker} onChange={(e) => setEditForm(prev => ({ ...prev, speaker: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                 <textarea value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={2}/>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setEditingItem(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleEdit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Update Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;