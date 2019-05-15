import axios from 'axios';
import {proxy, APIKEY, URLSearch} from '../config'

export default class Search {
  constructor(query){
    this.query = query;
  }

  async getResults(){
    try {
      const res = await axios(`${proxy}${URLSearch}?key=${APIKEY}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(res);
    } catch (error) {
      alert(error);
    }
    
  }
}




