// Drug definitions and progression tiers
const drugs = [
  { key: 'weed', name: 'Weed',    price: 10,  clickVal: 1, unlockCost: 0 },
  { key: 'coke', name: 'Cocaine', price: 50,  clickVal: 1, unlockCost: 5000 },
  { key: 'lsd',  name: 'LSD',     price: 100, clickVal: 1, unlockCost: 15000 }
];

// Inventory
let state = {
  cash: 0,
  dealers: 0,
  dealerCost: 100,
  heat: 0,
  maxHeat: 100,
  currentDrugIndex: 0,
  counts: { weed: 0, coke: 0, lsd: 0 },
  unlockedDrugs: [0], 
  upgrades: []
};

// Upgrades
let upgrades = [
  { name: "Better Equipment", cost: 5000, clickBonus: 1, purchased: false, desc: "Increases production per click by 1." },
  { name: "Lab Assistant", cost: 20000, clickBonus: 3, purchased: false, desc: "Increases production per click by 3." },
  { name: "Cooler", cost: 2000, level: 0, maxLevel: 10, desc: "Reduces heat gain from all sources by 10%." }
];

// Sound effects
const clickSound = new Audio('sounds/click.mp3');
const buySound = new Audio('sounds/buy.mp3');
const unlockSound = new Audio('sounds/unlock.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');