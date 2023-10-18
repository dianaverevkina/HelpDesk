import TicketService from './TicketService';
import PopoverView from './PopoverView';
/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
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
    [...this.form.elements].forEach((el) => {
      if (!el.name) return;
      data[el.name] = el.value;
    });

    if (this.form.classList.contains('add-item')) {
      this.createTicket(data);
    }

    if (this.form.classList.contains('edit-item')) {
      this.ticketService.update(this.editedItemId, data, (response) => {
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
    this.ticketService.create(data, (response) => {
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
