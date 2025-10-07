from flask import Flask, request
from flask_cors import CORS
from Controller import ReadGameFiles

app = Flask (__name__)
cors = CORS(app)



@app.route ("/")
def hello ():
    return "Hello!"

@app.get ("/points/<game>")
def get_points(game):
    r = ReadGameFiles(game)
    return r.getPoints()

@app.get ("/letters/<game>")
def get_letters(game):
    r = ReadGameFiles(game)
    return r.getLetters()

@app.get ("/answers/<game>")
def get_answers(game):
    r = ReadGameFiles(game)
    return r.getAnswers()

# Returns true if the game exists, false if not
@app.route ("/<game>")
def is_game(game):
    r = ReadGameFiles(game)
    return r.isGame()

if __name__ == "__main__":
    app.run(debug=True)