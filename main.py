import json, os, sys, urllib.request

ENV_URL = os.environ.get("MAKEFUN_ENV_URL")
V = {"p": 1, "n": 3, "b": 3, "r": 5, "q": 9, "k": 100}

def post(path, body):
    req = urllib.request.Request(ENV_URL + path, data=json.dumps(body).encode(), headers={"content-type": "application/json"})
    with urllib.request.urlopen(req) as res: return json.load(res)

def board_of(fen):
    board = {}
    for i, row in enumerate(fen.split()[0].split("/")):
        file = 0
        for c in row:
            if c.isdigit(): file += int(c)
            else: board["abcdefgh"[file] + str(8 - i)] = c; file += 1
    return board

# PST Table for Pawns
PST_P = {sq: 1 if sq[1] in '45' else 0 for sq in [f+r for f in 'abcdefgh' for r in '12345678']}

def choose(fen, legal):
    board = board_of(fen)
    def rank(move):
        mover = board[move[:2]].lower()
        victim = board.get(move[2:4])
        # Include PST bonus
        pos_bonus = PST_P.get(move[2:4], 0)
        taken = V[victim.lower()] if victim else 0
        return (-taken, -pos_bonus, 0, move)
    return min(legal, key=rank)

g = post("/game", {})
while g["status"] == "your_move":
    g = post("/move", {"game": g["game"], "move": choose(g["fen"], g["legal_moves"])})
