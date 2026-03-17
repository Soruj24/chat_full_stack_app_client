import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import dbConnect from "./db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "f6bd99da70ad4d9853347c184bde6d77f412405e468df02b810be908c7ab86d6e24057c6a58d420349904a799499fd64f2028fd2fa6eefb7b30928d56fedca3e";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  settings?: {
    showNotifications: boolean;
    messagePreview: boolean;
    soundEffects: boolean;
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export async function signToken(payload: AuthUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      settings: user.settings
    } as AuthUser;
  } catch (error) {
    console.error("Auth helper error:", error);
    return null;
  }
}

export function getUserIdFromRequest(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}
