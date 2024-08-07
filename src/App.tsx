import './App.css';
import Login from './pages/login/login';
import Main from './pages/main/main';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import withAuth from './utils/withAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route path="/" Component={withAuth(Main)} />

        {/* Public Routes */}
        <Route path="/login" Component={Login} />
      </Routes>
    </BrowserRouter>

    // <>
    //   <Login />
    // </>
  );
}

export default App;
