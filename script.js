"use strict";

const Player = (sign) => {
  const getSign = () => {
    return sign;
  };
  return { getSign };
};

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setField = (index, sign) => {
    if (index >= board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index >= board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setField, getField, reset };
})();

const displayController = (() => {
  const fieldEl = document.querySelectorAll(".field");
  const messageEl = document.querySelector(".message");
  const restartBtn = document.querySelector(".restart-button");

  fieldEl.forEach((el) =>
    el.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(+e.target.dataset.index);
      updateGameboard();
      setFieldColor(e.target);
    })
  );

  fieldEl.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.getCurrentSign() === "X"
        ? el.classList.add("hover-primary")
        : el.classList.add("hover-secondary");
    });

    el.addEventListener("mouseleave", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.getCurrentSign() === "X"
        ? el.classList.remove("hover-primary")
        : el.classList.remove("hover-secondary");
    });
  });

  restartBtn.addEventListener("click", () => {
    gameController.reset();
    gameBoard.reset();
    updateGameboard();
    resetFieldColor();
    setMessageEl("Player X's turn");
  });

  const setMessageEl = (message) => {
    messageEl.textContent = message;
  };

  const updateGameboard = () => {
    for (let i = 0; i < fieldEl.length; i++) {
      fieldEl[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (sign) => {
    if (sign === "Draw") {
      setMessageEl("It is a draw!");
    } else {
      setMessageEl(`Player ${sign} has won!`);
    }
  };

  const setFieldColor = (el) => {
    const color =
      el.textContent === "X" ? "--primary-color" : "--secondary-color";
    el.style.backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue(color);
  };

  const resetFieldColor = () => {
    fieldEl.forEach(
      (el) =>
        (el.style.backgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--background-color"))
    );
  };

  return { setResultMessage, setMessageEl };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");

  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentSign());
    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageEl(`Player ${getCurrentSign()}'s turn`);
  };

  const getIsOver = () => {
    return isOver;
  };

  const getCurrentSign = () => {
    return round % 2 == 1 ? playerX.getSign() : playerO.getSign();
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combo) => combo.includes(fieldIndex))
      .some((combo) =>
        combo.every((index) => gameBoard.getField(index) === getCurrentSign())
      );
  };

  const reset = () => {
    isOver = false;
    round = 1;
  };

  return { playRound, getIsOver, reset, getCurrentSign };
})();
