let isGameOver = false;

function produce() {
  const d = drugs[state.currentDrugIndex];
  let bonus = state.upgrades.reduce((sum, u) => sum + (u.clickBonus || 0), 0);
  state.counts[d.key] += d.clickVal + bonus;
  addHeat(2);
  updateUI();
  clickSound.currentTime = 0; clickSound.play(); 
}

function buyUpgrade(idx) {
  const u = upgrades[idx];
  if (!u.purchased && state.cash >= u.cost) {
    state.cash -= u.cost;
    u.purchased = true;
    state.upgrades.push(u);
    updateUI();
    renderUpgrades();
    buySound.currentTime = 0; buySound.play();
  }
}

function renderUpgrades() {
  const list = document.getElementById('upgrade-list');
  list.innerHTML = '';
  upgrades.forEach((u, i) => {
    const container = document.createElement('div');
    container.className = 'upgrade-node'; 

    const btn = document.createElement('button');
    btn.className = 'btn secondary-btn upgrade-btn';
    btn.disabled = u.purchased || state.cash < u.cost;
    btn.innerText = u.name;
    btn.addEventListener('click', () => buyUpgrade(i));
    if (u.purchased) btn.classList.add('purchased');

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-text';
    tooltip.innerHTML = `
      <div class="tooltip-title">${u.name}</div>
      <div class="tooltip-info">
        Cost: $${u.cost}
        ${u.desc ? `<br>${u.desc}` : ''}
      </div>
    `;

    container.appendChild(btn);
    container.appendChild(tooltip);
    list.appendChild(container);
  });
}

function sellAll() {
  const d = drugs[state.currentDrugIndex];
  const key = d.key;
  if (state.counts[key] > 0) {
    state.counts[key] -= 1;
    state.cash += d.price;
    addHeat(1);
    updateUI();
    buySound.currentTime = 0; buySound.play();  
    clickSound.currentTime = 0; clickSound.play();
  }
}

function hireDealer() {
  if (state.cash >= state.dealerCost) {
    state.cash -= state.dealerCost;
    state.dealers++;
    state.dealerCost = Math.floor(state.dealerCost * 1.3);
    document.getElementById('buy-dealer').innerText = `Hire Dealer ($${state.dealerCost})`;
    addHeat(5);
    updateUI();
    buySound.currentTime = 0; buySound.play();
  }
}

// Passive sales by dealers
setInterval(() => {
  const d = drugs[state.currentDrugIndex];
  const canSell = Math.min(state.counts[d.key], state.dealers);
  state.counts[d.key] -= canSell;
  state.cash += canSell * d.price;
  if (canSell) addHeat(canSell);
  updateUI();
}, 1000);

function gameOver() {
  if (isGameOver) return; 
  isGameOver = true;

  document.querySelectorAll('button').forEach(btn => btn.disabled = true);

  const overlay = document.createElement('div');
  overlay.id = 'game-over-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = 9999;
  overlay.innerHTML = `
    <h1 style="color:#e53935;">Game Over</h1>
    <p>You have been busted!</p>
    <button id="restart-btn" class="btn primary-btn">Restart</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById('restart-btn').onclick = restartGame;

  gameOverSound.currentTime = 0; gameOverSound.play();
}

function restartGame() {
  isGameOver = false;
  state.cash = 0;
  state.dealers = 0;
  state.dealerCost = 100;
  state.heat = 0;
  state.currentDrugIndex = 0;
  state.counts = { weed: 0, coke: 0, lsd: 0 };
  state.unlockedDrugs = [0];
  upgrades.forEach(u => u.purchased = false);
  state.upgrades = [];

  const overlay = document.getElementById('game-over-overlay');
  if (overlay) overlay.remove();
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);

  document.querySelectorAll('.progression-panel .node').forEach((node, i) => {
    node.classList.remove('unlocked', 'active');
    if (i === 0) {
      node.classList.add('unlocked', 'active');
    }
  });

  updateUI();
  renderUpgrades();
}

// --- INIT ---
loadGame();
initUI();
bindUI();
updateUI();
renderUpgrades();

window.addEventListener('beforeunload', saveGame);