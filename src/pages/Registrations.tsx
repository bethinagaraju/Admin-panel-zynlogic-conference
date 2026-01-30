import { Users, RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useEffect, useState } from 'react';

interface Registration {
  id: number;
  planId: string;
  conferenceCode: string;
  title: string;
  fullName: string;
  phone: string;
  email: string;
  institute: string;
  country: string;
  registrationType: string;
  presentationType: string;
  numberOfNights: number;
  numberOfGuests: number;
  stateId: string;
  paymentStatus: string;
  createdAt: string;
}

function Registrations() {
  const { selectedEvent } = useSelectedEvent();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (!selectedEvent) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    const conferenceCode = selectedEvent === 'robotics' ? 'AI-ROBO-2026' : selectedEvent;
    const url = `https://backendconf.roboticsaisummit.com/api/registration/conference/${encodeURIComponent(conferenceCode)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Registration[]) => {
        if (!mounted) return;
        setRegistrations(data || []);
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
        <h2 className="text-3xl font-bold text-gray-800">Registrations</h2>
        <button onClick={reload} title="Reload registrations" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading registrations...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error loading registrations: {error}</div>
          ) : registrations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No registrations found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Presentation Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nights</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.title}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{registration.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.institute}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.registrationType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.presentationType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.numberOfNights}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{registration.numberOfGuests}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        registration.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        registration.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {registration.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(registration.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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

export default Registrations;