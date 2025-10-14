from Controller import ReadGameFiles
import os
import json

r = ReadGameFiles(20230814)

# r.getAnswers()
# print (r.getAnswers ())

# print (r.isGame())

# print (r.getAllGames())
# print (os.listdir('games'))

# games = []
# gamesdir = os.listdir('games')
# for g in gamesdir:
#     if (os.path.isdir('games/' + g)):
#         games.append(g)
# games.sort()
# print (games)

# print (r.getAllGames())

print(r.getAllGames())