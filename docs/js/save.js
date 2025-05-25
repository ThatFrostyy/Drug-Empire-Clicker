function saveGame() {
  localStorage.setItem('drugClickerState', JSON.stringify(state));
  localStorage.setItem('drugClickerUpgrades', JSON.stringify(upgrades));
}

function loadGame() {
  const savedState = localStorage.getItem('drugClickerState');
  const savedUpgrades = localStorage.getItem('drugClickerUpgrades');
  if (savedState) {
    const loaded = JSON.parse(savedState);
    Object.assign(state, loaded);
  }
  if (savedUpgrades) {
    const loadedUpgrades = JSON.parse(savedUpgrades);
    upgrades.forEach((u, i) => {
      Object.assign(u, loadedUpgrades[i]);
    });
  }
}