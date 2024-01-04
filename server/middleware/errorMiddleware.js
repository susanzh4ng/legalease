const errorHandler = (err, req, res, next) => { //next to call further middleware
    const statusCode = res.statusCode ? res.statusCode : 500 //if there is an statusCode in the post request, use that stus code; else, set it to be 500 (server error)
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack //get stack trace in the err object only if it is in development mode (not production mode)
    })
}

module.exports = {
    errorHandler
}