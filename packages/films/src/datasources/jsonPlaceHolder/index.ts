const { RESTDataSource } = require('apollo-datasource-rest');

export default class JsonPlaceHolderAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }

  async getMovie(id) {
    return this.get(`todos/${id}`);
  }

}
