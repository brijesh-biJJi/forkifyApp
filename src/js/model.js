import { API_URL, RES_PER_PAGE } from './config';
import { getJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}/${id}`);

    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //Temp Error Handling
    console.error(`${err}!`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}!`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // (page - 1) * size
  const start = (page - 1) * state.search.resultsPerPage;
  // (page * size) - 1
  //If your are using "slice" then => (page * size), becoz slice emit the last value
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  // newQty = oldQty * newServing / oldServing // 2 * 8 / 4 => 4
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark current Recipe as Bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  state.bookmarks.splice(index, 1);

  // Mark current Recipe as NOT Bookmarked
  if (state.recipe.id === id) state.recipe.bookmarked = false;
};
