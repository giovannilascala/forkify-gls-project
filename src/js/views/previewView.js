import View from './View.js'
import icons from '../../img/icons.svg' //Parcel 2


class previewViewClass extends View {
  _data;

  generateMarkup(data) {
    if (Array.isArray(this._data && this._data.length === 0)) return;
    const id = window.location.hash.slice(1)

    this._data = data

    const markup = this._data.reduce((acc, cur) => acc + `
    <li class="preview">
      <a class="preview__link ${id === cur.id ? 'preview__link--active' : ''}" href="#${cur.id}">
        <figure class="preview__fig">
          <img src="${cur.image}" alt="${cur.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">
            ${cur.title}
          </h4>
          <p class="preview__publisher">${cur.publisher}</p>

          <div class="preview__user-generated ${cur.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
    `, ''
    )

    return markup
  }

}

export default PreviewView = new previewViewClass()