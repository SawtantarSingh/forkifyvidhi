import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0 Update Result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //  1) Updating bookmarks recipe
    bookmarkView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
// controlRecipe();

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get Search  Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search
    await model.loadSearchResults(query);

    //3) Render Results

    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) Render New Results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW  pagination buttons
  paginationView.render(model.state.search);
  console.log('Clicked:' + goToPage);
};

const controlServings = function (newServings) {
  // Update the Recipe servings (in state)

  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //  1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);

  //  2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipie = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarks
    bookmarkView.render(model.state.bookmarks);

    // Change ID In URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥' + err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipie);
};
init();
