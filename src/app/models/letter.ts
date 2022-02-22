export class letter {
  letter: string;
  index: number;
  isInvalid: boolean;

  constructor(letter = "", index = 0, isInvalid = false) {
    this.letter = letter;
    this.index = index;
    this.isInvalid = isInvalid;
  }
}
