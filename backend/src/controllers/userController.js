import { User } from '../data/schema';
import v from '../utils/validation';
import { createJWT } from '../utils/tools';

class UserController {
  static async getUser(req, res, next) {
    const user = await User.findOne({ where: { email: req.user.email } });
    res.json({ code: 200, msg: "Voici les informations de l'utilisateur.", data: { user }, errors: [] });
  }

  static async getUsers(req, res, next) {
    const users = await User.findAll();
    res.json({ code: 200, msg: 'Voici les utilisateurs de Groupmania.', data: { users }, errors: [] });
  }

  static async createUser(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    const errors = [];

    const alreadyExist = await User.findOne({
      where: {
        email: email,
      }
    });

    if (alreadyExist) {
      errors.push('Cet email est déja utilisé');
    }
    if (!v.user.firstName(firstName)) {
      errors.push('Merci de renseigner un prénom valide.');
    }
    if (!v.user.lastName(lastName)) {
      errors.push('Merci de renseigner un nom valide.');
    }
    if (!v.user.email(email)) {
      errors.push('Merci de renseigner un email valide.');
    }
    if (!v.user.password(password)) {
      errors.push('Merci de renseigner un mot de passe valide. (8 caractères, 1 lettre, 1 nombre et 1 caractères spécial.');
    }

    if (errors.length === 0) {
      const user = await User.create({
        roleId: 2, // 1 pour admin, 2 pour user
        firstName,
        lastName,
        email,
        password,
      });

      const payload = {
        id: user.id,
        roleId: user.roleId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      const token = createJWT(payload);

      res.json({ code: 200, msg: "Utilisateur créé.", data: { user, token, }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de créer l'utilisateur.", data: {}, errors });
    }

  }

  static async deleteUser(req, res, next) {
    const { userId } = req.params;
    await User.destroy({
      where: { id: userId },
    });
    res.json({ code: 200, msg: 'Utilisateur supprimé.', data: {}, errors: [] });
  }

  static async modifyUser(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    const { userId } = req.params;
    const errors = [];

    if (firstName && !v.user.firstName(firstName)) {
      errors.push('Merci de renseigner un prénom valide.');
    }
    if (lastName && !v.user.lastName(lastName)) {
      errors.push('Merci de renseigner un nom valide.');
    }
    if (email && !v.user.email(email)) {
      errors.push('Merci de renseigner un email valide.');
    }
    if (password && !v.user.password(password)) {
      errors.push('Merci de renseigner un mot de passe valide. (8 caractères, 1 lettre, 1 nombre et 1 caractères spécial.');
    }

    if (errors.length === 0) {
      const payload = {};

      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (email) payload.email = email;
      if (password) payload.password = password;

      const user = await User.update(payload, {
        where: { id: userId },
        returning: true,
        plain: true,
      });

      res.json({ code: 200, msg: "Utilisateur modifié.", data: { user }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de modifier l'utilisateur.", data: {}, errors });
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && password && user.correctPassword(password)) {
      const payload = {
        id: user.id,
        roleId: user.roleId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      const token = createJWT(payload);

      res.json({ code: 200, msg: 'Bienvenue !', data: { user, token, }, errors: [] });
    } else {
      res.json({ code: 403, msg: 'Identifiants incorrects.', data: {}, errors: [] });
    }
  }
}

export default UserController;