import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import WorkingLife from './pages/WorkingLife';
import PersonalLife from './pages/PersonalLife';
import Portfolio from './pages/Portfolio';

function App() {
  return (
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
  );
}

export default App;
