import { NextFunction, Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  index() {}

  show() {}

  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;

    try {
      const result = await this.usersService.create({name, email, password});

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  auth() {}
}

export { UsersController };
