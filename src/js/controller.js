// import icons from '../img/icons.svg' //Parcel 1
// import icons from 'url:../img/icons.svg' //Parcel 2

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js'
import { recipeView } from './views/recipeView.js'
import { searchView } from './views/searchView.js'
import { resultsView } from './views/resultsView.js'
import { paginationView } from './views/paginationView.js'
import { bookmarksView } from './views/bookmarksView.js'
import { addRecipeView } from './views/addRecipeView.js'

import { ITEM_PER_PAGE } from './config.js'

import * as helpers from './helpers.js'
import { MODAL_CLOSE_SEC } from './config.js'
// if (module.hot) module.hot.accept()


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return;

    // 1. Display spinner
    recipeView.renderSpinner()

    // 2. Loading recepies 
    await model.loadRecipe(id) // async function that return a promise

    // 3. Display recipe, servings and the bookmarks
    recipeView.render(model.state.recipe)

    // 4. Reset the servings
    recipeView.servings = 4

    // 5. Update the recipe
    recipeView.update(model.state.recipe)

    // 6. Update the results and the bookmark for the active recipe
    if (model.state.bookmarks.length !== 0) bookmarksView.update(model.state.bookmarks)

    if (model.state.search.results.length !== 0) resultsView.update(resultsView.paginatedItems)

  } catch (err) {
    recipeView.renderError(err.message)
    console.error(err.message)
  }
}

const controlResults = async function (e) {
  try {
    // 1.Prevent the event
    e?.preventDefault()

    // 1.1 clear the pagination container
    paginationView.clear()

    // 2. Render the spinner
    resultsView.renderSpinner()

    // 3. Catch the input value
    const searched = searchView.getQuery()
    if (!searched) throw new Error('Please write some recive')

    // 4. Pass it into model.load()
    await model.loadResults(searched)

    // 5. Set the current page at 1
    model.state.search.currentPage = 1
    paginationView.currentPage = model.state.search.currentPage

    // 6. Render 10 results per page
    const resultsPerPage = showPage(model.state.search.currentPage, model.state.search.results)
    resultsView.render(resultsPerPage)

    // 7. Reset the servings
    recipeView.servings = 4

  } catch (err) {
    recipeView.renderError()
    console.error(err)
  } finally {
    // 8. Reset the value of the input
    searchView.clearInput()
  }
}

const showPage = function (page, items) {
  // 0. Set the paginated items
  let paginatedItems = []

  // 1. Calc the items of the page
  const start = (page - 1) * ITEM_PER_PAGE;
  const end = page * ITEM_PER_PAGE;

  // 2. Divide the results array
  paginatedItems = items.slice(start, end);

  // 3. Set the current page into the VIEW and into the MODEL
  paginationView.currentPage = model.state.search.currentPage

  // 4. Render the pagination (true to avoid the guard)
  paginationView.render(true)

  // 5. Define the condition to control the buttons
  paginationView.viewBtn(
    paginationView.currentPage === model.state.search.totalPage,
    model.state.search.currentPage === 1
  );

  resultsView.paginatedItems = paginatedItems
  return paginatedItems
}

const controlPage = function (e) {
  // 0. Prevent the event
  e.preventDefault()

  // 1. Guard: currentPage NOT between 1 and the LAST page
  if (!(helpers.getTotalPages(model.state.search.results) > model.state.search.currentPage || model.state.search.currentPage > 1)) return;

  // 2. Update the number of the page and the current page
  const { goTo } = e.target.closest('button').dataset
  model.state.search.currentPage = +goTo
  paginationView.currentPage = model.state.search.currentPage

  // 3. Show the result per page and render them
  const resultsPerPage = showPage(model.state.search.currentPage, model.state.search.results)
  resultsView.render(resultsPerPage);
}

// Set the new quantity per servings
const setNewQuantity = function (recipe, newServings) {
  recipe.ingredients.forEach(ing => ing.quantity = (ing?.quantity * newServings) / recipeView.servings);
}

const controlServings = function (e, newServings) {
  // 1. Guard: previus servings = 0
  if (newServings === 0) return

  // 2. Increment or decrement the servings
  setNewQuantity(model.state.recipe, newServings);

  // 3. Set the new servings into the VIEW
  recipeView.servings = newServings

  // 4. Update the recipe with the new quantities and the new serving
  recipeView.update(model.state.recipe);
}


const controlBookmarks = function () {
  const recipe = model.state.recipe

  // 1. Find index of the bookmark
  const indexBookmark = model.state.bookmarks?.findIndex(bookmark => bookmark.id === recipe.id)

  // 2.1 Check if is bookmarked
  if (indexBookmark === -1) {

    // Set the isBookmarked property to true
    recipe.isBookmarked = true;

    // Push it into the model.state.bookmarks array
    model.state.bookmarks.push(recipe);
  }

  // 2.2 Chek if !isBookmarked
  if (indexBookmark !== -1) {

    // Set isBookmarked to false
    recipe.isBookmarked = false;


    // Remove the bookmark from the array
    model.state.bookmarks.splice(indexBookmark, 1);
  }

  // 3. Update bookmarks in the model
  model.setBookmark();

  // 4. Render the bookmarks
  bookmarksView.render(model.state.bookmarks)

  // 5. Update the bookmarks into the VIEW 
  recipeView.update(model.state.recipe)
  bookmarksView.update(model.state.bookmarks)
}

// Onload render the bookmarks from the local storage 
const loadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // 1.1 Render Spinner
    addRecipeView.renderSpinner()

    // 1. Creating the object
    await model.uploadRecipe(newRecipe)

    // 2. Render the success message
    addRecipeView.renderError(addRecipeView.message, 'message')

    // 3. Render the uploaded recipe and store it in the bookmarks
    bookmarksView.render(model.state.bookmarks)
    recipeView.render(model.state.recipe)

    // 4. Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // 5. Close Window upload
    setTimeout(() => {
      if (addRecipeView.checkCloseWindow()) return;
      addRecipeView.controlClassList()
    }, MODAL_CLOSE_SEC * 1000)

    // 6. Update the active bookmark
    bookmarksView.update(model.state.bookmarks)
    // controlResults()
    console.log(model.state.search.results);

    // 7. Save the bookmarks in the local storage
    model.setBookmark()
  } catch (err) {
    addRecipeView.renderError(err.message)
    console.error(err)
  }
}

const init = function () {
  // Onload render the recipe
  recipeView.addHandlerRender(controlRecipes)

  // Onclick update the quantities and the servings
  recipeView.addHandlerServings(controlServings)

  // Onsubmit calc and render the results and the pagination
  searchView.addHandlerSearch(controlResults)
  paginationView.addHandlerPagination(controlPage)

  // Onload render the bookmarks from the localstorage
  bookmarksView.addHandlerLoad(loadBookmarks)

  // On click render the bookmarks
  bookmarksView.addHandlerBookmarks(controlBookmarks)

  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()


