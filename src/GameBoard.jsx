import React from "react";

function GameBoard({ takeTurn }) {
  return (
    <div className="divide-y-8 max-w-lg p-2">
      <div className="grid grid-cols-3 divide-x-8">
        <div
          className="aspect-square w-28 max-w-40  row-1 col-1"
          id="1"
          onClick={() => takeTurn("1")}
        ></div>
        <div
          className="aspect-square max-w-40 row-1 col-2"
          id="2"
          onClick={() => takeTurn("2")}
        ></div>
        <div
          className="aspect-square max-w-40 row-1 col-3"
          id="3"
          onClick={() => takeTurn("3")}
        ></div>
      </div>

      <div className="grid grid-cols-3 divide-x-8 max-h-40">
        <div
          className="aspect-square max-w-40 row-2 col-1"
          id="4"
          onClick={() => takeTurn("4")}
        ></div>
        <div
          className="aspect-square max-w-40 row-2 col-2"
          id="5"
          onClick={() => takeTurn("5")}
        ></div>
        <div
          className="aspect-square max-w-40 row-2 col-3"
          id="6"
          onClick={() => takeTurn("6")}
        ></div>
      </div>

      <div className="grid grid-cols-3 divide-x-8 max-h-40">
        <div
          className="aspect-square max-w-40 row-3 col-1"
          id="7"
          onClick={() => takeTurn("7")}
        ></div>
        <div
          className="aspect-square max-w-40 row-3 col-2"
          id="8"
          onClick={() => takeTurn("8")}
        ></div>
        <div
          className="aspect-square max-w-40 row-3 col-3"
          id="9"
          onClick={() => takeTurn("9")}
        ></div>
      </div>
    </div>
  );
}

export default GameBoard;
