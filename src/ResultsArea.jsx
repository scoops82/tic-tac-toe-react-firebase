import React, { useState } from "react";
import crossImage from "./assets/cross.png";
import naughtImage from "./assets/naught.png";
import oXImage from "./assets/pngwingcom.png";

function ResultsArea({ allResults }) {
  // console.log("props passed to ResultsArea component: ", allResults);

  const now = new Date();

  const synonymArray = [
    "defeated",
    "obliterated",
    "outwitted",
    "destroyed",
    "vanquished",
    "outmanoeuvre",
    "bested",
    "outsmarted",
    "overcame",
    "annihilated",
    "broke",
    "whaled on",
    "triumphed over",
    "thwarted",
    "trounced",
  ];

  // const date = new Date(allResults[0].date.seconds * 1000);
  // console.log("🚀 ~ file: ResultsArea.jsx ~ line 7 ~ ResultsArea ~ date", date);

  function resultsParser(result) {
    const date = new Date(result.date.seconds * 1000);
    const msAgo = now.getTime() - date.getTime();
    const secAgo = msAgo / 1000;
    const minAgo = Math.floor(secAgo / 60);
    const hrsAgo = Math.floor(minAgo / 60);
    const daysAgo = Math.floor(hrsAgo / 24);
    const outcome = result.result;
    const player1 = result.player1;
    const player2 = result.player2;
    let timeAgoString;
    if (minAgo < 2) {
      timeAgoString = "Just Now";
    } else if (minAgo < 60) {
      timeAgoString = `${minAgo} minutes ago`;
    } else if (hrsAgo < 24) {
      timeAgoString = `${hrsAgo} hour${hrsAgo > 1 ? "s" : ""} ago`;
    } else {
      timeAgoString = `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    }

    let winner;
    let loser;
    let imageSrc;
    if (outcome === "draw") {
      imageSrc = oXImage;
      loser = "draw";
      // return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player1} drew with ${player2}`;
    } else if (outcome === "player1") {
      imageSrc = crossImage;
      loser = player2;
      winner = player1;
      // return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player1} defeated ${player2}`;
    } else if (outcome === "player2") {
      imageSrc = naughtImage;
      loser = player1;
      winner = player2;
      // return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player2} defeated ${player1}`;
    }
    return {
      date: date,
      outcome: outcome,
      player1: player1,
      player2: player2,
      imageSrc: imageSrc,
      winner: winner,
      loser: loser,
      timeAgoString: timeAgoString,
    };
  }

  function synonymSelector(resultInfo) {
    if (resultInfo.outcome === "draw") {
      return `${resultInfo.player1} and ${resultInfo.player2} ended in stalemate.`;
    } else {
      const victorySynonym =
        synonymArray[Math.floor(Math.random() * (synonymArray.length - 1))];
      return `${resultInfo.winner} ${victorySynonym} ${resultInfo.loser}!`;
    }
  }

  const parsedResults = [];
  for (const item of allResults) {
    parsedResults.unshift(resultsParser(item));
  }
  // console.log("parsedResults: ", parsedResults);

  return (
    <div>
      <div className="overflow-y-auto max-h-96 space-y-2 text-center">
        {allResults.length === 0 ? (
          <h2>No results yet.</h2>
        ) : (
          <h2 className="text-3xl font-semibold">Past Results</h2>
        )}
        <ul className="space-y-2">
          {parsedResults.map((resultInfo, i) => (
            <li key={i} className="m">
              <div className="card w-96 bg-base-100 h-32 shadow-xl image-full">
                <figure>
                  <img
                    src={resultInfo.imageSrc}
                    alt="Winners symbol"
                    className={
                      resultInfo.imageSrc === oXImage
                        ? "transform -translate-y-8 max-h-48 rotate-90"
                        : "max-h-32 rotate-0"
                    }
                  />
                </figure>
                <div className="card-body">
                  <h3 className="text-xl font-bold text-center">
                    {resultInfo.player1} Vs {resultInfo.player2}
                  </h3>
                  <p>
                    {resultInfo.timeAgoString} {synonymSelector(resultInfo)}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {/* {allResults.map((item, i) => (
            <li key={i}>{resultsParser(item)}</li>
          ))} */}
        </ul>
      </div>
    </div>
  );
}

export default ResultsArea;
