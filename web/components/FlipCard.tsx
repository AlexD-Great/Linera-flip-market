interface FlipCardProps {
  id: number;
  creator: string;
  betAmount: string;
  status: string;
  result?: string;
  winner?: string;
}

export default function FlipCard({
  id,
  creator,
  betAmount,
  status,
  result,
  winner,
}: FlipCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-purple-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">Flip #{id}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === 'Open'
              ? 'bg-green-500'
              : status === 'Waiting'
              ? 'bg-yellow-500'
              : 'bg-gray-500'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-400">
          Creator: <span className="text-white font-mono">{creator}</span>
        </p>
        <p className="text-gray-400">
          Bet Amount:{' '}
          <span className="text-yellow-400 font-bold">{betAmount} LINERA</span>
        </p>
      </div>

      {result && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-center text-xl font-bold">
            Result: {result === 'Heads' ? '🪙 Heads' : '🎯 Tails'}
          </p>
          {winner && (
            <p className="text-center text-green-400 mt-2">
              Winner: {winner}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold transition-all">
          🪙 Bet Heads
        </button>
        <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 px-4 py-2 rounded-lg font-semibold transition-all">
          🎯 Bet Tails
        </button>
      </div>
    </div>
  );
}