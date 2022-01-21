// import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';

if (module.hot) module.hot.accept();
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
    resultsView.renderSpinner();
    // 1. Get Search Query
    const query = searchView.getQuery();

    if (!query) return;

    // 2. Load Search Results
    await model.loadSearchResults(query);

    // 3. Render Search Results
    resultsView.render(model.state.search.results);
  } catch (err) {
    resultsView.renderError();
  }
};

//Subscribing to the Publisher
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
