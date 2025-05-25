let isGameOver = false;

function produce() {
  const d = drugs[state.currentDrugIndex];
  let bonus = state.upgrades.reduce((sum, u) => sum + (u.clickBonus || 0), 0);
  state.counts[d.key] += d.clickVal + bonus;

  // Cooler effect
  const cooler = upgrades.find(u => u.name === "Cooler");
  let heatMult = 1;
  if (cooler && cooler.level)
  {
    heatMult = 1 - 0.1 * cooler.level;
  }

  addHeat(Math.max(1, Math.round(2 * heatMult)));
  updateUI();

  clickSound.currentTime = 0; clickSound.play(); 
}

function buyUpgrade(idx) {
  const u = upgrades[idx];
  if (u.name === "Cooler") {
    if (u.level === undefined)
    {
      u.level = 0;
    }

    if (u.level < u.maxLevel && state.cash >= u.cost) {
      state.cash -= u.cost;
      u.level++;

      // Increase cost for next level (e.g., 1.7x)
      u.cost = Math.floor(u.cost * 1.7);

      updateUI();
      renderUpgrades();

      buySound.currentTime = 0; buySound.play();
    }
    return;
  }
  if (!u.purchased && state.cash >= u.cost) 
  {
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

    if (u.name === "Cooler") {
      btn.disabled = (u.level >= u.maxLevel) || state.cash < u.cost;
      btn.innerText = u.name;
      if (u.level >= u.maxLevel)
      {
        btn.classList.add('purchased');
      }
    } 
    else 
    {
      btn.disabled = u.purchased || state.cash < u.cost;
      btn.innerText = u.name;
      if (u.purchased)
      {
        btn.classList.add('purchased');
      }
    }
    btn.addEventListener('click', () => buyUpgrade(i));

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-text';
    tooltip.innerHTML = `
      <div class="tooltip-title">${getUpgradeTooltipTitle(u)}</div>
      <div class="tooltip-info">${getUpgradeTooltipInfo(u)}</div>
    `;

    container.appendChild(btn);
    container.appendChild(tooltip);
    list.appendChild(container);
  });

  // Add Hire Dealer node
  const dealerContainer = document.createElement('div');
  dealerContainer.className = 'upgrade-node';

  const dealerBtn = document.createElement('button');
  dealerBtn.id = 'buy-dealer';
  dealerBtn.className = 'btn primary-btn upgrade-btn';
  dealerBtn.innerText = 'Hire Dealer';
  dealerBtn.disabled = state.cash < state.dealerCost;

  dealerBtn.addEventListener('click', () => hireDealer());

  const dealerTooltip = document.createElement('div');
  dealerTooltip.className = 'tooltip-text';
  dealerTooltip.innerHTML = `
    <div class="tooltip-title">Hire Dealer</div>
    <div class="tooltip-info">
      Cost: $${state.dealerCost}<br>
      Dealers sell 1 unit per second.
    </div>
  `;

  dealerContainer.appendChild(dealerBtn);
  dealerContainer.appendChild(dealerTooltip);
  document.getElementById('action-buttons').appendChild(dealerContainer);
}

function sellAll() {
  const d = drugs[state.currentDrugIndex];
  const key = d.key;
  if (state.counts[key] > 0) {
    state.counts[key] -= 1;
    state.cash += d.price;

    // Cooler effect
    const cooler = upgrades.find(u => u.name === "Cooler");
    let heatMult = 1;
    if (cooler && cooler.level)
    {
      heatMult = 1 - 0.1 * cooler.level
    }

    addHeat(Math.max(1, Math.round(1 * heatMult)));
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

  // Cooler effect
  const cooler = upgrades.find(u => u.name === "Cooler");
  let heatMult = 1;
  if (cooler && cooler.level)
  {
    heatMult = 1 - 0.1 * cooler.level;
  }

  if (canSell) 
  {
    addHeat(Math.max(1, Math.round(canSell * heatMult)));
  }
  updateUI();
}, 1000);

function gameOver() {
  if (isGameOver)
  {
    console.warn("Game is already over, cannot trigger again.");
    return;
  }

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
  if (overlay)
  {
    overlay.remove();
  }

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

loadGame();
initUI();
bindUI();
updateUI();
renderUpgrades();

window.addEventListener('beforeunload', saveGame);