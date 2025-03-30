import createHttpError from "http-errors";
import { UsersCollection } from "../models/user.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, THIRTY_DAY } from "../constants/index.js";
import { SessionCollection } from "../models/session.js";

export const registerUserController = async (req, res, next) => {
  try {
    // Логування отриманих даних для діагностики
    console.log("Отримані дані для реєстрації:", req.body);

    // Перевірка, чи існує користувач із таким email
    const existingUser = await UsersCollection.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      throw createHttpError(409, "Email in use");
    }

    // Хешування пароля
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    // Створення нового користувача із збереженням номера телефону
    const newUser = await UsersCollection.create({
      name: req.body.name,
      email: req.body.email,
      // phone: req.body.phone, // збереження номера телефону
      password: encryptedPassword,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: newUser,
    });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const user = await UsersCollection.findOne({ email: req.body.email });
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
      throw createHttpError(401, "Unauthorized");
    }

    // Видаляємо попередню сесію, якщо є
    await SessionCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    const session = await SessionCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
    });

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAY),
    });
    res.cookie("sessionId", session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + THIRTY_DAY),
    });

    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
