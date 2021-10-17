import { verifyJWT } from '../utils/tools';

async function adminOnly(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.json({ code: 403, msg: 'Action non autorisée.', data: {}, errors: [] });
  } else {
    const user = await verifyJWT(token);

    if (user && user.roleId === 1) {
      req.user = user;
      next();
    } else {
      res.json({ code: 403, msg: 'Action non autorisée.', data: {}, errors: [] });
    }
  }
}

async function userAtLeast(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.json({ code: 403, msg: 'Action non autorisée.', data: {}, errors: [] });
  } else {
    const user = await verifyJWT(token);

    if (user && (user.roleId === 1 || user.roleId === 2)) {
      req.user = user;
      next();
    } else {
      res.json({ code: 403, msg: 'Action non autorisée.', data: {}, errors: [] });
    }
  }
}

export { adminOnly, userAtLeast, };
export default { adminOnly, userAtLeast, };