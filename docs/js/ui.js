function initUI() {
  const progBar = document.getElementById('progression-bar');
  progBar.innerHTML = '';

  drugs.forEach((d, i) => {
    const node = document.createElement('div');
    node.className = 'node' + (state.unlockedDrugs.includes(i) ? ' unlocked' : '') + (i === state.currentDrugIndex ? ' active' : '');
    node.dataset.index = i;

    node.innerHTML = `
      <img src="icons/${d.key}.png" alt="${d.name}">
      <div class="tooltip-text">
        <div class="tooltip-title">
            ${d.name}${state.unlockedDrugs.includes(i) ? ' (Unlocked)' : ''}
        </div>
        <div class="tooltip-info">
          ${i === 0 || state.unlockedDrugs.includes(i)
            ? `Sell Price: $${d.price}<br>Click Value: $${d.clickVal}`
            : `Unlock Price: $${d.unlockCost}<br>Sell Price: $${d.price}<br>Click Value: $${d.clickVal}`}
        </div>
      </div>
    `;

    node.addEventListener('click', () => {
      if (!state.unlockedDrugs.includes(i)) {
        if (state.cash >= d.unlockCost) {
          state.cash -= d.unlockCost;
          state.unlockedDrugs.push(i);
          unlockSound.currentTime = 0; unlockSound.play();
          updateUI();
        }
      } else {
        document.querySelectorAll('.progression-panel .node')
          .forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        state.currentDrugIndex = i;
        updateUI();
      }
    });

    progBar.appendChild(node);
  });
}

function updateUI() {
  drugs.forEach((d, i) => {
    const node = document.querySelector(`.node[data-index="${i}"]`);
    if (!node) return;

    // Highlight if can unlock
    if (!state.unlockedDrugs.includes(i) && state.cash >= d.unlockCost) {
      node.classList.add('can-unlock');
    } else {
      node.classList.remove('can-unlock');
    }

    // Update unlocked class
    if (state.unlockedDrugs.includes(i)) {
      node.classList.add('unlocked');
    } else {
      node.classList.remove('unlocked');
    }

    // Update tooltip title
    const tooltipTitle = node.querySelector('.tooltip-title');
    if (tooltipTitle) {
      tooltipTitle.innerHTML = state.unlockedDrugs.includes(i)
        ? `${d.name} (Unlocked)`
        : d.name;
    }

    // Update tooltip info
    const tooltipInfo = node.querySelector('.tooltip-info');
    if (tooltipInfo) {
      if (state.unlockedDrugs.includes(i) || i === 0) {
        tooltipInfo.innerHTML = `Sell Price: $${d.price}<br>Click Value: $${d.clickVal}`;
      } else {
        tooltipInfo.innerHTML = `Unlock Price: $${d.unlockCost}<br>Sell Price: $${d.price}<br>Click Value: $${d.clickVal}`;
      }
    }
  });

  const cur = drugs[state.currentDrugIndex];
  document.getElementById('current-drug-name').innerText = cur.name;
  document.getElementById('current-drug-count').innerText = state.counts[cur.key];
  document.getElementById('dealer-count').innerText = state.dealers;
  document.getElementById('cash-count').innerText = state.cash;

  const heatFill = document.getElementById('heat-fill');
  const percent = (state.heat / state.maxHeat) * 100;
  heatFill.style.width = `${percent}%`;

  if (percent < 40) {
    heatFill.style.background = '#4caf50';
  } else if (percent < 80) {
    heatFill.style.background = '#fdd835';
  } else {
    heatFill.style.background = '#e53935';
  }
}

function bindUI() {
  document.getElementById('clicker')
    .addEventListener('click', () => produce());
  document.getElementById('sell-btn')
    .addEventListener('click', () => sellAll());
  document.getElementById('buy-dealer')
    .addEventListener('click', () => hireDealer());
}