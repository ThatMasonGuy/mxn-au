// Comprehensive Satisfactory recipes database
export const recipes = {
  // Resources
  resources: {
    ironOre: { name: 'Iron Ore', baseRate: 60 },
    copperOre: { name: 'Copper Ore', baseRate: 60 },
    limestone: { name: 'Limestone', baseRate: 60 },
    coal: { name: 'Coal', baseRate: 60 },
    cateriumOre: { name: 'Caterium Ore', baseRate: 60 },
    bauxite: { name: 'Bauxite', baseRate: 60 },
    rawQuartz: { name: 'Raw Quartz', baseRate: 60 },
    sulfur: { name: 'Sulfur', baseRate: 60 },
    uranium: { name: 'Uranium', baseRate: 60 },
    crudeOil: { name: 'Crude Oil', baseRate: 120 },
    water: { name: 'Water', baseRate: 120 },
    nitrogenGas: { name: 'Nitrogen Gas', baseRate: 120 }
  },

  purityMultipliers: {
    impure: 0.5,
    normal: 1.0,
    pure: 2.0
  },

  minerMultipliers: {
    mk1: 1.0,
    mk2: 2.0,
    mk3: 2.5
  },

  extractorMultipliers: {
    mk1: 1.0,
    mk2: 2.0,
    mk3: 2.5
  }
};

export default recipes;