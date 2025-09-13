const handleResponse = (res, data = null, message = "Success", status = 200, error = null) => {
  return res.status(status).json({
    success: !error,
    message,
    data,
    error,
  });
};

export default handleResponse;
