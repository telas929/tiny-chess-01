import json, os, sys, urllib.request

V = {'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000}
PST = {k: [0] * 64 for k in 'pnbrqk'}
for f in range(8):
    for r in range(8):
        i = r * 8 + f
        c = min(f, 7 - f) + min(r, 7 - r)
        PST['n'][i] = PST['b'][i] = c * 5
        PST['p'][i] = (r if r > 1 else 0) * 5 + c * 5

def board_of(fen):
    b, file = {}, 0
    for row in fen.split()[0].split('/'):
        for c in row:
            if c.isdigit(): file += int(c)
            else: b[chr(97 + file) + str(8 - (len(b) // 8))] = c; file += 1
    return {chr(97 + (idx % 8)) + str(8 - (idx // 8)): c for idx, c in enumerate(fen.split()[0].replace('/', '')) if not c.isdigit()} if False else {}

# Re-implement board_of cleanly
def board_of(fen):
    b = {}
    for i, row in enumerate(fen.split()[0].split('/')):
        file = 0
        for c in row:
            if c.isdigit(): file += int(c)
            else: b[chr(97 + file) + str(8 - i)] = c; file += 1
    return b

def is_mate_or_check(b, m, act):
    ek = 'k' if act == 'w' else 'K'
    ksq = next((sq for sq, p in b.items() if p == ek), None)
    if not ksq: return 0
    t = m[2:4]
    p = b.get(m[:2], '').lower()
    kf, kr = ord(ksq[0]) - 97, int(ksq[1])
    tf, tr = ord(t[0]) - 97, int(t[1])
    chk = False
    if p in 'rq' and (kf == tf or kr == tr):
        df = 0 if kf == tf else (1 if kf > tf else -1)
        dr = 0 if kr == tr else (1 if kr > tr else -1)
        cf, cr = tf + df, tr + dr
        blk = False
        while (cf, cr) != (kf, kr):
            if chr(97 + cf) + str(cr) in b: blk = True; break
            cf += df; cr += dr
        if not blk: chk = True
    if p in 'bq' and abs(kf - tf) == abs(kr - tr) and kf != tf:
        df = 1 if kf > tf else -1
        dr = 1 if kr > tr else -1
        cf, cr = tf + df, tr + dr
        blk = False
        while (cf, cr) != (kf, kr):
            if chr(97 + cf) + str(cr) in b: blk = True; break
            cf += df; cr += dr
        if not blk: chk = True
    if p == 'n' and (abs(kf - tf), abs(kr - tr)) in [(1, 2), (2, 1)]: chk = True
    if not chk: return 0
    flight = 0
    for df in (-1, 0, 1):
        for dr in (-1, 0, 1):
            if df == 0 and dr == 0: continue
            nf, nr = kf + df, kr + dr
            if 0 <= nf < 8 and 1 <= nr <= 8:
                if chr(97 + nf) + str(nr) in b: continue
                if p in 'rq' and (nf == tf or nr == tr): continue
                flight += 1
    return 1000000 if flight == 0 else 50

def choose(fen, legal):
    b = board_of(fen)
    parts = fen.split()
    act = parts[1] if len(parts) > 1 else 'w'
    def rank(m):
        mover = b[m[:2]].lower()
        t = m[2:4]
        vic = b.get(t)
        v_val = V.get(vic.lower(), 0) if vic else 0
        a_val = V.get(mover, 0)
        pro = V.get(m[4].lower(), 0) if len(m) == 5 else 0
        mv = is_mate_or_check(b, m, act)
        is_m = 1 if mv >= 1000000 else 0
        chk_val = 50 if mv > 0 and not is_m else 0
        sq_idx = (int(t[1]) - 1) * 8 + ord(t[0]) - 97
        bonus = PST.get(mover, [0] * 64)[sq_idx]
        dev = 20 if mover in 'nb' and m[:2] in 'b1g1b8g8' else 0
        ctr = 30 if t in ['d4', 'e4', 'd5', 'e5'] else (10 if t in ['c4', 'f4', 'c5', 'f5'] else 0)
        return (-is_m, -(v_val + chk_val), -pro, a_val, -(bonus + dev + ctr), m)
    return min(legal, key=rank)

if __name__ == "__main__":
    U = os.environ.get("MAKEFUN_ENV_URL")
    if not U: sys.exit(0)
    def post(p, body):
        req = urllib.request.Request(U + p, data=json.dumps(body).encode(), headers={"content-type": "application/json"})
        with urllib.request.urlopen(req) as res: return json.load(res)
    while True:
        g = post("/game", {})
        if g.get("status") == "done": break
        while g.get("status") == "your_move":
            g = post("/move", {"game": g["game"], "move": choose(g["fen"], g["legal_moves"])})
