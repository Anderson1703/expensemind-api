import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
import { customAlphabet } from "nanoid";

export class AuthUtil {
  static async verifyToken(token: string): Promise<{
    isValid: boolean;
    data: any | null;
  }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return {
        isValid: true,
        data: decoded,
      };
    } catch (error) {
      return {
        isValid: false,
        data: null,
      };
    }
  }

  static async generateToken(payload: any): Promise<string> {
    // return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "5m" });

  }

  static async hashPassword(password: string): Promise<string> {
    return hashSync(password, 10);
  }

  static async comparePassword(
    currentPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compareSync(currentPassword, hashedPassword);
  }

  static async generateOTP(): Promise<string> {
    const nanoid = customAlphabet("0123456789", 10);
    return nanoid(5); 
  }

  static async generateRandomString(length: number): Promise<string> {
    const nanoid = customAlphabet("1234567890abcdef", 10);
    return nanoid(length).toLocaleUpperCase();
  }
}
