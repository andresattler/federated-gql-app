var __defineProperty = Object.defineProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};
__export(exports, {
  default: () => JsonPlaceHolderAPI
});
const {RESTDataSource} = require("apollo-datasource-rest");
class JsonPlaceHolderAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://jsonplaceholder.typicode.com";
  }
  async getMovie(id) {
    return this.get(`todos/${id}`);
  }
}
