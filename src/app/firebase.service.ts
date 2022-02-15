import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HistoricalAnswer } from './models/historicalAnswer';

@Injectable()
export class FirebaseService {
    public pastAnswers = new BehaviorSubject<HistoricalAnswer[]>(new Array<HistoricalAnswer>());

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://najemi.cz'
        })
    }

    private fireDbBaseUrl = 'https://wordle-helper-36eb4-default-rtdb.firebaseio.com/';
    private firstWordleDate = new Date('19 June 2021');


    constructor(private httpClient: HttpClient) {
    }

    GetTodaysAnswer() {
        return this.httpClient.get('https://najemi.cz/wordle_answers/api/?today', this.httpOptions);
    }

    GetPastAnswers() {
        this.httpClient.get(this.fireDbBaseUrl + 'pastAnswers.json').subscribe(data => {
            this.pastAnswers.next(<Array<HistoricalAnswer>>data);
            // var today = new Date();
            // var daysSinceStart = (today.getTime() - this.firstWordleDate.getTime()) / (1000 * 60 * 60 * 24);
            // console.log('daysSinceStart: ' + daysSinceStart);
            // console.log('pastAnswers.length: ' + this.pastAnswers.value.length);
            // if (Math.floor(daysSinceStart) > this.pastAnswers.value.length) {
            //     console.log('entered if');
            //     var index = this.pastAnswers.value.length;
            //     var startDate = new Date(this.firstWordleDate.toString());
            //     startDate.setDate(startDate.getDate() + index);
            //     console.log(startDate.toDateString());
            //     while (startDate <= today) {
            //         console.log('entered while');
            //         this.GetPastAnswer(startDate, index);
            //         startDate.setDate(startDate.getDate() + 1);
            //         index++;
            //     }
            // }
        });
    }

    private async GetPastAnswer(date: Date, index: number) {
        console.log('getting past answer');
        this.httpClient.get('https://najemi.cz/wordle_answers/api/?day=' + date.getDate() + '&month=' + (date.getMonth() + 1) + '&year=' + date.getFullYear()).subscribe(data => {
            this.PostAnswer(<HistoricalAnswer>{ id: index, word: data, date: date.toDateString().slice(4)})
        });
    }

    private async PostAnswer(historicalAnswer: HistoricalAnswer) {
        //this.httpClient.post(this.fireDbBaseUrl + 'pastAnswers.json', historicalAnswer).subscribe(response => console.log('added historical answer'));
        console.log(historicalAnswer);
    }
}