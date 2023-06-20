import { ICreate } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour, getHours } from "date-fns";
import { SchedulesRepository } from "../repositories/ServicesRepository";
class SchedulesService {
  private schedulesRepository: SchedulesRepository;

  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date, user_id }: ICreate) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const timezoneOffset = hourStart.getTimezoneOffset() / 60;
    const hour = (hourStart.getHours() + timezoneOffset) % 24;

    if (hour <= 9 || hour >= 19) {
      throw new Error("Create Schedule Between 9AM and 19PM");
    }

    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not Allowed to Schedule a old Date");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("Schedule date is not Available");
    }

    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: hourStart,
      user_id,
    });

    return create;
  }

  async index(date: Date) {
    const result = await this.schedulesRepository.findAll(date);

    return result;
  }

  async update(id: string, date: Date, user_id: string) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const timezoneOffset = hourStart.getTimezoneOffset() / 60;
    const hour = (hourStart.getHours() + timezoneOffset) % 24;

    if (hour <= 9 || hour >= 19) {
      throw new Error("Create Schedule Between 9AM and 19PM");
    }

    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not Allowed to Schedule a old Date");
    }

    const checkIsAvailable = await this.schedulesRepository.find(
      hourStart,
      user_id
    );

    if (checkIsAvailable) {
      throw new Error("Schedule date is not Available");
    }

    const result = await this.schedulesRepository.update(id, hourStart);
    return result;
  }

  async delete(id: string) {
    const checkExists = await this.schedulesRepository.findById(id);

    if (!checkExists) {
      throw new Error("Schedule doenst exists");
    }

    const result = await this.schedulesRepository.delete(id);

    return result;
  }
}
export { SchedulesService };
