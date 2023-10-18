import createRequest from './api/createRequest';
/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    this.URL = 'http://localhost:3000';
  }

  list(callback) {
    createRequest({
      url: `${this.URL}/?method=allTickets`,
      method: 'GET',
    }, callback);
  }

  get(id, callback) {
    createRequest({
      url: `${this.URL}/?method=ticketById&id=${id}`,
      method: 'GET',
    }, callback);
  }

  create(data, callback) {
    createRequest({
      url: `${this.URL}/?method=createTicket`,
      method: 'POST',
      data,
    }, callback);
  }

  update(id, data, callback) {
    createRequest({
      url: `${this.URL}/?method=updateById&id=${id}`,
      method: 'POST',
      data,
    }, callback);
  }

  delete(id, callback) {
    createRequest({
      url: `${this.URL}/?method=deleteById&id=${id}`,
      method: 'GET',
    }, callback);
  }
}
