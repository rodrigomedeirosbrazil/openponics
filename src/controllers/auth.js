const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // const user = await User.getByEmail(email);
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
    return res.status(500).json({ message: error });
  }
};


const recoveryPassword = async function (req, res) {
  try {
    const { email } = req.body;

    const user = await User.getByEmail(email);
    if (!user) return res.status(404).json({ message: "Email não encontrado" });

    const newPassword = createPassword(10);

    user.password = newPassword;

    await User.update(user)

    const newEmail = {
      from: "Pulsar Connect <contato@pulsarpay.com>",
      to: email,
      subject: "Recuperação da senha",
      text:
        `Você pediu a recuperação da senha, segue a senha que foi gerada:
      ${newPassword}
      `
    };

    await mail.sendMail(newEmail);
    return res.status(200).json({ message: "Email enviado!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

const changePassword = async function (req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    const id = req.userId

    // const user = await User.getWithPassword(id);
    if (!user) return res.status(404).json({ message: "Você precisa estar logado no sistema." });

    const valid = await bcrypt.compare(oldPassword, user.password)

    if (!valid) return res.status(404).json({ message: "Senha antiga inválida." });

    user.password = newPassword;

    await User.update(user)

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
  signup,
  recoveryPassword,
  changePassword,
  verifyJwt
};
