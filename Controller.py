import os
import json
from dotenv import load_dotenv
#from os import getenv

load_dotenv('/files/sb.env')

#class Games ():
    #def __init__(self):
        #this.gamesdir_path = os.getenv('GAMES_DIRECTORY')
    #def getGamesPath ():
        #with open('game_dir.json', 'r') as file:
            #json_ = json.load(file)
            #gamesdir_path = json_["games_dir"]
        #return gamesdir_path

    #def getPath (self):
        #load_dotenv()
        #gamesdir_path = os.environ.get("GAMES_DIRECTORY")
        #return self.gamesdir_path

class ReadGameFiles ():
    def __init__(self, game):
        #self.game_dir = f'/games/{game}/'
        self.gamesdir_path = os.environ['GAMES_DIRECTORY']
        self.game_dir = f'{self.gamesdir_path}/{game}/'
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

        # gets the path of the games directory from the game_dir.json file
        #with open ('game_dir.json', 'r') as file:
            #json_ = json.load(file)
            #gamesdir_path = json_["games_dir"]
            #gamesdir = os.listdir(gamesdir_path)

            #for g in gamesdir:
                #if (os.path.isdir(gamesdir_path + "/" + g)):
                    #games.append(g)
        #gamesdir_path = Games.getPath()
        gamesdir = os.listdir(self.gamesdir_path)

        for g in gamesdir:
            if (os.path.isdir(self.gamesdir_path + "/" + g)):
                games.append(g)
        #if the games directory has a .git directory, then remove the .git directory from the games dict
        if (os.path.isdir(self.gamesdir_path + "/.git")):
            games.remove(".git")
        if (os.path.isdir(self.gamesdir_path + "/saves")):
            games.remove("saves")
        games.sort(reverse=True)
        return games


class SaveGame():
    def __init__(self, game):
        self.game = game
        self.gamesdir_path = os.environ['GAMES_DIRECTORY']
        self.gamesave_dir = f"{self.gamesdir_path}/saves/"
        # self.game_dir = f'{self.gamesdir_path}/{game}/'

    def write_save(self, data) -> str:
        # gamesave_path:str = f"{self.gamesdir_path}/saves/{self.game}_save.json"
        gamesave_path:str = f"{self.gamesave_dir}{self.game}_save.json"
        with open (gamesave_path, "w") as file:
            json.dump(data, file)
        return "Wrote save."

    # Checks if a save exists for the game. Returns 1 if true, 
    # 0 if false
    def check_save(self) -> str:
        savesdir = os.listdir(self.gamesave_dir)
        gamesave_filename = f"{self.game}_save.json"
        if (gamesave_filename in savesdir):
            return "1"
        else:
            return "0"
    
    # Loads a save game
    def load_save(self) -> dict:
        gamesave_path:str = f"{self.gamesave_dir}{self.game}_save.json"
        with open (gamesave_path, "r") as file:
            game_data = json.load(file)
        return game_data

