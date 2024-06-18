class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

    
        Error.captureStackTrace(this, this.constructor);
    }
}

// Wrong Mongodb Id Error

export const errorMiddleware = (err, req, res, next) => {
     err.statusCode=err.statusCode || 500;
     err.message = err.message || "Internal Server Error"

     if(err.name==="CastError"){
        const message = `Resource not Found.Invalid :${err.path}`;
        err=new ErrorHandler(message,400);
    }
 
     res.status(err.statusCode).json({    
        success: false,
        message: err.message,
    });

    //Mongoose duplicate key error
     if(err.code===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered` ;
        err = new ErrorHandler(message,400);
     }

     //wrong Jwt Error
     if(err.name==="JsonWebTokenError"){
        const message ="Json Web Token is invalid try again" ;
        err = new ErrorHandler(message,400);
     }

     //JWT EXPIRE error
     if(err.name === "TokenExpiredError"){
        const message ="Json Web Token is Expired try again";
        err = new ErrorHandler(message,400);

     }

};



export default ErrorHandler;