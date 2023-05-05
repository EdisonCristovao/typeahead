import express, { Express, Request, Response, Router } from "express";
import _ from "lodash";
import TreePerson from "../entities/Trier";

class TypeAheadController {
  _indexer: TreePerson;
  router = Router();

  constructor(indexer: TreePerson) {
    this._indexer = indexer;
    this.init();
  }

  init() {
    this.router.get("/typeahead/:prefix?", this.getWordsByPrefix);
    this.router.post("/typeahead", this.addPopularity);
  }

  getWordsByPrefix = (req: Request, res: Response) => {
    const prefix = _.toLower(req.params.prefix);
    const people = this._indexer.searchWords(
      prefix,
      _.toNumber(process.env.SUGGESTION_NUMBER)
    );

    res.setHeader("Content-Type", "application/json");
    return res.send(people);
  };

  addPopularity = (req: Request, res: Response) => {
    const name = _.toLower(req.body.name);

    if (!name) return res.status(400).send();

    const person = this._indexer.addPopularity(name);

    if (!person) return res.status(400).send();

    res.setHeader("Content-Type", "application/json");
    return res.status(201).send(person);
  };
}

export default TypeAheadController;
