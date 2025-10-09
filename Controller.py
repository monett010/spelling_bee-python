import os

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
            # for a in answers_:
            #     if ('\n' in answers_):
            #         answers_.remove('\n')
            return answers_

    def isGame (self):
        bool = os.path.isdir (f'{self.game_dir}')
        
        if (bool == True):
            return "1"
        else:
            return "2"
    
    def getAllGames(self):
        games = []
        gamesdir = os.listdir('games')

        for g in gamesdir:
            if (os.path.isdir('games/' + g)):
                games.append(g)
        
        games.sort()
        return games