import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: { error: "Too many requests. Try again later." },
});

export default function handler(req, res, next) {
    return limiter(req, res, next);
}
