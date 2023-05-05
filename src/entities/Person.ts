import _ from "lodash";

class Person {
  name: string;
  times: number;

  constructor(name: string, times: number) {
    this.name = name;
    this.times = times;
  }
}

export default Person;
