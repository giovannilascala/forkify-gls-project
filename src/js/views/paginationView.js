import { mark } from 'regenerator-runtime'
import View from './View.js'
import icons from '../../img/icons.svg' //Parcel 2


class paginationViewClass extends View {
  _parentElement = document.querySelector('.pagination')
  currentPage;

  // Listen the click and get the buttons
  addHandlerPagination(handler) {
    document.body.addEventListener('click', e => {

      if (e.target.closest('.pagination__btn--prev') || e.target.closest('.pagination__btn--next')) handler(e)

    })
  }

  // Generate the markup of the pagination
  _generateMarkup() {
    const markup = `
      <button class="btn--inline pagination__btn--prev previus" data-go-to="${this.currentPage - 1}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this.currentPage - 1}</span>
      </button>
      <button class="btn--inline pagination__btn--next next" data-go-to="${this.currentPage + 1}">
        <span>Page ${this.currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `

    return markup
  }

  // Control the buttons
  viewBtn(conditionNext, conditionPrev) {
    const btnNext = this._parentElement.querySelector('.next')
    const btnPrevius = this._parentElement.querySelector('.previus')

    // Check the condition and hide or show the buttons
    conditionNext ? btnNext.classList.add('hidden') : btnNext.classList.remove('hidden')

    conditionPrev ? btnPrevius.classList.add('hidden') : btnPrevius.classList.remove('hidden')
  }
}
export const paginationView = new paginationViewClass()