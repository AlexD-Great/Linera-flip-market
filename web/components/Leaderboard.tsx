export default function Leaderboard() {
  const mockLeaderboard = [
    { player: '0x1234...5678', wins: 15 },
    { player: '0xabcd...efgh', wins: 12 },
    { player: '0x9876...5432', wins: 8 },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Top Players</h2>

      <div className="space-y-3">
        {mockLeaderboard.map((entry, index) => (
          <div
            key={entry.player}
            className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-yellow-400">
                #{index + 1}
              </span>
              <span className="font-mono text-lg">{entry.player}</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{entry.wins}</p>
              <p className="text-sm text-gray-400">wins</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}