import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Speakers from './pages/Speakers';
import Sponsors from './pages/Sponsors';
import Universities from './pages/Universities';
import Venues from './pages/Venues';
import Testimonials from './pages/Testimonials';
import Topics from './pages/Topics';
import Agenda from './pages/Agenda';
import Committees from './pages/Committees';
import AbstractSubmissions from './pages/AbstractSubmissions';
import Registrations from './pages/Registrations';
import Logs from './pages/Logs';
import UserManagement from './pages/UserManagement';
import ImportantDates from './pages/ImportantDates';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, isLogin, accessToken, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Token validation on tab change
  useEffect(() => {
    const validateToken = async () => {
      if (!accessToken) {
        logout();
        return;
      }

      try {
        const response = await fetch(`https://backendconf.roboticsaisummit.com/api/emails/validate-token?token=${encodeURIComponent(accessToken)}`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.valid) {
            logout();
          }

          else{
            console.log('Token is valid');
          }

        } else {
          logout();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
      }
    };

    if (isAuthenticated && accessToken) {
      validateToken();
    }
  }, [activeTab, accessToken, logout, isAuthenticated]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isLogin) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'speakers':
        return <Speakers />;
      case 'sponsors':
        return <Sponsors />;
      case 'universities':
        return <Universities />;
      case 'venues':
        return <Venues />;
      case 'testimonials':
        return <Testimonials />;
      case 'topics':
        return <Topics />;
      case 'agenda':
        return <Agenda />;
      case 'committees':
        return <Committees />;
      case 'abstracts':
        return <AbstractSubmissions />;
      case 'registrations':
        return <Registrations />;
      case 'logs':
        return <Logs />;
      case 'usermanagement':
        return <UserManagement />;
      case 'dates':
        return <ImportantDates />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
      />
      <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

      <main
        className={`pt-24 pb-8 px-6 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
