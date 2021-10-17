/* eslint-disable no-param-reassign */
import { DataTypes } from 'sequelize';
import crypto from 'crypto';
import database from '../index';
import Post from './Post';
import Comment from './Comment';

const User = database.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: DataTypes.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
  firstName: {
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
  },
  lastName: {
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
  },
});
User.prototype.generateSalt = () => crypto.randomBytes(16).toString('base64');
User.prototype.encryptPassword = (plainText, salt) => crypto
  .createHash('RSA-SHA256')
  .update(plainText)
  .update(salt)
  .digest('hex');
// eslint-disable-next-line func-names
User.prototype.correctPassword = function (enteredPassword) {
  return User.prototype.encryptPassword(enteredPassword, this.salt()) === this.password();
};
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = user.generateSalt();
    user.password = user.encryptPassword(user.password(), user.salt());
  }
};
User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
// Relation OneToMany User---n---Post
User.hasMany(Post);
Post.belongsTo(User);
// Relation OneToMany User---n---Comment
User.hasMany(Comment);
Comment.belongsTo(User);
(async () => {
  await database.sync(
    // { force: true },
  );
  // Code here
})();
export default User;
