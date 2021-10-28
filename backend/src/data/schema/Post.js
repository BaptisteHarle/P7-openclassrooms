/* eslint-disable no-param-reassign */
import { DataTypes } from 'sequelize';
import database from '../index';
import Comment from './Comment';

const Post = database.define('post', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  content: {
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
  },
  img: {
    unique: false,
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: new Date(),
  },
});
// Relation OneToMany Post---n---Comment
Post.hasMany(Comment);
Comment.belongsTo(Post);

(async () => {
  await database.sync(
    // { force: true },
  );
  // Code here
})();

export default Post;