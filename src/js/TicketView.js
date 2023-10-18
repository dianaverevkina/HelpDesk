/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
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
      minute: 'numeric',
    };

    const formattedDate = date.toLocaleString('ru-RU', options);
    return formattedDate;
  }
}
