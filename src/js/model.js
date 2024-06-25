import { async } from 'regenerator-runtime'
import { API_URL, KEY } from './config'
import * as helper from './helpers'

export const state = {
  recipe: {},
  search: {
    currentPage: 1,
    totalPage: 0,
    results: []
  },
  bookmarks: []
}

export const loadRecipe = async function (id) {

  try {
    // 1. Fetch the recipe
    const data = await helper.controlJSON(`${API_URL}${id}?key=${KEY}`)
    console.log(data);

    // 2. Set the recipe in the state
    state.recipe = helper.formatData(data.data.recipe)

    // 3. Set the isBookmarked property
    state.recipe.isBookmarked = state.bookmarks.some(bookmatk => state.recipe.id === bookmatk.id)
  } catch (err) {
    throw err
  }
}

export const loadResults = async function (query) {
  try {
    // 1. Guard: is the query doesn't exist
    if (!query) throw new Error('Recive not found')

    // 2. Fetch the results of the search
    const data = await helper.controlJSON(`${API_URL}?search=${query}&key=${KEY}`)

    // 3. Check if there is any recipe
    if (data.results === 0) throw new Error('Recive not find')

    // 4. Format the results and set them into the state
    state.search.results = data.data.recipes.map(result => helper.formatResultSearch(result))

    // 5. Calc the total page for render the results
    state.search.totalPage = helper.getTotalPages(state.search.results)
  } catch (err) {
    throw err
  }
}

export const setBookmark = function () {
  // 1. Guard: if there isn't the recipe
  if (!state.recipe) return;

  // 2. Set the bookmark in the local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const init = function () {
  // 1. Take the bookmarks from the local storage
  const bkLocalStorage = JSON.parse(localStorage.getItem('bookmarks'));

  // 2. Guard: if there isn't any bookmarks
  if (!bkLocalStorage) return;

  // 3. Set the isBookmarked property to TRUE for the bookmarks
  bkLocalStorage.forEach(bookmark => bookmark.isBookmarked = true)

  // 4. Set the bookmarks into the state
  state.bookmarks = bkLocalStorage
}

export const uploadRecipe = async function (newRecipe) {
  try {
    // 1. Create the ingredients array
    const ingredients = Object
      .entries(newRecipe)
      .filter(([key, value]) => key.startsWith('ingredient') && value !== '')
      .map(([_, value]) => {
        // 1.1 Replace all the empty space and split the quantity, unit and description
        const ingArr = value
          .split(',')
          .map(el => el.trim())

        // 1.2 Destructure the values
        const [quantity, unit, description] = ingArr

        // 1.3 Guard: if the descrition DOESN'T exist throw error
        if (!description) throw new Error('Please enter the descriptions of the ingredients')

        // 1.4 return the ingredient object
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description
        }
      })

    // 2. Create the ORIGINAL data recipe (under_case)
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    // 3. Send the request 
    const request = await helper.controlJSON(`${API_URL}?key=${KEY}`, recipe)

    // 4. Set the new recipe with the correct format
    state.recipe = helper.formatData(request.data.recipe)

    // 5. Push it into the bookmarks array
    state.recipe.isBookmarked = true
    state.bookmarks.push(state.recipe)


  } catch (err) {
    throw err
  }
}

init()
