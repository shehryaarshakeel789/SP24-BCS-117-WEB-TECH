// Middleware: user must be logged in to access the route
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    req.flash("error", "You must be logged in to access that page.");
    res.redirect("/auth/login");
}

// Middleware: user must be an admin to access the route
function isAdmin(req, res, next) {
    if (req.session.userId && req.session.userRole === "admin") {
        return next();
    }
    req.flash("error", "Access Denied. Admins only.");
    res.redirect("/");
}

module.exports = { isLoggedIn, isAdmin };
