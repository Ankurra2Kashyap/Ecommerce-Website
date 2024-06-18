import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,
    CLEAR_ERRORS
} from "../constants/productConstants";


export const getProduct = (keyword = "", currentPage = 1, price = [0, 25000], category,ratings = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

        if(category){
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        }

        const { data } = await axios.get(link)
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message,
        })

    }
};
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/product/${id}`)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
        console.log(data.product);
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        })

    }
};


//New Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
      dispatch({ type: NEW_REVIEW_REQUEST });
  
      const config = {
        headers: { "Content-Type": "application/json" },
      };
  
      const { data } = await axios.put(`/api/v1/review`, reviewData, config);
  
      dispatch({
        type: NEW_REVIEW_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: NEW_REVIEW_FAIL,
        payload: error.response.data.message,
      });
    }
  };
  
  // Get All Reviews of a Product
//   export const getAllReviews = (id) => async (dispatch) => {
//     try {
//       dispatch({ type: ALL_REVIEW_REQUEST });
  
//       const { data } = await axios.get(`/api/v1/reviews?id=${id}`);
  
//       dispatch({
//         type: ALL_REVIEW_SUCCESS,
//         payload: data.reviews,
//       });
//     } catch (error) {
//       dispatch({
//         type: ALL_REVIEW_FAIL,
//         payload: error.response.data.message,
//       });
//     }
//   };
  
//   // Delete Review of a Product
//   export const deleteReviews = (reviewId, productId) => async (dispatch) => {
//     try {
//       dispatch({ type: DELETE_REVIEW_REQUEST });
  
//       const { data } = await axios.delete(
//         `/api/v1/reviews?id=${reviewId}&productId=${productId}`
//       );
  
//       dispatch({
//         type: DELETE_REVIEW_SUCCESS,
//         payload: data.success,
//       });
//     } catch (error) {
//       dispatch({
//         type: DELETE_REVIEW_FAIL,
//         payload: error.response.data.message,
//       });
//     }
//   };

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}
