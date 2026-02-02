import { Users, Building2, GraduationCap, Calendar } from 'lucide-react';
import { useSelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const stats = [
  { label: 'Total Speakers', value: '24', icon: Users, color: 'bg-blue-500' },
  { label: 'Total Sponsors', value: '12', icon: Building2, color: 'bg-green-500' },
  { label: 'Total Universities', value: '8', icon: GraduationCap, color: 'bg-purple-500' },
  { label: 'Important Dates', value: '5', icon: Calendar, color: 'bg-orange-500' },
];

function Home() {
  const { selectedEvent } = useSelectedEvent();
  const { accessToken } = useAuth();

 
    // useEffect(() => {
    //   console.log('Access Token:', accessToken);
    // }, [accessToken]);
    
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
      <p className="text-sm text-gray-600 mb-2">Selected Event: <span className="font-medium text-gray-800">{selectedEvent}</span></p>
      {/* <p className="text-sm text-gray-600 mb-6">Access Token: <span className="font-medium text-gray-800">{accessToken ? `${accessToken.substring(0, 20)}...` : 'Not available'}</span></p> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New speaker added', time: '2 hours ago' },
              { action: 'Sponsor updated', time: '5 hours ago' },
              { action: 'University registered', time: '1 day ago' },
              { action: 'Date modified', time: '2 days ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
