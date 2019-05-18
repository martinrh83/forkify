import Search from './models/Search';
import Recipe from './models/Recipe';
import List from  './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView'
import {elements, renderLoader, clearLoader} from './views/base';


/*Global state of the app*/ 
const state = {};

const controlSearch  = async () => {
  const query = searchView.getInput();
  if (query) {
    state.search = new Search(query);
    
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert(error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e=>{
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
//backtick: AltGr + } + space
//avoid cors: crossorigin.me

//RECIPE CONTROLLER
const controlRecipe = async () => {
  //get id from url
  const id = window.location.hash.replace('#', '');
  if(id){
    // prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if(state.search) searchView.highlightSelected(id);

    //create new recipe object
    state.recipe = new Recipe(id);
    try {
      //get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(error);
    }
    
  }
}

//window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//list controller
const controlList = () => {
  //create a new list if there is none yet
  if (!state.list) state.list = new Likes();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach( el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  if(!state.likes.isLiked(currentID)){
    //add like to the state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    //toggle the like button

    //add like to UIlist
    console.log(state.likes);
  }else{
    //remove like from the state
    state.likes.deleteLike(currentID);
    //remove like from UI list
  }
}
//handle delete and update list item
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //bundle the delete button
  if(e.target.matches('.shopping_delete, .shopping__delete *')){
    //delete from state
    state.list.deleteItem(id);
    //delete from UI
    listView.deleteItem(id);
    //handle the count update
  }else if(e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  }else if (e.target.matches('.btn-increase, .btn-increase *')){
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }else if(e.target.matches('.recipe__love, .recipe__love *')){
    controlLike();
  }
});

const l = new List();
