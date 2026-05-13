from Controller import SaveGame
import requests

s = SaveGame(20260320)

# json = {"points_earned":1,"words_played":["tide"],"total_points":"237"}
# s.write_save(json)

# game = 20260515
# requests.post (f"127.0.0.1:5000/save/{game}")

# print (s.check_save())
print (s.load_save())