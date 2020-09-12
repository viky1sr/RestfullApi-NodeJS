const UserDB = require('../models/users');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

exports.register = asyncHandler(async (req,res,next) => {
        const { name, email, role, password, confirm_password } = req.body;

        //Check Password
        if (password !== confirm_password) {
            return res.status(400).json({
                success: 400,
                messages: "Password not match"
            });
        }


        let user = await UserDB.findOne({ email });
        //or
        //let user = await User.findOne({ name });

        if (user) return res.status(400).send("User already registered.");

        user = new UserDB({ name, email, password ,role });

        user = await user.save();

        const token = sendTokenResponse(user, 200 ,res)

        res.status(200).json({
            success:true,
            messages: "Register Success",
            token
        });
});

exports.login = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password',401))
    }

    let user = await UserDB.findOne({  email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Incorect login info',401))
    }

    let isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Incorect login info',401))
    }

    const token = sendTokenResponse(user, 200 ,res)

    res.status(200).json({
        success:true,
        messages: "Login Success",
        token
    });
});

//Get token from model, Creat cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            status: true
        });
}