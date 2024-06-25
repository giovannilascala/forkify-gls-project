
import View from './View.js'
import icons from '../../img/icons.svg' //Parcel 2


class searchViewClass extends View {

  _parentElement = document.querySelector('.search')

  // Listen the submit
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('.search__btn')) handler(e)
    })
  }

  // Clear the input
  clearInput() {
    this._parentElement.querySelector('.search__field').value = ''
  }

  // Get the query
  getQuery() {
    return this._parentElement.querySelector('.search__field').value
  }
}

export const searchView = new searchViewClass()