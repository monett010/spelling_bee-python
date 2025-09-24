class Game {
    constructor (game_num) {
        this.game_num = game_num;
        this.game_url = "http://127.0.0.1:5000/";
    }
    // generic function to fetch data from the API
    // if there is no response_type given, it defaults to return json
    // if response_type is 'text', then it returns text
    async fetchData (endpoint_url, response_type=''){
        const response = await fetch(endpoint_url);

        if (response_type === '' || response_type === 'json'){
            const json = await response.json();
            return json;
        } else {
            if (response_type === 'text') {
                const text = await response.text();
                return text;
            }
        }

    }
    async getPoints () {
        let points_endpoint = this.game_url + "points/" + this.game_num;
        let points = await this.fetchData(points_endpoint, 'text');
        return points; 
    }

    async getLetters () {
        const letters_endpoint = this.game_url + "letters/" + this.game_num;
        const letters = await this.fetchData(letters_endpoint);
        return letters; 
    
    }

    async getAnswers () {
        const answers_endpoint = this.game_url + "answers/" + this.game_num;
        const answers = await this.fetchData(answers_endpoint);
        return answers; 
    }
}

class Word {
    constructor (word, gamenum){
        this.word = word;
        this.gamenum = gamenum;
    }

    // boolean that returns true if the answers array has the word in it, 
    // false if it doesn't
    async isAnswer () {
        const g = new Game(this.gamenum);
        const game_answers = await g.getAnswers();
        return game_answers.includes(this.word);
    }

    // returns the number of letters in the word
    wordLength () {
        return this.word.length;
    }

    // returns true if the word is a pangram
    async isPangram () {
        const g = new Game(this.gamenum);
        const letters_ = await g.getLetters();
        const word_ = this.word.toUpperCase();

        const letters = new Set(letters_);
        const word = new Set(word_);

        let intersection = letters.intersection(word);

        if (await this.isAnswer() === true && intersection.size === 7) {  
            return true;
        } else {
            return false;
        }
    }

    async calculatePoints () {

        // if the word is 4 letters, return 1 point
        if (this.wordLength() === 4 && await this.isAnswer()) {
            return 1;
        }
        // if the word is a pangram, return word length + 7
        else if (this.wordLength() > 4 && await this.isPangram() && await this.isAnswer()) {
            return this.wordLength() + 7;
        }
        // if the word is greater than 4 letters but not a pangram,
        // return word length
        else if (this.wordLength() > 4 && await this.isPangram() === false && await this.isAnswer()) {
            return this.wordLength();
        }
        //if the word is less than 4 letters or not an answer, return 0
        else {
            return 0;
        }
    }

    // checks if the word has already been accepted as an answer
    alreadyAdded (added_words) {
        return added_words.includes(this.word)
    }
}