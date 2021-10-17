/* eslint-disable no-param-reassign */
import { DataTypes } from 'sequelize';
import database from '../index';

const Comment = database.define('comment', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: new Date(),
  },
  content: {
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
  },
});

(async () => {
  await database.sync(
    // { force: true },
  );
  // Code here
})();

export default Comment;