const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🔥 Incoming cookies:", req.cookies);
  const token = req.cookies.token;
  console.log("🍪 Token in cookie:", req.cookies.token);
  if (!token) return res.status(401).json({ error: "No token, auth denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
     console.log("✅ Token decoded:", decoded);
    next();
  } catch (err) {
    console.log("❌ JWT Error:", err.message);
    res.status(401).json({ error: "Token is invalid" });
  }
};

module.exports = authMiddleware; // ✅ export the function directly







// const jwt = require('jsonwebtoken');
// const ensureAuthenticated = (req, res, next) => {
//     const auth = req.headers['authorization'];
//     if (!auth) {
//         return res.status(403)
//             .json({ message: 'Unauthorized, JWT token is require' });
//     }
//     try {
//         const decoded = jwt.verify(auth, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(403)
//             .json({ message: 'Unauthorized, JWT token wrong or expired' });
//     }
// }

// module.exports = ensureAuthenticated;