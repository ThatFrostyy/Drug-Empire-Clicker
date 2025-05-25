function getDrugTooltipTitle(drug, unlocked) {
  return unlocked ? `${drug.name} (Unlocked)` : drug.name;
}

function getDrugTooltipInfo(drug, unlocked, index) {
  if (unlocked || index === 0) {
    return `Sell Price: $${drug.price}<br>Click Value: $${drug.clickVal}`;
  } else {
    return `Unlock Price: $${drug.unlockCost}<br>Sell Price: $${drug.price}<br>Click Value: $${drug.clickVal}`;
  }
}

function getUpgradeTooltipTitle(upgrade) {
  return upgrade.name;
}

function getUpgradeTooltipInfo(upgrade) {
  let info = `Cost: $${upgrade.cost}`;
  if (upgrade.name === "Cooler") {
    info += `<br>Owned: ${upgrade.level || 0}/${upgrade.maxLevel}`;
  }
  if (upgrade.desc) {
    info += `<br>${upgrade.desc}`;
  }
  return info;
}
