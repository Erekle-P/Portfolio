import { useEffect, useRef, useState } from 'react';

export default function TetrisGame() {
  const canvasRef = useRef();
  const animationRef = useRef();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.scale(20, 20); // Scale 1 grid unit = 20px

    const arena = createMatrix(12, 20); // 12 columns x 20 rows

    let player = {
      pos: { x: 5, y: 0 },
      matrix: createPiece(),
    };

    // Create a blank arena
    function createMatrix(w, h) {
      const matrix = [];
      while (h--) matrix.push(new Array(w).fill(0));
      return matrix;
    }

    // Create a 'T' shaped tetromino
    function createPiece() {
      return [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ];
    }

    // Merge tetromino into arena when it lands
    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            arena[y + player.pos.y][x + player.pos.x] = value;
          }
        });
      });
    }

    // Check for collisions between player and arena
    function collide(arena, player) {
      const m = player.matrix;
      const o = player.pos;
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (
            m[y][x] !== 0 &&
            (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
          ) {
            return true;
          }
        }
      }
      return false;
    }

    // Rotate tetromino clockwise
    function rotate(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
    }

    // Draw a matrix (either player or arena)
    function drawMatrix(matrix, offset) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            context.fillStyle = '#00FF00';
            context.fillRect(x + offset.x, y + offset.y, 1, 1);
          }
        });
      });
    }

    // Draw everything on canvas: background, grid, arena, player
    function draw() {
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      context.strokeStyle = 'rgba(0,255,0,0.2)';
      for (let x = 0; x < canvas.width; x += 20) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }

      drawMatrix(arena, { x: 0, y: 0 });
      drawMatrix(player.matrix, player.pos);
    }

    // Drop piece by 1 cell
    function playerDrop() {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
      }
      dropCounter = 0;
    }

    function playerMove(dir) {
      player.pos.x += dir;
      if (collide(arena, player)) {
        player.pos.x -= dir;
      }
    }

    function playerReset() {
      player.pos = { x: 5, y: 0 };
      player.matrix = createPiece();
      if (collide(arena, player)) {
        setGameOver(true);
        setGameStarted(false);
        cancelAnimationFrame(animationRef.current);
        window.removeEventListener('keydown', handleKeyDown);
      }
    }

    function playerRotate() {
      const rotated = rotate(player.matrix);
      const prev = player.matrix;
      player.matrix = rotated;
      if (collide(arena, player)) {
        player.matrix = prev; // Revert if collision
      }
    }

    function handleKeyDown(e) {
      if (!gameStarted) return;
      switch (e.code) {
        case 'ArrowLeft':
          playerMove(-1);
          break;
        case 'ArrowRight':
          playerMove(1);
          break;
        case 'ArrowDown':
          playerDrop();
          break;
        case 'ArrowUp':
          playerRotate();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;

    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;

      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
        playerDrop();
      }

      draw();
      animationRef.current = requestAnimationFrame(update);
    }

    playerReset();
    update();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Tetris</h1>

      {!gameStarted && (
        <button
          onClick={startGame}
          className="mb-4 px-6 py-2 bg-green-700 text-white rounded-full text-lg hover:bg-green-500 transition"
        >
          {gameOver ? 'Restart Game' : 'Start Game'}
        </button>
      )}

      <div className="p-4 bg-black rounded-xl shadow-inner ring-2 ring-green-700">
        <canvas
          ref={canvasRef}
          width={240}
          height={400}
          className={`bg-black rounded-md shadow-md border-2 border-green-600 ${
            !gameStarted ? 'opacity-50 blur-sm' : ''
          }`}
        />
      </div>

      {gameOver && (
        <p className="text-red-400 mt-4 text-xl font-semibold">Game Over 💥</p>
      )}
    </div>
  );
}
