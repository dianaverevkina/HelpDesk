/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/api/createRequest.js
const createRequest = async function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let callback = arguments.length > 1 ? arguments[1] : undefined;
  // eslint-disable-line 

  fetch(options.url, {
    method: options.method,
    body: JSON.stringify(options.data)
  }).then(response => {
    if (response.status === 204) {
      callback();
      return;
    }
    response.json().then(result => callback(result));
  }).catch(e => {
    console.error('Произошла ошибка: ', e);
  });
};
/* harmony default export */ const api_createRequest = (createRequest);
;// CONCATENATED MODULE: ./src/js/TicketService.js

/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
class TicketService {
  constructor() {
    this.URL = 'http://localhost:3000';
  }
  list(callback) {
    api_createRequest({
      url: `${this.URL}/?method=allTickets`,
      method: 'GET'
    }, callback);
  }
  get(id, callback) {
    api_createRequest({
      url: `${this.URL}/?method=ticketById&id=${id}`,
      method: 'GET'
    }, callback);
  }
  create(data, callback) {
    api_createRequest({
      url: `${this.URL}/?method=createTicket`,
      method: 'POST',
      data
    }, callback);
  }
  update(id, data, callback) {
    api_createRequest({
      url: `${this.URL}/?method=updateById&id=${id}`,
      method: 'POST',
      data
    }, callback);
  }
  delete(id, callback) {
    api_createRequest({
      url: `${this.URL}/?method=deleteById&id=${id}`,
      method: 'GET'
    }, callback);
  }
}
;// CONCATENATED MODULE: ./src/js/Ticket.js
class Ticket {
  constructor(_ref) {
    let {
      id,
      name,
      status,
      description,
      created
    } = _ref;
    this.id = id; // идентификатор (уникальный в пределах системы)
    this.name = name; // краткое описание
    this.status = status; // boolean - сделано или нет
    this.desc = description; // полное описание
    this.date = created; // дата создания
  }
}
;// CONCATENATED MODULE: ./src/js/TicketView.js
/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
class TicketView {
  static drawTicket(el) {
    const item = document.createElement('div');
    item.classList.add('list__row', 'item');
    item.setAttribute('data-id', el.id);
    item.innerHTML = `
      <label class="item__check">
        <input class="item__checkbox" type="checkbox" name="task-done" ${el.status ? 'checked' : ''}>
        <span class="item__check-icon"></span>
      </label>
      <div class="list__col item__desc">
        <p class="item__name">${el.name} 
          ${el.desc ? `<span class="item__more">
            <img src="./images/more-icon.svg" alt="Подробнее">
          </span>` : ''}
        </p>
      </div>
      <p class="list__col item__date">${this.formatDate(new Date(el.date))}</p>
      <div class="list__col item__controls">
        <button type="button" class="item__control item__control-edit">
          <img src="./images/edit.svg" alt="Edit item" class="item__edit">
        </button>
        <button type="button" class="item__control item__control-delete">
          <img src="./images/delete.svg" alt="Delete item" class="item__delete">
        </button>
      </div>
    `;
    return item;
  }
  static formatDate(date) {
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    const formattedDate = date.toLocaleString('ru-RU', options);
    return formattedDate;
  }
}
;// CONCATENATED MODULE: ./src/js/PopoverView.js
class PopoverView {
  // Отрисовываем всплывающее окно
  static drawPopover(formName, formTitle) {
    const popover = document.createElement('div');
    popover.classList.add('popover');
    popover.innerHTML = `
      <div class="popover__container">
        <form class="popover__form form ${formName} novalidate">
          <div class="form__block">
            <h1 class="form__title">${formTitle}</h1>
            <div class="form__row form__desc-short">
              <h2 class="form__input-title">Краткое описание</h2>
              <input type="text" name="name" class="form__input" required>
            </div>
            <div class="form__row form__desc-detailed">
              <h2 class="form__input-title">Подробное описание</h2>
              <textarea type="text" name="description" class="form__textarea" required></textarea>
            </div>  
          </div>
          <div class="form__block buttons">
            <button class="buttons__btn buttons__btn-save">Сохранить</button>
            <button type="button" class="buttons__btn buttons__btn-cancel">Отмена</button>
          </div>
        </form>
      </div>
    `;
    return popover;
  }

  // Отрисовываем окно для уточнения удалять ли задачу
  static drawDeletePopover() {
    const popover = document.createElement('div');
    popover.classList.add('popover');
    popover.innerHTML = `
      <div class="popover__container">
        <div class="popover__block">
          <div class="popover__content">
            <h1 class="popover__title">Удалить тикет</h1>
            <p class="popover__text">Вы уверены, что хотите удалить тикет? Это действие необратимо</p>
          </div>
          <div class="popover__buttons buttons">
            <button class="buttons__btn buttons__btn-save">Ок</button>
            <button type="button" class="buttons__btn buttons__btn-cancel">Отмена</button>
          </div>
        </div>
      </div>
    `;
    return popover;
  }
}
;// CONCATENATED MODULE: ./src/js/TicketForm.js


/**
 *  Класс для создания формы создания нового тикета
 * */
class TicketForm {
  constructor() {
    this.editedItemId = null;
    this.deleteditemId = null;
    this.ticketService = new TicketService();
    this.saveItem = this.saveItem.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  // Открываем popover
  showPopover(formName, formTitle) {
    this.popover = PopoverView.drawPopover(formName, formTitle);
    document.body.append(this.popover);
    this.form = this.popover.querySelector('.form');
    this.inputName = this.form.querySelector('[name="name"]');
    this.textareaDesc = this.form.querySelector('[name="description"]');
    this.btnSave = this.form.querySelector('.buttons__btn-save');
    this.btnCancel = this.form.querySelector('.buttons__btn-cancel');
    this.addEvents();
  }

  // Добавляем обработчики событий
  addEvents() {
    this.form.addEventListener('submit', this.saveItem);
    this.btnSave.addEventListener('click', this.saveItem);
    this.btnCancel.addEventListener('click', this.closePopover);
  }

  // Сохраняем данные тикета
  saveItem(e) {
    e.preventDefault();
    const data = {};
    [...this.form.elements].forEach(el => {
      if (!el.name) return;
      data[el.name] = el.value;
    });
    if (this.form.classList.contains('add-item')) {
      this.createTicket(data);
    }
    if (this.form.classList.contains('edit-item')) {
      this.ticketService.update(this.editedItemId, data, response => {
        if (response) {
          this.renewTickets();
          this.editedItemId = null;
        }
      });
    }
    this.closePopover();
  }

  // Cоздаем тикет
  createTicket(data) {
    this.ticketService.create(data, response => {
      if (response) {
        this.renewTickets();
      }
    });
  }

  // Удаляем popover
  closePopover() {
    // debugger;
    this.popover.remove();
  }

  // Открываем окно для уточнения удалять ли задачу
  showDeletePopover() {
    this.popover = PopoverView.drawDeletePopover();
    document.body.append(this.popover);
    this.btnSave = this.popover.querySelector('.buttons__btn-save');
    this.btnCancel = this.popover.querySelector('.buttons__btn-cancel');
    this.btnSave.addEventListener('click', () => this.deleteItem());
    this.btnCancel.addEventListener('click', this.closePopover);
  }

  // Удаляем задачу
  deleteItem() {
    this.ticketService.delete(this.deleteditemId, () => {
      this.renewTickets();
      this.deleteditemId = null;
      this.closePopover();
    });
  }
}
;// CONCATENATED MODULE: ./src/js/HelpDesk.js




/**
 *  Основной класс приложения
 * */
class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = new TicketService();
    this.ticketForm = new TicketForm();
    this.buttonToAdd = this.container.querySelector('.desk__btn-add');
    this.list = this.container.querySelector('.list');
    this.addItem = this.addItem.bind(this);
    this.modifyItem = this.modifyItem.bind(this);
    this.renewTickets = this.renewTickets.bind(this);
  }
  init() {
    this.renderTickets();
    this.addEvents();
    this.ticketForm.renewTickets = this.renewTickets;
  }

  // Получаем список тикетов с сервера и рендерим их
  renderTickets() {
    this.ticketService.list(response => {
      if (response) {
        response.forEach(item => {
          const ticket = new Ticket(item);
          const ticketEl = TicketView.drawTicket(ticket);
          this.list.append(ticketEl);
        });
      }
    });
  }

  // Добвляем обработчики событий
  addEvents() {
    this.buttonToAdd.addEventListener('click', this.addItem);
    this.list.addEventListener('click', this.modifyItem);
  }

  // При клике по кнопке "добавить", открываем окно для добавления тикета
  addItem(e) {
    e.preventDefault();
    this.ticketForm.showPopover('add-item', 'Добавить тикет');
  }

  // Обновляем тикеты
  renewTickets() {
    const items = this.list.querySelectorAll('.item');
    items.forEach(el => el.remove());
    this.renderTickets();
  }
  modifyItem(e) {
    e.preventDefault();
    const {
      target
    } = e;
    if (target.closest('.item__control-delete')) {
      this.onBtnDelete(target);
    }
    if (target.closest('.item__control-edit')) {
      const item = target.closest('.item');
      this.editItem(item);
    }
    const check = target.closest('.item__check');
    if (check) {
      this.changeTicketStatus(check);
    }
    if (target.closest('.item__more')) {
      this.showDetailedDesc(target);
    }
  }

  // При клике по кнопке 'редактировать', открываем окно для изменения данных
  // заполняем поля формы после получения данных тикета с сервера
  editItem(item) {
    this.ticketForm.showPopover('edit-item', 'Изменить тикет');
    this.ticketService.get(item.dataset.id, response => {
      if (response) {
        this.ticketForm.inputName.value = response.name;
        this.ticketForm.textareaDesc.value = response.description;
        this.ticketForm.editedItemId = response.id;
      }
    });
  }

  // При клике по кнопке "удалить" открываем окно для уточнения
  onBtnDelete(element) {
    const item = element.closest('.item');
    this.ticketForm.deleteditemId = item.getAttribute('data-id');
    this.ticketForm.showDeletePopover();
  }

  // При клике на чекбокс меняем его состояние и обновляем данные тикета
  changeTicketStatus(elem) {
    const {
      id
    } = elem.closest('.item').dataset;
    const checkbox = elem.querySelector('.item__checkbox');
    checkbox.checked = !checkbox.checked;
    const data = {
      status: checkbox.checked
    };
    this.ticketService.update(id, data, response => {
      if (response) {
        this.renewTickets();
      }
    });
  }

  // При клике по кнопке 'подробнее' отображаем описание тикета
  // после получения данных тикета с сервера
  showDetailedDesc(el) {
    const desc = el.closest('.item__desc');
    this.detailedDesc = desc.querySelector('.item__detailed-desc');
    if (this.detailedDesc) {
      this.detailedDesc.remove();
      return;
    }
    const {
      id
    } = el.closest('.item').dataset;
    this.ticketService.get(id, response => {
      if (response) {
        this.detailedDesc = document.createElement('p');
        this.detailedDesc.classList.add('item__detailed-desc');
        this.detailedDesc.textContent = response.description;
        desc.append(this.detailedDesc);
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const root = document.querySelector('.desk__container');
const app = new HelpDesk(root);
app.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map