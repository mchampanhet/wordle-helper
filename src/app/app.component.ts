import { Component, OnInit } from '@angular/core';
import * as dictionary from './dictionary.json';
import * as statsJson from './stats.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wordle-analytics';
  dictionary = Array.from(dictionary).map(x => x.toUpperCase());
  stats = Array.from(<Array<wordStat>>statsJson);
  correctLetter1 = "";
  correctLetter2 = "";
  correctLetter3 = "";
  correctLetter4 = "";
  correctLetter5 = "";
  validLetters = new Array<string>();
  invalidLetters = "";
  stringifiedStats = "";
  filteredStats = new Array<wordStat>();

  ngOnInit(): void {
    if (this.stats.length == 0) {
      this.dictionary.forEach(word => {
        var wordStats = new Array<stat>();
        word.split('').forEach((letter, index) => {
          var wordsWithLetterInPosition = this.dictionary.filter(x => x.split('')[index] == letter);
          wordStats.push(new stat(letter, index, wordsWithLetterInPosition.length/this.dictionary.length));
        });
        var score = wordStats.map(x => x.frequency).reduce((p, c) => p + c);
        this.stats.push(new wordStat(word, wordStats, score));
      });
      this.stats.sort((a, b) => b.totalScore - a.totalScore);
      this.stringifiedStats = JSON.stringify(this.stats);
    }
    this.filteredStats = this.stats.slice();
  }

  onFilter() {
    this.filteredStats = this.stats.filter(x => 
      (this.correctLetter1 == "" || this.correctLetter1.toUpperCase() == x.word.split('')[0])
      && (this.correctLetter2 == "" || this.correctLetter2.toUpperCase() == x.word.split('')[1])
      && (this.correctLetter3 == "" || this.correctLetter3.toUpperCase() == x.word.split('')[2])
      && (this.correctLetter4 == "" || this.correctLetter4.toUpperCase() == x.word.split('')[3])
      && (this.correctLetter5 == "" || this.correctLetter5.toUpperCase() == x.word.split('')[4])
      && this.invalidLetters.toUpperCase().split('').every(i => !x.word.includes(i)));
  }

}
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