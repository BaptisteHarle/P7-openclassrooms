/* eslint-disable no-param-reassign */
import { DataTypes } from 'sequelize';
import database from '../index';
import User from './User';

const Role = database.define('role', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
});

Role.hasMany(User);
User.belongsTo(Role);

(async () => {
  await database.sync(
    // { force: true },
  );
  // Code here
})();

export default Role;