import { useState } from 'react';
import clsx from 'clsx';

const choices = [
  { name: 'rock', emoji: '✊' },
  { name: 'paper', emoji: '✋' },
  { name: 'scissors', emoji: '✌️' },
];

const getResult = (player, computer) => {
  if (player === computer) return 'It’s a tie!';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) return 'You win!';
  return 'Computer wins!';
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const play = (choice) => {
    const comp = choices[Math.floor(Math.random() * choices.length)].name;
    setIsAnimating(true);
    setTimeout(() => {
      setPlayerChoice(choice);
      setComputerChoice(comp);
      setResult(getResult(choice, comp));
      setIsAnimating(false);
    }, 600);
  };

  const renderEmoji = (name) => {
    const found = choices.find(c => c.name === name);
    return found ? found.emoji : '';
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Rock Paper Scissors</h1>

      <div className="flex justify-center gap-8 mb-8">
        {choices.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => play(name)}
            disabled={isAnimating}
            className={clsx(
              "w-20 h-20 text-3xl sm:text-4xl bg-green-800 border-2 border-green-600 rounded-full flex items-center justify-center transform transition hover:scale-110 hover:bg-green-600",
              isAnimating && "opacity-50 cursor-not-allowed"
            )}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-10 mt-10 text-green-300 text-xl">
        {playerChoice && (
          <div
            className={clsx(
              "transition-transform duration-500",
              isAnimating && "translate-y-[-20px] opacity-0",
              !isAnimating && "translate-y-0 opacity-100"
            )}
          >
            You: <span className="text-3xl">{renderEmoji(playerChoice)}</span>
          </div>
        )}
        {computerChoice && (
          <div
            className={clsx(
              "transition-transform duration-500 delay-100",
              isAnimating && "translate-y-[-20px] opacity-0",
              !isAnimating && "translate-y-0 opacity-100"
            )}
          >
            Computer: <span className="text-3xl">{renderEmoji(computerChoice)}</span>
          </div>
        )}
      </div>

      {result && !isAnimating && (
        <p className="mt-6 text-2xl font-bold text-green-400 animate-pulse">{result}</p>
      )}
    </div>
  );
}
