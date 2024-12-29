
import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from './screens/Login';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from './screens/SignUp.jsx';
// import { CartProvider } from './components/contextReducer.jsx';
// import { CartProvider } from './components/ContextReducer.jsx';
import { CartProvider } from './components/ContextReducer.jsx'
import Order from './screens/Order.jsx';

function App() {
  return (
   <CartProvider>
    <Router>
    <div>
      <Routes>
        <Route exact path = '/' element={<Home/>} />
        <Route exact path = '/login' element={<Login/>} />
        <Route exact path = '/createuser' element={<SignUp/>} />
        <Route exact path = '/myOrderData' element={<Order/>} />
      </Routes>
    </div>
    </Router>
    </CartProvider>
  );
}

export default App;
