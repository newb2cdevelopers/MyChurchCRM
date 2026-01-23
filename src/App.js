import './global.css';
import { BrowserRouter } from "react-router-dom";
import Layout from './components/layout';
import useAuthPersistence from './hooks/useAuthPersistence';

function App() {
  useAuthPersistence();
  
  return (
    <BrowserRouter>
      <div className="App">
        <Layout/>
      </div>
    </BrowserRouter>
  );
}

export default App;
