import { RefreshCw } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useEffect, useState } from 'react';

interface AuthLog {
  id: number;
  username: string;
  loginTime: string;
  ipAddress: string;
  success: boolean;
  failureReason: string | null;
}

interface AuditLog {
  id: number;
  username: string;
  timestamp: string;
  ipAddress: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  changes: string;
  oldValues: string | null;
  newValues: string | null;
  conferenceCode: string;
}

function Logs() {
  const { selectedEvent } = useSelectedEvent();
  const [activeTab, setActiveTab] = useState<'auth' | 'audit'>('auth');
  const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    if (activeTab === 'auth') {
      const url = 'https://backendconf.roboticsaisummit.com/api/admin/logs';

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then((data: AuthLog[]) => {
          if (!mounted) return;
          setAuthLogs(data || []);
        })
        .catch((err) => {
          if (!mounted) return;
          setError(String(err));
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else if (activeTab === 'audit') {
      if (!selectedEvent) {
        setAuditLogs([]);
        setLoading(false);
        return;
      }

      const url = `https://backendconf.roboticsaisummit.com/api/admin/audit/conference/${encodeURIComponent(selectedEvent)}`;

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then((data: AuditLog[]) => {
          if (!mounted) return;
          setAuditLogs(data || []);
        })
        .catch((err) => {
          if (!mounted) return;
          setError(String(err));
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [activeTab, selectedEvent, reloadCounter]);

  const reload = () => setReloadCounter((c) => c + 1);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Logs</h2>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('auth')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'auth'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Authentication Logs
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Audit Logs
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'auth' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">Authentication Logs</h3>
            <button onClick={reload} title="Reload logs" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading authentication logs...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">Error loading logs: {error}</div>
              ) : authLogs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No authentication logs found.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Login Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Failure Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {authLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700">{log.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(log.loginTime).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.ipAddress}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.success
                            ? 'bg-green-100 text-green-800'
                            : log.failureReason === 'Credentials valid - awaiting OTP verification'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {log.success
                              ? 'Success'
                              : log.failureReason === 'Credentials valid - awaiting OTP verification'
                                ? 'Pending'
                                : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.failureReason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            {/* <h3 className="text-xl font-semibold text-gray-800">System Audit Trail</h3> */}
            <p className="text-sm text-gray-600 mb-6">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>
            <button onClick={reload} title="Reload audit logs" className="flex items-center gap-2 bg-white border px-3 py-2 rounded hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>



          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading audit logs...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">Error loading audit logs: {error}</div>
              ) : auditLogs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No audit logs found.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entity Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entity ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entity Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(log.timestamp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.ipAddress}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                              log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.entityType}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.entityId}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.entityName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logs;