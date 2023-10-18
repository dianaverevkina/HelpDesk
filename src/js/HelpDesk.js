import TicketService from './TicketService';
import Ticket from './Ticket';
import TicketView from './TicketView';
import TicketForm from './TicketForm';
/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
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
    this.ticketService.list((response) => {
      if (response) {
        response.forEach((item) => {
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
    items.forEach((el) => el.remove());

    this.renderTickets();
  }

  modifyItem(e) {
    e.preventDefault();
    const { target } = e;

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
    this.ticketService.get(item.dataset.id, (response) => {
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
    const { id } = elem.closest('.item').dataset;
    const checkbox = elem.querySelector('.item__checkbox');
    checkbox.checked = !checkbox.checked;
    const data = { status: checkbox.checked };
    this.ticketService.update(id, data, (response) => {
      if (response) {
        this.renewTickets();
      }
    });
  }

  // При клике по кнопке 'подробнее' отображаем описание тикета
  // после получения данных тикета с сервера
  showDetailedDesc(el) {
    const desc = (el.closest('.item__desc'));
    this.detailedDesc = desc.querySelector('.item__detailed-desc');

    if (this.detailedDesc) {
      this.detailedDesc.remove();
      return;
    }

    const { id } = el.closest('.item').dataset;
    this.ticketService.get(id, (response) => {
      if (response) {
        this.detailedDesc = document.createElement('p');
        this.detailedDesc.classList.add('item__detailed-desc');
        this.detailedDesc.textContent = response.description;
        desc.append(this.detailedDesc);
      }
    });
  }
}
