const adminAuth = (req, res, next) => {
  console.log("Authenticating requests on route /admin");
  const token = "xyz";
  const isAdminAuthenticated = token === "xyz";
  if (!isAdminAuthenticated) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("Authenticating requests on route /user");
  const token = "xyz-abc";
  const isAdminAuthenticated = token === "abc";
  if (!isAdminAuthenticated) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth
};
