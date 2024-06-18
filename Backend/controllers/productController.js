import ErrorHandler from "../middleware/error.js";
import {Product} from "../models/productModel.js";
// productController.js
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Apifeatures from "../utils/apifeatures.js";

// Rest of your code


//Create Product--Admin

const createProduct = catchAsyncError(async(req,res,next)=>{

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success:true,
    product
  })
});

//Get All Product
const getAllProducts = catchAsyncError(async(req, res) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new Apifeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
  })

  //get All productd admin
  const getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

  //Get Product Details

  const getProductDetails = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("Product Not Found",404));
    }
    res.status(200).json({
      success:true,
      product,
      // productCount,
    })
  });

  //update product --Admin

  const updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("Product Not Found",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
      success:true,
      product
    })
  });
  
  const deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler("Product Not Found",404));
    }

    await product.deleteOne();

    res.status(200).json({
      success:true,
      message:"Product Delete Successfully"
    })
  });

  //Create a Review or Update a Review

const createProductReview = catchAsyncError(async(req,res,next)=>{
  const {rating,comment,productId} = req.body;
  const review = {
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
  if(isReviewed){
    product.reviews.forEach(rev=>{
      if(rev.user.toString()===req.user._id.toString())
      rev.rating=rating,
      rev.comment=comment
    })
  }
  else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }
let avg = 0
   product.reviews.forEach(rev=>{
    avg+=rev.rating
  });

product.ratings = avg/product.reviews.length;

await product.save({validateBeforeSave:false});

res.status(200).json({
  success:true,

})
})

// Get All Reviews of a product
const getProductReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("product not found",404));
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews,
  });
});

//Delete Review

const deleteReview = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHandler("Prodict not found",404));
  }

  const reviews =  product.reviews.filter(rev=>rev._id.toString()!==req.query.id);

  let avg = 0
  reviews.forEach((rev)=>{
   avg+=rev.rating
 });

const ratings = avg/reviews.length; 

const numOfReviews = reviews.length

await Product.findByIdAndUpdate(req.query.productId,{
  reviews,
  ratings,
  numOfReviews
},{
  new:true,
  runValidators:true,
  userFindAndModify:false
})
  res.status(200).json({
    success:true,
    reviews:product.reviews,
  });
});
  
  export { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails,getAdminProducts,createProductReview,getProductReviews,deleteReview};