function addHeat(amount) {
  state.heat = Math.min(state.maxHeat, state.heat + amount);
  if (state.heat >= state.maxHeat) {
    gameOver();
  }
}
function coolDown() {
  state.heat = Math.max(0, state.heat - 1);
}

setInterval(() => {
  coolDown();
  updateUI();
}, 500);