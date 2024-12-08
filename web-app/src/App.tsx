// App.tsx
import NavBar from './components/NavBar';
import Header from './components/Header';
import './components/Styling/Global.css';
import './components/Styling/theme.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <NavBar />
    </div>
  );
};

export default App;
