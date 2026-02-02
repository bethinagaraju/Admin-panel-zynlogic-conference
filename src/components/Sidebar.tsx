import { Home, Users, Building2, GraduationCap, Calendar, Settings, MapPin, FileText, BookOpen, Star } from 'lucide-react';
import { useSelectedEvent, SelectedEvent } from '../context/SelectedEventContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
}

function Sidebar({ activeTab, setActiveTab, isCollapsed }: SidebarProps) {
  const { role } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'speakers', label: 'Speakers', icon: Users },
      { id: 'sponsors', label: 'Sponsors', icon: Building2 },
      // { id: 'universities', label: 'Universities', icon: GraduationCap },
      { id: 'venues', label: 'Venues', icon: MapPin },
      { id: 'testimonials', label: 'Testimonials', icon: Star },
      { id: 'topics', label: 'Topics', icon: BookOpen },
      { id: 'agenda', label: 'Agenda', icon: Calendar },
      { id: 'committees', label: 'Committees', icon: Users },
      { id: 'abstracts', label: 'Abstract Submissions', icon: FileText },
      { id: 'registrations', label: 'Registrations', icon: Users },
      { id: 'dates', label: 'Important Dates', icon: Calendar },
    ];

    // Add superadmin-only items
    if (role === 'superadmin') {
      baseItems.push(
        { id: 'logs', label: 'Logs', icon: FileText },
        { id: 'usermanagement', label: 'User Management', icon: Users }
      );
    }

    baseItems.push({ id: 'settings', label: 'Settings', icon: Settings });

    return baseItems;
  };

  const menuItems = getMenuItems();
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 overflow-y-auto ${
        isCollapsed ? 'w-20' : 'w-70'
      }`}
    >
      <div className="p-6">
        <h1
          className={`text-2xl font-bold text-gray-800 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
          }`}
        >
          Admin Panels
        </h1>
        {isCollapsed && (
          <div className="text-2xl font-bold text-gray-800 text-center">A</div>
        )}

        {!isCollapsed && (() => {
          const { selectedEvent, setSelectedEvent } = useSelectedEvent();
          return (
            <div className="mt-3">
              <label className="text-xs text-gray-500">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value as SelectedEvent)}
                className="mt-1 w-full border border-gray-200 rounded px-2 py-1 text-sm"
              >
                <option value="robotics">ROBOTICSAISUMMITS</option>
                <option value="biomedical">BIO MEDICAL</option>
                <option value="ICRES">Renewable Energy</option>
                <option value="ICACME">Computing & Materials</option>
                <option value="ICAFTech">Food Tech</option>
              </select>
            </div>
          );
        })()}
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
