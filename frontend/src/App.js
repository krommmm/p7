import { Routes, Route } from 'react-router-dom';
import './styles/Index.css';
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import User from "./pages/User";
import Menu from "./components/menu";
import Commentaires from './pages/Commentaires';
import Logout from './components/Log/LogOut';
import PageNotFound from './components/PageNotFound';
import Footer from './components/Footer';



function App() { 
  return (
    <>
    <Menu />
    <Routes>
      <Route  path="/" element={<Home/>}/>
      <Route  path="/User" element={<User/>}/>
      <Route  path="/Profil" element={<Profil/>}/>
      <Route  path="/Commentaires" element={<Commentaires/>}/>
      <Route  path="/Logout" element={<Logout/>}/>
      <Route element={<PageNotFound/>}/>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
