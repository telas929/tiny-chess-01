import json, os, urllib.request

V = {"p": 1, "n": 3, "b": 3, "r": 5, "q": 9, "k": 100}
PST = { 'p': [0]*64, 'n': [0]*64, 'b': [0]*64, 'r': [0]*64, 'q': [0]*64, 'k': [0]*64 }
for f in range(8):
    for r in range(8):
        i = r*8 + f; c = min(f, 7-f) + min(r, 7-r)
        PST['n'][i] = c * 2; PST['b'][i] = c * 2

def board_of(fen):
    board = {}
    for i, row in enumerate(fen.split()[0].split("/")):
        file = 0
        for c in row:
            if c.isdigit(): file += int(c)
            else: board["abcdefgh"[file] + str(8 - i)] = c; file += 1
    return board

def choose(fen, legal):
    board = board_of(fen)
    def rank(move):
        # MVV-LVA move ordering: Capture by victim value, then attacker value
        target = move[2:4]
        victim = board.get(target)
        # Use piece values for better capture prioritization
        victim_val = V.get(victim.lower(), 0) if victim else 0
        attacker_val = V.get(board[move[:2]].lower(), 0)
        # PST bonus for move
        bonus = PST.get(board[move[:2]].lower(), [0]*64)[(int(target[1])-1)*8 + ord(target[0])-ord('a')]
        # Piece development bonus for Knights/Bishops
        dev = 10 if board[move[:2]].lower() in 'nb' and move[:2] in 'c1f1c8f8' else 0
        # Primary: Captures first (victim value), then bonus
        return (-victim_val, attacker_val, -bonus, -dev, move)
    return min(legal, key=rank)

if __name__ == "__main__":
    ENV_URL = os.environ.get("MAKEFUN_ENV_URL")
    def post(path, body):
        req = urllib.request.Request(ENV_URL + path, data=json.dumps(body).encode(), headers={"content-type": "application/json"})
        with urllib.request.urlopen(req) as res: return json.load(res)
    
    g = post("/game", {})
    while g["status"] == "your_move":
        g = post("/move", {"game": g["game"], "move": choose(g["fen"], g["legal_moves"])})



