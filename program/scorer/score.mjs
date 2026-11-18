// scorer/score.mjs: built by scripts/competitions/build-agent-bundle.ts from src/scorer/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/scorer/main.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

// src/chess/rules.ts
var WHITE = 0;
var BLACK = 1;
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
var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var LETTERS = " pnbrqk";
var KNIGHT_STEPS = [33, 31, 18, 14, -14, -18, -31, -33];
var KING_STEPS = [1, -1, 16, -16, 15, 17, -15, -17];
var BISHOP_STEPS = [15, 17, -15, -17];
var ROOK_STEPS = [1, -1, 16, -16];
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
var moveFrom = (m) => m & 127;
var moveTo = (m) => m >> 7 & 127;
var movePromotion = (m) => m >> 14 & 7;
var pieceType = (p) => p & 7;
var pieceColour = (p) => p >> 3;
function squareName(sq) {
  return "abcdefgh"[sq & 7] + String((sq >> 4) + 1);
}
function squareOf(name) {
  if (!/^[a-h][1-8]$/.test(name)) return -1;
  return (name.charCodeAt(1) - 49) * 16 + (name.charCodeAt(0) - 97);
}
function moveUci(m) {
  const promo = movePromotion(m);
  return squareName(moveFrom(m)) + squareName(moveTo(m)) + (promo === 0 ? "" : LETTERS[promo]);
}
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
var Position = class _Position {
  board = new Int8Array(128);
  side = WHITE;
  castling = 0;
  /** The en passant target square, or -1: set after a double push only when an enemy pawn stands beside it. */
  ep = -1;
  halfmove = 0;
  fullmove = 1;
  kings = [-1, -1];
  hashLo = 0;
  hashHi = 0;
  undos = [];
  /** A position from FEN (six fields, or the first four with 0 and 1 for the clocks); throws on a malformed or impossible one. */
  static fromFen(fen) {
    const p = new _Position();
    const parts = fen.trim().split(/\s+/);
    if (parts.length !== 4 && parts.length !== 6) throw new Error(`FEN ${JSON.stringify(fen)}: 4 or 6 fields`);
    const rows = parts[0].split("/");
    if (rows.length !== 8) throw new Error(`FEN ${JSON.stringify(fen)}: 8 ranks`);
    for (let r = 0; r < 8; r += 1) {
      let file = 0;
      for (const ch of rows[r]) {
        if (ch >= "1" && ch <= "8") {
          file += Number(ch);
          continue;
        }
        const type = LETTERS.indexOf(ch.toLowerCase());
        if (type < 1 || file > 7) throw new Error(`FEN ${JSON.stringify(fen)}: bad rank ${rows[r]}`);
        const colour = ch === ch.toUpperCase() ? WHITE : BLACK;
        const sq = (7 - r) * 16 + file;
        p.board[sq] = type | colour << 3;
        if (type === KING) {
          if (p.kings[colour] !== -1) throw new Error(`FEN ${JSON.stringify(fen)}: two ${colour === WHITE ? "white" : "black"} kings`);
          p.kings[colour] = sq;
        }
        if (type === PAWN && (r === 0 || r === 7)) throw new Error(`FEN ${JSON.stringify(fen)}: a pawn on the first or last rank`);
        file += 1;
      }
      if (file !== 8) throw new Error(`FEN ${JSON.stringify(fen)}: rank ${rows[r]} is not 8 squares`);
    }
    if (p.kings[WHITE] === -1 || p.kings[BLACK] === -1) throw new Error(`FEN ${JSON.stringify(fen)}: each side has one king`);
    if (parts[1] !== "w" && parts[1] !== "b") throw new Error(`FEN ${JSON.stringify(fen)}: side is w or b`);
    p.side = parts[1] === "w" ? WHITE : BLACK;
    if (!/^(-|K?Q?k?q?)$/.test(parts[2]) || parts[2] === "") throw new Error(`FEN ${JSON.stringify(fen)}: castling`);
    for (const ch of parts[2]) p.castling |= ch === "K" ? WK : ch === "Q" ? WQ : ch === "k" ? BK : ch === "q" ? BQ : 0;
    if (p.board[4] !== KING) p.castling &= ~(WK | WQ);
    if (p.board[7] !== ROOK) p.castling &= ~WK;
    if (p.board[0] !== ROOK) p.castling &= ~WQ;
    if (p.board[116] !== (KING | 8)) p.castling &= ~(BK | BQ);
    if (p.board[119] !== (ROOK | 8)) p.castling &= ~BK;
    if (p.board[112] !== (ROOK | 8)) p.castling &= ~BQ;
    if (parts[3] !== "-") {
      const sq = squareOf(parts[3]);
      if (sq === -1 || sq >> 4 !== (p.side === WHITE ? 5 : 2)) throw new Error(`FEN ${JSON.stringify(fen)}: en passant square`);
      const pawn = p.side === WHITE ? sq - 16 : sq + 16;
      if (p.board[pawn] === (PAWN | (p.side ^ 1) << 3) && p.board[sq] === 0 && p.enemyPawnBeside(pawn, p.side)) p.ep = sq;
    }
    if (parts.length === 6) {
      if (!/^\d+$/.test(parts[4]) || !/^[1-9]\d*$/.test(parts[5])) throw new Error(`FEN ${JSON.stringify(fen)}: clocks`);
      p.halfmove = Number(parts[4]);
      p.fullmove = Number(parts[5]);
    }
    if (p.attacked(p.kings[p.side ^ 1], p.side)) throw new Error(`FEN ${JSON.stringify(fen)}: the side not to move is in check`);
    p.rehash();
    return p;
  }
  clone() {
    const p = new _Position();
    p.board.set(this.board);
    p.side = this.side;
    p.castling = this.castling;
    p.ep = this.ep;
    p.halfmove = this.halfmove;
    p.fullmove = this.fullmove;
    p.kings[0] = this.kings[0];
    p.kings[1] = this.kings[1];
    p.hashLo = this.hashLo;
    p.hashHi = this.hashHi;
    return p;
  }
  /** Whether a pawn of `side` stands beside square `sq` (on its rank), the one that could take en passant. */
  enemyPawnBeside(sq, side) {
    const pawn = PAWN | side << 3;
    return (sq + 1 & 136) === 0 && this.board[sq + 1] === pawn || (sq - 1 & 136) === 0 && this.board[sq - 1] === pawn;
  }
  rehash() {
    let lo = 0;
    let hi = 0;
    for (let sq = 0; sq < 128; sq += 1) {
      if (sq & 136) continue;
      const pc = this.board[sq];
      if (pc !== 0) {
        lo ^= ZOBRIST.pieces[(pc * 128 + sq) * 2];
        hi ^= ZOBRIST.pieces[(pc * 128 + sq) * 2 + 1];
      }
    }
    if (this.side === BLACK) {
      lo ^= ZOBRIST.side[0];
      hi ^= ZOBRIST.side[1];
    }
    lo ^= ZOBRIST.castling[this.castling * 2];
    hi ^= ZOBRIST.castling[this.castling * 2 + 1];
    if (this.ep !== -1) {
      lo ^= ZOBRIST.ep[(this.ep & 7) * 2];
      hi ^= ZOBRIST.ep[(this.ep & 7) * 2 + 1];
    }
    this.hashLo = lo >>> 0;
    this.hashHi = hi >>> 0;
  }
  togglePiece(pc, sq) {
    this.hashLo = (this.hashLo ^ ZOBRIST.pieces[(pc * 128 + sq) * 2]) >>> 0;
    this.hashHi = (this.hashHi ^ ZOBRIST.pieces[(pc * 128 + sq) * 2 + 1]) >>> 0;
  }
  /** The FEN of the position; its en passant field names a square only when an en passant capture is legal. */
  fen() {
    const rows = [];
    for (let r = 7; r >= 0; r -= 1) {
      let row = "";
      let empty = 0;
      for (let f = 0; f < 8; f += 1) {
        const pc = this.board[r * 16 + f];
        if (pc === 0) {
          empty += 1;
          continue;
        }
        if (empty > 0) row += String(empty);
        empty = 0;
        const letter = LETTERS[pieceType(pc)];
        row += pieceColour(pc) === WHITE ? letter.toUpperCase() : letter;
      }
      if (empty > 0) row += String(empty);
      rows.push(row);
    }
    let castling = "";
    if (this.castling & WK) castling += "K";
    if (this.castling & WQ) castling += "Q";
    if (this.castling & BK) castling += "k";
    if (this.castling & BQ) castling += "q";
    const ep = this.legalEnPassant() ? squareName(this.ep) : "-";
    return `${rows.join("/")} ${this.side === WHITE ? "w" : "b"} ${castling || "-"} ${ep} ${this.halfmove} ${this.fullmove}`;
  }
  /** Whether square `sq` is attacked by a piece of `by`. */
  attacked(sq, by) {
    const b = this.board;
    const enemy = by << 3;
    if (by === WHITE) {
      if ((sq - 15 & 136) === 0 && b[sq - 15] === PAWN) return true;
      if ((sq - 17 & 136) === 0 && b[sq - 17] === PAWN) return true;
    } else {
      if ((sq + 15 & 136) === 0 && b[sq + 15] === (PAWN | 8)) return true;
      if ((sq + 17 & 136) === 0 && b[sq + 17] === (PAWN | 8)) return true;
    }
    for (const d of KNIGHT_STEPS) {
      const t = sq + d;
      if ((t & 136) === 0 && b[t] === (KNIGHT | enemy)) return true;
    }
    for (const d of KING_STEPS) {
      const t = sq + d;
      if ((t & 136) === 0 && b[t] === (KING | enemy)) return true;
    }
    for (const d of BISHOP_STEPS) {
      for (let t = sq + d; (t & 136) === 0; t += d) {
        const pc = b[t];
        if (pc === 0) continue;
        if (pc === (BISHOP | enemy) || pc === (QUEEN | enemy)) return true;
        break;
      }
    }
    for (const d of ROOK_STEPS) {
      for (let t = sq + d; (t & 136) === 0; t += d) {
        const pc = b[t];
        if (pc === 0) continue;
        if (pc === (ROOK | enemy) || pc === (QUEEN | enemy)) return true;
        break;
      }
    }
    return false;
  }
  /** Whether the side to move is in check. */
  inCheck() {
    return this.attacked(this.kings[this.side], this.side ^ 1);
  }
  /**
   * Every pseudo-legal move of the side to move into `out` (cleared first), captures only when
   * `capturesOnly` (with every promotion, a capture or not): a move may leave its own king in check,
   * which make() reports. Castling is generated only when legal (not out of, through or into check).
   */
  pseudoMoves(out, capturesOnly = false) {
    out.length = 0;
    const b = this.board;
    const us = this.side;
    const them = us ^ 1;
    for (let from = 0; from < 128; from += 1) {
      if (from & 136) {
        from += 7;
        continue;
      }
      const pc = b[from];
      if (pc === 0 || pieceColour(pc) !== us) continue;
      const type = pieceType(pc);
      if (type === PAWN) {
        const fwd = us === WHITE ? 16 : -16;
        const rank = from >> 4;
        const lastRank = us === WHITE ? 6 : 1;
        const startRank = us === WHITE ? 1 : 6;
        const one = from + fwd;
        if (b[one] === 0) {
          if (rank === lastRank) {
            for (let promo = QUEEN; promo >= KNIGHT; promo -= 1) out.push(from | one << 7 | promo << 14);
          } else if (!capturesOnly) {
            out.push(from | one << 7);
            const two = one + fwd;
            if (rank === startRank && b[two] === 0) out.push(from | two << 7 | DOUBLE_PUSH);
          }
        }
        for (const side of [fwd - 1, fwd + 1]) {
          const to = from + side;
          if (to & 136) continue;
          const target = b[to];
          if (target !== 0 && pieceColour(target) === them) {
            if (rank === lastRank) {
              for (let promo = QUEEN; promo >= KNIGHT; promo -= 1) out.push(from | to << 7 | promo << 14 | CAPTURE);
            } else out.push(from | to << 7 | CAPTURE);
          } else if (to === this.ep) out.push(from | to << 7 | CAPTURE | EN_PASSANT);
        }
        continue;
      }
      if (type === KNIGHT || type === KING) {
        for (const d of type === KNIGHT ? KNIGHT_STEPS : KING_STEPS) {
          const to = from + d;
          if (to & 136) continue;
          const target = b[to];
          if (target === 0) {
            if (!capturesOnly) out.push(from | to << 7);
          } else if (pieceColour(target) === them) out.push(from | to << 7 | CAPTURE);
        }
        if (type === KING && !capturesOnly) this.castlingMoves(out);
        continue;
      }
      const steps = type === BISHOP ? BISHOP_STEPS : type === ROOK ? ROOK_STEPS : KING_STEPS;
      for (const d of steps) {
        for (let to = from + d; (to & 136) === 0; to += d) {
          const target = b[to];
          if (target === 0) {
            if (!capturesOnly) out.push(from | to << 7);
            continue;
          }
          if (pieceColour(target) === them) out.push(from | to << 7 | CAPTURE);
          break;
        }
      }
    }
    return out;
  }
  castlingMoves(out) {
    const b = this.board;
    const us = this.side;
    const them = us ^ 1;
    const base = us === WHITE ? 0 : 112;
    const king = base + 4;
    if (this.kings[us] !== king) return;
    const short = us === WHITE ? WK : BK;
    const long = us === WHITE ? WQ : BQ;
    if ((this.castling & (short | long)) === 0 || this.attacked(king, them)) return;
    if (this.castling & short && b[base + 5] === 0 && b[base + 6] === 0 && !this.attacked(base + 5, them) && !this.attacked(base + 6, them)) {
      out.push(king | base + 6 << 7 | CASTLE);
    }
    if (this.castling & long && b[base + 3] === 0 && b[base + 2] === 0 && b[base + 1] === 0 && !this.attacked(base + 3, them) && !this.attacked(base + 2, them)) {
      out.push(king | base + 2 << 7 | CASTLE);
    }
  }
  /**
   * Play a pseudo-legal move of the side to move. It returns false, the position unchanged, when it
   * would leave that side's king in check; true once made (unmake() takes it back).
   */
  make(m) {
    const b = this.board;
    const from = moveFrom(m);
    const to = moveTo(m);
    const pc = b[from];
    const us = this.side;
    const captureSq = m & EN_PASSANT ? us === WHITE ? to - 16 : to + 16 : to;
    const captured = b[captureSq];
    this.undos.push({ move: m, captured, castling: this.castling, ep: this.ep, halfmove: this.halfmove, hashLo: this.hashLo, hashHi: this.hashHi });
    if (captured !== 0) {
      this.togglePiece(captured, captureSq);
      b[captureSq] = 0;
    }
    this.togglePiece(pc, from);
    b[from] = 0;
    const promo = movePromotion(m);
    const placed = promo === 0 ? pc : promo | us << 3;
    b[to] = placed;
    this.togglePiece(placed, to);
    if (pieceType(pc) === KING) this.kings[us] = to;
    if (m & CASTLE) {
      const rookFrom = to > from ? from + 3 : from - 4;
      const rookTo = to > from ? from + 1 : from - 1;
      const rook = b[rookFrom];
      this.togglePiece(rook, rookFrom);
      b[rookFrom] = 0;
      b[rookTo] = rook;
      this.togglePiece(rook, rookTo);
    }
    this.hashLo = (this.hashLo ^ ZOBRIST.castling[this.castling * 2]) >>> 0;
    this.hashHi = (this.hashHi ^ ZOBRIST.castling[this.castling * 2 + 1]) >>> 0;
    this.castling &= CASTLE_KEEP[from] & CASTLE_KEEP[to];
    this.hashLo = (this.hashLo ^ ZOBRIST.castling[this.castling * 2]) >>> 0;
    this.hashHi = (this.hashHi ^ ZOBRIST.castling[this.castling * 2 + 1]) >>> 0;
    if (this.ep !== -1) {
      this.hashLo = (this.hashLo ^ ZOBRIST.ep[(this.ep & 7) * 2]) >>> 0;
      this.hashHi = (this.hashHi ^ ZOBRIST.ep[(this.ep & 7) * 2 + 1]) >>> 0;
    }
    this.ep = -1;
    if (m & DOUBLE_PUSH && this.enemyPawnBeside(to, us ^ 1)) {
      this.ep = from + to >> 1;
      this.hashLo = (this.hashLo ^ ZOBRIST.ep[(this.ep & 7) * 2]) >>> 0;
      this.hashHi = (this.hashHi ^ ZOBRIST.ep[(this.ep & 7) * 2 + 1]) >>> 0;
    }
    this.halfmove = pieceType(pc) === PAWN || captured !== 0 ? 0 : this.halfmove + 1;
    if (us === BLACK) this.fullmove += 1;
    this.side = us ^ 1;
    this.hashLo = (this.hashLo ^ ZOBRIST.side[0]) >>> 0;
    this.hashHi = (this.hashHi ^ ZOBRIST.side[1]) >>> 0;
    if (this.attacked(this.kings[us], us ^ 1)) {
      this.unmake();
      return false;
    }
    return true;
  }
  /** Take back the last move make() made. */
  unmake() {
    const u = this.undos.pop();
    if (u === void 0) throw new Error("no move to take back");
    const b = this.board;
    const m = u.move;
    const from = moveFrom(m);
    const to = moveTo(m);
    this.side ^= 1;
    const us = this.side;
    const placed = b[to];
    const pc = movePromotion(m) === 0 ? placed : PAWN | us << 3;
    b[from] = pc;
    b[to] = 0;
    if (pieceType(pc) === KING) this.kings[us] = from;
    if (u.captured !== 0) b[m & EN_PASSANT ? us === WHITE ? to - 16 : to + 16 : to] = u.captured;
    if (m & CASTLE) {
      const rookFrom = to > from ? from + 3 : from - 4;
      const rookTo = to > from ? from + 1 : from - 1;
      b[rookFrom] = b[rookTo];
      b[rookTo] = 0;
    }
    this.castling = u.castling;
    this.ep = u.ep;
    this.halfmove = u.halfmove;
    if (us === BLACK) this.fullmove -= 1;
    this.hashLo = u.hashLo;
    this.hashHi = u.hashHi;
  }
  /** Every legal move of the side to move, in generation order. */
  legalMoves() {
    const out = [];
    for (const m of this.pseudoMoves([])) {
      if (this.make(m)) {
        this.unmake();
        out.push(m);
      }
    }
    return out;
  }
  /** Whether the side to move has a legal move. */
  hasLegalMove() {
    for (const m of this.pseudoMoves([])) {
      if (this.make(m)) {
        this.unmake();
        return true;
      }
    }
    return false;
  }
  /** Whether an en passant capture is legal now. */
  legalEnPassant() {
    if (this.ep === -1) return false;
    for (const m of this.pseudoMoves([], true)) {
      if ((m & EN_PASSANT) !== 0 && this.make(m)) {
        this.unmake();
        return true;
      }
    }
    return false;
  }
  /** The legal move a UCI string names (a promotion needs its letter), or null. */
  parseUci(uci) {
    if (!/^[a-h][1-8][a-h][1-8][nbrq]?$/.test(uci)) return null;
    for (const m of this.legalMoves()) if (moveUci(m) === uci) return m;
    return null;
  }
  /**
   * The repetition key: the Zobrist hash, its en passant part kept only when an en passant capture is
   * legal, so two positions with the same pieces, side to move, castling rights and possible moves
   * share it.
   */
  repetitionKey() {
    let lo = this.hashLo;
    let hi = this.hashHi;
    if (this.ep !== -1 && !this.legalEnPassant()) {
      lo = (lo ^ ZOBRIST.ep[(this.ep & 7) * 2]) >>> 0;
      hi = (hi ^ ZOBRIST.ep[(this.ep & 7) * 2 + 1]) >>> 0;
    }
    return `${hi.toString(16).padStart(8, "0")}${lo.toString(16).padStart(8, "0")}`;
  }
  /**
   * Neither side can mate by any series of legal moves, in the cases this checks: no pawn, rook or
   * queen on the board, and either at most one knight or bishop in all, or bishops alone (no knight)
   * all on squares of one colour.
   */
  deadPosition() {
    let minors = 0;
    let knights = 0;
    let lightBishops = 0;
    let darkBishops = 0;
    for (let sq = 0; sq < 128; sq += 1) {
      if (sq & 136) continue;
      const t = pieceType(this.board[sq]);
      if (t === PAWN || t === ROOK || t === QUEEN) return false;
      if (t === KNIGHT) {
        knights += 1;
        minors += 1;
      } else if (t === BISHOP) {
        minors += 1;
        if (((sq >> 4) + (sq & 7)) % 2 === 0) darkBishops += 1;
        else lightBishops += 1;
      }
    }
    if (minors <= 1) return true;
    return knights === 0 && (lightBishops === 0 || darkBishops === 0);
  }
  /** Material by the counting values (pawn 1, knight 3, bishop 3, rook 5, queen 9): [white, black]. */
  material() {
    const out = [0, 0];
    for (let sq = 0; sq < 128; sq += 1) {
      if (sq & 136) continue;
      const pc = this.board[sq];
      if (pc !== 0) out[pieceColour(pc)] += MATERIAL_POINTS[pieceType(pc)];
    }
    return out;
  }
};
var MATERIAL_POINTS = [0, 1, 3, 3, 5, 9, 0];
var Game = class {
  position = Position.fromFen(START_FEN);
  moves = [];
  seen = /* @__PURE__ */ new Map();
  /** The Zobrist hashes of every position so far, oldest first (what a search treats as a repetition). */
  hashes = [];
  constructor() {
    this.note();
  }
  note() {
    const key = this.position.repetitionKey();
    this.seen.set(key, (this.seen.get(key) ?? 0) + 1);
    this.hashes.push(`${this.position.hashHi}:${this.position.hashLo}`);
  }
  /** How often the current position has occurred, this time included. */
  repetitions() {
    return this.seen.get(this.position.repetitionKey()) ?? 0;
  }
  /** Play a move by its UCI if it is legal; false (nothing played) if not. */
  play(uci) {
    const m = this.position.parseUci(uci);
    if (m === null) return false;
    this.position.make(m);
    this.moves.push(uci);
    this.note();
    return true;
  }
  /**
   * Whether the game is over by the rules, and how: checkmate or stalemate (no legal move), then a
   * dead position (insufficient material), then the third occurrence of a position, then 100 plies
   * with no capture and no pawn move. Null while it goes on. A checkmate on the move that makes the
   * fiftieth move or the third occurrence is a checkmate.
   */
  end() {
    const p = this.position;
    if (!p.hasLegalMove()) {
      if (p.inCheck()) return { result: p.side === WHITE ? "0-1" : "1-0", reason: "checkmate" };
      return { result: "1/2-1/2", reason: "stalemate" };
    }
    if (p.deadPosition()) return { result: "1/2-1/2", reason: "insufficient_material" };
    if (this.repetitions() >= 3) return { result: "1/2-1/2", reason: "threefold_repetition" };
    if (p.halfmove >= 100) return { result: "1/2-1/2", reason: "fifty_moves" };
    return null;
  }
};
function endByAdjudication(p, margin) {
  const [white, black] = p.material();
  if (white - black >= margin) return "1-0";
  if (black - white >= margin) return "0-1";
  return "1/2-1/2";
}

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
var COLOURS = ["white", "black"];
var GAMES_PER_OPPONENT = COLOURS.length;
var GAMES = OPPONENTS.length * GAMES_PER_OPPONENT;
var MAX_PLIES = 200;
var ADJUDICATION_MARGIN = 5;
var REASONS = ["checkmate", "stalemate", "insufficient_material", "threefold_repetition", "fifty_moves", "adjudicated", "time", "resigned", "abandoned", "unplayed"];
var RULE_REASONS = Object.freeze(["checkmate", "stalemate", "insufficient_material", "threefold_repetition", "fifty_moves", "adjudicated"]);
var ENTRY_LOSS_REASONS = Object.freeze(["time", "resigned", "abandoned", "unplayed"]);
function gameEnding(g) {
  const end = g.end();
  if (end !== null) return end;
  if (g.moves.length >= MAX_PLIES) return { result: endByAdjudication(g.position, ADJUDICATION_MARGIN), reason: "adjudicated" };
  return null;
}
function lossFor(colour) {
  return colour === "white" ? "0-1" : "1-0";
}
function pointsFor(result, colour) {
  if (result === "1/2-1/2") return 0.5;
  return result === "1-0" === (colour === "white") ? 1 : 0;
}

// src/shared/files.ts
var REFERENCE_FILE = "gauntlet.json";
var STATE_FILE = "state.json";
var REFERENCE_SCHEMA = "tiny-chess-01/reference/v1";
var STATE_SCHEMA = "tiny-chess-01/state/v1";
var RESULTS = ["1-0", "0-1", "1/2-1/2"];
var OUTCOMES = ["win", "draw", "loss"];
function jsonObject(name, text) {
  let v;
  try {
    v = JSON.parse(text);
  } catch (err) {
    throw new Error(`${name} is not JSON: ${err.message}`);
  }
  if (!isObject(v)) throw new Error(`${name} is not a JSON object`);
  return v;
}
function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function exactKeys(name, o, keys) {
  const got = Object.keys(o).sort();
  const want = [...keys].sort();
  if (got.join(",") !== want.join(",")) throw new Error(`${name} holds the keys ${got.join(", ")}, not ${want.join(", ")}`);
}
function count(name, o, key, min = 0) {
  const v = o[key];
  if (typeof v !== "number" || !Number.isSafeInteger(v) || v < min) throw new Error(`${name}: ${key} is not an integer of at least ${min}`);
  return v;
}
function oneOf(name, o, key, values) {
  const v = o[key];
  if (!values.includes(v)) throw new Error(`${name}: ${key} is not one of ${values.join(", ")}`);
  return v;
}
var UCI = /^[a-h][1-8][a-h][1-8][nbrq]?$/;
function moveList(name, v, what) {
  if (!Array.isArray(v) || !v.every((m) => typeof m === "string" && UCI.test(m))) throw new Error(`${name}: ${what} is not a list of UCI moves`);
  return [...v];
}
function gameSpecs(name, v) {
  if (!Array.isArray(v) || v.length === 0) throw new Error(`${name}: games is not a non-empty list`);
  const seen = /* @__PURE__ */ new Set();
  return v.map((g, i) => {
    const what = `${name}: games[${i}]`;
    if (!isObject(g)) throw new Error(`${what} is not an object`);
    exactKeys(what, g, ["game", "opponent", "colour", "opening"]);
    if (g.game !== i + 1) throw new Error(`${what}: game is not ${i + 1}`);
    const opponent = oneOf(what, g, "opponent", OPPONENTS.map((o2) => o2.id));
    const colour = oneOf(what, g, "colour", COLOURS);
    const key = `${opponent}/${colour}`;
    if (seen.has(key)) throw new Error(`${what}: ${opponent} with ${colour} twice`);
    seen.add(key);
    const o = g.opening;
    if (!isObject(o)) throw new Error(`${what}: opening is not an object`);
    exactKeys(`${what}.opening`, o, ["id", "name", "moves"]);
    const book = BOOK.find((b) => b.id === o.id);
    if (book === void 0) throw new Error(`${what}: opening ${String(o.id)} is not in the book`);
    const moves = moveList(what, o.moves, "opening.moves");
    if (o.name !== book.name || moves.join(" ") !== book.moves.join(" ") || moves.length !== OPENING_PLIES) throw new Error(`${what}: opening ${book.id} is not the book's`);
    return { game: i + 1, opponent, colour, opening: { id: book.id, name: book.name, moves } };
  });
}
var REFERENCE_KEYS = ["schema", "scored", "max_plies", "adjudication_margin", "elo_floor", "elo_cap", "anchors", "games"];
function parseReferenceFile(source) {
  const name = `reference/${REFERENCE_FILE}`;
  const o = jsonObject(name, source);
  exactKeys(name, o, REFERENCE_KEYS);
  if (o.schema !== REFERENCE_SCHEMA) throw new Error(`${name}: schema is not ${REFERENCE_SCHEMA}`);
  if (typeof o.scored !== "boolean") throw new Error(`${name}: scored is not a boolean`);
  const anchors = o.anchors;
  if (!isObject(anchors)) throw new Error(`${name}: anchors is not an object`);
  exactKeys(`${name}.anchors`, anchors, OPPONENTS.map((x) => x.id));
  for (const [id, r] of Object.entries(anchors)) if (typeof r !== "number" || !Number.isSafeInteger(r)) throw new Error(`${name}: anchors.${id} is not an integer`);
  const floor = count(name, o, "elo_floor");
  const cap = count(name, o, "elo_cap", floor + 1);
  return {
    schema: REFERENCE_SCHEMA,
    scored: o.scored,
    max_plies: count(name, o, "max_plies", OPENING_PLIES + 1),
    adjudication_margin: count(name, o, "adjudication_margin", 1),
    elo_floor: floor,
    elo_cap: cap,
    anchors,
    games: gameSpecs(name, o.games)
  };
}
var STATE_KEYS = ["schema", "games"];
var RECORD_KEYS = ["game", "opponent", "colour", "opening", "moves", "result", "outcome", "reason"];
function parseStateFile(source) {
  const name = STATE_FILE;
  const o = jsonObject(name, source);
  exactKeys(name, o, STATE_KEYS);
  if (o.schema !== STATE_SCHEMA) throw new Error(`${name}: schema is not ${STATE_SCHEMA}`);
  if (!Array.isArray(o.games)) throw new Error(`${name}: games is not a list`);
  return {
    schema: STATE_SCHEMA,
    games: o.games.map((g, i) => {
      const what = `${name}: games[${i}]`;
      if (!isObject(g)) throw new Error(`${what} is not an object`);
      exactKeys(what, g, RECORD_KEYS);
      if (typeof g.opening !== "string") throw new Error(`${what}: opening is not an id`);
      return {
        game: count(what, g, "game", 1),
        opponent: oneOf(what, g, "opponent", OPPONENTS.map((x) => x.id)),
        colour: oneOf(what, g, "colour", COLOURS),
        opening: g.opening,
        moves: moveList(what, g.moves, "moves"),
        result: oneOf(what, g, "result", RESULTS),
        outcome: oneOf(what, g, "outcome", OUTCOMES),
        reason: oneOf(what, g, "reason", REASONS)
      };
    })
  };
}

// src/shared/elo.ts
function expectedScore(diff) {
  return 1 / (1 + 10 ** (-diff / 400));
}
function performanceRating(games, floor, cap) {
  if (!(floor < cap)) throw new RangeError(`the floor ${floor} is below the cap ${cap}`);
  if (games.length === 0) return floor;
  const scored = games.reduce((s, g) => s + g.points, 0);
  const surplus = (r) => games.reduce((s, g) => s + expectedScore(r - g.anchor), 0) - scored;
  if (surplus(floor) >= 0) return floor;
  if (surplus(cap) <= 0) return cap;
  let lo = floor;
  let hi = cap;
  for (let i = 0; i < 100; i += 1) {
    const mid = (lo + hi) / 2;
    if (surplus(mid) < 0) lo = mid;
    else hi = mid;
  }
  return Math.min(cap, Math.max(floor, Math.round((lo + hi) / 2)));
}

// src/scorer/score.ts
var ScoreError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ScoreError";
  }
};
var outcomeFor = (points) => points === 1 ? "win" : points === 0 ? "loss" : "draw";
function entryMoves(r) {
  let n = 0;
  for (let i = OPENING_PLIES; i < r.moves.length; i += 1) if (i % 2 === 0 === (r.colour === "white")) n += 1;
  return n;
}
function checkGame(r, opening, maxPlies) {
  const what = `game ${r.game}`;
  if (r.moves.length < OPENING_PLIES || r.moves.slice(0, OPENING_PLIES).join(" ") !== opening.join(" ")) throw new ScoreError(`${what}: its moves do not begin with its opening`);
  if (r.moves.length > maxPlies) throw new ScoreError(`${what}: ${r.moves.length} plies, past the cap of ${maxPlies}`);
  const g = new Game();
  for (let i = 0; i < r.moves.length; i += 1) {
    if (!g.play(r.moves[i])) throw new ScoreError(`${what}: ply ${i + 1}, ${r.moves[i]}, is not a legal move`);
    if (i < r.moves.length - 1 && gameEnding(g) !== null) throw new ScoreError(`${what}: it was over after ply ${i + 1}, yet it goes on`);
  }
  const end = gameEnding(g);
  if (RULE_REASONS.includes(r.reason)) {
    if (end === null || end.reason !== r.reason || end.result !== r.result) throw new ScoreError(`${what}: its moves end it ${end === null ? "not at all" : `${end.result} by ${end.reason}`}, not ${r.result} by ${r.reason}`);
  } else if (ENTRY_LOSS_REASONS.includes(r.reason)) {
    if (end !== null) throw new ScoreError(`${what}: its moves end it ${end.result} by ${end.reason}, not by ${r.reason}`);
    const entryToMove = g.position.side === 0 === (r.colour === "white");
    if (!entryToMove) throw new ScoreError(`${what}: ${r.reason} on the house's move`);
    if (r.result !== lossFor(r.colour)) throw new ScoreError(`${what}: ${r.reason} is a loss for the entry, not ${r.result}`);
  } else throw new ScoreError(`${what}: a started game is not ${r.reason}`);
}
function scoreTrial(state, ref) {
  if (ref.max_plies !== MAX_PLIES || ref.adjudication_margin !== ADJUDICATION_MARGIN) throw new ScoreError(`the reference's ply cap ${ref.max_plies} and margin ${ref.adjudication_margin} are not this scorer's ${MAX_PLIES} and ${ADJUDICATION_MARGIN}`);
  if (state.games.length !== ref.games.length) throw new ScoreError(`the state holds ${state.games.length} games, the instance ${ref.games.length}`);
  let started = true;
  let abandoned = false;
  const rated = [];
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let own = 0;
  let spare = 0;
  state.games.forEach((r, i) => {
    const spec = ref.games[i];
    if (r.game !== spec.game || r.opponent !== spec.opponent || r.colour !== spec.colour || r.opening !== spec.opening.id) throw new ScoreError(`game ${i + 1} is not the instance's game ${spec.game} (${spec.opponent}, ${spec.colour}, ${spec.opening.id})`);
    if (r.reason === "unplayed") {
      started = false;
      if (r.moves.length !== 0 || r.result !== lossFor(r.colour)) throw new ScoreError(`game ${r.game}: unplayed, yet it has moves or is not a loss`);
    } else {
      if (!started) throw new ScoreError(`game ${r.game} was played after an unplayed game`);
      if (abandoned) throw new ScoreError(`game ${r.game} was played after an abandoned game`);
      if (r.reason === "abandoned") abandoned = true;
      checkGame(r, spec.opening.moves, ref.max_plies);
    }
    const points = pointsFor(r.result, r.colour);
    if (r.outcome !== outcomeFor(points)) throw new ScoreError(`game ${r.game}: ${r.result} with ${r.colour} is a ${outcomeFor(points)}, not a ${r.outcome}`);
    const anchor = ref.anchors[r.opponent];
    if (anchor === void 0) throw new ScoreError(`game ${r.game}: no anchor for ${r.opponent}`);
    rated.push({ anchor, points });
    if (points === 1) {
      wins += 1;
      spare += ref.max_plies - r.moves.length;
    } else if (points === 0) losses += 1;
    else draws += 1;
    own += entryMoves(r);
  });
  return {
    elo: performanceRating(rated, ref.elo_floor, ref.elo_cap),
    working: own > 0 ? 1 : 0,
    wins,
    draws,
    losses,
    spare_plies: spare
  };
}

// src/scorer/main.ts
var OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
var REFERENCE_DIR = process.env.MAKEFUN_REFERENCE_DIR || "/reference";
var SCORES_DIR = process.env.MAKEFUN_SCORES_DIR || "/scores";
function readText(dir, name) {
  try {
    return readFileSync(join(dir, name), "utf8");
  } catch (err) {
    throw new Error(`${name}: cannot be read: ${err.message}`);
  }
}
try {
  const ref = parseReferenceFile(readText(REFERENCE_DIR, REFERENCE_FILE));
  const state = parseStateFile(readText(OUTPUT_DIR, STATE_FILE));
  const scores = scoreTrial(state, ref);
  mkdirSync(SCORES_DIR, { recursive: true });
  writeFileSync(join(SCORES_DIR, "scores.json"), `${JSON.stringify(scores)}
`);
  const reasons = /* @__PURE__ */ new Map();
  for (const g of state.games) reasons.set(g.reason, (reasons.get(g.reason) ?? 0) + 1);
  process.stdout.write(`${state.games.length} games: ${scores.wins} won, ${scores.draws} drawn, ${scores.losses} lost (${[...reasons].map(([r, n]) => `${r} ${n}`).join(", ")})
`);
  process.stdout.write(`elo ${scores.elo} working ${scores.working} spare_plies ${scores.spare_plies}
`);
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exitCode = 1;
}
