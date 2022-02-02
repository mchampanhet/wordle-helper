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
  dictionary = Array.from(dictionary);
  stats = Array.from(<Array<wordStat>>statsJson);
  filteredStats = new Array<wordStat>();
  stringifiedStats = "";
  correctLetter1 = "";
  correctLetter2 = "";
  correctLetter3 = "";
  correctLetter4 = "";
  correctLetter5 = "";
  misplacedLetters1 = "";
  misplacedLetters2 = "";
  misplacedLetters3 = "";
  misplacedLetters4 = "";
  misplacedLetters5 = "";
  invalidLetters = "";
  
  

  public get correctLetters() {
    return [this.correctLetter1.toUpperCase(), this.correctLetter2.toUpperCase(), this.correctLetter3.toUpperCase(), this.correctLetter4.toUpperCase(), this.correctLetter5.toUpperCase()];
  }

  public get misplacedLetters() {
    return [this.misplacedLetters1.toUpperCase(), this.misplacedLetters2.toUpperCase(), this.misplacedLetters3.toUpperCase(), this.misplacedLetters4.toUpperCase(), this.misplacedLetters5.toUpperCase()];
  }

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
    this.stats.forEach(x => {x.word = x.word.toUpperCase()});
    this.filteredStats = this.stats.slice();
  }

  onFilter() {
    // this.filteredStats = this.stats.filter(x => 
    //   (this.correctLetter1 == "" || this.correctLetter1.toUpperCase() == x.word.split('')[0])
    //   && (this.correctLetter2 == "" || this.correctLetter2.toUpperCase() == x.word.split('')[1])
    //   && (this.correctLetter3 == "" || this.correctLetter3.toUpperCase() == x.word.split('')[2])
    //   && (this.correctLetter4 == "" || this.correctLetter4.toUpperCase() == x.word.split('')[3])
    //   && (this.correctLetter5 == "" || this.correctLetter5.toUpperCase() == x.word.split('')[4])
    //   && this.invalidLetters.toUpperCase().split('').every(i => !x.word.includes(i)));

    this.filteredStats = this.stats.filter(stat => {

      var word = stat.word;
      var wordLetters = stat.word.toUpperCase().split('');
      var includesInvalidLetters = wordLetters.some(x => this.invalidLetters.includes(x));
      
      if (includesInvalidLetters) return false;

      var includesAllCorrectLetters = wordLetters.every((letter, index) => {
        if (this.correctLetters[index] == '') return true;

        return letter.toUpperCase() == this.correctLetters[index].toUpperCase();
      });

      if (!includesAllCorrectLetters) return false;

      var includesMisplacedLetterInWrongPlace = this.misplacedLetters.some((misplacedString, index) => misplacedString.includes(wordLetters[index]));

      if (includesMisplacedLetterInWrongPlace) return false;

      var includesMisplacedLettersInOtherPlace = true;

      return includesMisplacedLettersInOtherPlace;

      var includesMisplacedLetters = this.misplacedLetters.every((misplacedString, index) => {
        return !misplacedString.includes(wordLetters[index]) && wordLetters.filter((wordLetter, wordLetterIndex) => wordLetterIndex != index)
        .every(wordLetter => misplacedString.includes(wordLetter));
      });

      return includesMisplacedLetters;

      
      // if (!this.incorrectLetters.every(letters => {
      //   return letters.split('').every(letter => stat.word.includes(letter));
      // })) {
      //   return false;
      // }

      // if (wordLetters.every((letter, index) => {
      //   if (this.correctLetters[index] !== "") {
      //     return letter.toUpperCase() == this.correctLetters[index].toUpperCase();
      //   }

      //   var incorrectIndex = this.incorrectLetters.findIndex(x => x == letter);
      //   if (incorrectIndex == -1) {
      //     return false;
      //   }

      //   return incorrectIndex != index;

      // })
    });
  }

  log(event:any) {
    console.log(event);
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