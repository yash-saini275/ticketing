import * as mongoose from 'mongoose';
import {Document, Model} from 'mongoose';

import {Password} from '../services/password';

interface UserDto {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserDto): UserDoc;
}

type UserDoc = UserDto & Document;

const userSchema = new mongoose.Schema<UserDoc, UserModel>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserDto) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};
