const isValidBoard = board => /^[x-]{256}$/.test(board);

module.exports = {
  isValidBoard
};
