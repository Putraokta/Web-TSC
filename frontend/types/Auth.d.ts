import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface ILogin {
  username: string;
  password: string;
}

interface IRegister {
  username: string;
  password: string;
}

interface UserExtended extends User {
  accessToken?: string;
  role?: string;
}

interface SessionExtended extends Session {
  accessToken?: string;
}

interface JWTExtended extends JWT {
  user?: UserExtended;
}
