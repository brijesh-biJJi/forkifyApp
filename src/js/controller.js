// import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';

///////////////////////////////////////
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 1. Loading Recipe
    await model.loadRecipe(id);

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

//Subscriber
const controlSearchResults = async function () {
  try {
    // 1. Get Search Query
    const query = searchView.getQuery();

    if (!query) return;

    // 2. Load Search Results
    await model.loadSearchResults(query);

    // 3. Render Search Results
  } catch (err) {
    console.error(`${err}!`);
  }
};

//Subscribing to the Publisher
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
