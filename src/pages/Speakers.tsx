
import { Plus, Edit, Trash2, RefreshCw, GripVertical, FileText } from 'lucide-react';
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
  visible?: boolean;
  slug?: string | null;
  linkedin?: string | null;
  partnerLogo?: string | null;
  speakerrole?: string | null;
}

interface SpeakerSection {
  id: number;
  content: string;
  priorities: string | null;
  currentFocus: string | null;
  futureFocus: string | null;
}

interface SpeakerSpeakingSection {
  id: number;
  title: string;
  description: string;
  date: string;
  speakerName?: string;
  speakerUniversity?: string;
  speakerImage?: string;
  speakerType?: string;
  partnerLogo?: string;
  linkedin?: string;
}

const API_BASE_URL = 'https://backendconf.roboticsaisummit.com/api/speakers';
const SPEAKER_SECTIONS_API = 'https://backendconf.roboticsaisummit.com/api/speaker-sections';
const SPEAKER_SPEAKING_SECTIONS_API = 'https://backendconf.roboticsaisummit.com/api/speaker-speaking-sections';

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
  const [editVisible, setEditVisible] = useState(true);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editPartnerLogoFile, setEditPartnerLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editSpeakerRole, setEditSpeakerRole] = useState('');

  // Add State
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUniversity, setAddUniversity] = useState('');
  const [addSpeakerType, setAddSpeakerType] = useState('');
  const [addVisible, setAddVisible] = useState(true);
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addSlug, setAddSlug] = useState('');
  const [addLinkedin, setAddLinkedin] = useState('');
  const [addPartnerLogoFile, setAddPartnerLogoFile] = useState<File | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSpeakerRole, setAddSpeakerRole] = useState('');

  const [reloadCounter, setReloadCounter] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Drag & Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Sections Modal State (Unified)
  const [showSectionsModal, setShowSectionsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'speaking'>('general');
  const [selectedSpeakerForSections, setSelectedSpeakerForSections] = useState<Speaker | null>(null);

  // General Sections State
  const [speakerSections, setSpeakerSections] = useState<SpeakerSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<SpeakerSection | null>(null);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);
  const [sectionSubmitError, setSectionSubmitError] = useState<string | null>(null);

  // Speaking Sections State
  const [speakingSections, setSpeakingSections] = useState<SpeakerSpeakingSection[]>([]);
  const [speakingSectionsLoading, setSpeakingSectionsLoading] = useState(false);
  const [speakingSectionsError, setSpeakingSectionsError] = useState<string | null>(null);
  const [editingSpeakingSection, setEditingSpeakingSection] = useState<SpeakerSpeakingSection | null>(null);
  const [speakingSectionSubmitting, setSpeakingSectionSubmitting] = useState(false);
  const [speakingSectionSubmitError, setSpeakingSectionSubmitError] = useState<string | null>(null);


  // Bulk Add Sections State (General)
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkSections, setBulkSections] = useState<Omit<SpeakerSection, 'id'>[]>([]);
  const [bulkAddSubmitting, setBulkAddSubmitting] = useState(false);
  const [bulkAddError, setBulkAddError] = useState<string | null>(null);

  // Add Speaking Section State
  const [showAddSpeakingSection, setShowAddSpeakingSection] = useState(false);
  const [addSpeakingSectionTitle, setAddSpeakingSectionTitle] = useState('');
  const [addSpeakingSectionDate, setAddSpeakingSectionDate] = useState('');
  const [addSpeakingSectionDescription, setAddSpeakingSectionDescription] = useState('');
  const [addSpeakingSectionSubmitting, setAddSpeakingSectionSubmitting] = useState(false);
  const [addSpeakingSectionError, setAddSpeakingSectionError] = useState<string | null>(null);

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
    setEditVisible(s.visible ?? true);
    setEditImageFile(null); // Reset file input
    setEditImageUrl('');
    setEditSlug(s.slug || '');
    setEditLinkedin(s.linkedin || '');
    setEditPartnerLogoFile(null); // Reset file input
    setSubmitError(null);
    setEditSpeakerRole(s.speakerrole || '');
  };

  const closeEdit = () => {
    setEditingSpeaker(null);
    setEditName('');
    setEditUniversity('');
    setEditSpeakerType('');
    setEditVisible(true);
    setEditImageFile(null);
    setEditImageUrl('');
    setEditSlug('');
    setEditLinkedin('');
    setEditPartnerLogoFile(null);
    setSubmitError(null);
    setEditSpeakerRole('');
  };

  const submitEdit = async () => {
    if (!editingSpeaker || !selectedEvent) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const body = new FormData();
      body.append('name', editName);
      body.append('university', editUniversity);
      body.append('conferencecode', selectedEvent);
      body.append('speakerType', editSpeakerType);
      body.append('visible', editVisible.toString());
      body.append('username', username || '');
      body.append('speakerrole', editSpeakerRole);

      if (editSlug) {
        body.append('slug', editSlug);
      }
      if (editLinkedin) {
        body.append('linkedin', editLinkedin);
      }
      if (editImageFile) {
        body.append('image', editImageFile);
      }
      if (editImageUrl) {
        body.append('imageUrl', editImageUrl);
      }
      if (editPartnerLogoFile) {
        body.append('partnerLogo', editPartnerLogoFile);
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
    setAddVisible(true);
    setAddImageFile(null);
    setAddSlug('');
    setAddLinkedin('');
    setAddPartnerLogoFile(null);
    setAddError(null);
    setAddSpeakerRole('');
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddName('');
    setAddUniversity('');
    setAddSpeakerType('');
    setAddVisible(true);
    setAddImageFile(null);
    setAddSlug('');
    setAddLinkedin('');
    setAddPartnerLogoFile(null);
    setAddError(null);
    setAddSpeakerRole('');
  };

  const submitAdd = async () => {
    if (!selectedEvent) {
      setAddError('Event not selected');
      return;
    }

    if (!addName || !addUniversity || !addSpeakerType) {
      setAddError('Please fill in Name, University, and Speaker Type.');
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
      body.append('visible', addVisible.toString());
      body.append('username', username || '');
      body.append('speakerrole', addSpeakerRole);

      if (addSlug) {
        body.append('slug', addSlug);
      }
      if (addLinkedin) {
        body.append('linkedin', addLinkedin);
      }
      if (addImageFile) {
        body.append('image', addImageFile);
      }
      if (addPartnerLogoFile) {
        body.append('partnerLogo', addPartnerLogoFile);
      }

      // POST /api/speakers/{conferencecode}
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
      const res = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
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

  /* ================= SPEAKER SECTIONS ================= */

  const openSectionsModal = async (speaker: Speaker, tab: 'general' | 'speaking' = 'general') => {
    setSelectedSpeakerForSections(speaker);
    setShowSectionsModal(true);
    setActiveTab(tab);

    // Reset States
    setSectionsError(null);
    setEditingSection(null);
    setSpeakingSectionsError(null);
    setEditingSpeakingSection(null);
    setShowAddSpeakingSection(false);

    // Fetch General Sections
    setSectionsLoading(true);
    fetch(`${SPEAKER_SECTIONS_API}/speaker/${speaker.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSpeakerSections(data || []))
      .catch(err => setSectionsError(err.message))
      .finally(() => setSectionsLoading(false));

    // Fetch Speaking Sections
    setSpeakingSectionsLoading(true);
    fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/speaker/${speaker.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSpeakingSections(data || []))
      .catch(err => setSpeakingSectionsError(err.message))
      .finally(() => setSpeakingSectionsLoading(false));
  };

  const closeSectionsModal = () => {
    setShowSectionsModal(false);
    setSelectedSpeakerForSections(null);
    setSpeakerSections([]);
    setSpeakingSections([]);
    setEditingSection(null);
    setEditingSpeakingSection(null);
  };

  const startEditSection = (section: SpeakerSection) => {
    setEditingSection({ ...section });
    setSectionSubmitError(null);
  };

  const cancelEditSection = () => {
    setEditingSection(null);
    setSectionSubmitError(null);
  };

  const submitSectionEdit = async () => {
    if (!editingSection) return;

    setSectionSubmitting(true);
    setSectionSubmitError(null);

    try {
      // Prepare x-www-form-urlencoded data
      const formData = new URLSearchParams();
      formData.append('content', editingSection.content);
      formData.append('priorities', editingSection.priorities || '');
      formData.append('currentFocus', editingSection.currentFocus || '');
      formData.append('futureFocus', editingSection.futureFocus || '');
      formData.append('username', username);

      const res = await fetch(`${SPEAKER_SECTIONS_API}/${editingSection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update section: ${text}`);
      }

      // Refresh sections list
      if (selectedSpeakerForSections) {
        const refreshRes = await fetch(`${SPEAKER_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setSpeakerSections(data || []);
        }
      }

      setEditingSection(null);
      setSectionSubmitError(null);
    } catch (err: any) {
      setSectionSubmitError(err.message);
    } finally {
      setSectionSubmitting(false);
    }
  };

  const deleteSection = async (sectionId: number) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const res = await fetch(`${SPEAKER_SECTIONS_API}/${sectionId}?username=${username}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete section: ${text}`);
      }

      // Refresh sections list
      if (selectedSpeakerForSections) {
        const refreshRes = await fetch(`${SPEAKER_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setSpeakerSections(data || []);
        }
      }

      // Close edit mode if this section was being edited
      if (editingSection?.id === sectionId) {
        setEditingSection(null);
      }
    } catch (err: any) {
      alert('Error deleting section: ' + err.message);
    }
  };

  /* ================= BULK ADD SECTIONS ================= */

  const openBulkAdd = () => {
    setShowBulkAdd(true);
    setBulkAddError(null);
    // Initialize with one empty section template
    setBulkSections([
      {
        content: '',
        priorities: null,
        currentFocus: null,
        futureFocus: null,
      },
    ]);
  };

  const closeBulkAdd = () => {
    setShowBulkAdd(false);
    setBulkSections([]);
    setBulkAddError(null);
  };

  const addBulkSectionTemplate = () => {
    setBulkSections([
      ...bulkSections,
      {
        content: '',
        priorities: null,
        currentFocus: null,
        futureFocus: null,
      },
    ]);
  };

  const removeBulkSection = (index: number) => {
    setBulkSections(bulkSections.filter((_, i) => i !== index));
  };

  const updateBulkSection = (index: number, field: keyof Omit<SpeakerSection, 'id'>, value: string) => {
    const updated = [...bulkSections];
    updated[index] = { ...updated[index], [field]: value || null };
    setBulkSections(updated);
  };

  const submitBulkSections = async () => {
    if (!selectedSpeakerForSections) return;

    // Validation - only content is required
    const hasEmptyContent = bulkSections.some(s => !s.content.trim());

    if (hasEmptyContent) {
      setBulkAddError('Content is required for all sections.');
      return;
    }

    setBulkAddSubmitting(true);
    setBulkAddError(null);

    try {
      const res = await fetch(
        `${SPEAKER_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}/bulk?username=${username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bulkSections),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create sections: ${text}`);
      }

      // Refresh sections list
      const refreshRes = await fetch(`${SPEAKER_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}`);
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setSpeakerSections(data || []);
      }

      closeBulkAdd();
    } catch (err: any) {
      setBulkAddError(err.message);
    } finally {
      setBulkAddSubmitting(false);
    }
  };

  /* ================= SPEAKER SPEAKING SECTIONS ================= */

  // Old methods removed effectively, replaced by unified `openSectionsModal`
  // Keeping `submitSpeakingSectionEdit`, `deleteSpeakingSection`, etc. intact below.

  const startEditSpeakingSection = (section: SpeakerSpeakingSection) => {
    setEditingSpeakingSection({ ...section });
    setSpeakingSectionSubmitError(null);
  };

  const cancelEditSpeakingSection = () => {
    setEditingSpeakingSection(null);
    setSpeakingSectionSubmitError(null);
  };

  const submitSpeakingSectionEdit = async () => {
    if (!editingSpeakingSection) return;

    setSpeakingSectionSubmitting(true);
    setSpeakingSectionSubmitError(null);

    try {
      // Updates params via Query String as per requirement
      // PUT https://backendconf.roboticsaisummit.com/api/speaker-speaking-sections/{id}?title=...&date=...
      const params = new URLSearchParams();
      if (editingSpeakingSection.title) params.append('title', editingSpeakingSection.title);
      if (editingSpeakingSection.date) params.append('date', editingSpeakingSection.date);
      if (editingSpeakingSection.description) params.append('description', editingSpeakingSection.description);
      params.append('username', username);

      const res = await fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/${editingSpeakingSection.id}?${params.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json' // Even if no body, some servers expect a content-type or empty body
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update: ${text}`);
      }

      // Refresh list
      if (selectedSpeakerForSections) {
        const refreshRes = await fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}`);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setSpeakingSections(data || []);
        }
      }

      setEditingSpeakingSection(null);
    } catch (err: any) {
      setSpeakingSectionSubmitError(err.message);
    } finally {
      setSpeakingSectionSubmitting(false);
    }
  };

  const deleteSpeakingSection = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this speaking section?')) return;

    try {
      // DELETE
      const res = await fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/${id}?username=${username}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete: ${text}`);
      }

      // Refresh list
      if (selectedSpeakerForSections) {
        // Optimistically remove or refetch
        setSpeakingSections(prev => prev.filter(s => s.id !== id));
      }
    } catch (err: any) {
      alert('Error deleting speaking section: ' + err.message);
    }
  };

  const toggleAddSpeakingSection = () => {
    setShowAddSpeakingSection(!showAddSpeakingSection);
    // Reset form when opening
    if (!showAddSpeakingSection) {
      setAddSpeakingSectionTitle('');
      setAddSpeakingSectionDate('');
      setAddSpeakingSectionDescription('');
      setAddSpeakingSectionError(null);
    }
  };

  const submitAddSpeakingSection = async () => {
    if (!selectedSpeakerForSections) return;

    if (!addSpeakingSectionTitle) {
      setAddSpeakingSectionError("Title is required.");
      return;
    }

    setAddSpeakingSectionSubmitting(true);
    setAddSpeakingSectionError(null);

    try {
      const params = new URLSearchParams();
      params.append('title', addSpeakingSectionTitle);
      params.append('description', addSpeakingSectionDescription);
      params.append('date', addSpeakingSectionDate);
      params.append('username', username);

      // POST https://backendconf.roboticsaisummit.com/api/speaker-speaking-sections/speaker/{SPEAKER_ID}
      const res = await fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // Refresh list
      const refreshRes = await fetch(`${SPEAKER_SPEAKING_SECTIONS_API}/speaker/${selectedSpeakerForSections.id}`);
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setSpeakingSections(data || []);
      }

      setShowAddSpeakingSection(false); // Close add form
    } catch (err: any) {
      setAddSpeakingSectionError(err.message);
    } finally {
      setAddSpeakingSectionSubmitting(false);
    }
  }

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
              <th className="p-3 text-left font-semibold text-gray-700">Speaker Role</th>
              <th className="p-3 text-left font-semibold text-gray-700">Slug</th>
              <th className="p-3 text-left font-semibold text-gray-700">LinkedIn</th>
              <th className="p-3 text-left font-semibold text-gray-700">Partner</th>
              <th className="p-3 text-left font-semibold text-gray-700">Visible</th>
              <th className="p-3 text-left font-semibold text-gray-700">Image</th>
              <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">
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
                  <td className="p-3 text-gray-600">{s.speakerrole ?? '—'}</td>
                  <td className="p-3 text-gray-600 text-sm max-w-[150px] truncate" title={s.slug || ''}>{s.slug || '—'}</td>
                  <td className="p-3 text-gray-600">
                    {s.linkedin ? (
                      <a
                        href={s.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {s.partnerLogo ? (
                      <img
                        src={s.partnerLogo}
                        alt="Partner"
                        className="w-8 h-8 object-contain"
                        title="Partner Logo"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${s.visible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </td>
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
                      onClick={() => openSectionsModal(s, 'general')}
                      className="text-green-600 hover:text-green-800 transition flex items-center gap-1"
                      title="Manage Sections"
                    >
                      <FileText size={18} />
                      <span className="text-xs font-semibold"></span>
                    </button>
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
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 sticky top-0 bg-white z-10">
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
              <select
                value={editingSpeaker ? editSpeakerType : addSpeakerType}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditSpeakerType(e.target.value)
                    : setAddSpeakerType(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="Keynote">Keynote</option>
                <option value="Pleanary Speaker">Pleanary Speaker</option>
                <option value="Technical Speaker">Technical Speaker</option>
                <option value="Speaker">Speaker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Role (Optional)</label>
              <input
                placeholder="e.g., Professor, CEO"
                value={editingSpeaker ? editSpeakerRole : addSpeakerRole}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditSpeakerRole(e.target.value)
                    : setAddSpeakerRole(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingSpeaker ? editVisible : addVisible}
                  onChange={(e) =>
                    editingSpeaker
                      ? setEditVisible(e.target.checked)
                      : setAddVisible(e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Visible</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (Optional)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  editingSpeaker
                    ? setEditPartnerLogoFile(e.target.files?.[0] || null)
                    : setAddPartnerLogoFile(e.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Optional)</label>
              <input
                placeholder="prof-yanda-li"
                value={editingSpeaker ? editSlug : addSlug}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditSlug(e.target.value)
                    : setAddSlug(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (Optional)</label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/username"
                value={editingSpeaker ? editLinkedin : addLinkedin}
                onChange={(e) =>
                  editingSpeaker
                    ? setEditLinkedin(e.target.value)
                    : setAddLinkedin(e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* {editingSpeaker && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )} */}

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


      {/* BULK ADD SECTIONS MODAL */}
      {showBulkAdd && selectedSpeakerForSections && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-6xl space-y-4 animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Add Sections for {selectedSpeakerForSections.name}
                </h3>
                <p className="text-sm text-gray-500">Create multiple sections at once</p>
              </div>
              <button
                onClick={closeBulkAdd}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {bulkSections.map((section, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 relative"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-700">Section {index + 1}</h4>
                    {bulkSections.length > 1 && (
                      <button
                        onClick={() => removeBulkSection(index)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Remove Section"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={section.content}
                      onChange={(e) => updateBulkSection(index, 'content', e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Main content..."
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priorities
                    </label>
                    <textarea
                      rows={2}
                      value={section.priorities || ''}
                      onChange={(e) => updateBulkSection(index, 'priorities', e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Optional: Building collaborative research networks..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Focus
                      </label>
                      <textarea
                        rows={2}
                        value={section.currentFocus || ''}
                        onChange={(e) => updateBulkSection(index, 'currentFocus', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Optional: AI safety and ethics..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Future Focus
                      </label>
                      <textarea
                        rows={2}
                        value={section.futureFocus || ''}
                        onChange={(e) => updateBulkSection(index, 'futureFocus', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Optional: Next-generation medical robotics..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addBulkSectionTemplate}
              className="w-full border-2 border-dashed border-blue-400 text-blue-600 py-3 rounded hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Section
            </button>

            {bulkAddError && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                {bulkAddError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={closeBulkAdd}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 border transition"
              >
                Cancel
              </button>
              <button
                onClick={submitBulkSections}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
                disabled={bulkAddSubmitting || bulkSections.length === 0}
              >
                {bulkAddSubmitting && <RefreshCw className="animate-spin" size={16} />}
                Create {bulkSections.length} Section{bulkSections.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* UNIFIED SECTIONS MODAL */}
      {showSectionsModal && selectedSpeakerForSections && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl space-y-4 animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-4">
                {selectedSpeakerForSections.imagePath && (
                  <img
                    src={selectedSpeakerForSections.imagePath}
                    alt={selectedSpeakerForSections.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Manage Sections
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{selectedSpeakerForSections.name}</p>
                  <p className="text-xs text-gray-500">{selectedSpeakerForSections.university} • {selectedSpeakerForSections.speakerType}</p>
                </div>
              </div>
              <button
                onClick={closeSectionsModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* TABS */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 py-2 px-4 font-medium rounded-md transition-all ${activeTab === 'general'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <FileText size={16} />
                General Sections
              </button>
              <button
                onClick={() => setActiveTab('speaking')}
                className={`flex items-center gap-2 py-2 px-4 font-medium rounded-md transition-all ${activeTab === 'speaking'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <Plus size={16} />
                Speaking Sections
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
              {activeTab === 'general' ? (
                // --- GENERAL SECTIONS TAB CONTENT ---
                <>
                  {sectionsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="animate-spin mr-2" size={24} />
                      <span className="text-gray-600">Loading sections...</span>
                    </div>
                  ) : sectionsError ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded text-center border border-red-200">
                      {sectionsError}
                    </div>
                  ) : speakerSections.length === 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-600 p-12 rounded-xl text-center space-y-6 border-2 border-dashed border-blue-200">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">No sections yet</h4>
                        <p className="text-sm text-gray-600 mb-4">Create sections to showcase {selectedSpeakerForSections.name}'s background, expertise, and focus areas.</p>
                      </div>
                      <button
                        onClick={openBulkAdd}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-medium"
                      >
                        <Plus size={20} />
                        Add First Section
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Existing Map for General Sections */}
                      {speakerSections.map((section) => (
                        <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                          {editingSection?.id === section.id ? (
                            // EDIT MODE (Existing logic copied)
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  About <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  rows={4}
                                  value={editingSection.content}
                                  onChange={(e) =>
                                    setEditingSection({ ...editingSection, content: e.target.value })
                                  }
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priorities</label>
                                <textarea
                                  rows={2}
                                  value={editingSection.priorities || ''}
                                  onChange={(e) => setEditingSection({ ...editingSection, priorities: e.target.value || null })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Focus</label>
                                <textarea
                                  rows={2}
                                  value={editingSection.currentFocus || ''}
                                  onChange={(e) => setEditingSection({ ...editingSection, currentFocus: e.target.value || null })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Future Focus</label>
                                <textarea
                                  rows={2}
                                  value={editingSection.futureFocus || ''}
                                  onChange={(e) => setEditingSection({ ...editingSection, futureFocus: e.target.value || null })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>

                              {sectionSubmitError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{sectionSubmitError}</div>
                              )}

                              <div className="flex justify-end gap-3 pt-2">
                                <button onClick={cancelEditSection} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-300 transition font-medium">Cancel</button>
                                <button
                                  onClick={submitSectionEdit}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2 font-medium shadow-sm"
                                  disabled={sectionSubmitting}
                                >
                                  {sectionSubmitting && <RefreshCw className="animate-spin" size={16} />}
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            // VIEW MODE
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileText className="text-blue-600" size={16} />
                                  </div>
                                  <h4 className="text-lg font-bold text-gray-800">Section #{section.id}</h4>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditSection(section)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                    title="Edit Section"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteSection(section.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete Section"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <span className="font-semibold text-black text-base uppercase tracking-wide">About</span>
                                  <p className="text-gray-600 mt-1 leading-relaxed">{section.content}</p>
                                </div>
                                {section.priorities && (
                                  <div>
                                    <span className="font-semibold text-black text-base uppercase tracking-wide">Priorities</span>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{section.priorities}</p>
                                  </div>
                                )}
                                {section.currentFocus && (
                                  <div>
                                    <span className="font-semibold text-black text-base uppercase tracking-wide">Current Focus</span>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{section.currentFocus}</p>
                                  </div>
                                )}
                                {section.futureFocus && (
                                  <div>
                                    <span className="font-semibold text-black text-base uppercase tracking-wide">Future Focus</span>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{section.futureFocus}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // --- SPEAKING SECTIONS TAB CONTENT ---
                <div className="pt-4">
                  <div className="flex justify-end mb-6">
                    <button
                      onClick={toggleAddSpeakingSection}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${showAddSpeakingSection
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                      {showAddSpeakingSection ? (
                        <>Cancel</>
                      ) : (
                        <><Plus size={20} /> Add Speaking Section</>
                      )}
                    </button>
                  </div>

                  {/* ADD FORM */}
                  {showAddSpeakingSection && (
                    <div className="bg-gray-50 border rounded-lg p-4 mb-4 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-semibold text-gray-700 mb-3">Add New Speaking Section</h4>
                      <div className="space-y-3">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label><input value={addSpeakingSectionTitle} onChange={(e) => setAddSpeakingSectionTitle(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Panel Discussion..." /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input value={addSpeakingSectionDate} onChange={(e) => setAddSpeakingSectionDate(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="February 12th, 2026 4:45 PM" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={addSpeakingSectionDescription} onChange={(e) => setAddSpeakingSectionDescription(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                        {addSpeakingSectionError && <div className="text-red-600 text-sm">{addSpeakingSectionError}</div>}
                        <div className="flex justify-end pt-2"><button onClick={submitAddSpeakingSection} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2" disabled={addSpeakingSectionSubmitting}>{addSpeakingSectionSubmitting && <RefreshCw className="animate-spin" size={16} />} Add Section</button></div>
                      </div>
                    </div>
                  )}

                  {speakingSectionsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="animate-spin mr-2" size={24} />
                      <span className="text-gray-600">Loading speaking sections...</span>
                    </div>
                  ) : speakingSectionsError ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded text-center border border-red-200">
                      {speakingSectionsError}
                    </div>
                  ) : speakingSections.length === 0 ? (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-600 p-12 rounded-xl text-center space-y-6 border-2 border-dashed border-purple-200">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Plus className="text-purple-600" size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">No speaking engagements yet</h4>
                        <p className="text-sm text-gray-600 mb-4">Add speaking sections to highlight {selectedSpeakerForSections.name}'s presentations and talks.</p>
                      </div>
                      <button
                        onClick={toggleAddSpeakingSection}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-medium"
                      >
                        <Plus size={20} />
                        Add Speaking Section
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {speakingSections.map((section) => (
                        <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-200">
                          {editingSpeakingSection?.id === section.id ? (
                            // EDIT MODE
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                  value={editingSpeakingSection.title}
                                  onChange={(e) => setEditingSpeakingSection({ ...editingSpeakingSection, title: e.target.value })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                  value={editingSpeakingSection.date}
                                  onChange={(e) => setEditingSpeakingSection({ ...editingSpeakingSection, date: e.target.value })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                  rows={4}
                                  value={editingSpeakingSection.description}
                                  onChange={(e) => setEditingSpeakingSection({ ...editingSpeakingSection, description: e.target.value })}
                                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
                                />
                              </div>
                              {speakingSectionSubmitError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{speakingSectionSubmitError}</div>
                              )}
                              <div className="flex justify-end gap-3 pt-2">
                                <button
                                  onClick={cancelEditSpeakingSection}
                                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-300 transition font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={submitSpeakingSectionEdit}
                                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-70 flex items-center gap-2 font-medium shadow-sm"
                                  disabled={speakingSectionSubmitting}
                                >
                                  {speakingSectionSubmitting && <RefreshCw className="animate-spin" size={16} />}
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            // VIEW MODE
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Plus className="text-purple-600" size={16} />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-gray-800">{section.title}</h4>
                                    <p className="text-sm text-purple-600 font-medium">{section.date}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditSpeakingSection(section)}
                                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                                    title="Edit Section"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteSpeakingSection(section.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete Section"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Description</span>
                                <p className="text-gray-600 mt-1 leading-relaxed">{section.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={closeSectionsModal}
                className="px-8 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}

export default Speakers;