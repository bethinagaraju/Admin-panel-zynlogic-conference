import { FileText, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useEffect, useState } from 'react';

interface AbstractSubmission {
  id: number;
  conferencecode: string | null;
  title: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  organization: string;
  country: string;
  abstractFilePath: string;
   createdAt?: string | null;
}

function AbstractSubmissions() {
  const { selectedEvent } = useSelectedEvent();
  const [submissions, setSubmissions] = useState<AbstractSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const url = `https://backendconf.roboticsaisummit.com/api/robotics/abstract-submissions/by-conferencecode/${encodeURIComponent(selectedEvent)}`;
    // const url = `https://robotics-backend-node.vercel.app/api/abstracts`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: AbstractSubmission[]) => {
        if (!mounted) return;
        setSubmissions(data || []);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-gray-800">Abstract Submissions</h2>
        <button onClick={reload} title="Reload submissions" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading submissions...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error loading submissions: {error}</div>
          ) : submissions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No submissions found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Abstract File</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{submission.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.emailAddress}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.organization}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{submission.country}</td>
                    {/* <td className="px-6 py-4 text-sm text-gray-700">{submission.createdAt.split("T")[0]}</td> */}
                    <td className="px-6 py-4 text-sm text-gray-700">
  {submission.createdAt
    ? new Date(submission.createdAt.split("T")[0]).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—"}
</td>
                    <td className="px-6 py-4">
                      {submission.abstractFilePath ? (
                        <a href={submission.abstractFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View File
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AbstractSubmissions;