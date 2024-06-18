import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js"
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"
import cloudinary from 'cloudinary'

export const registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder:"avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
  });

//Login User

export const loginUser = catchAsyncError(async(req,res,next)=>{
  const {email,password}=req.body;
  //checking if user has given password and email

  if(!email || !password){
    return next(new ErrorHandler("Please Enter Email & Password",400))
  }

  const user = await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid email or password",401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid Email or Password",401));
  }
  sendToken(user,200,res);
});

//Logout User

export const logout = catchAsyncError(async(req,res,next)=>{

  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  })

  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
})

//forget Password

export const forgotPassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler("User not Found",404));
  }

  //Get ResetPassword Token

  const  resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave:false});

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

  const message  = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
  then , Please ignore it `;
try {
  await sendEmail({
    email:user.email,
    subject:`Ecommerce Password Recovery`,
    message,

  });
  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`
  })
  
} catch (error) {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({validateBeforeSave:false});

  return next(new ErrorHandler(error.message,500))
}
})

export const resetPassword = catchAsyncError(async(req,res,next)=>{
  //creating token hash
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  })

  if(!user){
    return next(new ErrorHandler("Reset Password token is invalid or has been expired",404))
  }

  if(req.body.password !==req.body.confirmPassword){
    return next(new ErrorHandler("password does not password",404))
    
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire=undefined;

  await user.save();
  sendToken(user,200,res)
});

//Get User Details

export const getUserDetails = catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user,
  })
})

//update user password

export const updatePassword = catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.user.id).select("+password");
  
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("old password is incorrect",401));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("password does not match",401));
  }

  user.password = req.body.newPassword;
  await user.save()
  sendToken(user,200,res);
})

//update User profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Assuming the user is authenticated and their ID is available in req.user.id
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (req.body.avatar && req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user: updatedUser,
    },
  });
});

//Get All Users
export const getAllUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.find();
  res.status(200).json({
    success:true,
    user,

  })
})

//Get All Users(admin)
export const getAllUserAdmin = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    user,

  })
})

// Update User Role --Admin
export const updateRole= catchAsyncError(async(req,res,next)=>{

  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

  //wE WILL ADD COLUDINARY LATER

  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  });

  res.status(200).json({
    success:true,
  })
})

//Delete USer Role

export const DeleteUser= catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
  }

  await user.deleteOne();
 

  //wE WILL Remove COLUDINARY LATER

 

  res.status(200).json({
    success:true,
    message:"User Deleted Succesfully"
  })
})

