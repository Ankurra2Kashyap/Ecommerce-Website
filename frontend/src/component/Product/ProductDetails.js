import React, { useEffect, Fragment, useState } from 'react';
import Loader from "../layout/Loader/Loader.js"
import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import ReactStars from 'react-rating-stars-component';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails, clearErrors, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReviewCard from "./ReviewCard.js";
import { useAlert } from "react-alert"
import MetaData from '../layout/MetaData.js';
import { addItemsToCart } from '../../actions/cartActions.js';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { Rating } from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails) || {};

    const { success, error: reviewError } = useSelector((state) => state.newReview);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors())
        }

        if (success) {
            alert.success("review Submitted Successfully")
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, reviewError, success]);

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    }

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increaseQuantity = () => {
        if (product.Stock <= quantity) {
            return;
        }
        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        if (1 >= quantity) {
            return;
        }
        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart");
    }

    const submitReviewToggle = () => {
        setOpen(!open);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));
        setOpen(false);
    };

    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>
                    <MetaData title={`${product ? product.name : "Product"} -- ECOMMERCE`} />
                    {product && (
                        <div className='ProductDetails'>
                            <div>
                                <Carousel>
                                    {product.images && product.images.map((item, i) => (
                                        <img
                                            className='CarouselImage'
                                            key={i}
                                            src={item.url}
                                            alt={`${i} Slide`}
                                            onLoad={() => console.log(item.url)}
                                            onError={() => console.error("Image failed to load:", item.url)}
                                        />
                                    ))}
                                </Carousel>
                            </div>
                            <div>
                                <div className='detailsBlock-1'>
                                    <h2>{product.name}</h2>
                                    <p>Product # {product._id}</p>
                                </div>
                                <div className='detailsBlock-2'>
                                    <Rating {...options} />
                                    <span className='detailsBlock-2-span'>
                                        {" "}
                                        ({product.numOfReviews} Reviews)
                                    </span>
                                </div>
                                <div className='detailsBlock-3'>
                                    <h1>{`Rs ${product.price}`}</h1>
                                    <div className='detailsBlock-3-1'>
                                        <div className='detailsBlock-3-1-1'>
                                            <button onClick={decreaseQuantity} style={{ marginRight: '10px' }}>-</button>
                                            <span>{quantity}</span>
                                            <button onClick={increaseQuantity} style={{ marginLeft: '10px' }}>+</button>
                                        </div>
                                        <button disabled={product.Stock < 1} onClick={addToCartHandler}>Add to Cart</button>
                                    </div>
                                    <p>
                                        Status:{" "}
                                        <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                            {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                        </b>
                                    </p>
                                </div>
                                <div className='detailsBlock-4'>
                                    Description: <p>{product.description}</p>
                                </div>
                                <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                            </div>
                        </div>
                    )}
                    <h3 className='reviewsHeading'>REVIEWS</h3>
                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />
                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {product && product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
                        </div>
                    ) : (
                        <p className='noReviews'>No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
}

export default ProductDetails;
