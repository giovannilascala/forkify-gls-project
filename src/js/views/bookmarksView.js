import PreviewView from './previewView.js'
import icons from '../../img/icons.svg' //Parcel 2
import View from './View.js'


class bookmarksViewClass extends View {

  _parentElement = document.querySelector('.bookmarks__list')
  _bookmarkBtn;
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)'
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)'


  addHandlerBookmarks(handler) {
    document.body.addEventListener('click', e => {
      this._bookmarkBtn = e.target.closest('.bookmark-button')
      if (this._bookmarkBtn) handler()
    })
  }

  // Onload render the bookmarks
  addHandlerLoad(handler) {
    window.addEventListener('load', () => handler())
  }

  _generateMarkup() {
    return PreviewView.generateMarkup(this._data)
  }
}

export const bookmarksView = new bookmarksViewClass()