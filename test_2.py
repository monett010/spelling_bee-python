from Controller import SaveGame


s = SaveGame(20260515)

json = {"points_earned":1,"words_played":["tide"],"total_points":"237"}
s.write_save(json)