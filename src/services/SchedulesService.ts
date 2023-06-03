import { ICreate } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour } from "date-fns";
import { SchedulesRepository } from "../repositories/ServicesRepository";
class SchedulesService {
  private schedulesRepository: SchedulesRepository;

  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date }: ICreate) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    console.log("datejson " + date);
    console.log("formatada " + dateFormatted);
    console.log("start " + hourStart);

    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not Allowed to Schedule a old Date");
    }

    const checkIsAvailable = await this.schedulesRepository.find(hourStart);

    if (checkIsAvailable) {
      throw new Error("Schedule date is not Available");
    }

    const create = await this.schedulesRepository.create({
      name,
      phone,
      date: hourStart,
    });

    return create;
  }
}

export { SchedulesService };
