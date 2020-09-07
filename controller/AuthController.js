const UserDB = require('../models/users');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

exports.register = asyncHandler(async (req,res,next) => {
    try {
        const { name, email, role, password, confirm_password } = req.body;

        //Check Password
        if (password !== confirm_password) return res.status(400).send("Passwords dont match");

        let user = await UserDB.findOne({ email });
        //or
        //let user = await User.findOne({ name });

        if (user) return res.status(400).send("User already registered.");

        user = new UserDB({ name, email, password ,role });

        user = await user.save();

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success:true,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

exports.login = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password',401))
    }

    let user = await UserDB.findOne({  email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials',401))
    }

    let isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials',401))
    }

    const token = user.getSignedJwtToken();
    res.status(200).json({
        success:true,
        token
    });
})