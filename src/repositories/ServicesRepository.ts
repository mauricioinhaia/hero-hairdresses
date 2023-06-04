import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/SchedulesInterface";
import { startOfDay, endOfDay } from "date-fns";

class SchedulesRepository {
  async create({ name, phone, date }: ICreate) {
    const result = await prisma.schedule.create({
      data: {
        name,
        phone,
        date,
      },
    });
    return result;
  }

  async find(date: Date, user_id: string) {
    const result = await prisma.schedule.findFirst({
      where: { date, user_id },
    });
    return result;
  }

  async findAll(date: Date) {
    const result = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lt: endOfDay(date),
        },
      },
      orderBy: { date: "asc" },
    });
    return result;
  }

  async update(id: string, date: Date) {
    const result = await prisma.schedule.update({
      where: {
        id,
      },
      data: {
        date,
      },
    });
    return result;
  }

  async delete() {}
}

export { SchedulesRepository };
