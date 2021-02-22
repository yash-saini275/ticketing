import * as mongoose from 'mongoose';

class DatabaseConfig {
  public static async connect() {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
}

export {DatabaseConfig};
