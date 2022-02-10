export class invalidLetter {
  letter: string;
  isInvalid: boolean;

  constructor(letter = "", isInvalid = false) {
    this.letter = letter;
    this.isInvalid = isInvalid;
  }
}
