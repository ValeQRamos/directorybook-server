const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

//  Middleware
/* 
-Este nos va a servir para verificar si tengo un usuario loggeado
*/
exports.verifyToken = (req, res, next) => {
  console.log("las cookies --->", req.cookies);
  const { headload, signature } = req.cookies;
  if (!headload || !signature)
    return res.status(401).json({ errorMessage: "Unauthorized cookie" });

  jwt.verify(
    `${headload}.${signature}`,
    process.env.SUPER_SECTET,
    { complete: true },
    (err, decoded) => {
      //esto es cuando tiene error en la verificacion
      if (err) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
      }
      console.log("que carahoo es el decoded??", decoded);
      User.findById(decoded.userId)
        .then((user) => {
          req.user = user; // aqui guardo mi usuario loggeado en el req. para usarlo en los otros endpoints o middleware
          next(); //nos da el paso para la siguiente accion || ruta
        })
        .catch((error) => {
          re.status(401).json({
            errorMessage: "Algo salio mal checar consola",
          });
        });
    }
  ); // <----- aca termina verify
}; // <------ aca termina funcion padre verifyToken

exports.createJWT = (user) => {
  return jwt
    .sign(
      {
        userId: user._id,
        email: user.username,
      },
      process.env.SUPER_SECTET,
      { expiresIn: "24h" }
    )
    .split(".");
};

exports.clearRest = (data) => {
  const { password, __v, updatedAtm, ...cleanedData } = data;

  return cleanedData;
};
