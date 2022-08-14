import React, { useState } from "react";

function PlayersArea({ addPlayer }) {
  const [playerName, setPlayerName] = useState("");
  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-2xl px-4">
        <figure>
          <img
            className="max-h-40"
            src="./src/assets/pngwingcom.png"
            alt="naught and cross"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Welcome to Tic-Tac-Toe.</h2>
          <p>
            Enter your name in the form below to start a game. Once two people
            have entered their names then a game can start.
          </p>
          <div className="card-actions justify-center w-full">
            <div className="form-control w-full">
              <form onSubmit={(e) => addPlayer(playerName, e)}>
                <label className="input-group w-full">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Joe Bloggs"
                    className="input input-bordered w-full"
                    value={playerName}
                    onChange={($e) => setPlayerName($e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Play
                  </button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        <div className="card card-side bg-base-100 shadow-xl px-4">
          <figure>
            <img
              className="max-h-16"
              src="./src/assets/cross.png"
              alt="cross"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Player 1</h2>
          </div>
        </div>
        <div className="card card-side bg-base-100 shadow-xl px-4">
          <figure>
            <img
              className="max-h-16"
              src="./src/assets/naught.png"
              alt="naught"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Player 2</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayersArea;
