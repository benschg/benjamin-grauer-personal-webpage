import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import WorkingLife from './pages/WorkingLife';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/working-life" element={<WorkingLife />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
