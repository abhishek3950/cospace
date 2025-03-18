import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VirtualOffice } from './scenes/VirtualOffice';
import { Login } from './components/Login';
import { useStore } from './store/useStore';

const App = () => {
  const { currentUser } = useStore();

  return (
    <Router>
      <div className="w-full h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={currentUser ? <VirtualOffice /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 