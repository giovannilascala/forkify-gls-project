import icons from '../../img/icons.svg' //Parcel 2

export default class View {

  _parentElement = document.querySelector('.recipe')
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data  The data to be rendered (e.g. recipe)
   * @returns {undefined | function} renderError() if the data is an array with length=0 or data=undefined
   * @this {Object} View instance
   * @author Giovanni La Scala
   * @todo Finish implementation 
   */
  render(data) {
    //Set the data into the Class as private field
    if (Array.isArray(data) && data.length === 0 || !data) return this.renderError()
    this._data = data;

    //Clean the recipeContanier
    this.clear(this._parentElement);

    //Set the recipe into recipeContainer
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkup(this._data));
  }


  renderSpinner(container = this._parentElement) {
    //Create the code for the spinner
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `
    //Clean the recipeContainer
    this.clear(container)

    //Set the spinner into recipeContainer
    container.insertAdjacentHTML('afterbegin', markup)
  }

  _generateMarkupError(message = this._errorMessage, type = 'error') {
    const markup = `
    <div class="${type}">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `
    return markup
  }

  renderError(message, type) {
    this.clear(this._parentElement)
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkupError(message, type))
  }

  clear(container = this._parentElement) {
    container.innerHTML = ''
  }



  /*  update(data = this._parentElement) {
     // if (!Array.isArray(data) || data.length === 0) return;
 
     this._data = data
 
     const newMarkup = this._generateMarkup()
     const newDom = document.createRange().createContextualFragment(newMarkup)
     const newElements = Array.from(newDom.querySelectorAll('*'))
     const curElements = Array.from(this._parentElement.querySelectorAll('*'))
 
     newElements.forEach((newEl, i) => {
       const curEl = curElements[i]
 !== '');
 
       if (!newEl?.isEqualNode(curEl) && newEl?.innerText.trim() !== '') {
         curEl.textContent = newEl.textContent
       }
 
 
       if (!newEl.isEqualNode(curEl)) {
         Array.from(newEl.attributes).forEach(attr => {
           curEl.setAttribute(attr.name, attr.value)
         })
       }
 
     })
   }
  */

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    if (newMarkup === '') this.renderError(this._message, 'message');

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') curEl.textContent = newEl.textContent;

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
}


