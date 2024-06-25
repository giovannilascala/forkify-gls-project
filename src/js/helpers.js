import { TIMEOUT_SEC } from './config.js'
import { recipeView } from './views/recipeView.js'
import { ITEM_PER_PAGE } from './config.js';


const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long!`));
    }, s * 1000);
  });
};


const controlJSON = async function (url, uploadRecipe = undefined) {
  try {

    const fetchPro = uploadRecipe ?
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadRecipe)
      }) :
      fetch(url)


    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
    const data = await res.json()

    if (!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data
  } catch (err) {
    throw err
  }
}



const formatData = function (data) {
  const newData = {
    cookingTime: data.cooking_time,
    image: data.image_url,
    sourceUrl: data.source_url,
    ...(data.key && { key: data.key }),
    ...data
  }
  delete newData.cooking_time
  delete newData.image_url
  delete newData.source_url

  return newData
}

const formatResultSearch = function (data) {
  const newData = {
    ...formatData(data),
    ...(data.key && { key: data.key }),
  }
  delete newData.sourceUrl
  delete newData.cookingTime

  return newData
}

const getTotalPages = function (items) {
  const totalPages = Math.ceil(items.length / ITEM_PER_PAGE);
  recipeView.totalPage = totalPages
  return totalPages
}



export { getJSON, controlJSON, formatData, formatResultSearch, getTotalPages };