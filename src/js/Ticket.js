export default class Ticket {
  constructor({
    id, name, status, description, created,
  }) {
    this.id = id;// идентификатор (уникальный в пределах системы)
    this.name = name; // краткое описание
    this.status = status;// boolean - сделано или нет
    this.desc = description; // полное описание
    this.date = created; // дата создания
  }
}
