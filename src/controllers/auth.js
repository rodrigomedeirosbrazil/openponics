const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/connection')

const login = async function (req, res) {
  try {
    const { username, password } = req.body;

    const user = await db('users').where('name', username).first()
    if (!user) return res.status(404).json({ message: "Email ou senha inválidos (1)" });

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
        expiresIn: '6h'
      });
      user.password = ''; // hide password hash
      return res.json({ user, token });
    }
    return res.status(404).json({ message: "Email ou senha inválidos" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const changePassword = async function (req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    const id = req.userId

    const user = await db('users').where('id', id).first()

    if (!user) return res.status(404).json({ message: "Você precisa estar logado no sistema." });

    const valid = await bcrypt.compare(oldPassword, user.password)

    if (!valid) return res.status(404).json({ message: "Senha antiga inválida." });

    await db('users').where('id', id).update({ password: bcrypt.hashSync(newPassword)})

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }

}

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(401).send({ error: 'Token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    req.userId = decoded.id;
    return next();
  });
};

module.exports = {
  login,
  changePassword,
  verifyJwt
};
