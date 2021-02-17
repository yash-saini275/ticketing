import * as mongoose from 'mongoose';

class DatabaseConfig {
  public static async connect() {
    if (!process.env.DB_URL) {
      throw new Error('DB_URL is required.');
    }

    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectInterval: 1000,
      reconnectTries: 10,
    });
  }
}

export {DatabaseConfig};
