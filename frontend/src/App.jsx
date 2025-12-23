import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Menu from './pages/Menu';

function App() {
  return (
    <BrowserRouter>
      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Placeholders for future routes */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/menu" element={<Menu />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
