import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

function Navbar({ toggleSidebar, isCollapsed }: NavbarProps) {
  const { logout, username } = useAuth();

  return (
    <div
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 z-40 ${
        isCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {username || 'Admin'}
          </span>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
