exports.createPostValidator = (req,res,next) => {
    req.check('title', "Write a title").notEmpty()
    req.check('title', "Title must be 4 to 10 length").isLength({
        min:4,
        max:10
    });
    req.check('body', "Write a body").notEmpty()
    req.check('body', "Body must be 4 to 100 length").isLength({
        min:4,
        max:100
    });

    const errors =req.validationErrors()
    if(errors){
        const firstError = errors.map( (error) => error.msg)[0]
        return res.status(400).json({error: firstError});
    }
    next();
}

exports.userSignupValidator = (req,res,next) => {
    req.check('name', "Name is required.").notEmpty()
    
    req.check('email', "Email is required").notEmpty()
    req.check('email', "Email must be 4 to 100 length")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max: 100
    })

    req.check('password', "Password is required.").notEmpty()
    req.check('password',"Password must contain at least 6 characters")
    .isLength({min: 6})
    .matches(/\d/)
    .withMessage("Password must contain a digit")

    const errors =req.validationErrors()
    if(errors){
        const firstError = errors.map( (error) => error.msg)[0]
        return res.status(400).json({error: firstError});
    }
    next();
}