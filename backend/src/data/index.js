import { Sequelize } from 'sequelize';
import config from '../config';

const db = new Sequelize(config.db.uri, {
  logging: false, dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});
export default db;