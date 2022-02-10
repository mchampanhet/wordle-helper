export class stat {
  letter: string;
  index: number;
  frequency: number;

  constructor(letter = "", index = 0, frequency = 0) {
    this.letter = letter;
    this.index = index;
    this.frequency = frequency;
  }
}
