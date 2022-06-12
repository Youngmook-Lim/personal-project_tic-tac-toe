"use strict";

const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];
  return { board };
})();

const Player = (sign) => {
  this.sign = sign;
  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const playerX = Player("X");
console.log(playerX);
