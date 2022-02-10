import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseReference, getDatabase } from 'firebase/database';
import { child, Database, get, onValue, ref } from '@angular/fire/database';
import { HistoricalAnswer } from './models/historicalAnswer';

@Injectable()
export class FirebaseService {
    public pastAnswers: HistoricalAnswer[] = [];
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://najemi.cz'
        })
    }

    private firebaseDb: DatabaseReference;


    constructor(private httpClient: HttpClient) {
        this.firebaseDb = ref(getDatabase());
        get(child(this.firebaseDb, 'pastAnswers')).then(x => {
            if (x.exists()) {
                this.pastAnswers = x.val();
            }
        }).catch(error => console.error(error));
    }

    GetTodaysAnswer() {
        return this.httpClient.get('https://najemi.cz/wordle_answers/api/?today', this.httpOptions);
    }

    GetPastAnswers() {
        
    }
}