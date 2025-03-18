const { decodeToken, checkPassword } = require("../../functions/helperFunction")
const { findUserService } = require("../../controllers/user/customersController")


// const authMiddleware = async (req, res, next) => {
//     const { token } = req.headers
//     try {
//         if (!token) {
//             throw new Error({ message: "LogIn Again " })
//         }
//         const decodeValues = decodeToken(token)
//         if (!decodeValues) {
//             throw new Error({ message: "LogIn Again " })
//         }
//         const { email, password } = decodeValues
//         const findedUser = await findUserService(email)
//         if (!findedUser) {
//             throw new Error({ message: "LogIn Again " })
//         }
//         const checkPwd = await checkPassword(password, findedUser.password)
//         if (!checkPwd) {
//             throw new Error({ message: "LogIn Again " })
//         }
//         req.user = findedUser
//         next()

//     } catch (error) {
//         console.log(error)
//         res.status(400).send({ message: error })
//     }
// }
// const jwt = require("jsonwebtoken")
// const authMiddleware = async (req, res, next) => {
//     try {
//         // Get token from request headers
//         const token = req.header("Authorization");

//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }

//         // Verify token
//         const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "fhaefgahwfbhawejfdwgehqwf");

//         if (!decoded) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }

//         // Attach user data to request object
//         req.user = decoded;

//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized: Token verification failed", error: error.message });
//     }
// };
const jwt = require("jsonwebtoken");
const Customer = require("../../models/customersModel");

// const customerAuthMiddleware = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ message: "Authorization token missing" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const customer = await Customer.findById(decoded.id).select("id mobile");

//         if (!customer) {
//             return res.status(401).json({ message: "Customer not found" });
//         }

//         req.customer = { id: customer.id, mobile: customer.mobile };
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// };
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No authentication token, access denied" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch customer details from database
        const customer = await Customer.findById(decoded.id).select("-password"); // Exclude password

        if (!customer) {
            return res.status(401).json({ message: "Customer not found" });
        }

        // Attach user details to req.user
        req.user = { id: customer._id, email: customer.email };
        
        next(); // Move to the next middleware or controller

    } catch (error) {
        res.status(401).json({ message: "Invalid token, access denied" });
    }
};

// module.exports = customerAuthMiddleware;




module.exports = authMiddleware