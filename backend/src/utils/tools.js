import jwt from 'jsonwebtoken';
import config from '../config';

function createJWT(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '86400s' } );
}

function verifyJWT(token) {
  return new Promise((fnResolve, fnReject) => {
    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        fnResolve(null);
        return;
      }
      fnResolve(user);
      return;
    });
  });
}

export { createJWT, verifyJWT, };
export default { createJWT, verifyJWT, };