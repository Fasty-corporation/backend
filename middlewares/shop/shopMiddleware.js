const Shop = require("../../models/shops");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; 

const isShopOwner = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const userId = req.user.id; // Assuming req.user is set by authentication middleware

        // Find the shop by ID
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        // Check if the logged-in user is the shop owner
        if (shop.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You are not the owner of this shop"
            });
        }

        next(); // User is authorized, proceed to the next handler
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const isAuthenticatedShopOwner = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided"
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY || "fhehfewhfb2q3hdbhwabdhwdbh");

        const shop = await Shop.findById(decoded.shopId);
        if (!shop) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only shop owners can access"
            });
        }

        req.shop = shop; // Attach shop details for later use
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

// module.exports = isAuthenticatedShopOwner;


// module.exports = isAuthenticated;


module.exports = {isShopOwner,isAuthenticatedShopOwner};
