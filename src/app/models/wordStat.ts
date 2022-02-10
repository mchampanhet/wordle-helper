import { stat } from "./stat";

export class wordStat {
  word: string;
  stats: stat[];
  totalScore: number;

  constructor(word = "", stats = new Array<stat>(), totalScore = 0) {
    this.word = word;
    this.stats = stats;
    this.totalScore = totalScore;
  }
}
