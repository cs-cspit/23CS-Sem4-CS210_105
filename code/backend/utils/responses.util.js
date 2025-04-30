exports.successResponse = (res, data, msg = "Success response") => {
    res.status(200).json({
        data: data,
        message: msg,
        success: true
    });
};

exports.successfullyCreatedResponse = (
    res,
    data,
    msg = "Record created successfully."
) => {
    res.status(201).json({
        data: data,
        message: msg,
        success: true
    });
};

exports.badRequestResponse = (res, error, msg = "Validation error") => {
    console.error("Bad Request Error:", error);
    let errorMessage = error;
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    res.status(400).json({
        error: errorMessage,
        message: msg,
        success: false
    });
};

exports.unauthorizedResponse = (res, msg = "Unauthorized") => {
    res.status(401).json({ 
        message: msg,
        success: false 
    });
};

exports.notFoundResponse = (res, msg = "Route Not Found") => {
    res.status(404).json({ 
        message: msg,
        success: false 
    });
};

exports.serverErrorResponse = (res, err = "Server Error") => {
    console.error("Server Error:", err);
    let errorMessage = err;
    if (err instanceof Error) {
        errorMessage = err.message;
    }
    res.status(500).json({ 
        message: "Server Error", 
        error: errorMessage,
        success: false 
    });
};
