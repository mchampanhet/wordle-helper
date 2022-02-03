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
  invalidLettersArray = [
    [
      new invalidLetter('Q'),
      new invalidLetter('W'),
      new invalidLetter('E'),
      new invalidLetter('R'),
      new invalidLetter('T'),
      new invalidLetter('Y'),
      new invalidLetter('U'),
      new invalidLetter('I'),
      new invalidLetter('O'),
      new invalidLetter('P')
    ],
    [
      new invalidLetter('A'),
      new invalidLetter('S'),
      new invalidLetter('D'),
      new invalidLetter('F'),
      new invalidLetter('G'),
      new invalidLetter('H'),
      new invalidLetter('J'),
      new invalidLetter('K'),
      new invalidLetter('L')
    ],
    [
      new invalidLetter('Z'),
      new invalidLetter('X'),
      new invalidLetter('C'),
      new invalidLetter('V'),
      new invalidLetter('B'),
      new invalidLetter('N'),
      new invalidLetter('M')
    ]
  ];
  
  

  public get correctLetters() {
    return [this.correctLetter1.toUpperCase(), this.correctLetter2.toUpperCase(), this.correctLetter3.toUpperCase(), this.correctLetter4.toUpperCase(), this.correctLetter5.toUpperCase()];
  }

  public get misplacedLetters() {
    return [this.misplacedLetters1.toUpperCase(), this.misplacedLetters2.toUpperCase(), this.misplacedLetters3.toUpperCase(), this.misplacedLetters4.toUpperCase(), this.misplacedLetters5.toUpperCase()];
  }

  public get invalidLetters() {
    var invalidLetters = new Array<string>();
    this.invalidLettersArray.forEach(row => row.forEach(letter => {
      if (letter.isInvalid) invalidLetters.push(letter.letter);
    }))
    return invalidLetters;
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

  onToggleInvalidKey(event: any, rowIndex: number, letterIndex: number) {
    console.log(event);
    this.invalidLettersArray[rowIndex][letterIndex].isInvalid = event.checked;
    this.onFilter();
  }

  onFilter() {
    this.filteredStats = this.stats.filter(stat => {

      var word = stat.word;
      var wordLetters = word.toUpperCase().split('');
      var indexesNeedingValidation = [0,1,2,3,4];
      
      var includesAllCorrectLetters = wordLetters.every((letter, index) => {
        if (this.correctLetters[index] == '') return true;
        var isValid = letter == this.correctLetters[index];
        if (isValid) indexesNeedingValidation = indexesNeedingValidation.filter(x => x !== index);
        return isValid;
      });

      if (!includesAllCorrectLetters) return false;

      var includesInvalidLetters = wordLetters.filter((x, index) => indexesNeedingValidation.includes(index)).some(x => this.invalidLetters.includes(x));
      if (includesInvalidLetters) return false;

      var includesMisplacedLetterInWrongPlace = this.misplacedLetters
        // filter out indexes that have already been validated with correct letters and empty misplaced letter strings
        .filter((x, index) => indexesNeedingValidation.includes(index) && !!x)
        .some((misplacedString, index) => misplacedString.includes(wordLetters[index]));
      
      if (includesMisplacedLetterInWrongPlace) return false;

      var includesMisplacedLettersInOtherPlace = this.misplacedLetters
        .filter(x => !!x)
        .every((misplacedString, misplacedStringIndex) => {
          var wordLettersExceptValidOnesAndCurrentIndex = wordLetters.filter((letter, letterIndex) => indexesNeedingValidation.includes(letterIndex) && letterIndex !== misplacedStringIndex);
          return misplacedString.split('').every(letter => wordLettersExceptValidOnesAndCurrentIndex.includes(letter));
        });

      return includesMisplacedLettersInOtherPlace;
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

export class invalidLetter {
  letter: string;
  isInvalid: boolean;

  constructor(letter = "", isInvalid = false) {
    this.letter = letter;
    this.isInvalid = isInvalid;
  }
}