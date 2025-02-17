const {
  generateToken,
  decodeToken,
  checkPassword,
} = require("../../functions/helperFunction");
const bcrypt = require("bcrypt");
const {
  findUserService,
  createUserService,
} = require("../../services/userServices");

const authController = {
  // for user signup
  onUserSignUp: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ message: "error while creating user (some fields are blank" });
    }
    try {
      const findedUser = await findUserService(email);
      if (findedUser) {
        return res.status(400).send({ message: "User Exist" });
      }

      const hashPwd = await bcrypt.hash(password, 10); // 10 is salt round
      // checking hashpwd if comming null
      if (!hashPwd) {
        console.log("30", error.message);
        return res.status(400).send({ message: "error while creating user" });
      }

      // creating the user
      const createdUser = await createUserService(name, email, hashPwd);

      //double check if created user is null
      if (!createdUser) {
        return res.status(400).send({ message: "error while creating user" });
      }
      // generating the token
      const token = generateToken(email, password);
      return res.send({ token: token, name, email });
    } catch (error) {
      console.log("44", error.message);
      res.status(500).send({ message: "internal server error" });
    }
  },

  // for user login
  onUserLogIn: async (req, res) => {
    const { email, password } = req.body;
    // if email & password is null
    if (!email || !password) {
      return res
        .status(500)
        .send({ message: "error while login (some fields are blank)" });
    }
    try {
      const findedUser = await findUserService(email);
      // if user is not found
      if (!findedUser) {
        return res.status(500).send({ message: "User doesn't exist" });
      }
      const checkPwd = await checkPassword(password, findedUser.password);

      // if password is not matched
      if (!checkPwd) {
        return res.status(500).send({ message: "Wrong Password" });
      }
      const token = generateToken(email, password);
      res.send({
        token: token,
        name: findedUser.name,
        email,
        cart: findedUser.carts,
      });
    } catch (error) {
      res.status(400).send({ message: "error while login " });
    }
  },

  // verify user
  onVerfiyUser: async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(500).send({ message: "Please LogIn Again !" });
    }
    try {
      const decodeValues = decodeToken(token);
      if (!decodeValues) {
        return res.status(500).send({ message: "Please LogIn Again !" });
      }
      const { email, password } = decodeValues;
      const findedUser = await findUserService(email);

      if (!findedUser) {
        return res.status(500).send({ message: "Please LogIn Again !" });
      }
      const checkPwd = await checkPassword(password, findedUser.password);

      if (!checkPwd) {
        return res.status(500).send({ message: "Please LogIn Again" });
      }
      return res.send({
        name: findedUser.name,
        email,
        cart: findedUser.carts,
      });
    } catch (error) {
      res.status(400).send({ message: "Please LogIn Again" });
    }
  },
};

module.exports = authController;
