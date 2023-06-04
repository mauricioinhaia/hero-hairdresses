import { ICreate } from "../interfaces/SchedulesInterface";
import { isBefore, startOfHour, getHours } from "date-fns";
import { SchedulesRepository } from "../repositories/ServicesRepository";
class SchedulesService {
  private schedulesRepository: SchedulesRepository;

  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({ name, phone, date }: ICreate) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const hour = getHours(hourStart);

    if(hour <= 9 || hour >= 19){
        throw new Error("Create Schedule Between 9AM and 19PM")
    } 

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

  async index(date: Date) {
    const result = await this.schedulesRepository.findAll(date);

    return result;
  }

  async update(id: string, date: Date) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const hour = getHours(hourStart);

    if(hour <= 9 || hour >= 19){
        throw new Error("Create Schedule Between 9AM and 19PM")
    } 

    if (isBefore(hourStart, new Date())) {
      throw new Error("It is not Allowed to Schedule a old Date");
    }

    const checkIsAvailable = await this.schedulesRepository.find(hourStart);

    if (checkIsAvailable) {
      throw new Error("Schedule date is not Available");
    }

    const result = await this.schedulesRepository.update(id, hourStart);
    return result;
  }

  async delete() {}
}

export { SchedulesService };
