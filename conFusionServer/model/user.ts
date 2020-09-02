import { createSchema, Type, typedModel } from "ts-mongoose";

const UserSchema = createSchema({
  username: Type.string({ required: true }),
  password: Type.string({ required: true }),
  admin: Type.boolean({ default: false as boolean, required: false }),
});
const User = typedModel("User", UserSchema);

export default User;
