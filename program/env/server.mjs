// env/server.mjs: built by scripts/competitions/build-agent-bundle.ts from src/server/main.ts with esbuild 0.28.2. Do not edit: rebuild it.
import { createRequire as __agentBundleCreateRequire } from 'node:module';
const require = __agentBundleCreateRequire(import.meta.url);

// src/server/main.ts
import { appendFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

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
var MATE = 1e5;
var PIECE_VALUES = [0, 100, 320, 330, 500, 900, 0];
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
function evaluate(p) {
  const b = p.board;
  let score = 0;
  let nonPawn = 0;
  const bishops = [0, 0];
  const kingAt = [0, 0];
  for (let sq = 0; sq < 128; sq += 1) {
    if (sq & 136) {
      sq += 7;
      continue;
    }
    const pc = b[sq];
    if (pc === 0) continue;
    const t = pieceType(pc);
    const colour = pieceColour(pc);
    const rel = colour === WHITE ? (sq >> 4) * 8 + (sq & 7) : (7 - (sq >> 4)) * 8 + (sq & 7);
    if (t === KING) {
      kingAt[colour] = rel;
      continue;
    }
    const v = PIECE_VALUES[t] + PST[t][rel];
    score += colour === WHITE ? v : -v;
    if (t !== PAWN) nonPawn += PIECE_VALUES[t];
    if (t === BISHOP) bishops[colour] += 1;
  }
  const phase = Math.min(nonPawn, OPENING_MATERIAL);
  const king = (rel) => Math.round((PST[KING][rel] * phase + PST[7][rel] * (OPENING_MATERIAL - phase)) / OPENING_MATERIAL);
  score += king(kingAt[WHITE]) - king(kingAt[BLACK]);
  if (bishops[WHITE] >= 2) score += 30;
  if (bishops[BLACK] >= 2) score -= 30;
  return p.side === WHITE ? score : 0 - score;
}
function randomMove(p, rng) {
  const moves = p.legalMoves();
  if (moves.length === 0) throw new Error("no legal move");
  return moves[rng(moves.length)];
}
function immediateGain(p, m) {
  let gain = 0;
  if (m & CAPTURE) gain += PIECE_VALUES[pieceType(p.board[moveTo(m)]) || PAWN];
  const promo = movePromotion(m);
  if (promo !== 0) gain += PIECE_VALUES[promo] - PIECE_VALUES[PAWN];
  return gain;
}
function greedyMove(p, rng) {
  const moves = p.legalMoves();
  if (moves.length === 0) throw new Error("no legal move");
  let best = -1;
  let tied = [];
  for (const m of moves) {
    let score = immediateGain(p, m);
    p.make(m);
    if (p.inCheck() && !p.hasLegalMove()) score = MATE;
    p.unmake();
    if (score > best) {
      best = score;
      tied = [m];
    } else if (score === best) tied.push(m);
  }
  return tied[rng(tied.length)];
}
var MAX_PLY = 128;
var TT_BITS = 17;
var TT_MASK = (1 << TT_BITS) - 1;
var EXACT = 1;
var LOWER = 2;
var UPPER = 3;
function newTable() {
  const n = 1 << TT_BITS;
  return { lo: new Uint32Array(n), hi: new Uint32Array(n), move: new Int32Array(n), score: new Int32Array(n), depth: new Int8Array(n), flag: new Uint8Array(n) };
}
var toTable = (score, ply) => score > MATE - MAX_PLY ? score + ply : score < -MATE + MAX_PLY ? score - ply : score;
var fromTable = (score, ply) => score > MATE - MAX_PLY ? score - ply : score < -MATE + MAX_PLY ? score + ply : score;
var Search = class {
  nodes = 0;
  tt = newTable();
  p;
  /** The hashes of every position from the game's start to the current one, the search path's included (the current one last). */
  lo = [];
  hi = [];
  killers = new Int32Array(MAX_PLY * 2);
  lists = [];
  scores = [];
  constructor(p, history) {
    this.p = p;
    for (const h of history) {
      const [hi, lo] = h.split(":");
      this.hi.push(Number(hi));
      this.lo.push(Number(lo));
    }
    if (this.lo.length === 0 || this.lo.at(-1) !== p.hashLo || this.hi.at(-1) !== p.hashHi) {
      this.hi.push(p.hashHi);
      this.lo.push(p.hashLo);
    }
    for (let i = 0; i <= MAX_PLY; i += 1) {
      this.lists.push([]);
      this.scores.push([]);
    }
  }
  /**
   * Whether the current position (the last hash) occurred before within its fifty-move window: an
   * earlier position with the same side to move, no capture or pawn move since.
   */
  repeated() {
    const p = this.p;
    const n = this.lo.length;
    const stop = Math.max(0, n - 1 - p.halfmove);
    for (let i = n - 3; i >= stop; i -= 2) if (this.lo[i] === p.hashLo && this.hi[i] === p.hashHi) return true;
    return false;
  }
  push() {
    this.lo.push(this.p.hashLo);
    this.hi.push(this.p.hashHi);
  }
  pop() {
    this.lo.pop();
    this.hi.pop();
  }
  /** Order moves: the table's move, promotions and captures by victim then attacker, the ply's killers, then the rest as generated. */
  order(moves, ply, scores, first = 0) {
    const b = this.p.board;
    scores.length = moves.length;
    const k0 = this.killers[ply * 2];
    const k1 = this.killers[ply * 2 + 1];
    for (let i = 0; i < moves.length; i += 1) {
      const m = moves[i];
      let s = 0;
      if (m & CAPTURE) s = 1e5 + 10 * PIECE_VALUES[pieceType(b[moveTo(m)]) || PAWN] - pieceType(b[moveFrom(m)]);
      if (movePromotion(m) !== 0) s += 2e5 + PIECE_VALUES[movePromotion(m)];
      if (s === 0 && m === k0) s = 5e4;
      else if (s === 0 && m === k1) s = 4e4;
      if (m === first) s = 1e6;
      scores[i] = s - i / 1e3;
    }
    for (let i = 1; i < moves.length; i += 1) {
      const m = moves[i];
      const s = scores[i];
      let j = i - 1;
      while (j >= 0 && scores[j] < s) {
        moves[j + 1] = moves[j];
        scores[j + 1] = scores[j];
        j -= 1;
      }
      moves[j + 1] = m;
      scores[j + 1] = s;
    }
  }
  /** The node budget of the iteration under way (0: none), and whether it ran out, which voids that iteration. */
  limit = 0;
  aborted = false;
  spent() {
    if (this.limit > 0 && this.nodes >= this.limit) this.aborted = true;
    return this.aborted;
  }
  /**
   * The quiescence search: out of check, the evaluation stands (the side to move may decline every
   * capture) and only captures and promotions are searched; in check, nothing stands, every evasion is
   * searched, and a position with none is mate.
   */
  quiesce(alpha, beta, ply) {
    this.nodes += 1;
    if (this.spent()) return 0;
    const p = this.p;
    const check = p.inCheck();
    let best = -MATE - 1;
    if (ply >= MAX_PLY) return evaluate(p);
    if (!check) {
      const stand = evaluate(p);
      if (stand >= beta) return stand;
      best = stand;
      if (stand > alpha) alpha = stand;
    }
    const moves = p.pseudoMoves(this.lists[ply], !check);
    this.order(moves, ply, this.scores[ply]);
    let legal = 0;
    for (let i = 0; i < moves.length; i += 1) {
      if (!p.make(moves[i])) continue;
      legal += 1;
      const score = -this.quiesce(-beta, -alpha, ply + 1);
      p.unmake();
      if (this.aborted) return 0;
      if (score > best) best = score;
      if (score >= beta) return score;
      if (score > alpha) alpha = score;
    }
    if (check && legal === 0) return -MATE + ply;
    return best;
  }
  negamax(depth, alpha, beta, ply) {
    const p = this.p;
    if (ply > 0 && (p.halfmove >= 100 || this.repeated())) return 0;
    if (depth <= 0 || ply >= MAX_PLY) return this.quiesce(alpha, beta, ply);
    this.nodes += 1;
    if (this.spent()) return 0;
    const tt = this.tt;
    const slot = p.hashLo & TT_MASK;
    let ttMove = 0;
    if (tt.flag[slot] !== 0 && tt.lo[slot] === p.hashLo && tt.hi[slot] === p.hashHi) {
      ttMove = tt.move[slot];
      if (tt.depth[slot] >= depth) {
        const s = fromTable(tt.score[slot], ply);
        const flag = tt.flag[slot];
        if (flag === EXACT || flag === LOWER && s >= beta || flag === UPPER && s <= alpha) return s;
      }
    }
    const alpha0 = alpha;
    const moves = p.pseudoMoves(this.lists[ply]);
    this.order(moves, ply, this.scores[ply], ttMove);
    let legal = 0;
    let best = -MATE - 1;
    let bestMove = 0;
    for (let i = 0; i < moves.length; i += 1) {
      const m = moves[i];
      if (!p.make(m)) continue;
      legal += 1;
      this.push();
      const score = -this.negamax(depth - 1, -beta, -alpha, ply + 1);
      this.pop();
      p.unmake();
      if (this.aborted) return 0;
      if (score > best) {
        best = score;
        bestMove = m;
      }
      if (score > alpha) alpha = score;
      if (alpha >= beta) {
        if ((m & CAPTURE) === 0 && movePromotion(m) === 0 && this.killers[ply * 2] !== m) {
          this.killers[ply * 2 + 1] = this.killers[ply * 2];
          this.killers[ply * 2] = m;
        }
        break;
      }
    }
    if (legal === 0) return p.inCheck() ? -MATE + ply : 0;
    tt.lo[slot] = p.hashLo;
    tt.hi[slot] = p.hashHi;
    tt.depth[slot] = depth;
    tt.score[slot] = toTable(best, ply);
    tt.move[slot] = bestMove;
    tt.flag[slot] = best <= alpha0 ? UPPER : best >= beta ? LOWER : EXACT;
    return best;
  }
  /**
   * Iterative deepening to `depth`: each iteration searches the root's moves best-first by the last
   * one's scores. With a node budget (`nodes` > 0) an iteration after the first that runs past it is
   * dropped whole, and the last whole one's move stands: the nodes, not a clock, decide where it stops.
   */
  root(depth, nodes) {
    const p = this.p;
    const moves = p.legalMoves();
    if (moves.length === 0) throw new Error("no legal move");
    let order = moves.map((m, i) => ({ m, i, score: 0 }));
    let best = { move: order[0].m, score: 0, depth: 0 };
    for (let d = 1; d <= depth; d += 1) {
      this.limit = d === 1 ? 0 : nodes;
      let alpha = -MATE - 1;
      for (const r of order) {
        p.make(r.m);
        this.push();
        r.score = -this.negamax(d - 1, -MATE - 1, -alpha, 1);
        this.pop();
        p.unmake();
        if (this.aborted) break;
        if (r.score > alpha) alpha = r.score;
      }
      if (this.aborted) break;
      order = [...order].sort((a, b) => b.score - a.score);
      best = { move: order[0].m, score: order[0].score, depth: d };
      if (best.score >= MATE - MAX_PLY) break;
    }
    return best;
  }
};
var MAX_SEARCH_DEPTH = 64;
function alphabetaMove(p, limits, history, stats) {
  const { depth, nodes } = limits;
  if (!Number.isSafeInteger(depth) || depth < 1 || depth > MAX_SEARCH_DEPTH) throw new RangeError(`depth ${depth} is not a whole number from 1 to ${MAX_SEARCH_DEPTH}`);
  if (!Number.isSafeInteger(nodes) || nodes < 0) throw new RangeError(`nodes ${nodes} is not a whole number of at least 0`);
  const s = new Search(p, history);
  const r = s.root(depth, nodes);
  if (stats !== void 0) {
    stats.nodes = s.nodes;
    stats.score = r.score;
  }
  return r.move;
}

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
function opponentById(id) {
  return OPPONENTS.find((o) => o.id === id);
}
var COLOURS = ["white", "black"];
var GAMES_PER_OPPONENT = COLOURS.length;
var GAMES = OPPONENTS.length * GAMES_PER_OPPONENT;
var MAX_PLIES = 200;
var ADJUDICATION_MARGIN = 5;
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
function houseMove(o, g, rng) {
  if (o.kind === "random") return moveUci(randomMove(g.position, rng));
  if (o.kind === "greedy") return moveUci(greedyMove(g.position, rng));
  return moveUci(alphabetaMove(g.position, { depth: o.depth, nodes: o.nodes }, g.hashes));
}

// src/shared/files.ts
var GAUNTLET_FILE = "gauntlet.json";
var STATE_FILE = "state.json";
var TRANSCRIPT_FILE = "transcript.ndjson";
var GAUNTLET_SCHEMA = "tiny-chess-01/gauntlet/v1";
var STATE_SCHEMA = "tiny-chess-01/state/v1";
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
var GAUNTLET_KEYS = ["schema", "house_seed", "max_plies", "adjudication_margin", "move_limit_ms", "games"];
function parseGauntletFile(source) {
  const name = GAUNTLET_FILE;
  const o = jsonObject(name, source);
  exactKeys(name, o, GAUNTLET_KEYS);
  if (o.schema !== GAUNTLET_SCHEMA) throw new Error(`${name}: schema is not ${GAUNTLET_SCHEMA}`);
  if (typeof o.house_seed !== "string" || !/^[0-9a-f]{64}$/.test(o.house_seed)) throw new Error(`${name}: house_seed is not 64 lowercase hex characters`);
  return {
    schema: GAUNTLET_SCHEMA,
    house_seed: o.house_seed,
    max_plies: count(name, o, "max_plies", OPENING_PLIES + 1),
    adjudication_margin: count(name, o, "adjudication_margin", 1),
    move_limit_ms: count(name, o, "move_limit_ms", 1),
    games: gameSpecs(name, o.games)
  };
}
function jsonText(v) {
  return `${JSON.stringify(v, null, 2)}
`;
}

// src/chess/fast.ts
var MAX_PLY2 = 128;
var MAX_SEARCH_DEPTH2 = 64;
var KNIGHT_STEPS2 = Int32Array.of(33, 31, 18, 14, -14, -18, -31, -33);
var KING_STEPS2 = Int32Array.of(1, -1, 16, -16, 15, 17, -15, -17);
var BISHOP_STEPS2 = Int32Array.of(15, 17, -15, -17);
var ROOK_STEPS2 = Int32Array.of(1, -1, 16, -16);
var WK2 = 1;
var WQ2 = 2;
var BK2 = 4;
var BQ2 = 8;
var CASTLE_KEEP2 = new Int8Array(128).fill(15);
CASTLE_KEEP2[0] = 15 & ~WQ2;
CASTLE_KEEP2[7] = 15 & ~WK2;
CASTLE_KEEP2[4] = 15 & ~(WK2 | WQ2);
CASTLE_KEEP2[112] = 15 & ~BQ2;
CASTLE_KEEP2[119] = 15 & ~BK2;
CASTLE_KEEP2[116] = 15 & ~(BK2 | BQ2);
var Z = (() => {
  let s = 2654435769;
  const next = () => {
    s = s + 2654435769 | 0;
    let z = s;
    z = Math.imul(z ^ z >>> 16, 2246822507);
    z = Math.imul(z ^ z >>> 13, 3266489909);
    return (z ^ z >>> 16) >>> 0;
  };
  const table = (n) => {
    const t = new Int32Array(n * 2);
    for (let i = 0; i < t.length; i += 1) t[i] = next() | 0;
    return t;
  };
  return { pieces: table(16 * 128), side: table(1), castling: table(16), ep: table(8) };
})();
var ZP = Z.pieces;
var ZC = Z.castling;
var ZE = Z.ep;
var ZS_LO = Z.side[0];
var ZS_HI = Z.side[1];
var centre2 = (i) => Math.min(i, 7 - i);
var PST2 = (() => {
  const tables = [];
  for (let t = 0; t <= 7; t += 1) tables.push(new Int16Array(64));
  const pawnAdvance = [0, 0, 4, 8, 14, 24, 40, 0];
  const pawnCentre = [0, 0, 0, 10, 15, 10, 5, 0];
  for (let r = 0; r < 8; r += 1) {
    for (let f = 0; f < 8; f += 1) {
      const i = r * 8 + f;
      const c = centre2(f) + centre2(r);
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
var OPENING_MATERIAL2 = 2 * (2 * 320 + 2 * 330 + 2 * 500 + 900);
var relOf = (sq, colour) => colour === WHITE ? (sq >> 4) * 8 + (sq & 7) : (7 - (sq >> 4)) * 8 + (sq & 7);
var PSV = (() => {
  const t = new Int32Array(16 * 128);
  for (let colour = 0; colour < 2; colour += 1) {
    for (let type = PAWN; type < KING; type += 1) {
      for (let sq = 0; sq < 128; sq += 1) {
        if (sq & 136) continue;
        const v = PIECE_VALUES[type] + PST2[type][relOf(sq, colour)];
        t[(type | colour << 3) * 128 + sq] = colour === WHITE ? v : -v;
      }
    }
  }
  return t;
})();
var NPV = (() => {
  const t = new Int32Array(16);
  for (let colour = 0; colour < 2; colour += 1) for (const type of [KNIGHT, BISHOP, ROOK, QUEEN]) t[type | colour << 3] = PIECE_VALUES[type];
  return t;
})();
var KING_MG = new Int32Array(256);
var KING_EG = new Int32Array(256);
for (let colour = 0; colour < 2; colour += 1) {
  for (let sq = 0; sq < 128; sq += 1) {
    if (sq & 136) continue;
    KING_MG[colour * 128 + sq] = PST2[KING][relOf(sq, colour)];
    KING_EG[colour * 128 + sq] = PST2[7][relOf(sq, colour)];
  }
}
var VICTIM = (() => {
  const t = new Int32Array(16);
  for (let pc = 0; pc < 16; pc += 1) t[pc] = PIECE_VALUES[pc & 7 || PAWN] ?? 0;
  return t;
})();
var LINE_STEP = (() => {
  const t = new Int8Array(239);
  for (const d of KING_STEPS2) for (let k = 1; k < 8; k += 1) t[k * d + 119] = d;
  return t;
})();
var A_WPAWN = 1;
var A_BPAWN = 2;
var A_KNIGHT = 4;
var A_BISHOP = 8;
var A_ROOK = 16;
var A_QUEEN = 32;
var A_KING = 64;
var ATTACKER_BIT = (() => {
  const t = new Int8Array(16);
  t[PAWN] = A_WPAWN;
  t[PAWN | 8] = A_BPAWN;
  for (const c of [0, 8]) {
    t[KNIGHT | c] = A_KNIGHT;
    t[BISHOP | c] = A_BISHOP;
    t[ROOK | c] = A_ROOK;
    t[QUEEN | c] = A_QUEEN;
    t[KING | c] = A_KING;
  }
  return t;
})();
var ATTACKERS = (() => {
  const t = new Int8Array(239);
  t[15 + 119] |= A_WPAWN;
  t[17 + 119] |= A_WPAWN;
  t[-15 + 119] |= A_BPAWN;
  t[-17 + 119] |= A_BPAWN;
  for (const d of KNIGHT_STEPS2) t[d + 119] |= A_KNIGHT;
  for (const d of KING_STEPS2) t[d + 119] |= A_KING;
  for (const d of BISHOP_STEPS2) for (let k = 1; k < 8; k += 1) t[k * d + 119] |= A_BISHOP | A_QUEEN;
  for (const d of ROOK_STEPS2) for (let k = 1; k < 8; k += 1) t[k * d + 119] |= A_ROOK | A_QUEEN;
  return t;
})();
var idx64 = (sq) => sq + (sq & 7) >> 1;
var STACK = 512;
var FastBoard = class {
  b = new Int8Array(128);
  side = WHITE;
  castling = 0;
  ep = -1;
  halfmove = 0;
  kings = new Int32Array(2);
  /** The Zobrist hash's halves as int32 (rules.ts's bits). */
  lo = 0;
  hi = 0;
  /** Material and piece-square terms but the kings', from white's side. */
  ps = 0;
  nonPawn = 0;
  bishopsW = 0;
  bishopsB = 0;
  /** Each side's pieces: [colour * 2 + word], bit i of word w the square of index 32w + i. */
  occ = new Int32Array(4);
  /** Whether the side to move is in check: set from the position, then by every move make() plays (givesCheck). */
  check = false;
  u = 0;
  uMove = new Int32Array(STACK);
  uCaptured = new Int8Array(STACK);
  uCastling = new Int8Array(STACK);
  uEp = new Int16Array(STACK);
  uHalfmove = new Int32Array(STACK);
  uLo = new Int32Array(STACK);
  uHi = new Int32Array(STACK);
  uPs = new Int32Array(STACK);
  uNonPawn = new Int32Array(STACK);
  uBishops = new Int8Array(STACK * 2);
  uCheck = new Uint8Array(STACK);
  constructor(p) {
    this.b.set(p.board);
    this.side = p.side;
    this.castling = p.castling;
    this.ep = p.ep;
    this.halfmove = p.halfmove;
    this.kings[0] = p.kings[0];
    this.kings[1] = p.kings[1];
    this.lo = p.hashLo | 0;
    this.hi = p.hashHi | 0;
    for (let sq = 0; sq < 128; sq += 1) {
      if (sq & 136) continue;
      const pc = this.b[sq];
      if (pc === 0) continue;
      this.add(pc, sq);
    }
    this.check = this.inCheck();
  }
  /** The hash's halves as rules.ts holds them (uint32). */
  get hashLo() {
    return this.lo >>> 0;
  }
  get hashHi() {
    return this.hi >>> 0;
  }
  add(pc, sq) {
    this.ps += PSV[pc * 128 + sq];
    this.nonPawn += NPV[pc];
    if ((pc & 7) === BISHOP) {
      if (pc >> 3 === WHITE) this.bishopsW += 1;
      else this.bishopsB += 1;
    }
    const i = idx64(sq);
    this.occ[pc >> 3 << 1 | i >> 5] ^= 1 << (i & 31);
  }
  remove(pc, sq) {
    this.ps -= PSV[pc * 128 + sq];
    this.nonPawn -= NPV[pc];
    if ((pc & 7) === BISHOP) {
      if (pc >> 3 === WHITE) this.bishopsW -= 1;
      else this.bishopsB -= 1;
    }
    const i = idx64(sq);
    this.occ[pc >> 3 << 1 | i >> 5] ^= 1 << (i & 31);
  }
  /** engine.ts evaluate: the side to move's centipawns. */
  evaluate() {
    const phase = this.nonPawn < OPENING_MATERIAL2 ? this.nonPawn : OPENING_MATERIAL2;
    const rest = OPENING_MATERIAL2 - phase;
    const kw = this.kings[WHITE];
    const kb = 128 + this.kings[BLACK];
    let score = this.ps + Math.round((KING_MG[kw] * phase + KING_EG[kw] * rest) / OPENING_MATERIAL2) - Math.round((KING_MG[kb] * phase + KING_EG[kb] * rest) / OPENING_MATERIAL2);
    if (this.bishopsW >= 2) score += 30;
    if (this.bishopsB >= 2) score -= 30;
    return this.side === WHITE ? score : 0 - score;
  }
  /**
   * rules.ts attacked: whether square `sq` is attacked by a piece of `by`. It walks `by`'s pieces, not
   * the rays from `sq`: a piece whose step from its square to `sq` is none of its type's (ATTACKERS) is
   * passed over, and a slider on a line with `sq` attacks it when the squares between are empty.
   */
  attacked(sq, by) {
    const b = this.b;
    for (let w = 0; w < 2; w += 1) {
      let bits = this.occ[by << 1 | w];
      while (bits !== 0) {
        const low = bits & -bits;
        bits ^= low;
        const i = w << 5 | 31 - Math.clz32(low);
        const from = i >> 3 << 4 | i & 7;
        const pc = b[from];
        const delta = sq - from + 119;
        if ((ATTACKERS[delta] & ATTACKER_BIT[pc]) === 0) continue;
        const t = pc & 7;
        if (t === BISHOP || t === ROOK || t === QUEEN) {
          const d = LINE_STEP[delta];
          let s = from + d;
          while (s !== sq && b[s] === 0) s += d;
          if (s === sq) return true;
          continue;
        }
        return true;
      }
    }
    return false;
  }
  inCheck() {
    return this.attacked(this.kings[this.side], this.side ^ 1);
  }
  enemyPawnBeside(sq, side) {
    const pawn = PAWN | side << 3;
    return (sq + 1 & 136) === 0 && this.b[sq + 1] === pawn || (sq - 1 & 136) === 0 && this.b[sq - 1] === pawn;
  }
  /** rules.ts pseudoMoves into `out` from index 0, in its order; returns the count. */
  moves(out, capturesOnly) {
    const b = this.b;
    const us = this.side;
    const them = us ^ 1;
    const ep = this.ep;
    let n = 0;
    for (let w = 0; w < 2; w += 1) {
      let bits = this.occ[us << 1 | w];
      while (bits !== 0) {
        const low = bits & -bits;
        bits ^= low;
        const i = w << 5 | 31 - Math.clz32(low);
        const from = i >> 3 << 4 | i & 7;
        const type = b[from] & 7;
        if (type === PAWN) {
          const fwd = us === WHITE ? 16 : -16;
          const rank = from >> 4;
          const last = rank === (us === WHITE ? 6 : 1);
          const one = from + fwd;
          if (b[one] === 0) {
            if (last) {
              for (let promo = QUEEN; promo >= KNIGHT; promo -= 1) out[n++] = from | one << 7 | promo << 14;
            } else if (!capturesOnly) {
              out[n++] = from | one << 7;
              const two = one + fwd;
              if (rank === (us === WHITE ? 1 : 6) && b[two] === 0) out[n++] = from | two << 7 | DOUBLE_PUSH;
            }
          }
          for (let s = 0; s < 2; s += 1) {
            const to = from + fwd + (s === 0 ? -1 : 1);
            if (to & 136) continue;
            const target = b[to];
            if (target !== 0 && target >> 3 === them) {
              if (last) {
                for (let promo = QUEEN; promo >= KNIGHT; promo -= 1) out[n++] = from | to << 7 | promo << 14 | CAPTURE;
              } else out[n++] = from | to << 7 | CAPTURE;
            } else if (to === ep) out[n++] = from | to << 7 | CAPTURE | EN_PASSANT;
          }
          continue;
        }
        if (type === KNIGHT || type === KING) {
          const steps2 = type === KNIGHT ? KNIGHT_STEPS2 : KING_STEPS2;
          for (let k = 0; k < 8; k += 1) {
            const to = from + steps2[k];
            if (to & 136) continue;
            const target = b[to];
            if (target === 0) {
              if (!capturesOnly) out[n++] = from | to << 7;
            } else if (target >> 3 === them) out[n++] = from | to << 7 | CAPTURE;
          }
          if (type === KING && !capturesOnly) n = this.castlingMoves(out, n);
          continue;
        }
        const steps = type === BISHOP ? BISHOP_STEPS2 : type === ROOK ? ROOK_STEPS2 : KING_STEPS2;
        for (let k = 0; k < steps.length; k += 1) {
          const d = steps[k];
          for (let to = from + d; (to & 136) === 0; to += d) {
            const target = b[to];
            if (target === 0) {
              if (!capturesOnly) out[n++] = from | to << 7;
              continue;
            }
            if (target >> 3 === them) out[n++] = from | to << 7 | CAPTURE;
            break;
          }
        }
      }
    }
    return n;
  }
  castlingMoves(out, n) {
    const b = this.b;
    const us = this.side;
    const them = us ^ 1;
    const base = us === WHITE ? 0 : 112;
    const king = base + 4;
    if (this.kings[us] !== king) return n;
    const short = us === WHITE ? WK2 : BK2;
    const long = us === WHITE ? WQ2 : BQ2;
    if ((this.castling & (short | long)) === 0 || this.check) return n;
    if (this.castling & short && b[base + 5] === 0 && b[base + 6] === 0 && !this.attacked(base + 5, them) && !this.attacked(base + 6, them)) {
      out[n++] = king | base + 6 << 7 | CASTLE;
    }
    if (this.castling & long && b[base + 3] === 0 && b[base + 2] === 0 && b[base + 1] === 0 && !this.attacked(base + 3, them) && !this.attacked(base + 2, them)) {
      out[n++] = king | base + 2 << 7 | CASTLE;
    }
    return n;
  }
  /** Whether piece `pc` on `sq` attacks square `target` (a slider: through empty squares). */
  hits(pc, sq, target) {
    const delta = target - sq + 119;
    if ((ATTACKERS[delta] & ATTACKER_BIT[pc]) === 0) return false;
    const t = pc & 7;
    if (t !== BISHOP && t !== ROOK && t !== QUEEN) return true;
    const d = LINE_STEP[delta];
    let s = sq + d;
    while (s !== target && this.b[s] === 0) s += d;
    return s === target;
  }
  /** Whether the first piece from `king` along the line through `through` is a slider of `by` that moves along it. */
  lineAttack(king, through, by) {
    const d = LINE_STEP[through - king + 119];
    if (d === 0) return false;
    const diagonal = d === 15 || d === 17 || d === -15 || d === -17;
    for (let t = king + d; (t & 136) === 0; t += d) {
      const x = this.b[t];
      if (x === 0) continue;
      if (x >> 3 !== by) return false;
      const xt = x & 7;
      return xt === QUEEN || xt === (diagonal ? BISHOP : ROOK);
    }
    return false;
  }
  /**
   * rules.ts make: play a pseudo-legal move; false, the board unchanged, when it leaves the mover's king
   * attacked. The legality test and the check it gives look only where the move can change them (the
   * header): out of check, a move by a piece other than the king, no en passant, exposes its own king
   * only along the line through its from-square; and it checks the other king only from its to-square
   * or along the line through its from-square (castling and en passant, which move or take a second
   * piece, get the full attack test).
   */
  make(m) {
    const inCheck = this.check;
    const b = this.b;
    const from = m & 127;
    const to = m >> 7 & 127;
    const pc = b[from];
    const us = this.side;
    const them = us ^ 1;
    const captureSq = m & EN_PASSANT ? us === WHITE ? to - 16 : to + 16 : to;
    const captured = b[captureSq];
    const u = this.u;
    this.uMove[u] = m;
    this.uCaptured[u] = captured;
    this.uCastling[u] = this.castling;
    this.uEp[u] = this.ep;
    this.uHalfmove[u] = this.halfmove;
    this.uLo[u] = this.lo;
    this.uHi[u] = this.hi;
    this.uPs[u] = this.ps;
    this.uNonPawn[u] = this.nonPawn;
    this.uBishops[u * 2] = this.bishopsW;
    this.uBishops[u * 2 + 1] = this.bishopsB;
    this.uCheck[u] = inCheck ? 1 : 0;
    this.u = u + 1;
    let lo = this.lo;
    let hi = this.hi;
    if (captured !== 0) {
      lo ^= ZP[(captured * 128 + captureSq) * 2];
      hi ^= ZP[(captured * 128 + captureSq) * 2 + 1];
      b[captureSq] = 0;
      this.remove(captured, captureSq);
    }
    lo ^= ZP[(pc * 128 + from) * 2];
    hi ^= ZP[(pc * 128 + from) * 2 + 1];
    b[from] = 0;
    this.remove(pc, from);
    const promo = m >> 14 & 7;
    const placed = promo === 0 ? pc : promo | us << 3;
    b[to] = placed;
    this.add(placed, to);
    lo ^= ZP[(placed * 128 + to) * 2];
    hi ^= ZP[(placed * 128 + to) * 2 + 1];
    const isKing = (pc & 7) === KING;
    if (isKing) this.kings[us] = to;
    if (m & CASTLE) {
      const rookFrom = to > from ? from + 3 : from - 4;
      const rookTo = to > from ? from + 1 : from - 1;
      const rook = b[rookFrom];
      lo ^= ZP[(rook * 128 + rookFrom) * 2];
      hi ^= ZP[(rook * 128 + rookFrom) * 2 + 1];
      b[rookFrom] = 0;
      this.remove(rook, rookFrom);
      b[rookTo] = rook;
      this.add(rook, rookTo);
      lo ^= ZP[(rook * 128 + rookTo) * 2];
      hi ^= ZP[(rook * 128 + rookTo) * 2 + 1];
    }
    lo ^= ZC[this.castling * 2];
    hi ^= ZC[this.castling * 2 + 1];
    this.castling &= CASTLE_KEEP2[from] & CASTLE_KEEP2[to];
    lo ^= ZC[this.castling * 2];
    hi ^= ZC[this.castling * 2 + 1];
    if (this.ep !== -1) {
      lo ^= ZE[(this.ep & 7) * 2];
      hi ^= ZE[(this.ep & 7) * 2 + 1];
    }
    this.ep = -1;
    if (m & DOUBLE_PUSH && this.enemyPawnBeside(to, them)) {
      this.ep = from + to >> 1;
      lo ^= ZE[(this.ep & 7) * 2];
      hi ^= ZE[(this.ep & 7) * 2 + 1];
    }
    this.halfmove = (pc & 7) === PAWN || captured !== 0 ? 0 : this.halfmove + 1;
    this.side = them;
    this.lo = lo ^ ZS_LO;
    this.hi = hi ^ ZS_HI;
    const k = this.kings[us];
    const special = (m & (CASTLE | EN_PASSANT)) !== 0;
    if (isKing || inCheck || special ? this.attacked(k, them) : this.lineAttack(k, from, them)) {
      this.unmake();
      return false;
    }
    const ek = this.kings[them];
    this.check = special ? this.attacked(ek, us) : this.hits(placed, to, ek) || this.lineAttack(ek, from, us);
    return true;
  }
  /** rules.ts unmake: take back the last move make() made. */
  unmake() {
    const u = this.u -= 1;
    const b = this.b;
    const m = this.uMove[u];
    const from = m & 127;
    const to = m >> 7 & 127;
    this.side ^= 1;
    const us = this.side;
    const placed = b[to];
    const pc = m >> 14 & 7 ? PAWN | us << 3 : placed;
    const i = idx64(to);
    const j = idx64(from);
    const occ = this.occ;
    occ[us << 1 | i >> 5] ^= 1 << (i & 31);
    occ[us << 1 | j >> 5] ^= 1 << (j & 31);
    b[from] = pc;
    b[to] = 0;
    if ((pc & 7) === KING) this.kings[us] = from;
    const captured = this.uCaptured[u];
    if (captured !== 0) {
      const sq = m & EN_PASSANT ? us === WHITE ? to - 16 : to + 16 : to;
      b[sq] = captured;
      const c = idx64(sq);
      occ[(us ^ 1) << 1 | c >> 5] ^= 1 << (c & 31);
    }
    if (m & CASTLE) {
      const rookFrom = to > from ? from + 3 : from - 4;
      const rookTo = to > from ? from + 1 : from - 1;
      b[rookFrom] = b[rookTo];
      b[rookTo] = 0;
      const rf = idx64(rookFrom);
      const rt = idx64(rookTo);
      occ[us << 1 | rf >> 5] ^= 1 << (rf & 31);
      occ[us << 1 | rt >> 5] ^= 1 << (rt & 31);
    }
    this.castling = this.uCastling[u];
    this.ep = this.uEp[u];
    this.halfmove = this.uHalfmove[u];
    this.lo = this.uLo[u];
    this.hi = this.uHi[u];
    this.ps = this.uPs[u];
    this.nonPawn = this.uNonPawn[u];
    this.bishopsW = this.uBishops[u * 2];
    this.bishopsB = this.uBishops[u * 2 + 1];
    this.check = this.uCheck[u] === 1;
  }
  /** rules.ts legalMoves: every legal move, in generation order. */
  legalMoves() {
    const list = new Int32Array(256);
    const n = this.moves(list, false);
    const out = [];
    for (let i = 0; i < n; i += 1) {
      if (this.make(list[i])) {
        this.unmake();
        out.push(list[i]);
      }
    }
    return out;
  }
};
var TT_BITS2 = 17;
var TT_SIZE = 1 << TT_BITS2;
var TT_MASK2 = TT_SIZE - 1;
var EXACT2 = 1;
var LOWER2 = 2;
var UPPER2 = 3;
var TT = {
  stamp: new Uint32Array(TT_SIZE),
  lo: new Int32Array(TT_SIZE),
  hi: new Int32Array(TT_SIZE),
  move: new Int32Array(TT_SIZE),
  score: new Int32Array(TT_SIZE),
  depth: new Int8Array(TT_SIZE),
  flag: new Uint8Array(TT_SIZE)
};
var searches = 0;
var LISTS = [];
var KEYS = [];
for (let i = 0; i <= MAX_PLY2; i += 1) {
  LISTS.push(new Int32Array(256));
  KEYS.push(new Int32Array(256));
}
var PICKED = 3;
var toTable2 = (score, ply) => score > MATE - MAX_PLY2 ? score + ply : score < -MATE + MAX_PLY2 ? score - ply : score;
var fromTable2 = (score, ply) => score > MATE - MAX_PLY2 ? score - ply : score < -MATE + MAX_PLY2 ? score + ply : score;
var FastSearch = class _FastSearch {
  nodes = 0;
  limit = 0;
  aborted = false;
  p;
  stamp;
  /** The hashes of every position from the game's start to the current one, as int32 (the current one last). */
  los = [];
  his = [];
  killers = new Int32Array(MAX_PLY2 * 2);
  constructor(p, history) {
    this.p = p;
    searches = searches + 1 >>> 0;
    if (searches === 0) {
      TT.stamp.fill(0);
      searches = 1;
    }
    this.stamp = searches;
    for (const h of history) {
      const [hi, lo] = h.split(":");
      this.his.push(Number(hi) | 0);
      this.los.push(Number(lo) | 0);
    }
    if (this.los.length === 0 || this.los.at(-1) !== p.lo || this.his.at(-1) !== p.hi) {
      this.his.push(p.hi);
      this.los.push(p.lo);
    }
  }
  repeated() {
    const p = this.p;
    const n = this.los.length;
    const stop = Math.max(0, n - 1 - p.halfmove);
    const lo = p.lo;
    const hi = p.hi;
    for (let i = n - 3; i >= stop; i -= 2) if (this.los[i] === lo && this.his[i] === hi) return true;
    return false;
  }
  /** engine.ts order's keys (the header), s * 1000 - i. */
  keys(moves, n, ply, keys, first) {
    const b = this.p.b;
    const k0 = this.killers[ply * 2];
    const k1 = this.killers[ply * 2 + 1];
    for (let i = 0; i < n; i += 1) {
      const m = moves[i];
      let s = 0;
      if (m & CAPTURE) s = 1e5 + 10 * VICTIM[b[m >> 7 & 127]] - (b[m & 127] & 7);
      const promo = m >> 14 & 7;
      if (promo !== 0) s += 2e5 + PIECE_VALUES[promo];
      if (s === 0 && m === k0) s = 5e4;
      else if (s === 0 && m === k1) s = 4e4;
      if (m === first) s = 1e6;
      keys[i] = s * 1e3 - i;
    }
  }
  /**
   * The sorted order's i-th move, called for i = 0, 1, 2, ... in turn: the first PICKED are each the best
   * of the moves left, brought to i (a cut-off soon after needs no sort); at i = PICKED the rest are
   * insertion-sorted at once (their keys mostly fall in generation order already, so it is about linear).
   */
  static next(moves, keys, i, n) {
    if (i > PICKED) return moves[i];
    if (i === PICKED) {
      for (let a = i + 1; a < n; a += 1) {
        const m2 = moves[a];
        const k = keys[a];
        let j = a - 1;
        while (j >= i && keys[j] < k) {
          moves[j + 1] = moves[j];
          keys[j + 1] = keys[j];
          j -= 1;
        }
        moves[j + 1] = m2;
        keys[j + 1] = k;
      }
      return moves[i];
    }
    let best = i;
    let bk = keys[i];
    for (let j = i + 1; j < n; j += 1) {
      if (keys[j] > bk) {
        bk = keys[j];
        best = j;
      }
    }
    const m = moves[best];
    if (best !== i) {
      moves[best] = moves[i];
      keys[best] = keys[i];
      moves[i] = m;
      keys[i] = bk;
    }
    return m;
  }
  spent() {
    if (this.limit > 0 && this.nodes >= this.limit) this.aborted = true;
    return this.aborted;
  }
  quiesce(alpha, beta, ply) {
    this.nodes += 1;
    if (this.spent()) return 0;
    const p = this.p;
    const check = p.check;
    let best = -MATE - 1;
    if (ply >= MAX_PLY2) return p.evaluate();
    if (!check) {
      const stand = p.evaluate();
      if (stand >= beta) return stand;
      best = stand;
      if (stand > alpha) alpha = stand;
    }
    const moves = LISTS[ply];
    const keys = KEYS[ply];
    const n = p.moves(moves, !check);
    this.keys(moves, n, ply, keys, 0);
    let legal = 0;
    for (let i = 0; i < n; i += 1) {
      const m = _FastSearch.next(moves, keys, i, n);
      if (!p.make(m)) continue;
      legal += 1;
      const score = -this.quiesce(-beta, -alpha, ply + 1);
      p.unmake();
      if (this.aborted) return 0;
      if (score > best) best = score;
      if (score >= beta) return score;
      if (score > alpha) alpha = score;
    }
    if (check && legal === 0) return -MATE + ply;
    return best;
  }
  negamax(depth, alpha, beta, ply) {
    const p = this.p;
    if (ply > 0 && (p.halfmove >= 100 || this.repeated())) return 0;
    if (depth <= 0 || ply >= MAX_PLY2) return this.quiesce(alpha, beta, ply);
    this.nodes += 1;
    if (this.spent()) return 0;
    const slot = p.lo & TT_MASK2;
    let ttMove = 0;
    if (TT.stamp[slot] === this.stamp && TT.lo[slot] === p.lo && TT.hi[slot] === p.hi) {
      ttMove = TT.move[slot];
      if (TT.depth[slot] >= depth) {
        const s = fromTable2(TT.score[slot], ply);
        const flag = TT.flag[slot];
        if (flag === EXACT2 || flag === LOWER2 && s >= beta || flag === UPPER2 && s <= alpha) return s;
      }
    }
    const alpha0 = alpha;
    const check = p.check;
    const moves = LISTS[ply];
    const keys = KEYS[ply];
    const n = p.moves(moves, false);
    this.keys(moves, n, ply, keys, ttMove);
    let legal = 0;
    let best = -MATE - 1;
    let bestMove = 0;
    for (let i = 0; i < n; i += 1) {
      const m = _FastSearch.next(moves, keys, i, n);
      if (!p.make(m)) continue;
      legal += 1;
      this.los.push(p.lo);
      this.his.push(p.hi);
      const score = -this.negamax(depth - 1, -beta, -alpha, ply + 1);
      this.los.pop();
      this.his.pop();
      p.unmake();
      if (this.aborted) return 0;
      if (score > best) {
        best = score;
        bestMove = m;
      }
      if (score > alpha) alpha = score;
      if (alpha >= beta) {
        if ((m & CAPTURE) === 0 && (m >> 14 & 7) === 0 && this.killers[ply * 2] !== m) {
          this.killers[ply * 2 + 1] = this.killers[ply * 2];
          this.killers[ply * 2] = m;
        }
        break;
      }
    }
    if (legal === 0) return check ? -MATE + ply : 0;
    TT.stamp[slot] = this.stamp;
    TT.lo[slot] = p.lo;
    TT.hi[slot] = p.hi;
    TT.depth[slot] = depth;
    TT.score[slot] = toTable2(best, ply);
    TT.move[slot] = bestMove;
    TT.flag[slot] = best <= alpha0 ? UPPER2 : best >= beta ? LOWER2 : EXACT2;
    return best;
  }
  /** engine.ts Search.root, the same iterations and the same stable sort. */
  root(depth, nodes) {
    const p = this.p;
    const moves = p.legalMoves();
    if (moves.length === 0) throw new Error("no legal move");
    let order = moves.map((m, i) => ({ m, i, score: 0 }));
    let best = { move: order[0].m, score: 0, depth: 0 };
    for (let d = 1; d <= depth; d += 1) {
      this.limit = d === 1 ? 0 : nodes;
      let alpha = -MATE - 1;
      for (const r of order) {
        p.make(r.m);
        this.los.push(p.lo);
        this.his.push(p.hi);
        r.score = -this.negamax(d - 1, -MATE - 1, -alpha, 1);
        this.los.pop();
        this.his.pop();
        p.unmake();
        if (this.aborted) break;
        if (r.score > alpha) alpha = r.score;
      }
      if (this.aborted) break;
      order = [...order].sort((a, b) => b.score - a.score);
      best = { move: order[0].m, score: order[0].score, depth: d };
      if (best.score >= MATE - MAX_PLY2) break;
    }
    return best;
  }
};
function fastAlphabetaMove(p, limits, history, stats) {
  const { depth, nodes } = limits;
  if (!Number.isSafeInteger(depth) || depth < 1 || depth > MAX_SEARCH_DEPTH2) throw new RangeError(`depth ${depth} is not a whole number from 1 to ${MAX_SEARCH_DEPTH2}`);
  if (!Number.isSafeInteger(nodes) || nodes < 0) throw new RangeError(`nodes ${nodes} is not a whole number of at least 0`);
  const s = new FastSearch(new FastBoard(p), history);
  const r = s.root(depth, nodes);
  if (stats !== void 0) {
    stats.nodes = s.nodes;
    stats.score = r.score;
  }
  return r.move;
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

// src/server/match.ts
function refuse(status, error, message) {
  return { status, body: { error, message } };
}
var outcomeOf = (ending, spec) => {
  const points = pointsFor(ending.result, spec.colour);
  return points === 1 ? "win" : points === 0 ? "loss" : "draw";
};
var Gauntlet = class {
  file;
  clock;
  games;
  /** The index of the game in play, or of the next to start; games.length once every game is over. */
  current = 0;
  events = [];
  /** The entry's think time behind the last /move or /resign for the game in play (the call log's), or null. */
  lastThinkMs = null;
  constructor(file, clock) {
    this.file = file;
    this.clock = clock;
    this.games = file.games.map((spec) => {
      const opponent = opponentById(spec.opponent);
      if (opponent === void 0) throw new Error(`game ${spec.game}: no opponent ${spec.opponent}`);
      const stream = new Stream(file.house_seed, `game/${spec.game}`);
      return { spec, opponent, rng: (n) => stream.int(n), game: null, ending: null, servedAt: 0 };
    });
  }
  refused(path, a) {
    this.events.push({ kind: "refused", path, status: a.status, error: String(a.body.error) });
    return a;
  }
  /** The house's move in the game in play, then whether that ended it. */
  houseReply(pl) {
    const g = pl.game;
    const o = pl.opponent;
    const m = o.kind === "alphabeta" ? moveUci(fastAlphabetaMove(g.position, { depth: o.depth, nodes: o.nodes }, g.hashes)) : houseMove(o, g, pl.rng);
    if (!g.play(m)) throw new Error(`game ${pl.spec.game}: the house played ${m}, not a legal move`);
    pl.ending = gameEnding(g);
    return m;
  }
  finish(pl, ending) {
    pl.ending = ending;
    this.current += 1;
    this.events.push({ kind: "end", game: pl.spec.game, result: ending.result, outcome: outcomeOf(ending, pl.spec), reason: ending.reason, plies: pl.game?.moves.length ?? 0 });
  }
  start(pl) {
    const g = new Game();
    pl.game = g;
    for (const m of pl.spec.opening.moves) if (!g.play(m)) throw new Error(`game ${pl.spec.game}: the opening's ${m} is not legal`);
    const entrySide = pl.spec.colour === "white" ? 0 : 1;
    let house = null;
    pl.ending = gameEnding(g);
    if (pl.ending === null && g.position.side !== entrySide) house = this.houseReply(pl);
    this.events.push({ kind: "start", game: pl.spec.game, opponent: pl.spec.opponent, colour: pl.spec.colour, opening: pl.spec.opening.id, house_move: house });
    if (pl.ending !== null) this.finish(pl, pl.ending);
    pl.servedAt = this.clock();
  }
  /** Whether the entry ran past the move limit on the game in play; if so the game is lost on time. */
  overTime(pl) {
    const think = this.clock() - pl.servedAt;
    this.lastThinkMs = Math.round(think);
    if (think <= this.file.move_limit_ms) return false;
    this.finish(pl, { result: lossFor(pl.spec.colour), reason: "time" });
    return true;
  }
  /** The answer about a game: where it stands, and how it ended once over. */
  view(pl) {
    const g = pl.game;
    const e = pl.ending;
    const N = this.games.length;
    return {
      status: 200,
      body: {
        game: pl.spec.game,
        games: N,
        opponent: pl.opponent.id,
        opponent_name: pl.opponent.name,
        colour: pl.spec.colour,
        opening: pl.spec.opening,
        start_fen: START_FEN,
        moves: [...g.moves],
        fen: g.position.fen(),
        plies: g.moves.length,
        last_move: g.moves.at(-1) ?? null,
        status: e === null ? "your_move" : "over",
        legal_moves: e === null ? g.position.legalMoves().map(moveUci) : [],
        result: e?.result ?? null,
        outcome: e === null ? null : outcomeOf(e, pl.spec),
        reason: e?.reason ?? null,
        next_game: e === null || pl.spec.game === N ? null : pl.spec.game + 1,
        move_limit_ms: this.file.move_limit_ms,
        max_plies: this.file.max_plies
      }
    };
  }
  done() {
    const s = this.summary();
    return { status: 200, body: { status: "done", games: this.games.length, ...s } };
  }
  summary() {
    const records = this.state().games;
    return {
      wins: records.filter((r) => r.outcome === "win").length,
      draws: records.filter((r) => r.outcome === "draw").length,
      losses: records.filter((r) => r.outcome === "loss").length
    };
  }
  body(o) {
    return o !== null && typeof o === "object" && !Array.isArray(o) ? o : null;
  }
  /** The game in play's checks a /move and a /resign share; the game, or why the request is refused. */
  inPlay(path, b) {
    if (this.current >= this.games.length) return this.refused(path, refuse(409, "done", "every game is over"));
    const pl = this.games[this.current];
    if (pl.game === null) return this.refused(path, refuse(409, "not_started", `game ${pl.spec.game} has not started: POST /game first`));
    if (b.game !== pl.spec.game) return this.refused(path, refuse(409, "wrong_game", `the game in play is game ${pl.spec.game}`));
    return pl;
  }
  game(input) {
    if (this.body(input) === null) return this.refused("/game", refuse(400, "bad_request", "the body is {}"));
    if (this.current >= this.games.length) return this.done();
    const pl = this.games[this.current];
    this.lastThinkMs = null;
    if (pl.game === null) this.start(pl);
    else this.overTime(pl);
    return this.view(pl);
  }
  move(input) {
    const b = this.body(input);
    if (b === null || !Number.isSafeInteger(b.game) || typeof b.move !== "string") return this.refused("/move", refuse(400, "bad_request", 'the body is {"game": <n>, "move": "<uci>"}'));
    const pl = this.inPlay("/move", b);
    if (!("spec" in pl)) return pl;
    if (this.overTime(pl)) return this.view(pl);
    const g = pl.game;
    const move = b.move;
    if (!g.play(move)) return this.refused("/move", refuse(400, "illegal_move", `${JSON.stringify(move.slice(0, 16))} is not a legal move in game ${pl.spec.game}: send one of legal_moves, in UCI (e2e4, e7e8q)`));
    const ply = g.moves.length;
    let house = null;
    pl.ending = gameEnding(g);
    if (pl.ending === null) house = this.houseReply(pl);
    this.events.push({ kind: "move", game: pl.spec.game, ply, move, house_move: house });
    if (pl.ending !== null) this.finish(pl, pl.ending);
    else pl.servedAt = this.clock();
    return this.view(pl);
  }
  resign(input) {
    const b = this.body(input);
    if (b === null || !Number.isSafeInteger(b.game)) return this.refused("/resign", refuse(400, "bad_request", 'the body is {"game": <n>}'));
    const pl = this.inPlay("/resign", b);
    if (!("spec" in pl)) return pl;
    if (!this.overTime(pl)) this.finish(pl, { result: lossFor(pl.spec.colour), reason: "resigned" });
    return this.view(pl);
  }
  /** export/state.json: every game, started or not (StateFile). */
  state() {
    const games = this.games.map((pl) => {
      const base = { game: pl.spec.game, opponent: pl.spec.opponent, colour: pl.spec.colour, opening: pl.spec.opening.id };
      if (pl.game === null) return { ...base, moves: [], result: lossFor(pl.spec.colour), outcome: "loss", reason: "unplayed" };
      const moves = [...pl.game.moves];
      if (pl.ending === null) return { ...base, moves, result: lossFor(pl.spec.colour), outcome: "loss", reason: "abandoned" };
      return { ...base, moves, result: pl.ending.result, outcome: outcomeOf(pl.ending, pl.spec), reason: pl.ending.reason };
    });
    return { schema: STATE_SCHEMA, games };
  }
  /** export/transcript.ndjson: one JSON line per answered start, move and end and per refusal, in order. */
  transcriptText() {
    return this.events.map((e) => `${JSON.stringify(e)}
`).join("");
  }
};

// src/server/main.ts
var READY_SCHEMA = "tiny-chess-01/ready/v1";
var GAME_PATH = "/game";
var MOVE_PATH = "/move";
var RESIGN_PATH = "/resign";
var DEFAULT_PORT = 8080;
var MAX_BODY_BYTES = 65536;
var env = process.env;
var processDriver = env.MAKEFUN_STATE_DIR !== void 0 && env.MAKEFUN_STATE_DIR !== "";
var dataDir = env.MAKEFUN_ENV_DATA_DIR || "/env-data";
var stateDir = processDriver ? env.MAKEFUN_STATE_DIR : "/state";
var host = env.MAKEFUN_ENV_HOST || (processDriver ? "127.0.0.1" : "0.0.0.0");
var portText = env.MAKEFUN_ENV_PORT ?? String(DEFAULT_PORT);
function writeAtomic(file, text) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}
function send(res, a) {
  const body = `${JSON.stringify(a.body)}
`;
  res.writeHead(a.status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  res.end(body);
}
function start() {
  if (!/^\d{1,5}$/.test(portText) || Number(portText) > 65535) throw new Error(`MAKEFUN_ENV_PORT ${JSON.stringify(portText)} is not a port`);
  const file = parseGauntletFile(readFileSync(join(dataDir, GAUNTLET_FILE), "utf8"));
  const gauntlet = new Gauntlet(file, () => performance.now());
  mkdirSync(stateDir, { recursive: true });
  const callLog = join(stateDir, "calls.ndjson");
  writeFileSync(callLog, "");
  let seq = 0;
  let queue = Promise.resolve();
  const route = (method, path, raw) => {
    const handler = path === GAME_PATH ? gauntlet.game : path === MOVE_PATH ? gauntlet.move : path === RESIGN_PATH ? gauntlet.resign : null;
    if (handler === null) return { status: 404, body: { error: "not_found", message: `no route ${path}: POST ${GAME_PATH}, ${MOVE_PATH} or ${RESIGN_PATH}` } };
    if (method !== "POST") return { status: 405, body: { error: "method_not_allowed", message: `${path} takes POST` } };
    if (raw === null) return { status: 413, body: { error: "too_large", message: `a request body holds at most ${MAX_BODY_BYTES} bytes` } };
    let input;
    try {
      input = JSON.parse(raw.toString("utf8"));
    } catch {
      return { status: 400, body: { error: "bad_json", message: "the body is not JSON" } };
    }
    return handler.call(gauntlet, input);
  };
  const server = createServer((req, res) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size <= MAX_BODY_BYTES) chunks.push(c);
    });
    req.on("end", () => {
      const method = req.method ?? "GET";
      const path = new URL(req.url ?? "/", "http://env").pathname;
      const raw = size > MAX_BODY_BYTES ? null : Buffer.concat(chunks);
      queue = queue.then(() => {
        const t0 = performance.now();
        gauntlet.lastThinkMs = null;
        let a;
        try {
          a = route(method, path, raw);
        } catch (err) {
          a = { status: 500, body: { error: "internal", message: err.message } };
        }
        seq += 1;
        appendFileSync(callLog, `${JSON.stringify({ seq, method, path, status: a.status, ms: Math.round(performance.now() - t0), think_ms: gauntlet.lastThinkMs })}
`);
        send(res, a);
      });
    });
  });
  process.on("SIGTERM", () => {
    const exportDir = join(stateDir, "export");
    mkdirSync(exportDir, { recursive: true });
    writeAtomic(join(exportDir, TRANSCRIPT_FILE), gauntlet.transcriptText());
    writeAtomic(join(exportDir, STATE_FILE), jsonText(gauntlet.state()));
    server.close();
    process.exit(0);
  });
  server.listen(Number(portText), host, () => {
    const { port } = server.address();
    writeAtomic(join(stateDir, "ready"), `${JSON.stringify({ schema: READY_SCHEMA, host, port })}
`);
    process.stdout.write(`tiny-chess-01 env: ${file.games.length} games on ${host}:${port}
`);
  });
}
try {
  start();
} catch (err) {
  process.stderr.write(`${err.message}
`);
  process.exit(1);
}
export {
  GAME_PATH,
  MOVE_PATH,
  READY_SCHEMA,
  RESIGN_PATH
};
