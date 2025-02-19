// lek 156
import mongoose from "mongoose";

// lek 166
import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
  // message?: string;
}

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// const User = mongoose.model('User', userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

// export { User, buildUser };

// lek 157
// An interface that describes the properties
// that a User Model has
// interface UserModel extends mongoose.Model<any> {
//   build(attrs: UserAttrs): any;
// }

// lek 158
// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// lek 158
// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // message?: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // message: "you are sign in",
  },
  // lek 182
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        // onmessage
      },
    },
  }
);

// lek 166
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// const User = mongoose.model<any, UserModel>('User', userSchema);

// lek 158
// <UserDoc, UserModel> lista argumentów typu ogólnego.
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
