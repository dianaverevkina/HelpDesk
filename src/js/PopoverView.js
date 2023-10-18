export default class PopoverView {
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
