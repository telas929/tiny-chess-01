// generator/draw.mjs: built by scripts/competitions/build-agent-bundle.ts from src/generator/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/generator/main.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// src/chess/rules.ts
var PAWN = 1;
var KNIGHT = 2;
var BISHOP = 3;
var ROOK = 4;
var QUEEN = 5;
var KING = 6;
var CAPTURE = 1 << 17;
var EN_PASSANT = 1 << 18;
var CASTLE = 1 << 19;
var DOUBLE_PUSH = 1 << 20;
var WK = 1;
var WQ = 2;
var BK = 4;
var BQ = 8;
var CASTLE_KEEP = new Int8Array(128).fill(15);
CASTLE_KEEP[0] = 15 & ~WQ;
CASTLE_KEEP[7] = 15 & ~WK;
CASTLE_KEEP[4] = 15 & ~(WK | WQ);
CASTLE_KEEP[112] = 15 & ~BQ;
CASTLE_KEEP[119] = 15 & ~BK;
CASTLE_KEEP[116] = 15 & ~(BK | BQ);
var ZOBRIST = (() => {
  let s = 2654435769;
  const next = () => {
    s = s + 2654435769 | 0;
    let z = s;
    z = Math.imul(z ^ z >>> 16, 2246822507);
    z = Math.imul(z ^ z >>> 13, 3266489909);
    return (z ^ z >>> 16) >>> 0;
  };
  const table = (n) => {
    const t = new Uint32Array(n * 2);
    for (let i = 0; i < t.length; i += 1) t[i] = next();
    return t;
  };
  return { pieces: table(16 * 128), side: table(1), castling: table(16), ep: table(8) };
})();

// src/chess/engine.ts
var centre = (i) => Math.min(i, 7 - i);
var PST = (() => {
  const tables = [];
  for (let t = 0; t <= 7; t += 1) tables.push(new Int16Array(64));
  const pawnAdvance = [0, 0, 4, 8, 14, 24, 40, 0];
  const pawnCentre = [0, 0, 0, 10, 15, 10, 5, 0];
  for (let r = 0; r < 8; r += 1) {
    for (let f = 0; f < 8; f += 1) {
      const i = r * 8 + f;
      const c = centre(f) + centre(r);
      tables[PAWN][i] = pawnAdvance[r] + (f === 3 || f === 4 ? pawnCentre[r] : 0);
      tables[KNIGHT][i] = 6 * c - 20;
      tables[BISHOP][i] = 4 * c - 8;
      tables[ROOK][i] = (r === 6 ? 15 : 0) + (r === 0 && (f === 3 || f === 4) ? 5 : 0);
      tables[QUEEN][i] = 2 * c - 6;
      tables[KING][i] = r === 0 ? [20, 25, 10, 0, 0, 10, 25, 20][f] : Math.max(-50, -15 * r);
      tables[7][i] = 8 * c - 24;
    }
  }
  return tables;
})();
var OPENING_MATERIAL = 2 * (2 * 320 + 2 * 330 + 2 * 500 + 900);
var TT_BITS = 17;
var TT_MASK = (1 << TT_BITS) - 1;
var MAX_SEARCH_DEPTH = 64;

// src/shared/gauntlet.ts
var LADDER = Object.freeze([
  { id: "random", name: "Random mover", kind: "random", depth: 0, nodes: 0 },
  { id: "greedy", name: "Greedy capturer", kind: "greedy", depth: 0, nodes: 0 },
  { id: "depth-1", name: "Alpha-beta, depth 1", kind: "alphabeta", depth: 1, nodes: 0 },
  { id: "depth-2", name: "Alpha-beta, depth 2", kind: "alphabeta", depth: 2, nodes: 0 },
  { id: "depth-3", name: "Alpha-beta, depth 3", kind: "alphabeta", depth: 3, nodes: 0 },
  { id: "depth-4", name: "Alpha-beta, depth 4", kind: "alphabeta", depth: 4, nodes: 0 },
  { id: "nodes-100k", name: "Alpha-beta, 100,000 nodes", kind: "alphabeta", depth: MAX_SEARCH_DEPTH, nodes: 1e5 },
  { id: "nodes-250k", name: "Alpha-beta, 250,000 nodes", kind: "alphabeta", depth: MAX_SEARCH_DEPTH, nodes: 25e4 },
  { id: "nodes-500k", name: "Alpha-beta, 500,000 nodes", kind: "alphabeta", depth: MAX_SEARCH_DEPTH, nodes: 5e5 },
  { id: "nodes-1M", name: "Alpha-beta, 1,000,000 nodes", kind: "alphabeta", depth: MAX_SEARCH_DEPTH, nodes: 1e6 },
  { id: "nodes-2M", name: "Alpha-beta, 2,000,000 nodes", kind: "alphabeta", depth: MAX_SEARCH_DEPTH, nodes: 2e6 }
]);
var TRIAL_FIRST_RUNG = 3;
var TRIAL_RUNGS = 8;
var OPPONENTS = Object.freeze(LADDER.slice(TRIAL_FIRST_RUNG, TRIAL_FIRST_RUNG + TRIAL_RUNGS));
var ELO_CAP_ABOVE_TOP = 400;
var COLOURS = ["white", "black"];
var GAMES_PER_OPPONENT = COLOURS.length;
var GAMES = OPPONENTS.length * GAMES_PER_OPPONENT;
var MAX_PLIES = 200;
var ADJUDICATION_MARGIN = 5;
var MOVE_LIMIT_MS = 1e4;
var RULE_REASONS = Object.freeze(["checkmate", "stalemate", "insufficient_material", "threefold_repetition", "fifty_moves", "adjudicated"]);
var ENTRY_LOSS_REASONS = Object.freeze(["time", "resigned", "abandoned", "unplayed"]);

// src/shared/anchors.ts
var ANCHORS = Object.freeze({
  "depth-2": 855,
  "depth-3": 1073,
  "depth-4": 1199,
  "nodes-100k": 1392,
  "nodes-250k": 1497,
  "nodes-500k": 1596,
  "nodes-1M": 1667,
  "nodes-2M": 1712
});
var ELO_FLOOR = 0;
var ELO_CAP = Math.max(...Object.values(ANCHORS)) + ELO_CAP_ABOVE_TOP;

// src/shared/book.ts
var OPENING_PLIES = 8;
var line = (id, name, moves) => ({ id, name, moves: Object.freeze(moves.split(" ")) });
var BOOK = Object.freeze([
  line("italian-game", "Italian Game", "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6"),
  line("two-knights", "Two Knights Defence", "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 d2d3 f8e7"),
  line("ruy-lopez-morphy", "Ruy Lopez, Morphy Defence", "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6"),
  line("ruy-lopez-berlin", "Ruy Lopez, Berlin Defence", "e2e4 e7e5 g1f3 b8c6 f1b5 g8f6 e1g1 f6e4"),
  line("scotch-game", "Scotch Game", "e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 g8f6"),
  line("petrov-defence", "Petrov Defence", "e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3 f6e4"),
  line("four-knights", "Four Knights Game, Spanish", "e2e4 e7e5 g1f3 b8c6 b1c3 g8f6 f1b5 f8b4"),
  line("kings-gambit", "King's Gambit Accepted", "e2e4 e7e5 f2f4 e5f4 g1f3 g7g5 h2h4 g5g4"),
  line("vienna-game", "Vienna Game", "e2e4 e7e5 b1c3 g8f6 f2f4 d7d5 f4e5 f6e4"),
  line("philidor-defence", "Philidor Defence", "e2e4 e7e5 g1f3 d7d6 d2d4 g8f6 b1c3 b8d7"),
  line("sicilian-najdorf", "Sicilian Defence, Open with 2...d6", "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6"),
  line("sicilian-classical", "Sicilian Defence, Open with 2...Nc6", "e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6"),
  line("sicilian-taimanov", "Sicilian Defence, Taimanov", "e2e4 c7c5 g1f3 e7e6 d2d4 c5d4 f3d4 b8c6"),
  line("sicilian-alapin", "Sicilian Defence, Alapin", "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4"),
  line("sicilian-closed", "Sicilian Defence, Closed", "e2e4 c7c5 b1c3 b8c6 g2g3 g7g6 f1g2 f8g7"),
  line("french-winawer", "French Defence, Winawer", "e2e4 e7e6 d2d4 d7d5 b1c3 f8b4 e4e5 c7c5"),
  line("french-advance", "French Defence, Advance", "e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 b8c6"),
  line("french-tarrasch", "French Defence, Tarrasch", "e2e4 e7e6 d2d4 d7d5 b1d2 g8f6 e4e5 f6d7"),
  line("caro-kann-classical", "Caro-Kann Defence, Classical", "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5"),
  line("caro-kann-advance", "Caro-Kann Defence, Advance", "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 g1f3 e7e6"),
  line("pirc-defence", "Pirc Defence", "e2e4 d7d6 d2d4 g8f6 b1c3 g7g6 g1f3 f8g7"),
  line("scandinavian-defence", "Scandinavian Defence", "e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 d2d4 g8f6"),
  line("alekhine-defence", "Alekhine Defence, Modern", "e2e4 g8f6 e4e5 f6d5 d2d4 d7d6 g1f3 c8g4"),
  line("queens-gambit-declined", "Queen's Gambit Declined", "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1g5 f8e7"),
  line("queens-gambit-accepted", "Queen's Gambit Accepted", "d2d4 d7d5 c2c4 d5c4 g1f3 g8f6 e2e3 e7e6"),
  line("slav-defence", "Slav Defence", "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 d5c4"),
  line("semi-slav", "Semi-Slav Defence", "d2d4 d7d5 c2c4 c7c6 b1c3 g8f6 e2e3 e7e6"),
  line("nimzo-indian", "Nimzo-Indian Defence, Rubinstein", "d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8"),
  line("queens-indian", "Queen's Indian Defence", "d2d4 g8f6 c2c4 e7e6 g1f3 b7b6 g2g3 c8b7"),
  line("kings-indian", "King's Indian Defence", "d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6"),
  line("grunfeld-defence", "Grünfeld Defence, Exchange", "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5"),
  line("modern-benoni", "Modern Benoni", "d2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3 e6d5"),
  line("dutch-defence", "Dutch Defence", "d2d4 f7f5 g2g3 g8f6 f1g2 e7e6 g1f3 f8e7"),
  line("london-system", "London System", "d2d4 d7d5 c1f4 g8f6 e2e3 c7c5 c2c3 b8c6"),
  line("catalan-opening", "Catalan Opening", "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2 f8e7"),
  line("english-symmetrical", "English Opening, Symmetrical", "c2c4 c7c5 b1c3 b8c6 g2g3 g7g6 f1g2 f8g7"),
  line("english-reversed-sicilian", "English Opening, Reversed Sicilian", "c2c4 e7e5 b1c3 g8f6 g1f3 b8c6 g2g3 d7d5"),
  line("reti-opening", "Réti Opening", "g1f3 d7d5 c2c4 e7e6 g2g3 g8f6 f1g2 f8e7"),
  line("kings-indian-attack", "King's Indian Attack", "g1f3 d7d5 g2g3 g8f6 f1g2 c7c5 e1g1 b8c6"),
  line("bird-opening", "Bird's Opening", "f2f4 d7d5 g1f3 g8f6 e2e3 g7g6 b2b3 f8g7")
]);

// src/shared/files.ts
var GAUNTLET_SCHEMA = "tiny-chess-01/gauntlet/v1";
var REFERENCE_SCHEMA = "tiny-chess-01/reference/v1";
function jsonText(v) {
  return `${JSON.stringify(v, null, 2)}
`;
}

// src/shared/stream.ts
import { createHmac } from "node:crypto";
var Stream = class {
  key;
  label;
  block = 0;
  buf = Buffer.alloc(0);
  pos = 0;
  constructor(seedHex, label) {
    if (!/^[0-9a-f]{64}$/.test(seedHex)) throw new RangeError("a stream is seeded by 64 lowercase hex characters");
    this.key = Buffer.from(seedHex, "hex");
    this.label = label;
  }
  byte() {
    if (this.pos === this.buf.length) {
      this.buf = createHmac("sha256", this.key).update(`${this.label}/${this.block}`).digest();
      this.block += 1;
      this.pos = 0;
    }
    const b = this.buf[this.pos];
    this.pos += 1;
    return b;
  }
  /** A uniform integer in [0, n), 1 <= n <= 2^32, by rejection over 32-bit words. */
  int(n) {
    if (!Number.isSafeInteger(n) || n < 1 || n > 2 ** 32) throw new RangeError(`int(n) takes n from 1 to 2^32, got ${n}`);
    const limit = Math.floor(2 ** 32 / n) * n;
    for (; ; ) {
      const w = (this.byte() << 24 >>> 0) + (this.byte() << 16) + (this.byte() << 8) + this.byte();
      if (w < limit) return w % n;
    }
  }
  pick(items) {
    if (items.length === 0) throw new RangeError("pick from an empty list");
    return items[this.int(items.length)];
  }
};

// src/generator/instance.ts
var INSTANCE_SEED_SCHEMA = "agent-fun/instance-seed/v1";
function readSeedFile(source) {
  let v;
  try {
    v = JSON.parse(source);
  } catch (err) {
    throw new Error(`/input/seed.json is not JSON: ${err.message}`);
  }
  const o = v;
  if (o === null || typeof o !== "object" || o.schema !== INSTANCE_SEED_SCHEMA || typeof o.seed !== "string" || !/^[0-9a-f]{64}$/.test(o.seed)) {
    throw new Error(`/input/seed.json is not an ${INSTANCE_SEED_SCHEMA} seed`);
  }
  if (o.t !== void 0 && (typeof o.t !== "number" || !Number.isSafeInteger(o.t) || o.t < 0)) throw new Error("/input/seed.json: t is not a trial index");
  return { seed: o.seed, purpose: typeof o.purpose === "string" ? o.purpose : "", k: typeof o.k === "number" ? o.k : 0, t: typeof o.t === "number" ? o.t : null };
}
var TRIAL_GAMES = OPPONENTS.length;
var PRACTICE_GAMES = 6;
function gamesOf(scored) {
  return scored ? TRIAL_GAMES : PRACTICE_GAMES;
}
function colourOf(rung, t) {
  return COLOURS[(rung + t) % COLOURS.length];
}
function drawInstance(seed, scored, t = null) {
  const trial = t ?? 0;
  const pick = new Stream(seed, "openings");
  const left = [...BOOK];
  const openings = [];
  for (let i = 0; i < OPPONENTS.length; i += 1) openings.push(left.splice(pick.int(left.length), 1)[0]);
  const house = new Stream(seed, "house");
  let houseSeed = "";
  for (let i = 0; i < 32; i += 1) houseSeed += house.int(256).toString(16).padStart(2, "0");
  const games = OPPONENTS.slice(0, gamesOf(scored)).map((o, i) => {
    const op = openings[i];
    return { game: i + 1, opponent: o.id, colour: colourOf(i, trial), opening: { id: op.id, name: op.name, moves: [...op.moves] } };
  });
  return { seed, scored, t: trial, houseSeed, games };
}
var thousands = (n) => n.toLocaleString("en-US");
var ENTRY_MAX_BYTES = 4096;
var TRIAL_WALL_SEC = 1800;
var HOUSE_MINUTES = [3, 6];
var MOVE_BUDGET_SEC = 3;
function renderBrief(i) {
  const env = "$MAKEFUN_ENV_URL";
  const rungs = OPPONENTS.map((o, n) => `  rung ${n + 1}  ${o.id.padEnd(10)}  anchored at ${String(ANCHORS[o.id]).padStart(4)}  ${o.name}`);
  const games = i.games.map((g) => {
    const o = OPPONENTS.find((x) => x.id === g.opponent);
    return `  game ${String(g.game).padStart(2)}  ${o.id} (${ANCHORS[o.id]}), you play ${g.colour}; ${g.opening.name}: ${g.opening.moves.join(" ")}`;
  });
  return [
    `tiny-chess-01: the strongest chess engine you can write in ${thousands(ENTRY_MAX_BYTES)} bytes of Python. It plays the house gauntlet, one game after another.`,
    "",
    "Your entry:",
    `  - main.py, at the repository's root, is the whole engine: at most ${thousands(ENTRY_MAX_BYTES)} bytes as committed (comments, whitespace and docstrings count), Python 3.13 with the standard library only. It reads, imports and execs no other file of the repository. A main.py that unpacks and execs a compressed payload (lzma, zlib) is allowed; the payload and the unpacker both count toward its ${thousands(ENTRY_MAX_BYTES)} bytes.`,
    "  - It talks to the env alone, over HTTP. It calls no model and no other service: there is none to reach.",
    "  - It searches to a fixed depth or a fixed number of nodes, never to a clock (see Determinism).",
    "",
    `The house ladder: ${OPPONENTS.length} engines, weakest first, each with the anchor your Elo is measured against. The depth rungs search every move to that depth; the node rungs deepen until the next depth would pass their node budget and play the last whole depth's move. None reads a clock.`,
    "",
    ...rungs,
    "",
    `You play ${i.games.length} games, ${i.games.length === OPPONENTS.length ? "one against each rung" : `one against each of the first ${i.games.length} rungs (a practice trial: the final's trials also play ${OPPONENTS.slice(i.games.length).map((o) => o.id).join(" and ")})`}, each from its own opening, in this order; your colour alternates from rung to rung (${i.games.filter((g) => g.colour === "white").length} with white, ${i.games.filter((g) => g.colour === "black").length} with black), and the next trial's instance gives you the other colour against each. Each starts from the standard start position with its opening's ${OPENING_PLIES} plies played for both sides, so white moves first after the book; when you play black, the house has already made its move when you are served the position.`,
    "",
    ...games,
    "",
    `The env, at ${env}, takes a POST of one JSON object on each route and answers one:`,
    `  POST ${env}/game    {}                                 the game in play; the first call, and the first after a game ends, starts the next game. Once every game is over: {"status": "done", "games", "wins", "draws", "losses"}`,
    `  POST ${env}/move    {"game": <n>, "move": "<uci>"}     your move in game n, the game in play; the house answers at once with its own`,
    `  POST ${env}/resign  {"game": <n>}                      you give game n up, a loss`,
    "",
    `A game answer: {"game", "games", "opponent", "opponent_name", "colour" (yours), "opening": {"id", "name", "moves"}, "start_fen", "moves" (every move from the start position in UCI, the opening's included), "fen" (the position now), "plies", "last_move", "status" ("your_move" or "over"), "legal_moves" (yours, in UCI, while it is your move), "result" ("1-0", "0-1" or "1/2-1/2", white's side, once over), "outcome" ("win", "draw" or "loss", yours), "reason", "next_game", "move_limit_ms", "max_plies"}.`,
    "",
    "Moves are UCI: from-square and to-square, and the promotion piece in lower case (e2e4, e7e8q); castling is the king's move (e1g1, e8c8). A move that is not legal is refused with HTTP 400 and changes nothing; send another.",
    "",
    "A game ends:",
    "  - by the rules: checkmate; a draw by stalemate, by insufficient material (no pawn, rook or queen left, and at most one knight or bishop, or only bishops all on squares of one colour), by the third occurrence of a position (same pieces, side to move, castling rights and en passant capture) or by 100 plies with no capture and no pawn move, each applied at once, no claim needed",
    `  - at the ply cap: a game still going after ${MAX_PLIES} plies from the start position (the opening's included) is adjudicated, won by the side ahead in material (pawn 1, knight 3, bishop 3, rook 5, queen 9) by at least ${ADJUDICATION_MARGIN}, else drawn`,
    `  - on time: your move must reach the env within ${thousands(MOVE_LIMIT_MS)} ms of the env serving the position (its answer to your last move, or to /game); a /move, /resign or /game for the game in play that comes later loses it on time. The house thinks on its own time, never on yours`,
    "  - by your resignation; and a game in play when your program exits, or never started, is lost",
    "",
    `Time: the whole trial has ${thousands(TRIAL_WALL_SEC)} seconds of wall time, the house's own thinking included (about ${HOUSE_MINUTES[0]} to ${HOUSE_MINUTES[1]} minutes of it: the env runs the house engines on half a CPU). A trial still running then is stopped and scores 0. So budget about ${MOVE_BUDGET_SEC} seconds a move on average, even though one move may take up to ${MOVE_LIMIT_MS / 1e3} seconds.`,
    "",
    `Score: each trial's Elo is the rating at which your expected points against these opponents' anchors (expected points of a game: 1 / (1 + 10^((anchor - R) / 400)); a win 1, a draw 1/2, a loss 0) add up to the points you scored, rounded to a whole number and held between ${ELO_FLOOR} and ${thousands(ELO_CAP)}: ${ELO_FLOOR} when you score no more than a player rated ${ELO_FLOOR} would expect, ${thousands(ELO_CAP)} when you win every game. Your entry ranks on its mean Elo over the trials; an exact tie goes to the more plies to spare (for each game won, the ply cap less the game's length, summed), then the earlier receipt.`,
    "",
    "Determinism: your program must play the same moves given the same positions: no wall clock in your search, no unseeded randomness (MAKEFUN_TRIAL_SEED is a seed for any you need). Every trial of a final contender (an entry that goes on past the final's first instance) runs twice, live and then replayed, and the replay must leave the same games, move for move: search to a fixed depth or a fixed number of nodes, never to a time, and keep each move well inside the move limit.",
    ""
  ].join("\n");
}
function gauntletFile(i) {
  return { schema: GAUNTLET_SCHEMA, house_seed: i.houseSeed, max_plies: MAX_PLIES, adjudication_margin: ADJUDICATION_MARGIN, move_limit_ms: MOVE_LIMIT_MS, games: i.games };
}
function referenceFile(i) {
  return {
    schema: REFERENCE_SCHEMA,
    scored: i.scored,
    max_plies: MAX_PLIES,
    adjudication_margin: ADJUDICATION_MARGIN,
    elo_floor: ELO_FLOOR,
    elo_cap: ELO_CAP,
    anchors: { ...ANCHORS },
    games: i.games
  };
}
function instanceFiles(i) {
  return {
    "input/prompt.txt": renderBrief(i),
    "input/env/gauntlet.json": jsonText(gauntletFile(i)),
    "reference/gauntlet.json": jsonText(referenceFile(i))
  };
}

// src/generator/main.ts
var INPUT_DIR = process.env.MAKEFUN_INPUT_DIR || "/input";
var OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
try {
  const seedFile = readSeedFile(readFileSync(join(INPUT_DIR, "seed.json"), "utf8"));
  const instance = drawInstance(seedFile.seed, seedFile.purpose === "scored", seedFile.t);
  for (const [rel, text] of Object.entries(instanceFiles(instance))) {
    const file = join(OUTPUT_DIR, ...rel.split("/"));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  const openings = [...new Set(instance.games.map((g) => g.opening.id))].join(", ");
  process.stdout.write(`drew a ${instance.scored ? "scored" : "practice"} gauntlet of ${instance.games.length} games on ${openings} (${seedFile.purpose} k=${seedFile.k}${seedFile.t === null ? "" : ` t=${seedFile.t}`})
`);
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exitCode = 1;
}
