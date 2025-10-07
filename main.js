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
        const letters_array = await g.getLetters();
        const word_array = this.word.toUpperCase(); // make sure the letters are uppercase, just like the letters in the letters_ array

        const letters = new Set(letters_array);
        const word = new Set(word_array);

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

class GameGUI {
    constructor (gamenum) {
        this.g = new Game(gamenum);
        this.gs = new GameStorage(gamenum);
        this.gamenum = gamenum;
    }

    async writeLetterButtons () {
        const letters = await this.g.getLetters();
        const button_div = document.getElementById("letters");

        for (let l in letters){
            const button = `<button type="button" id="${letters[l]}" class="letter" aria-label="${letters[l]}_button">${letters[l]}</button>` 
            button_div.innerHTML += button;
        }
    }

    addLettersToTextBox (letter) {
        const test_box = document.getElementById("current_word");
        test_box.value = test_box.value + letter.toLowerCase();
    }

    addEventListenersToLetterButtons () {
        const buttons = document.getElementsByClassName("letter");
            for (let b=0; b < buttons.length; b++) {
                buttons[b].addEventListener("click", (e)=>{
                    this.addLettersToTextBox(buttons[b].id);
                })
            }
    }

    addEventListenerToTextInput () {
        const text_input = document.getElementById("current_word");
        text_input.addEventListener("change", this.checkWord) 
        //async (e)=> {
           // const current_word = new Word(text_input.value, this.gamenum);
            //const isAnswer = await current_word.isAnswer();
            // console.log(text_input.value)
            //console.log(isAnswer)
            //  if (isAnswer === true) {
            //     con
            //     // this.addWordToTextarea(w);
            //     console.log("that's a word")
            // // If it's not a word, just delete the word from the input.
            // } else {
            //     console.log ("is not a word");
            // }
        //})
    }

    // the callback function that runs in the Enter button 
    // EventListener and the text input EventListener
    checkWord = async ()=> {
        const text_input = document.getElementById("current_word");
        const current_word = new Word(text_input.value, this.gamenum);
        const isAnswer = await current_word.isAnswer();
        const words_played = JSON.parse(localStorage.getItem(this.gamenum))["words_played"];
        const alreadyAdded = current_word.alreadyAdded(words_played);

        // if the word is the answer and hasn't already been played, add it to the words_played textarea, calculate and
        // update the earned points total, and add the words to the words_played array
            if (isAnswer && !alreadyAdded) {
                this.addWordToTextarea(text_input.value);
                this.addToWordsPlayedArray(text_input.value);
                this.updatePointsEarned(await current_word.calculatePoints());
                this.updatePointsEarnedTextBox(await current_word.calculatePoints());
            } 
        //delete the word from the text input
        text_input.value = "";
    }

    addEventListenerToEnterButton() {
        const enterButton = document.getElementById("enter");
        enterButton.addEventListener("click", this.checkWord);
    }


    addWordToTextarea (word) {
        const textarea = document.getElementById("words_played");
        textarea.value += " " + word;
    }

    addToWordsPlayedArray (word) {
        // get the game data from localStorage, push the new word to
        // the words_played array, and update the localStorage
        // with the newly updated game data
        const game_data = JSON.parse(localStorage.getItem(this.gamenum));
        const words_played = game_data["words_played"]; //the words_played array
        words_played.push(word);
        localStorage.setItem(this.gamenum, JSON.stringify(game_data));
    }


    updatePointsEarned (points_to_add) {
        const game_data = JSON.parse(localStorage.getItem(this.gamenum));
        game_data["points_earned"] += points_to_add;
        localStorage.setItem(this.gamenum, JSON.stringify(game_data));
    }

    updatePointsEarnedTextBox (points_to_add) {
        const textbox = document.getElementById("points_earned");
        const textbox_value = parseInt(textbox.value);
        textbox.value = textbox_value + parseInt(points_to_add);

    }
}


class Points {
    constructor (pointsEarned, totalGamePoints) {
        this.totalGamePoints = totalGamePoints;
        this.pointsEarned = pointsEarned;
        // this.gs = new GameStorage();
    }


    calculatePercent () {
        const percent = this.pointsPlayed / this.totalGamePoints;
        return percent;
    }

    calculateLevel () {
        if (this.calculatePercent() == 0) {
            // "Beginner";
            return 0;
        }
        if (this.calculatePercent() >= .02 && this.calculatePercent() < .05) {
            // "Good Start";
            return 1;
        }
        if (this.calculatePercent() >= .05 && this.calculatePercent () < .08) {
            // "Moving Up";
            return 2;
        }
        if (this.calculatePercent() >= .08 && this.calculatePercent() < .15) {
            // "Good";
            return 3;
        }
        if (this.calculatePercent() >= .15 && this.calculatePercent() < .25) {
            // "Solid";
            return 4;   
        } 
        if (this.calculatePercent() >= .25 && this.calculatePercent() < .40) {
            // "Nice";
            return 5;
        }
        if (this.calculatePercent() >= .40 && this.calculatePercent() < .50) {
            // "Great";
            return 6;
        }
        if (this.calculatePercent() >= .50 && this.calculatePercent() < .70) {
            // "Amazing";
            return 7;
        }
        if (this.calculatePercent() >= .70 && this.calculatePercent() < 1) {
            // "Genius";
            return 8;
        }
        if (this.calculatePercent() >= 1) {
            // "Queen Bee";
            return 9;
        } else {
            return 0;
        }
    }

    isGenius () {
        if (this.calculateLevel() === 8) {
            return true;
        } else {
            return false;
        }
    }
}

class GameStorage {
    constructor (gamenum) {
        this.gamenum = gamenum;
        this.g = new Game(gamenum);
    }

    //if the gamenum localstorage doesn't exist, initialize it
    // with 0 points_earned, empty words_played, and the correct
    // number of total_points from this.getPoints().
    // if it does exist, don't worry about it.

    async initializeStorage () {
        if (localStorage.getItem(this.gamenum) === null){
            const total_points = await this.g.getPoints();
            const game_data = {"points_earned": 0, "words_played":[], "total_points": total_points};
            localStorage.setItem(this.gamenum, JSON.stringify(game_data));
        }
    }

}