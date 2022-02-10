export class HistoricalAnswer {
    id: number;
    word: string;
    date: string;

    constructor(id: number, word: string, date: string) {
        this.id = id;
        this.word = word;
        this.date = date;
    }
}