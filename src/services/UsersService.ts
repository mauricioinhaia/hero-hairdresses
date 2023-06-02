import { hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";
import { v4 as uuid } from "uuid";
import { s3 } from "../config/aws";

class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (findUser) {
      throw new Error("User exists");
    }

    const hashPassword = await hash(password, 10);

    const create = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });
    return create;
  }

  async update({ name, oldPassword, newPassword, avatar_url }: IUpdate) {
    const uploadImage = avatar_url?.buffer;

    const uploadS3 = await s3
      .upload({
        Bucket: "mauricioinhaia-hero-week",
        Key: `${uuid()}-${avatar_url?.originalname}`,
        Body: uploadImage,
      })
      .promise();
  }
}

export { UsersService };
