// App.tsx
import NavBar from './components/NavBar';
import Header from './components/Header';
import './Styling/Global.css';
import './Styling/theme.css';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="app">
      <Header />
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;
