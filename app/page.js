"use client";

import React, { useState, useRef } from "react";

const App = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [players, setPlayers] = useState([
    {
      name: "Myles Turner",
      imageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626167.png",
      team: "IND",
      opponent: "MIL",
      gameTime: "Sat 7:00 PM",
      line: 22.5,
      statType: "PTS+REB+AST",
      betType: "Over",
    },
    {
      name: "LeBron James",
      imageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
      team: "LAL",
      opponent: "PHX",
      gameTime: "Sat 8:30 PM",
      line: 25.5,
      statType: "Points",
      betType: "Over",
    },
    {
      name: "Luka Dončić",
      imageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png",
      team: "DAL",
      opponent: "HOU",
      gameTime: "Sun 3:30 PM",
      line: 30.5,
      statType: "Points",
      betType: "Over",
    },
    {
      name: "Rudy Gobert",
      imageUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/203497.png",
      team: "MIN",
      opponent: "DEN",
      gameTime: "Sun 8:00 PM",
      line: 12.5,
      statType: "Rebounds",
      betType: "Under",
    },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const addPlayer = (player) => {
    setPlayers([...players, player]);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6 border-4 border-transparent">
        <UnderdogBetSlip
          playerName={selectedPlayer.name}
          gameInfo={`${selectedPlayer.team} @ ${selectedPlayer.opponent}, ${selectedPlayer.gameTime}`}
          betType={selectedPlayer.betType}
          targetValue={selectedPlayer.line}
          statType={selectedPlayer.statType}
          playerImageUrl={selectedPlayer.imageUrl}
          currentPoints={currentPoints}
          gameEnded={gameEnded}
        />
      </div>

      <ControlPanel
        currentPoints={currentPoints}
        setCurrentPoints={setCurrentPoints}
        gameEnded={gameEnded}
        setGameEnded={setGameEnded}
        selectedBetType={selectedPlayer.betType}
      />

      <PlayerSelector
        players={players}
        onSelectPlayer={(player) => {
          setSelectedPlayer(player);
          setCurrentPoints(0);
          setGameEnded(false);
        }}
        onAddNewClick={() => setShowAddForm(true)}
      />

      {showAddForm && (
        <PlayerForm
          onCancel={() => setShowAddForm(false)}
          onSubmit={addPlayer}
        />
      )}
    </div>
  );
};

const UnderdogBetSlip = ({
  playerName = "Myles Turner",
  gameInfo = "IND @ MIL, Sat 7:00 PM",
  betType = "Over",
  targetValue = 22.5,
  statType = "PTS+REB+AST",
  playerImageUrl = "https://cdn.nba.com/headshots/nba/latest/1040x760/1626167.png",
  currentPoints = 0,
  gameEnded = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const isOver = betType === "Over";

  const completed = isOver
    ? currentPoints >= targetValue
    : currentPoints <= targetValue;

  const slipRef = useRef(null);

  const progressPercentage = Math.min((currentPoints / targetValue) * 100, 100);

  const getProgressColor = () => {
    if (gameEnded) {
      if (isOver) {
        return "bg-red-500";
      } else {
        return "bg-green-500";
      }
    }

    if (isOver) {
      if (completed) return "bg-green-500";
      if (progressPercentage >= 75) return "bg-yellow-500";
      if (progressPercentage >= 50) return "bg-orange-500";
      return "bg-red-500";
    } else {
      if (currentPoints > targetValue) return "bg-red-500";
      return "bg-yellow-500";
    }
  };

  const getBorderClass = () => {
    if ((isOver && completed) || (!isOver && gameEnded))
      return "border-2 border-green-500";
    return "border-2 border-gray-800";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-[360px] h-[180px]">
      <div className="flex flex-col bg-black p-4 font-sans rounded-lg h-full">
        <div
          ref={slipRef}
          className={`bg-gray-900 rounded-lg p-3 ${getBorderClass()} h-full flex flex-col`}
        >
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-3 bg-blue-900 flex items-center justify-center">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  {playerName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
              ) : (
                <img
                  src={playerImageUrl}
                  alt={playerName}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <div className="text-white font-bold text-lg">{playerName}</div>
              <div className="text-gray-400 text-xs mb-1">{gameInfo}</div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  <div
                    className={`font-bold text-sm mr-1 ${
                      completed ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {betType}
                  </div>
                  <div className="text-white font-bold">{targetValue}</div>
                </div>
                <div className="text-white text-xs">{statType}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-auto">
            <div
              className={`text-sm mr-2 ${
                completed ? "text-green-500 font-bold" : "text-white"
              }`}
            >
              {currentPoints.toFixed(1)}
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden flex-1">
              <div
                className={`h-full ${getProgressColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-white text-sm ml-2">{targetValue}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlPanel = ({
  currentPoints,
  setCurrentPoints,
  gameEnded,
  setGameEnded,
  selectedBetType,
}) => {
  const isOver = selectedBetType === "Over";
  const gameEndButtonText = isOver ? "Game Ended (Loss)" : "Game Ended (Win)";
  const gameEndButtonColor = isOver ? "bg-red-600" : "bg-green-600";

  return (
    <div className="mt-4">
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setCurrentPoints(0)}
          className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
        >
          Reset
        </button>
        <button
          onClick={() => setCurrentPoints(Math.max(0, currentPoints - 1))}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
        >
          -1
        </button>
        <button
          onClick={() => setCurrentPoints(currentPoints + 1)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          +1
        </button>
        <button
          onClick={() => setCurrentPoints(currentPoints + 2)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          +2
        </button>
        <button
          onClick={() => setCurrentPoints(currentPoints + 3)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          +3
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setGameEnded(!gameEnded)}
          className={`${gameEndButtonColor} text-white px-3 py-1 rounded text-sm flex-1`}
        >
          {gameEnded ? "Return to Live" : gameEndButtonText}
        </button>
      </div>
    </div>
  );
};

const PlayerSelector = ({ players, onSelectPlayer, onAddNewClick }) => {
  return (
    <div className="mt-6 bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">Select Player:</h3>
        <button
          onClick={onAddNewClick}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          + Add Player
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
        {players.map((player, index) => (
          <button
            key={index}
            onClick={() => onSelectPlayer(player)}
            className="text-left bg-gray-800 hover:bg-gray-700 text-white p-2 rounded flex justify-between items-center"
          >
            <span>
              {player.name} - {player.line} {player.statType}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                player.betType === "Over" ? "bg-blue-600" : "bg-purple-600"
              }`}
            >
              {player.betType}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PlayerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    team: "",
    opponent: "",
    gameTime: "",
    line: 0,
    statType: "Points",
    betType: "Over",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "line" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-3">Add New Player</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-gray-400 text-xs block mb-1">
              Player Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              placeholder="e.g. Anthony Davis"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-400 text-xs block mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              placeholder="https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">
              Stat Type
            </label>
            <select
              name="statType"
              value={formData.statType}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              required
            >
              <option value="Points">Points</option>
              <option value="Rebounds">Rebounds</option>
              <option value="Assists">Assists</option>
              <option value="PTS+REB">PTS+REB</option>
              <option value="PTS+AST">PTS+AST</option>
              <option value="REB+AST">REB+AST</option>
              <option value="PTS+REB+AST">PTS+REB+AST</option>
              <option value="Made Threes">Made Threes</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">Bet Type</label>
            <select
              name="betType"
              value={formData.betType}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              required
            >
              <option value="Over">Over</option>
              <option value="Under">Under</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">Line</label>
            <input
              type="number"
              step="0.5"
              name="line"
              value={formData.line}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">Team</label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              placeholder="e.g. LAL"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">Opponent</label>
            <input
              type="text"
              name="opponent"
              value={formData.opponent}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              placeholder="e.g. GSW"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-400 text-xs block mb-1">
              Game Time
            </label>
            <input
              type="text"
              name="gameTime"
              value={formData.gameTime}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
              placeholder="e.g. Sun 7:30 PM"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Player
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
