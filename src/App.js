import './global.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme/theme';
import Layout from './components/layout';
import useAuthPersistence from './hooks/useAuthPersistence';

function App() {
  useAuthPersistence();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Layout />
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={true}
            closeButton={false}
            icon={false}
            toastStyle={{
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
              marginBottom: 8,
            }}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
