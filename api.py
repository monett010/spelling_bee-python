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

# Returns 1 if the game exists on the filesystem, 0 if not
@app.get ("/<game>")
def is_game(game):
    r = ReadGameFiles(game)
    return r.isGame()

@app.get ("/all")
def get_all_games():
    r = ReadGameFiles("all")
    return r.getAllGames()


if __name__ == "__main__":
    app.run(debug=True)