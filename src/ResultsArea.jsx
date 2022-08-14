import React, { useState } from "react";

function ResultsArea({ allResults }) {
  console.log("props passed to ResultsArea component: ", allResults);

  // const date = new Date(allResults[0].date.seconds * 1000);
  // console.log("🚀 ~ file: ResultsArea.jsx ~ line 7 ~ ResultsArea ~ date", date);

  function resultsParser(result) {
    const date = new Date(result.date.seconds * 1000);
    // const time = result.date;
    const outcome = result.result;
    const player1 = result.player1;
    const player2 = result.player2;
    if (outcome === "draw") {
      return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player1} drew with ${player2}`;
    } else if (outcome === "player1") {
      return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player1} defeated ${player2}`;
    } else if (outcome === "player2") {
      return `On ${date.toDateString()} at ${date.toLocaleTimeString()}, ${player2} defeated ${player1}`;
    }
  }

  // if(results.length)
  return (
    <div>
      <div>
        {allResults.length === 0 ? (
          <h2>No results yet.</h2>
        ) : (
          <h2 className="text-3xl font-semibold">Past Results</h2>
        )}
        <ul>
          {allResults.map((item, i) => (
            <li key={i}>{resultsParser(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultsArea;
