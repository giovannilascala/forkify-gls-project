import icons from '../../img/icons.svg' //Parcel 2
import fracty from 'fracty'
import View from './View';



class recipeViewClass extends View {
  _parentElement = document.querySelector('.recipe');
  _data;

  servings = 4

  _errorMessage = 'We could not find that recipe. Please try another one!'
  _message = 'Search an intresting recipe or ingredient. Have fun!'

  // Render the recipe
  addHandlerRender(handler) {
    const events = ['hashchange', 'load']
    events.forEach(ev => window.addEventListener(`${ev}`, handler))
  }

  // Update the servings
  addHandlerServings(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('.btn--increase-servings')) {

        const { updateTo } = e.target.closest('.btn--increase-servings').dataset
        handler(e, +updateTo)
      }
    })
  }

  _generateMarkup() {
    // 1. Create the code for all the recipe
    const markup = `
          <figure class="recipe__fig">
          <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
          </figure>
        
          <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this.servings}</span>
            <span class="recipe__info-text">servings</span>
        
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings decrease " data-update-to="${this.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle" ></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings increase" data-update-to="${this.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
        
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round bookmark-button">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.isBookmarked ? '-fill' : ''}" class="bookmark"></use>
            </svg>
          </button>
          </div>
        
          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            
            ${this._data.ingredients.reduce((acc, cur) => acc + `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${cur.quantity !== null ? fracty(cur.quantity) : ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${cur.unit || ''}</span>
                ${cur.description || ''}
              </div>
            </li>
              `

      , '')}
            </ul>
          </div>
        
          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="${this._data.serviceUrl}"
            target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>`

    return markup
  }
}

export const recipeView = new recipeViewClass()