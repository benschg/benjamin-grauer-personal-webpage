import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FontLoader from './components/common/FontLoader';

// Direct imports for instant page transitions
import Home from './pages/Home';
import WorkingLife from './pages/WorkingLife';
import PersonalLife from './pages/PersonalLife';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <FontLoader>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/working-life" element={<WorkingLife />} />
            <Route path="/personal-life" element={<PersonalLife />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </Router>
    </FontLoader>
  );
}

export default App;
