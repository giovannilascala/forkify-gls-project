import View from './View'

class addRecipeViewClass extends View {

  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')

  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _btnClose = document.querySelector('.btn--close-modal')

  message = 'Recipe uploaded!'

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerHideWindow()
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.controlClassList.bind(this))
  }

  _addHandlerHideWindow() {
    this._overlay.addEventListener('click', this.controlClassList.bind(this))
    this._btnClose.addEventListener('click', this.controlClassList.bind(this))
  }

  controlClassList() {
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }

  checkCloseWindow() {
    return this._overlay.classList.contains('hidden') || this._window.classList.contains('hidden')
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // 0. Prevent the event
      e.preventDefault()

      // 1. Export the data of the form into an array of ENTRIES
      const dataArr = [...new FormData(this)]

      // 2. Create the object from the array of the entries
      const data = Object.fromEntries(dataArr)

      // 3. Control the newRecipe
      handler(data)
    })
  }
}



export const addRecipeView = new addRecipeViewClass()
