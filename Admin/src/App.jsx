import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Products from './Pages/Products/Products';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import Blogs from './Pages/Blogs/Blogs';
import ProductDetails from './Pages/ProductDetails/ProductDetails';

function App() {

  return (
    <>
      <Navbar />
      <Sidebar />
      <ToastContainer />
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/add-products' element={<Products />} />
        <Route path='/add-blogs' element={<Blogs/>} />
        <Route path='/product-details' element={<ProductDetails/>} />
      </Routes>
    </>
  )
}

export default App
