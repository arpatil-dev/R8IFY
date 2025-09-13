import handleResponse from "../utils/response.js";
export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  handleResponse(res, err.status || 500, false, null, err.message || "Something went wrong");
}
