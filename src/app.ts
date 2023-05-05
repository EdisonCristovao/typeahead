import express, { Express, json, Request, Response } from "express";
import TypeAheadController from "./controler/typeahead";
import TreePerson from "./entities/Trier";
import names from "../names.json";
import Person from "./entities/Person";

class App {
  _app: Express;
  _indexer: TreePerson;

  constructor() {
    this._app = express();
    this._indexer = new TreePerson();

    console.log("Init System");
    this.init();
  }

  init() {
    this.startIndexer();
    this.startMiddlaware();
    this.startRoute();
  }
  startMiddlaware() {
    this._app.use(json());
  }

  startIndexer() {
    const people = Object.entries(names).map<Person>(
      ([key, value]) => new Person(key, value)
    );

    people.forEach((person) => this._indexer.insertPerson(person));
  }

  startRoute() {
    this._app.use(new TypeAheadController(this._indexer).router);
  }
}

export default new App()._app;
