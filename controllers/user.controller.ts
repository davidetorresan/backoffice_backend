import { Request, Response } from "express";
import User from "../models/user.model";
import crypto from "crypto";
import { IUser, ILogin, IRegister } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

export const routeWelcome = (_req: Request, _res: Response) => {
  _res.status(200).json({
    status: 200,
    message: "Welcome to the v1 Restfull API",
  });
};

export const login = async (_req: Request, _res: Response) => {
  if (_req.body.email && _req.body.password) {
    let result: any = await User.findOne({ email: _req.body.email });
    if (result) {
      console.log(result);
      let hash = await crypto
        .pbkdf2Sync(_req.body.password, result.salt, 1000, 64, `sha512`)
        .toString(`hex`);
      if (hash == result.hash) {
        const token = await jwt.sign(
          {
            email: result.email,
            firstname: result.firstname,
            lastname: result.lastname,
          },
          process.env.TOKEN_SECRET as string,
          { expiresIn: "24h" }
        );

        return _res.status(201).json({
          status: 201,
          message: "Operation successfully performed",
          token,
        });
      }
    }
  } else {
    return _res.status(501).json({
      status: 501,
      error: "Some problems with your login",
    });
  }
};

export const register = (_req: Request, _res: Response) => {
  const user: IRegister = _req.body;
  if (user) {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto
      .pbkdf2Sync(_req.body.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const newUser = new User({
      salt,
      hash,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });

    newUser.save((err, User) => {
      if (err) {
        return _res.status(401).json({
          status: 401,
          error: err,
        });
      } else {
        return _res.status(201).json({
          status: 201,
          message: "Operation successfully performed",
          user: User,
        });
      }
    });
  } else {
    return _res.status(501).json({
      status: 501,
      error: "No user informations are provided",
    });
  }
};

export const getMe = async (_req: Request, _res: Response) => {
  let user = await User.findOne({ _id: _req.body.id });
  if (user) {
    return _res.status(201).json({
      status: 201,
      message: "Operation successfully performed",
      user,
    });
  } else {
    return _res.status(501).json({
      status: 501,
      error: "No user was found",
    });
  }
};
