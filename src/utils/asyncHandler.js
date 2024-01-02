//  this function is used just for raper functions
// we use this function so many times.Ex one time for user, videos, or other collection it has 2 type functions. for example try catch or promise ( .then .catch function)

//promise function
const asyncHandler = (requestHandler) => {
        return (req, res, next) => {
                Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
        }
}

export { asyncHandler };

// try catch function

/*

const asyncHandler = ( requestHandler ) => async(req, res, next) =>{
        try{
                await requestHandler(req, res, next);
        }
        .catch (err) {
                res.status(err.code || 500).json({
                        success: false,
                        message: err.message
                })
        }
}


*/