// // import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// // import { useSelectedEvent } from '../context/SelectedEventContext';
// // import { useEffect, useState } from 'react';

// // interface Topic {
// //   id: number;
// //   topicName: string;
// //   conferencecode: string | null;
// // }

// // function Topics() {
// //   const { selectedEvent } = useSelectedEvent();
// //   const [topics, setTopics] = useState<Topic[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [reloadCounter, setReloadCounter] = useState(0);

// //   // Add state
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [addTopicName, setAddTopicName] = useState('');
// //   const [addSubmitting, setAddSubmitting] = useState(false);
// //   const [addError, setAddError] = useState<string | null>(null);

// //   // Edit state
// //   const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
// //   const [editTopicName, setEditTopicName] = useState('');
// //   const [editSubmitting, setEditSubmitting] = useState(false);
// //   const [editError, setEditError] = useState<string | null>(null);

// //   const [deletingIds, setDeletingIds] = useState<number[]>([]);

// //   useEffect(() => {
// //     let mounted = true;
// //     setLoading(true);
// //     setError(null);

// //     if (!selectedEvent) {
// //       setTopics([]);
// //       setLoading(false);
// //       return;
// //     }

// //     const url = `https://backendconf.roboticsaisummit.com/api/robotics/topics/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

// //     fetch(url)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`Status ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data: Topic[]) => {
// //         if (!mounted) return;
// //         setTopics(data || []);
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

// //   // Add handlers
// //   const handleAdd = async () => {
// //     if (!addTopicName.trim()) {
// //       setAddError('Topic name is required');
// //       return;
// //     }

// //     setAddSubmitting(true);
// //     setAddError(null);

// //     try {
// //       const response = await fetch('https://backendconf.roboticsaisummit.com/api/robotics/topics', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           topicName: addTopicName.trim(),
// //           conferencecode: selectedEvent,
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Failed to add topic: ${response.status}`);
// //       }

// //       setAddTopicName('');
// //       setShowAdd(false);
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       setAddError(String(err));
// //     } finally {
// //       setAddSubmitting(false);
// //     }
// //   };

// //   // Edit handlers
// //   const openEdit = (topic: Topic) => {
// //     setEditingTopic(topic);
// //     setEditTopicName(topic.topicName || '');
// //     setEditError(null);
// //   };

// //   const closeEdit = () => {
// //     setEditingTopic(null);
// //     setEditTopicName('');
// //     setEditError(null);
// //   };

// //   const handleEdit = async () => {
// //     if (!editingTopic) return;

// //     if (!editTopicName.trim()) {
// //       setEditError('Topic name is required');
// //       return;
// //     }

// //     setEditSubmitting(true);
// //     setEditError(null);

// //     try {
// //       const response = await fetch(`https://backendconf.roboticsaisummit.com/api/robotics/topics/${editingTopic.id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           topicName: editTopicName.trim(),
// //           conferencecode: selectedEvent,
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Failed to update topic: ${response.status}`);
// //       }

// //       closeEdit();
// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       setEditError(String(err));
// //     } finally {
// //       setEditSubmitting(false);
// //     }
// //   };

// //   // Delete handler
// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure you want to delete this topic?')) return;

// //     setDeletingIds((prev) => [...prev, id]);

// //     try {
// //       const response = await fetch(`https://backendconf.roboticsaisummit.com/api/robotics/topics/${id}`, {
// //         method: 'DELETE',
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Failed to delete topic: ${response.status}`);
// //       }

// //       setReloadCounter((prev) => prev + 1);
// //     } catch (err) {
// //       alert(`Error deleting topic: ${err}`);
// //     } finally {
// //       setDeletingIds((prev) => prev.filter((delId) => delId !== id));
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h2 className="text-3xl font-bold text-gray-800">Topics</h2>
// //           <p className="text-sm text-gray-600">Manage conference topics</p>
// //         </div>
// //         <div className="flex gap-3">
// //           <button
// //             onClick={() => setReloadCounter((prev) => prev + 1)}
// //             className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
// //           >
// //             <RefreshCw className="w-4 h-4" />
// //             Refresh
// //           </button>
// //           <button
// //             onClick={() => setShowAdd(true)}
// //             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             <Plus className="w-4 h-4" />
// //             Add Topic
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
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-50 border-b border-gray-200">
// //                 <tr>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     ID
// //                   </th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Topic Name
// //                   </th>
// //                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Conference Code
// //                   </th>
// //                   <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {topics.map((topic) => (
// //                   <tr key={topic.id} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                       {topic.id}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                       {topic.topicName}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                       {topic.conferencecode}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                       <div className="flex justify-end gap-2">
// //                         <button
// //                           onClick={() => openEdit(topic)}
// //                           className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
// //                           title="Edit"
// //                         >
// //                           <Edit className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(topic.id)}
// //                           disabled={deletingIds.includes(topic.id)}
// //                           className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
// //                           title="Delete"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {topics.length === 0 && !loading && (
// //                   <tr>
// //                     <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
// //                       No topics found
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {/* Add Modal */}
// //       {showAdd && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Topic</h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Topic Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={addTopicName}
// //                   onChange={(e) => setAddTopicName(e.target.value)}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   placeholder="Enter topic name"
// //                 />
// //               </div>
// //               {addError && (
// //                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
// //                   <p className="text-red-800 text-sm">{addError}</p>
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex justify-end gap-3 mt-6">
// //               <button
// //                 onClick={() => {
// //                   setShowAdd(false);
// //                   setAddTopicName('');
// //                   setAddError(null);
// //                 }}
// //                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleAdd}
// //                 disabled={addSubmitting}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 {addSubmitting ? 'Adding...' : 'Add Topic'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Edit Modal */}
// //       {editingTopic && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Topic</h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Topic Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={editTopicName}
// //                   onChange={(e) => setEditTopicName(e.target.value)}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   placeholder="Enter topic name"
// //                 />
// //               </div>
// //               {editError && (
// //                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
// //                   <p className="text-red-800 text-sm">{editError}</p>
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex justify-end gap-3 mt-6">
// //               <button
// //                 onClick={closeEdit}
// //                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleEdit}
// //                 disabled={editSubmitting}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 {editSubmitting ? 'Updating...' : 'Update Topic'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Topics;









// import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
// import { useSelectedEvent } from '../context/SelectedEventContext';
// import { useEffect, useState } from 'react';

// interface Topic {
//   id: number;
//   topicName: string;
//   conferencecode: string | null;
// }

// const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/topics';

// function Topics() {
//   const { selectedEvent } = useSelectedEvent();
//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [reloadCounter, setReloadCounter] = useState(0);

//   // Add state
//   const [showAdd, setShowAdd] = useState(false);
//   const [addTopicName, setAddTopicName] = useState('');
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addError, setAddError] = useState<string | null>(null);

//   // Edit state
//   const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
//   const [editTopicName, setEditTopicName] = useState('');
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editError, setEditError] = useState<string | null>(null);

//   const [deletingIds, setDeletingIds] = useState<number[]>([]);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     if (!selectedEvent) {
//       setTopics([]);
//       setLoading(false);
//       return;
//     }

//     // GET /api/robotics/topics/by-conferencecode/{conferencecode}
//     const url = `${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         return res.json();
//       })
//       .then((data: Topic[]) => {
//         if (!mounted) return;
//         setTopics(data || []);
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

//   /* ================= ADD ================= */
//   const handleAdd = async () => {
//     if (!selectedEvent) {
//       setAddError('Event not selected');
//       return;
//     }
//     if (!addTopicName.trim()) {
//       setAddError('Topic name is required');
//       return;
//     }

//     setAddSubmitting(true);
//     setAddError(null);

//     try {
//       // POST /api/robotics/topics?topicName=...&conferencecode=...
//       const params = new URLSearchParams();
//       params.append('topicName', addTopicName.trim());
//       params.append('conferencecode', selectedEvent);

//       const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
//         method: 'POST',
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Failed to add topic: ${response.status} ${text}`);
//       }

//       setAddTopicName('');
//       setShowAdd(false);
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       setAddError(String(err));
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   /* ================= EDIT ================= */
//   const openEdit = (topic: Topic) => {
//     setEditingTopic(topic);
//     setEditTopicName(topic.topicName || '');
//     setEditError(null);
//   };

//   const closeEdit = () => {
//     setEditingTopic(null);
//     setEditTopicName('');
//     setEditError(null);
//   };

//   const handleEdit = async () => {
//     if (!editingTopic || !selectedEvent) return;

//     if (!editTopicName.trim()) {
//       setEditError('Topic name is required');
//       return;
//     }

//     setEditSubmitting(true);
//     setEditError(null);

//     try {
//       // PUT /api/robotics/topics/{id}?topicName=...&conferencecode=...
//       const params = new URLSearchParams();
//       params.append('topicName', editTopicName.trim());
//       params.append('conferencecode', selectedEvent);

//       const response = await fetch(`${API_BASE_URL}/${editingTopic.id}?${params.toString()}`, {
//         method: 'PUT',
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Failed to update topic: ${response.status} ${text}`);
//       }

//       closeEdit();
//       setReloadCounter((prev) => prev + 1);
//     } catch (err) {
//       setEditError(String(err));
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this topic?')) return;

//     setDeletingIds((prev) => [...prev, id]);

//     try {
//       // DELETE /api/robotics/topics/{id}
//       const response = await fetch(`${API_BASE_URL}/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Failed to delete topic: ${response.status} ${text}`);
//       }

//       setTopics((prev) => prev.filter((topic) => topic.id !== id));
//     } catch (err) {
//       alert(`Error deleting topic: ${err}`);
//       // Only reload if optimistic update failed or to be safe
//       setReloadCounter((prev) => prev + 1);
//     } finally {
//       setDeletingIds((prev) => prev.filter((delId) => delId !== id));
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-800">Topics</h2>
//           <p className="text-sm text-gray-600">Manage conference topics for <span className="font-semibold">{selectedEvent}</span></p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setReloadCounter((prev) => prev + 1)}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowAdd(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//           >
//             <Plus className="w-4 h-4" />
//             Add Topic
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
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Topic Name
//                   </th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {topics.length === 0 ? (
//                   <tr>
//                     <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
//                       No topics found for {selectedEvent}.
//                     </td>
//                   </tr>
//                 ) : (
//                   topics.map((topic) => (
//                     <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {topic.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {topic.topicName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => openEdit(topic)}
//                             className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(topic.id)}
//                             disabled={deletingIds.includes(topic.id)}
//                             className={`p-2 rounded transition-colors ${
//                               deletingIds.includes(topic.id) 
//                                 ? 'text-gray-400 cursor-not-allowed' 
//                                 : 'text-red-600 hover:text-red-800 hover:bg-red-50'
//                             }`}
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
//             <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Add New Topic</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Topic Name
//                 </label>
//                 <input
//                   type="text"
//                   value={addTopicName}
//                   onChange={(e) => setAddTopicName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter topic name"
//                 />
//               </div>
//               {addError && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//                   <p className="text-red-800 text-sm">{addError}</p>
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowAdd(false);
//                   setAddTopicName('');
//                   setAddError(null);
//                 }}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAdd}
//                 disabled={addSubmitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {addSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
//                 {addSubmitting ? 'Adding...' : 'Add Topic'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editingTopic && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
//             <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Edit Topic</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Topic Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editTopicName}
//                   onChange={(e) => setEditTopicName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter topic name"
//                 />
//               </div>
//               {editError && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//                   <p className="text-red-800 text-sm">{editError}</p>
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={closeEdit}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEdit}
//                 disabled={editSubmitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {editSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
//                 {editSubmitting ? 'Updating...' : 'Update Topic'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Topics;











import { Plus, Edit, Trash2, RefreshCw, GripVertical } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Topic {
  id: number;
  topicName: string;
  conferencecode: string | null;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/robotics/topics';

function Topics() {
  const { selectedEvent } = useSelectedEvent();
  const { username } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addTopicName, setAddTopicName] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit state
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTopicName, setEditTopicName] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Drag & Drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setTopics([]);
      setLoading(false);
      return;
    }

    // GET /api/robotics/topics/by-conferencecode/{conferencecode}
    const url = `${API_BASE_URL}/by-conferencecode/${encodeURIComponent(selectedEvent)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Topic[]) => {
        if (!mounted) return;
        setTopics(data || []);
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
    const updatedTopics = [...topics];
    const [draggedItem] = updatedTopics.splice(draggedItemIndex, 1);
    updatedTopics.splice(targetIndex, 0, draggedItem);

    setTopics(updatedTopics);
    setDraggedItemIndex(null);
    setIsReordering(true);

    try {
      // 2. Prepare payload: Array of IDs in new order
      const topicIds = updatedTopics.map((t) => t.id);

      // 3. Send PUT request
      const response = await fetch(`${API_BASE_URL}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicIds),
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

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!selectedEvent) {
      setAddError('Event not selected');
      return;
    }
    if (!username) {
      setAddError('Username not available');
      return;
    }
    if (!addTopicName.trim()) {
      setAddError('Topic name is required');
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      const params = new URLSearchParams();
      params.append('topicName', addTopicName.trim());
      params.append('conferencecode', selectedEvent);
      params.append('username', username);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to add topic: ${response.status} ${text}`);
      }

      setAddTopicName('');
      setShowAdd(false);
      setReloadCounter((prev) => prev + 1);
    } catch (err) {
      setAddError(String(err));
    } finally {
      setAddSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditTopicName(topic.topicName || '');
    setEditError(null);
  };

  const closeEdit = () => {
    setEditingTopic(null);
    setEditTopicName('');
    setEditError(null);
  };

  const handleEdit = async () => {
    if (!editingTopic || !selectedEvent) return;
    if (!username) {
      setEditError('Username not available');
      return;
    }

    if (!editTopicName.trim()) {
      setEditError('Topic name is required');
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      const params = new URLSearchParams();
      params.append('topicName', editTopicName.trim());
      params.append('conferencecode', selectedEvent);
      params.append('username', username);

      const response = await fetch(`${API_BASE_URL}/${editingTopic.id}?${params.toString()}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update topic: ${response.status} ${text}`);
      }

      closeEdit();
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
    if (!window.confirm('Are you sure you want to delete this topic?')) return;

    setDeletingIds((prev) => [...prev, id]);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete topic: ${response.status} ${text}`);
      }

      setTopics((prev) => prev.filter((topic) => topic.id !== id));
    } catch (err) {
      alert(`Error deleting topic: ${err}`);
      setReloadCounter((prev) => prev + 1);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Topics</h2>
          <p className="text-sm text-gray-600">
            Manage and reorder topics for <span className="font-semibold">{selectedEvent}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setReloadCounter((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading || isReordering ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Topic
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-4"></th> {/* Grip Column */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Topic Name
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No topics found for {selectedEvent}.
                    </td>
                  </tr>
                ) : (
                  topics.map((topic, index) => (
                    <tr
                      key={topic.id}
                      className={`hover:bg-gray-50 transition-colors ${draggedItemIndex === index ? 'opacity-50 bg-gray-100' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-gray-400 cursor-move">
                        <GripVertical className="w-5 h-5 mx-auto hover:text-gray-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {topic.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {topic.topicName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(topic)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(topic.id)}
                            disabled={deletingIds.includes(topic.id)}
                            className={`p-2 rounded transition-colors ${deletingIds.includes(topic.id)
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                              }`}
                            title="Delete"
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
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Add New Topic</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={addTopicName}
                  onChange={(e) => setAddTopicName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter topic name"
                />
              </div>
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{addError}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAdd(false);
                  setAddTopicName('');
                  setAddError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={addSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {addSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
                {addSubmitting ? 'Adding...' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTopic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Edit Topic</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={editTopicName}
                  onChange={(e) => setEditTopicName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter topic name"
                />
              </div>
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{editError}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {editSubmitting && <RefreshCw className="animate-spin w-4 h-4" />}
                {editSubmitting ? 'Updating...' : 'Update Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;