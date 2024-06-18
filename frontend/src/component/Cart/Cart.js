import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import './Cart.css'
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartActions.js';
import CartItemCard from "./CartItemCard.js";
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart)
    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }
    const decreaseQuantity = (id, quantity, stock) => {
        const newQty = quantity - 1;
        if (1 >= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }
    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    };
    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }
    return (
        <Fragment>
            {cartItems.length === 0 ? (<div className='emptyCart'>
                <RemoveShoppingCartIcon />
                <Typography>No Product in Your Cart</Typography>
                <Link to="/products">View Products</Link>
            </div>) : (<Fragment>
                <div className="cartPage">
                    <div className="cartHeader">
                        <p>Product</p>
                        <p>Quantity</p>
                        <p>Subtotal</p>
                    </div>
                    {cartItems && cartItems.map((item) => (
                        <div className='cartContainer' key={item.product}>
                            <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                            <div className='cartInput'>
                                <button style={{ marginRight: '10px' }} onClick={() => decreaseQuantity(item.product, item.quantity, item.stock)}>-</button>
                                <span>{item.quantity}</span>
                                <button style={{ marginLeft: '10px' }} onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                            </div>
                            <p className="cartSubtotal">{`₹${item.price * item.quantity
                                }`}</p>

                        </div>
                    ))}

                    <div className='cartGrossProfit'>
                        <div></div>
                        <div className='cartGrossProfitBox'>
                            <p>Gross Total</p>
                            <p>{`Rs${cartItems.reduce(
                                (acc, item) => acc + item.quantity * item.price, 0
                            )}`}</p>
                        </div>
                        <div></div>
                        <div className="checkOutBtn">
                            <button onClick={checkoutHandler}>Check Out</button>
                        </div>
                    </div>
                </div>
            </Fragment>)}
        </Fragment>
    )
}

export default Cart
