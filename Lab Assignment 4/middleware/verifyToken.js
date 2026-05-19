const jwt = require("jsonwebtoken");

// Middleware: verify the JWT sent in the Authorization header
function verifyToken(req, res, next) {
    // The client sends: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];

    // If there is no Authorization header at all, reject immediately
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided. Access denied." });
    }

    // Split "Bearer <token>" and grab the token part
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token missing. Access denied." });
    }

    // Verify the token with the secret stored in .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token is present but invalid or expired
            return res.status(403).json({ error: "Invalid or expired token." });
        }

        // Attach the decoded payload (user_id, role) to req so routes can use it
        req.user = decoded;
        next();
    });
}

module.exports = { verifyToken };
