import { Component, OnInit } from '@angular/core';
import * as dictionary from './dictionary.json';
import { invalidLetter } from './models/invalidLetter';
import { stat } from './models/stat';
import * as statsJson from './stats.json';
import { wordStat } from './models/wordStat';
import { FirebaseService } from './firebase.service';
import * as historyJson from './Untitled-1.json';
import { HistoricalAnswer } from './models/historicalAnswer';

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
  correctLetters = ["", "", "", "", ""];
  misplacedLetters: string[][] = [[],[],[],[],[]];
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
  historyStats = new Array<HistoricalAnswer>();

  public get invalidLetters() {
    var invalidLetters = new Array<string>();
    this.invalidLettersArray.forEach(row => row.forEach(letter => {
      if (letter.isInvalid) invalidLetters.push(letter.letter);
    }))
    return invalidLetters;
  }

  constructor(private firebaseService: FirebaseService) {}

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
    // this.firebaseService.GetTodaysAnswer().subscribe(data => console.log(data));
    this.historyStats = Array.from(<Array<HistoricalAnswer>>historyJson);
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
      
      // make sure word contains all validated letters
      var includesAllCorrectLetters = wordLetters.every((letter, index) => {
        if (this.correctLetters[index] == '') return true;
        var isValid = letter == this.correctLetters[index];
        if (isValid) indexesNeedingValidation = indexesNeedingValidation.filter(x => x !== index);
        return isValid;
      });

      if (!includesAllCorrectLetters) return false;

      // make sure remaining slots don't contain any invalid letters
      // unless it's a double-letter scenario where one is misplaced and the other is invalid
      var includesInvalidLetters = wordLetters.filter((x, index) => indexesNeedingValidation.includes(index)).some(x => this.invalidLetters.includes(x));
      if (includesInvalidLetters) return false;

      // var includesMisplacedLetterInWrongPlace = this.misplacedLetters
      //   // filter out indexes that have already been validated with correct letters and empty misplaced letter strings
      //   .filter((x, i) => indexesNeedingValidation.includes(i) && x.length > 0)
      //   .some((letters, index) => letters.some(letter => letter == wordLetters[index]));
      
      var includesMisplacedLetterInWrongPlace = this.misplacedLetters
        .some((letters, letterIndex) => {
          if (!indexesNeedingValidation.includes(letterIndex) || letters.length == 0) return false;
          return letters.some(letter => letter == wordLetters[letterIndex]);
        });

      
      if (includesMisplacedLetterInWrongPlace) return false;

      //TODO: something is wrong in here
      var includesMisplacedLettersInOtherPlace = this.misplacedLetters
        .every((letters, index) => {
          var wordLettersExceptValidOnesAndCurrentIndex = wordLetters
            .filter((letter, letterIndex) => indexesNeedingValidation.includes(letterIndex) && letterIndex !== index);
          return letters.every(letter => wordLettersExceptValidOnesAndCurrentIndex.includes(letter));
        });

      return includesMisplacedLettersInOtherPlace;
    });
  }

  logMisplacedLetter(event: string[], index: number) {
    this.misplacedLetters[index] = event.map(x => x.toUpperCase());
  }

  log(event:any) {
    console.log(event);
  }

  getHistoryForWord(word: string) {
    var answers = this.historyStats.filter(x => x.word == word);
    if (answers.length == 0) return "";
    return answers[0].date;
  }

}