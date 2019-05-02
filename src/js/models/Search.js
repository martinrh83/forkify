import axios from 'axios';


export default class Search {
  constructor(query){
    this.query = query;
  }

  async getResults(){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const APIKEY = 'dc226cf232a098aa5cae62aeb59a2c3c';
    const URL = 'https://www.food2fork.com/api/search';
    try {
      const res = await axios(`${proxy}${URL}?key=${APIKEY}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
    
  }
}




