
class ReadGameFiles ():
    def __init__(self, game):
        self.game_dir = f'games/{game}/'
        self.game = game

    def getPoints (self):
        with open (f'{self.game_dir}{self.game}_points.txt', 'r') as pointsfile:
            return pointsfile.readline()

    def getLetters (self):
        with open (f'{self.game_dir}{self.game}_letters.txt', 'r') as lettersfile:
            letters_ = lettersfile.read().splitlines()
            return letters_

    def getAnswers (self):
        with open(f'{self.game_dir}{self.game}_answer_list.txt','r') as answersfile:
            answers_ = answersfile.read().splitlines()
            return answers_