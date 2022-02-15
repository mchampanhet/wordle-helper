import { Component, OnInit } from '@angular/core';
import * as dictionary from './dictionary.json';
import { invalidLetter } from './models/invalidLetter';
import { stat } from './models/stat';
import * as statsJson from './stats.json';
import { wordStat } from './models/wordStat';
import { FirebaseService } from './firebase.service';
import * as historyJson from './Untitled-1.json';
import { HistoricalAnswer } from './models/historicalAnswer';
import { Subscription } from 'rxjs';

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
  historyStatsSub: Subscription;
  historyStats = new Array<HistoricalAnswer>();

  public get invalidLetters() {
    var invalidLetters = new Array<string>();
    this.invalidLettersArray.forEach(row => row.forEach(letter => {
      if (letter.isInvalid) invalidLetters.push(letter.letter);
    }))
    return invalidLetters;
  }

  constructor(private firebaseService: FirebaseService) {
    this.historyStatsSub = this.firebaseService.pastAnswers.subscribe(x => {
      this.historyStats = x;
    });
    this.firebaseService.GetPastAnswers();
    
    
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
      var wordIsPossible = true;

      wordLetters.forEach((letter, index) => {
        // if we've already disqualified the word, 
        // don't bother doing any more checks
        if (!wordIsPossible) {
          return;
        }

        // if there is a known correct letter in this position,
        // run a check
        if (!!this.correctLetters[index]) {
          
          // if letter isn't correct, the word is disqualified
          if (letter != this.correctLetters[index]) {
            wordIsPossible = false;
            return;
          }

          // if letter is correct, word isn't disqualified yet
          // move on to checking next letter
          if (letter == this.correctLetters[index]) {
            return;
          }
        }

        // check if letter isn't disqualified by misplaced
        // letters for this index
        if (this.misplacedLetters[index].includes(letter)) {
          wordIsPossible = false;
          return;
        }

        // if letter is known invalid, word doesn't qualify
        if (this.invalidLetters.includes(letter)) {
          wordIsPossible = false;
          return;
        }
      });

      // make sure word includes all misplaced letters
      // but not in the known incorrect position
      this.misplacedLetters.forEach((misplacedLetters, misplacedIndex) => {
        if (!wordIsPossible) {
          return;
        }

        misplacedLetters.forEach(misplacedLetter => {
          if (!wordLetters.filter((x,i) => i != misplacedIndex).includes(misplacedLetter)) {
            wordIsPossible = false;
            return;
          }
        });
      });

      return wordIsPossible;
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