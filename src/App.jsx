import React, { useState, useEffect } from "react";
// import GameBoard from "./GameBoard";
// import PlayersArea from "./PlayersArea";
// import { nanoid } from "nanoid";
import _, { isEqual } from "lodash";
import ResultsArea from "./ResultsArea";
import crossImage from "./assets/cross.png";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  Firestore,
  updateDoc,
  setDoc,
  getDoc,
  getFirestore,
  onSnapshot,
  arrayUnion,
  increment,
  getDocFromServer,
} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

function App() {
  const [playerNameInput, setPlayerNameInput] = useState("");

  const [amPlayer1, setAmPlayer1] = useState(true);

  // used to determine and display the player whose turn it is.
  // const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [gameInfo, setGameInfo] = useState({
    player1: "",
    player2: "",
    turnNumber: 1,
    moves: [],
    player1Moves: [],
    player2Moves: [],
    message:
      "Enter your name in the form below to start a game. Once two people have entered their names then a game can start.",
    buttonText: "Reset",
    buttonClassNames: "btn btn-error",
    formDisplay: "card-actions justify-center w-full",
    gameFinished: false,
  });
  const [displayControl, setDisplayControl] = useState({
    formDisabled: false,
    gameBoardDisplay: "hidden",
    localMessage: "",
  });

  const crossSymbol = (
    <img src={crossImage} className="object-contain" alt="cross symbol" />
  );
  const naughtSymbol = (
    <img
      src="./src/assets/naught.png"
      className="object-contain"
      alt="naught symbol"
    />
  );

  // let localMessage = "";

  // let formClassName = "card-actions justify-center w-full";
  // let gameBoardClassName = "divide-y-8 max-w-lg p-2";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC7BYtMWs0JmnImLLPqZDcA3d490vhv2VA",
    authDomain: "naughts-and-crosses-be720.firebaseapp.com",
    projectId: "naughts-and-crosses-be720",
    storageBucket: "naughts-and-crosses-be720.appspot.com",
    messagingSenderId: "616257555109",
    appId: "1:616257555109:web:9174b30cf69b4b1c521b4c",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const gameinfoRef = doc(db, "current-game", "game-info");
  const gamegridRef = collection(db, "game-grid");
  const currentGameRef = collection(db, "current-game");

  // Initial Get of Game info.
  async function initialGetGameInfo() {
    try {
      const gameinfoDocSnap = await getDoc(gameinfoRef);
      if (gameinfoDocSnap.exists()) {
        setGameInfo(gameinfoDocSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Initial fetch from firestore failed: ", error);
    }
  }
  // initialGetGameInfo();

  const player1CardActive =
    "card card-side bg-base-100 shadow-xl shadow-red-cross px-4";
  const player1CardInactive = "card card-side bg-base-100 shadow-xl px-4";
  const player2CardInactive = "card card-side bg-base-100 shadow-xl px-4";
  const player2CardActive =
    "card card-side bg-base-100 shadow-xl px-4 shadow-blue-naught";
  // Listener for changes in current-game/game-info
  useEffect(() => {
    const currentGameInfoUnsubscribe = onSnapshot(
      currentGameRef,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log("change.doc.data() ", change.doc.data());
          if (!_.isEqual(gameInfo, change.doc.data())) {
            console.log("Updating gameInfo in state...");
            setGameInfo(change.doc.data());
          }
          // if (change.type === "modified") {
          //   setGameInfo(change.doc.data());
          //   console.log("modified in gameinfo", change.doc.data());
          // } else if (change.type === "added") {
          //   // setGameInfo(change.doc.data());
          //   console.log("added to gameinfo", change.doc.data());
          // } else if (change.type === "removed") {
          //   console.log("removed from gameinfo", change.doc.data());
          // }
        });
      }
    );
    setDisplayControl({ ...displayControl, localMessage: "" });

    return () => {
      currentGameInfoUnsubscribe();
    };
  }, [gameInfo]);

  useEffect(() => {
    checkWin();
    if (gameInfo.turnNumber > 9) {
    }

    return () => {
      // second;
    };
  }, [gameInfo.turnNumber]);

  async function takeTurn(gridRef) {
    checkWin();
    if (gameInfo.gameFinished) {
      setDisplayControl({
        ...displayControl,
        localMessage:
          "The game has finished. Please click the button below to play again.",
      });
    } else if (gameInfo.moves.length >= 9) {
      setGameInfo({
        ...gameInfo,
        message: "The game is over. Click the button below to play again.",
      });
      // setDisplayControl({
      //   ...displayControl,
      //   localMessage:
      //     "The game is over. Click the 'End Game' button below to play again.",
      // });
    } else if (amPlayer1 && gameInfo.turnNumber % 2 === 1) {
      console.log("Player1's turn.");
      try {
        await updateDoc(gameinfoRef, {
          turnNumber: increment(1),
          moves: [...gameInfo.moves, `${gridRef}:x`],
          player1Moves: [...gameInfo.player1Moves, gridRef * 1],
          message: `${gameInfo.player2}, please make your move.`,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else if (!amPlayer1 && gameInfo.turnNumber % 2 === 0) {
      console.log("Player2's turn.");
      try {
        await updateDoc(gameinfoRef, {
          turnNumber: increment(1),
          moves: [...gameInfo.moves, `${gridRef}:o`],
          player2Moves: [...gameInfo.player2Moves, gridRef * 1],
          message: `${gameInfo.player1}, please make your move.`,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      setGameInfo({
        ...gameInfo,
        message: `Hey! Slow down ${
          gameInfo.turnNumber % 2 === 1 ? gameInfo.player2 : gameInfo.player1
        }! It's ${
          gameInfo.turnNumber % 2 === 1 ? gameInfo.player1 : gameInfo.player2
        }'s turn now.`,
      });
      // setDisplayControl({
      //   ...displayControl,
      //   localMessage: "It's not your turn!",
      // });
      // localMessage = "It's not your turn!";
      // console.log("It's not your turn!");
    }
  }

  async function addPlayer(e, playerName) {
    e.preventDefault();
    // formClassName = "hidden";
    setDisplayControl({
      gameBoardDisplay: "divide-y-8 max-w-lg p-2",
      formDisabled: true,
    });
    const gameInfoSnap = await getDoc(gameinfoRef);

    if (gameInfoSnap.data().player1.length > 0) {
      try {
        await updateDoc(gameinfoRef, {
          player2: playerName,
          message: `${gameInfo.player1}, please make your first move.`,
        });
      } catch (error) {
        console.log("Error updating player name: ", error);
      }
      setAmPlayer1(false);
    } else {
      try {
        await updateDoc(gameinfoRef, {
          player1: playerName,
          message: "Player 2, please enter your name to start the game.",
        });
      } catch (error) {
        console.log("Error updating player name: ", error);
      }
      setAmPlayer1(true);
    }
  }

  function checkWin() {
    const winningCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
    for (const winCombo of winningCombinations) {
      let player1Matches = [];
      let player2Matches = [];
      for (const num of winCombo) {
        if (gameInfo.player1Moves.includes(num)) {
          player1Matches.push(num);
          if (player1Matches.length === 3) {
            // localMessage = `${gameInfo.player1} Wins!`;
            notifyWin("player1");
            setDisplayControl({
              ...displayControl,
              buttonClassNames: "btn btn-success",
              buttonText: "Play Again",
            });
          }
        } else if (gameInfo.player2Moves.includes(num)) {
          player2Matches.push(num);
          if (player2Matches.length === 3) {
            // localMessage = `${gameInfo.player2} Wins!`;
            notifyWin("player2");
            setDisplayControl({
              ...displayControl,
              buttonClassNames: "btn btn-success",
              buttonText: "Play Again",
            });
          }
        } else if (gameInfo.moves.length === 9) {
          notifyWin("draw");
          setDisplayControl({
            ...displayControl,
            buttonClassNames: "btn btn-success",
            buttonText: "Play Again",
          });
        }
      }
      console.log("player1 matches: ", player1Matches);
      console.log("player2 matches: ", player2Matches);
    }
  }
  async function notifyWin(result) {
    if (result === "draw") {
      await updateDoc(gameinfoRef, {
        message: `It's a draw!`,
        buttonText: "Play again",
        buttonClassNames: "btn btn-success",
        gameFinished: true,
      });
    } else if (result === "player1") {
      try {
        await updateDoc(gameinfoRef, {
          message: `${gameInfo.player1} Wins! Better luck next time ${gameInfo.player2}`,
          buttonText: "Play again",
          buttonClassNames: "btn btn-success",
          gameFinished: true,
        });
      } catch (error) {
        setDisplayControl({ ...displayControl, localMessage: error });
      }
    } else if (result === "player2") {
      try {
        await updateDoc(gameinfoRef, {
          message: `${gameInfo.player2} Wins! Better luck next time ${gameInfo.player1}`,
          buttonText: "Play again",
          buttonClassNames: "btn btn-success",
          gameFinished: true,
        });
      } catch (error) {
        setDisplayControl({ ...displayControl, localMessage: error });
      }
    }
  }

  async function endGame() {
    try {
      await setDoc(gameinfoRef, {
        player1: "",
        player2: "",
        turnNumber: 1,
        moves: [],
        player1Moves: [],
        player2Moves: [],
        message:
          "Enter your name in the form below to start a game. Once two people have entered their names then a game can start.",
        buttonText: "Reset Game",
        buttonClassNames: "btn btn-error",
        formDisplay: "card-actions justify-center w-full",
        gameFinished: false,
      });
    } catch (error) {
      console.log("Error clearing game-info: ", error);
    }
    setPlayerNameInput("");
    setDisplayControl({
      gameBoardDisplay: "hidden",
      formDisabled: false,
    });
    // formClassName = "card-actions justify-center w-full";
  }

  return (
    <div className="App space-y-10">
      <div className="App flex flex-col items-center gap-5">
        <div className="prose min-w-full text-center">
          <h1>Tic-Tac-Toe</h1>
        </div>
        <div className="flex flex-col justify-center gap-5">
          <div className="card lg:card-side bg-base-100 shadow-xl max-w-2xl px-4 h-48">
            <figure>
              <img
                className="max-h-40"
                src="./src/assets/pngwingcom.png"
                alt="naught and cross"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Welcome to Tic-Tac-Toe.</h2>
              <p>{gameInfo.message}</p>
              <p>{displayControl.localMessage}</p>
              <div className={gameInfo.formDisplay}>
                <div className="form-control w-full">
                  <form onSubmit={(e) => addPlayer(e, playerNameInput)}>
                    <label className="input-group w-full">
                      <span>Name</span>
                      <input
                        type="text"
                        placeholder="Joe Bloggs"
                        className="input input-bordered w-full"
                        value={playerNameInput}
                        onChange={($e) => setPlayerNameInput($e.target.value)}
                        autofocus
                        disabled={displayControl.formDisabled}
                      />
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={displayControl.formDisabled}
                      >
                        Play
                      </button>
                    </label>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <div
              id="player1-card"
              className={
                gameInfo.turnNumber % 2 === 1
                  ? player1CardActive
                  : player1CardInactive
              }
            >
              <figure>
                <img className="max-h-16" src={crossImage} alt="cross" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {gameInfo.player1.length > 0 ? gameInfo.player1 : "Player 1"}
                </h2>
              </div>
            </div>
            <div
              id="player2-card"
              className={
                gameInfo.turnNumber % 2 === 0
                  ? player2CardActive
                  : player2CardInactive
              }
            >
              <figure>
                <img
                  className="max-h-16"
                  src="./src/assets/naught.png"
                  alt="naught"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {gameInfo.player2.length > 0 ? gameInfo.player2 : "Player 2"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>

      <div id="game-board" className="flex flex-wrap gap-5 justify-center">
        <div className="flex gap-5 flex-col basis-80">
          <div
            className={
              !gameInfo.player1 || !gameInfo.player2
                ? "hidden"
                : "divide-y-8 max-w-lg p-2" /*displayControl.gameBoardDisplay*/
            }
          >
            <div className="grid grid-cols-3 divide-x-8 min-w-full">
              <div
                className="aspect-square max-w-40  row-1 col-1"
                id="1"
                onClick={() => takeTurn("1")}
              >
                {gameInfo.player1Moves.includes(1) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(1) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-1 col-2"
                id="2"
                onClick={() => takeTurn("2")}
              >
                {gameInfo.player1Moves.includes(2) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(2) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-1 col-3"
                id="3"
                onClick={() => takeTurn("3")}
              >
                {gameInfo.player1Moves.includes(3) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(3) ? naughtSymbol : ""}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x-8 max-h-40">
              <div
                className="aspect-square max-w-40 row-2 col-1"
                id="4"
                onClick={() => takeTurn("4")}
              >
                {gameInfo.player1Moves.includes(4) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(4) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-2 col-2"
                id="5"
                onClick={() => takeTurn("5")}
              >
                {gameInfo.player1Moves.includes(5) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(5) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-2 col-3"
                id="6"
                onClick={() => takeTurn("6")}
              >
                {gameInfo.player1Moves.includes(6) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(6) ? naughtSymbol : ""}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x-8 max-h-40">
              <div
                className="aspect-square max-w-40 row-3 col-1"
                id="7"
                onClick={() => takeTurn("7")}
              >
                {gameInfo.player1Moves.includes(7) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(7) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-3 col-2"
                id="8"
                onClick={() => takeTurn("8")}
              >
                {gameInfo.player1Moves.includes(8) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(8) ? naughtSymbol : ""}
              </div>
              <div
                className="aspect-square max-w-40 row-3 col-3"
                id="9"
                onClick={() => takeTurn("9")}
              >
                {gameInfo.player1Moves.includes(9) ? crossSymbol : ""}
                {gameInfo.player2Moves.includes(9) ? naughtSymbol : ""}
              </div>
            </div>
          </div>
          <button
            className={gameInfo.buttonClassNames}
            onClick={() => endGame()}
          >
            {gameInfo.buttonText}
          </button>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <ResultsArea />
      </div>
    </div>
  );
}

export default App;
