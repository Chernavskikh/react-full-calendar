import logo from './logo.svg';
import './App.css';
import CalendarWrapper from './components/CalendarWrapper'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Full calendar
        </p>

        <CalendarWrapper/>
      </header>
    </div>
  );
}

export default App;
