import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import store from './store';
import { loadUser } from './actions/userAction';
import Header from './component/layout/Header/Header';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import UserOptions from './component/layout/Header/UserOptions';
import Profile from './component/User/Profile';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ProtectedRoute from './component/Route/ProtectedRoute';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment';
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetail';
function App() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [stripeApiKey, setStripeApiKey] = useState('');

    const StripeWrapper = ({ stripeApiKey }) => {
        return (
            <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
            </Elements>
        );
    };

    async function getStripeApiKey() {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    // Include your authentication token here
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const { data } = await axios.get('/api/v1/stripeapikey', config);
            setStripeApiKey(data.stripeApiKey);
        } catch (error) {
            console.error('Error fetching Stripe API key', error);
        }
    }

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto', 'Droid Sans', 'Chilanka'],
            },
        });
        store.dispatch(loadUser());
        getStripeApiKey();
    }, []);

    return (
        <Router>
            <Header />
            {isAuthenticated && <UserOptions user={user} />}
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/product/:id" element={<ProductDetails />} />
                <Route exact path="/products" element={<Products />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/products/:keyword" element={<Products />} />
                <Route exact path="/login" element={<LoginSignUp />} />
                <Route element={<ProtectedRoute />}>
                    <Route exact path="/account" element={<Profile />} />
                    <Route exact path="/me/update" element={<UpdateProfile />} />
                    <Route exact path="/password/update" element={<UpdatePassword />} />
                    <Route exact path="/login/shipping" element={<Shipping />} />
                    <Route exact path="/order/confirm" element={<ConfirmOrder />} />
                    <Route exact path="/success" element={<OrderSuccess />} />
                    <Route exact path='/orders' element={<MyOrders/>}/>
                    <Route exact path='/order/:id' element={<OrderDetails/>}/>    
                </Route>
                {stripeApiKey && (
                    <Route element={<ProtectedRoute />}>
                        <Route exact path="/process/payment" element={<StripeWrapper stripeApiKey={stripeApiKey} />} />
                    </Route>
                )}
                <Route exact path="/password/forgot" element={<ForgotPassword />} />
                <Route exact path="/password/reset/:token" element={<ResetPassword />} />
                <Route exact path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
