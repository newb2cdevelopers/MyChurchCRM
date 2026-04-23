import './global.css';
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout';
import useAuthPersistence from './hooks/useAuthPersistence';

function App() {
  useAuthPersistence();
  
  return (
    <BrowserRouter>
      <div className="App">
        <Layout/>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </BrowserRouter>
  );
}

export default App;
