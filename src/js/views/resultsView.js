import View from './View.js'
import PreviewView from './previewView.js'
import icons from '../../img/icons.svg' //Parcel 2


class resultsViewClass extends View {

  _parentElement = document.querySelector('.results')
  paginatedItems
  _errorMessage = 'No recipes found for your query! Please try again ;)'
  _message = ''

  _generateMarkup() {
    return PreviewView.generateMarkup(this._data)
  }
}

export const resultsView = new resultsViewClass()