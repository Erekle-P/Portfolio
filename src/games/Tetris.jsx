import { useEffect, useRef, useState } from 'react';

export default function TetrisGame() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ---- Dimensions in CELLS (classic 10x20; change cols=12 if you prefer)
    const cols = 10;
    const rows = 20;
    const cell = 24; // pixels per cell (controls visual size)

    // Set canvas size in pixels; draw only in pixel units
    canvas.width = cols * cell;
    canvas.height = rows * cell;

    // ---- Arena (playfield)
    const createMatrix = (w, h) => Array.from({ length: h }, () => Array(w).fill(0));
    const arena = createMatrix(cols, rows);

    // ---- Tetromino shapes (1..7 color ids)
    const PIECES = {
      T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      O: [
        [2, 2],
        [2, 2],
      ],
      L: [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
      ],
      J: [
        [4, 0, 0],
        [4, 4, 4],
        [0, 0, 0],
      ],
      I: [
        [0, 0, 0, 0],
        [5, 5, 5, 5],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      S: [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ],
      Z: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ],
    };

    const colors = {
      1: '#00FF00',
      2: '#66ff66',
      3: '#33ff99',
      4: '#00e68a',
      5: '#00cc66',
      6: '#00b359',
      7: '#00994d',
    };

    // ---- Player state
    const player = { pos: { x: 0, y: 0 }, matrix: null, next: null };

    // 7-bag generator
    let bag = [];
    const refillBag = () => { bag = Object.keys(PIECES).sort(() => Math.random() - 0.5); };
    const nextType = () => { if (!bag.length) refillBag(); return bag.pop(); };
    const createPiece = (type) => PIECES[type].map(r => r.slice());

    // Merge piece into arena
    const merge = (a, p) => {
      p.matrix.forEach((row, y) => {
        row.forEach((v, x) => {
          if (v !== 0) a[p.pos.y + y][p.pos.x + x] = v;
        });
      });
    };

    // Collision detection
    const collide = (a, p) => {
      const m = p.matrix, o = p.pos;
      for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
          if (m[y][x] !== 0 && ((a[y + o.y] && a[y + o.y][x + o.x]) !== 0)) {
            return true;
          }
        }
      }
      return false;
    };

    // Rotate clockwise
    const rotate = (m) => m[0].map((_, i) => m.map(r => r[i])).reverse();

    const playerRotate = () => {
      const prev = player.matrix;
      player.matrix = rotate(player.matrix);

      // basic wall-kick attempts
      let offset = 1;
      while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (Math.abs(offset) > player.matrix[0].length) {
          player.matrix = prev;
          break;
        }
      }
    };

    const playerReset = () => {
      const type = player.next ?? nextType();
      player.matrix = createPiece(type);
      player.next = nextType();
      player.pos.y = 0;
      player.pos.x = (cols / 2 | 0) - (player.matrix[0].length / 2 | 0);
      if (collide(arena, player)) {
        setGameOver(true);
        setGameStarted(false);
        cancelAnimationFrame(animationRef.current);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      }
    };

    // ---- Clear only the filled rows; return number of rows cleared (0..4)
    const sweep = () => {
      let cleared = 0;
      for (let y = rows - 1; y >= 0; y--) {
        const isFull = arena[y].every(v => v !== 0);
        if (isFull) {
          arena.splice(y, 1);
          arena.unshift(Array(cols).fill(0));
          cleared++;
          y++; // re-check same index after unshift
        }
      }
      return cleared;
    };

    // --- Draw functions (pixel units)
    const drawCell = (px, py, value) => {
      ctx.fillStyle = colors[value] || '#00FF00';
      ctx.fillRect(px * cell, py * cell, cell, cell);
    };

    const drawMatrix = (matrix, offset) => {
      matrix.forEach((row, y) => {
        row.forEach((v, x) => { if (v) drawCell(x + offset.x, y + offset.y, v); });
      });
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0,255,0,0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        const px = x * cell + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, rows * cell);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        const py = y * cell + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(cols * cell, py);
        ctx.stroke();
      }
    };

    const render = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawMatrix(arena, { x: 0, y: 0 });
      drawMatrix(player.matrix, player.pos);
    };

    // Movement & drop
    const move = (dir) => {
      player.pos.x += dir;
      if (collide(arena, player)) player.pos.x -= dir;
    };

    const applyClearAndScore = (cleared) => {
      if (cleared <= 0) return;
      const table = [0, 40, 100, 300, 1200]; // single/double/triple/tetris
      setScore(s => s + (table[cleared] || 0) * level);
      setLines(l => {
        const newLines = l + cleared;
        setLevel(lv => {
          const target = Math.floor(newLines / 10) + 1; // level up every 10 lines
          return target > lv ? target : lv;
        });
        return newLines;
      });
    };

    const drop = () => {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        const cleared = sweep();
        applyClearAndScore(cleared);
        playerReset();
      }
      dropCounter = 0;
    };

    // Timing
    let dropCounter = 0;
    let last = 0;
    const baseInterval = 1000; // ms
    const intervalForLevel = () => Math.max(100, baseInterval - (level - 1) * 100);

    let soft = false;

    const loop = (t = 0) => {
      const dt = t - last;
      last = t;

      dropCounter += dt * (soft ? 3 : 1); // soft drop ~3x faster
      if (dropCounter >= intervalForLevel()) drop();

      render();
      animationRef.current = requestAnimationFrame(loop);
    };

    // Controls
    const onKeyDown = (e) => {
      if (!gameStarted) return;
      if (e.code === 'ArrowLeft') move(-1);
      else if (e.code === 'ArrowRight') move(1);
      else if (e.code === 'ArrowUp') playerRotate();
      else if (e.code === 'ArrowDown') { soft = true; drop(); }
      else if (e.code === 'Space') {
        // Hard drop
        while (!collide(arena, player)) player.pos.y++;
        player.pos.y--;
        merge(arena, player);
        const cleared = sweep();
        applyClearAndScore(cleared);
        playerReset();
        dropCounter = 0;
      }
    };
    const onKeyUp = (e) => { if (e.code === 'ArrowDown') soft = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Start
    playerReset();
    loop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameStarted, level]); // rebind timing when level changes

  const startGame = () => {
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-2">Tetris</h1>

      <div className="flex gap-6 mb-4 text-green-300">
        <div>Score: <span className="text-green-400 font-semibold">{score}</span></div>
        <div>Lines: <span className="text-green-400 font-semibold">{lines}</span></div>
        <div>Level: <span className="text-green-400 font-semibold">{level}</span></div>
      </div>

      {!gameStarted && (
        <button
          onClick={startGame}
          className="mb-4 px-6 py-2 bg-green-700 text-white rounded-full text-lg hover:bg-green-500 transition"
        >
          {gameOver ? 'Restart Game' : 'Start Game'}
        </button>
      )}

      <div className="p-4 bg-black rounded-xl shadow-inner ring-2 ring-green-700">
        {/* width/height set by JS for perfect fit */}
        <canvas
          ref={canvasRef}
          className={`bg-black rounded-md shadow-md border-2 border-green-600 ${
            !gameStarted ? 'opacity-50 blur-sm' : ''
          }`}
        />
      </div>

      {gameOver && (
        <p className="text-red-400 mt-4 text-xl font-semibold">Game Over 💥</p>
      )}

      <p className="mt-4 text-sm text-green-300 opacity-80">
        Controls: ← → move · ↑ rotate · ↓ soft drop · Space hard drop
      </p>
    </div>
  );
}
