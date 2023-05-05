import Person from "./Person";
import _ from "lodash";

class TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
  person: Person | null;

  constructor() {
    this.children = new Map();
    this.isWord = false;
    this.person = null;
  }
}

class TreePerson {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insertPerson(person: Person) {
    let current: TrieNode = this.root;

    for (let i = 0; i < person.name.length; i++) {
      const char = _.toLower(person.name[i]);
      let node = current.children.get(char);
      if (!node) {
        node = new TrieNode();
        current.children.set(char, node);
      }
      current = node;
    }
    current.isWord = true;
    current.person = person;
  }

  searchWords(prefix: string, numberOfWords: number) {
    const wordsLimited: Person[] = [];
    const words: Map<string, Person> = new Map();

    let current: TrieNode | null = this.searchNode(_.toLower(prefix));

    if (!current) return [];

    this.addWords(words, current);

    if (words.get(prefix)) {
      wordsLimited.push(words.get(prefix) as Person);
      words.delete(_.toLower(prefix));
    }

    const numberOfItemMatch = wordsLimited.length;
    for (let i = 0; i < numberOfWords - numberOfItemMatch; i++) {
      let auxWords = [...words].map(([, value]) => ({ ...value }));
      const maxPopularity = _.maxBy(auxWords, "times") as Person;

      if (!maxPopularity) continue;

      wordsLimited.push(maxPopularity);
      words.delete(_.toLower(maxPopularity.name));
    }

    return wordsLimited;
  }

  private addWords(words: Map<string, Person>, current: TrieNode) {
    if (!current) return;

    if (current.isWord && current.person) {
      words.set(_.toLower(current.person.name), current.person);
    }

    current.children.forEach((node) => this.addWords(words, node));
  }

  searchNode(prefix: string, node?: TrieNode): TrieNode | null {
    let current: TrieNode = this.root;
    if (node) current = node;

    if (!prefix) return current;

    if (!current.children.get(prefix[0])) return null;

    return this.searchNode(
      prefix.substring(1),
      current.children.get(prefix[0])
    );
  }

  addPopularity(name: string) {
    const node = this.searchNode(_.toLower(name));

    if (!node || !node.person) return null;

    if (node.person) node.person.times++;

    return node.person;
  }
}

export default TreePerson;
