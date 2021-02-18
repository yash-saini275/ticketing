import * as mongoose from 'mongoose';

class DatabaseConfig {
  public static async connect() {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectInterval: 1000,
      reconnectTries: 10,
    });
  }
}

export {DatabaseConfig};
