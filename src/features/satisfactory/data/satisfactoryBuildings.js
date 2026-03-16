export const resourceNodes = [
  {
    id: 'miner',
    name: 'Miner',
    type: 'resource',
    description: 'Extracts resources from nodes',
    powerUsage: 5,
    recipes: [
      { name: 'Iron Ore', output: { item: 'Iron Ore', amount: 60 } }
    ]
  }
];

export const productionBuildings = [
  {
    id: 'smelter',
    name: 'Smelter',
    type: 'smelter',
    powerUsage: 4,
    recipes: [
      {
        name: 'Iron Ingot',
        inputs: [{ item: 'Iron Ore', amount: 30 }],
        output: { item: 'Iron Ingot', amount: 30 },
        time: 2
      },
      {
        name: 'Copper Ingot',
        inputs: [{ item: 'Copper Ore', amount: 30 }],
        output: { item: 'Copper Ingot', amount: 30 },
        time: 2
      },
      {
        name: 'Caterium Ingot',
        inputs: [{ item: 'Caterium Ore', amount: 45 }],
        output: { item: 'Caterium Ingot', amount: 15 },
        time: 4
      },
      {
        name: 'Pure Iron Ingot',
        isAlternate: true,
        inputs: [{ item: 'Iron Ore', amount: 35 }, { item: 'Water', amount: 20 }],
        output: { item: 'Iron Ingot', amount: 65 },
        time: 12
      },
      {
        name: 'Pure Copper Ingot',
        isAlternate: true,
        inputs: [{ item: 'Copper Ore', amount: 15 }, { item: 'Water', amount: 10 }],
        output: { item: 'Copper Ingot', amount: 37.5 },
        time: 24
      },
      {
        name: 'Pure Caterium Ingot',
        isAlternate: true,
        inputs: [{ item: 'Caterium Ore', amount: 24 }, { item: 'Water', amount: 24 }],
        output: { item: 'Caterium Ingot', amount: 12 },
        time: 5
      }
    ]
  },
  {
    id: 'foundry',
    name: 'Foundry',
    type: 'foundry',
    powerUsage: 16,
    recipes: [
      {
        name: 'Steel Ingot',
        inputs: [{ item: 'Iron Ore', amount: 45 }, { item: 'Coal', amount: 45 }],
        output: { item: 'Steel Ingot', amount: 45 },
        time: 4
      },
      {
        name: 'Aluminum Ingot',
        inputs: [{ item: 'Aluminum Scrap', amount: 90 }, { item: 'Silica', amount: 75 }],
        output: { item: 'Aluminum Ingot', amount: 60 },
        time: 4
      },
      {
        name: 'Solid Steel Ingot',
        isAlternate: true,
        inputs: [{ item: 'Iron Ore', amount: 40 }, { item: 'Coal', amount: 40 }],
        output: { item: 'Steel Ingot', amount: 60 },
        time: 3
      },
      {
        name: 'Compacted Steel Ingot',
        isAlternate: true,
        inputs: [{ item: 'Iron Ore', amount: 22.5 }, { item: 'Compacted Coal', amount: 11.25 }],
        output: { item: 'Steel Ingot', amount: 37.5 },
        time: 16
      }
    ]
  },
  {
    id: 'constructor',
    name: 'Constructor',
    type: 'constructor',
    powerUsage: 4,
    recipes: [
      {
        name: 'Iron Plate',
        inputs: [{ item: 'Iron Ingot', amount: 30 }],
        output: { item: 'Iron Plate', amount: 20 },
        time: 6
      },
      {
        name: 'Iron Rod',
        inputs: [{ item: 'Iron Ingot', amount: 15 }],
        output: { item: 'Iron Rod', amount: 15 },
        time: 4
      },
      {
        name: 'Screw',
        inputs: [{ item: 'Iron Rod', amount: 10 }],
        output: { item: 'Screw', amount: 40 },
        time: 6
      },
      {
        name: 'Wire',
        inputs: [{ item: 'Copper Ingot', amount: 15 }],
        output: { item: 'Wire', amount: 30 },
        time: 4
      },
      {
        name: 'Cable',
        inputs: [{ item: 'Wire', amount: 60 }],
        output: { item: 'Cable', amount: 30 },
        time: 2
      },
      {
        name: 'Concrete',
        inputs: [{ item: 'Limestone', amount: 45 }],
        output: { item: 'Concrete', amount: 15 },
        time: 4
      },
      {
        name: 'Steel Beam',
        inputs: [{ item: 'Steel Ingot', amount: 60 }],
        output: { item: 'Steel Beam', amount: 15 },
        time: 4
      },
      {
        name: 'Steel Pipe',
        inputs: [{ item: 'Steel Ingot', amount: 30 }],
        output: { item: 'Steel Pipe', amount: 20 },
        time: 6
      },
      {
        name: 'Copper Sheet',
        inputs: [{ item: 'Copper Ingot', amount: 20 }],
        output: { item: 'Copper Sheet', amount: 10 },
        time: 6
      },
      {
        name: 'Quickwire',
        inputs: [{ item: 'Caterium Ingot', amount: 12 }],
        output: { item: 'Quickwire', amount: 60 },
        time: 5
      },
      {
        name: 'Iron Wire',
        isAlternate: true,
        inputs: [{ item: 'Iron Ingot', amount: 12.5 }],
        output: { item: 'Wire', amount: 22.5 },
        time: 24
      },
      {
        name: 'Caterium Wire',
        isAlternate: true,
        inputs: [{ item: 'Caterium Ingot', amount: 15 }],
        output: { item: 'Wire', amount: 120 },
        time: 4
      },
      {
        name: 'Steel Rod',
        isAlternate: true,
        inputs: [{ item: 'Steel Ingot', amount: 12 }],
        output: { item: 'Iron Rod', amount: 48 },
        time: 5
      },
      {
        name: 'Steel Screw',
        isAlternate: true,
        inputs: [{ item: 'Steel Beam', amount: 5 }],
        output: { item: 'Screw', amount: 260 },
        time: 12
      },
      {
        name: 'Cast Screw',
        isAlternate: true,
        inputs: [{ item: 'Iron Ingot', amount: 12.5 }],
        output: { item: 'Screw', amount: 50 },
        time: 24
      }
    ]
  },
  {
    id: 'assembler',
    name: 'Assembler',
    type: 'assembler',
    powerUsage: 15,
    recipes: [
      {
        name: 'Reinforced Iron Plate',
        inputs: [{ item: 'Iron Plate', amount: 30 }, { item: 'Screw', amount: 60 }],
        output: { item: 'Reinforced Iron Plate', amount: 5 },
        time: 12
      },
      {
        name: 'Rotor',
        inputs: [{ item: 'Iron Rod', amount: 20 }, { item: 'Screw', amount: 100 }],
        output: { item: 'Rotor', amount: 4 },
        time: 15
      },
      {
        name: 'Modular Frame',
        inputs: [{ item: 'Reinforced Iron Plate', amount: 3 }, { item: 'Iron Rod', amount: 12 }],
        output: { item: 'Modular Frame', amount: 2 },
        time: 60
      },
      {
        name: 'Smart Plating',
        inputs: [{ item: 'Reinforced Iron Plate', amount: 1 }, { item: 'Rotor', amount: 1 }],
        output: { item: 'Smart Plating', amount: 1 },
        time: 30
      },
      {
        name: 'Motor',
        inputs: [{ item: 'Rotor', amount: 10 }, { item: 'Stator', amount: 10 }],
        output: { item: 'Motor', amount: 5 },
        time: 12
      },
      {
        name: 'Stator',
        inputs: [{ item: 'Steel Pipe', amount: 15 }, { item: 'Wire', amount: 40 }],
        output: { item: 'Stator', amount: 5 },
        time: 12
      },
      {
        name: 'Encased Industrial Beam',
        inputs: [{ item: 'Steel Beam', amount: 24 }, { item: 'Concrete', amount: 30 }],
        output: { item: 'Encased Industrial Beam', amount: 6 },
        time: 10
      },
      {
        name: 'Bolted Frame',
        isAlternate: true,
        inputs: [{ item: 'Reinforced Iron Plate', amount: 7.5 }, { item: 'Screw', amount: 140 }],
        output: { item: 'Modular Frame', amount: 5 },
        time: 24
      },
      {
        name: 'Stitched Iron Plate',
        isAlternate: true,
        inputs: [{ item: 'Iron Plate', amount: 18.75 }, { item: 'Wire', amount: 37.5 }],
        output: { item: 'Reinforced Iron Plate', amount: 5.625 },
        time: 32
      },
      {
        name: 'Copper Rotor',
        isAlternate: true,
        inputs: [{ item: 'Copper Sheet', amount: 22.5 }, { item: 'Screw', amount: 195 }],
        output: { item: 'Rotor', amount: 11.25 },
        time: 16
      },
      {
        name: 'Steel Rotor',
        isAlternate: true,
        inputs: [{ item: 'Steel Pipe', amount: 10 }, { item: 'Wire', amount: 30 }],
        output: { item: 'Rotor', amount: 5 },
        time: 12
      }
    ]
  },
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    type: 'manufacturer',
    powerUsage: 55,
    recipes: [
      {
        name: 'Computer',
        inputs: [
          { item: 'Circuit Board', amount: 25 },
          { item: 'Cable', amount: 22.5 },
          { item: 'Plastic', amount: 45 },
          { item: 'Screw', amount: 130 }
        ],
        output: { item: 'Computer', amount: 2.5 },
        time: 24
      },
      {
        name: 'Heavy Modular Frame',
        inputs: [
          { item: 'Modular Frame', amount: 10 },
          { item: 'Steel Pipe', amount: 30 },
          { item: 'Encased Industrial Beam', amount: 10 },
          { item: 'Screw', amount: 200 }
        ],
        output: { item: 'Heavy Modular Frame', amount: 2 },
        time: 30
      },
      {
        name: 'Crystal Oscillator',
        inputs: [
          { item: 'Quartz Crystal', amount: 36 },
          { item: 'Cable', amount: 28 },
          { item: 'Reinforced Iron Plate', amount: 5 }
        ],
        output: { item: 'Crystal Oscillator', amount: 2 },
        time: 120
      }
    ]
  },
  {
    id: 'refinery',
    name: 'Refinery',
    type: 'refinery',
    powerUsage: 30,
    recipes: [
      {
        name: 'Plastic',
        inputs: [{ item: 'Crude Oil', amount: 30 }],
        output: { item: 'Plastic', amount: 20 },
        byproduct: { item: 'Heavy Oil Residue', amount: 10 },
        time: 6
      },
      {
        name: 'Rubber',
        inputs: [{ item: 'Crude Oil', amount: 30 }],
        output: { item: 'Rubber', amount: 20 },
        byproduct: { item: 'Heavy Oil Residue', amount: 20 },
        time: 6
      },
      {
        name: 'Fuel',
        inputs: [{ item: 'Crude Oil', amount: 60 }],
        output: { item: 'Fuel', amount: 40 },
        byproduct: { item: 'Polymer Resin', amount: 30 },
        time: 6
      },
      {
        name: 'Alumina Solution',
        inputs: [{ item: 'Bauxite', amount: 120 }, { item: 'Water', amount: 180 }],
        output: { item: 'Alumina Solution', amount: 120 },
        byproduct: { item: 'Silica', amount: 50 },
        time: 6
      },
      {
        name: 'Aluminum Scrap',
        inputs: [{ item: 'Alumina Solution', amount: 240 }, { item: 'Coal', amount: 120 }],
        output: { item: 'Aluminum Scrap', amount: 360 },
        byproduct: { item: 'Water', amount: 120 },
        time: 1
      }
    ]
  }
];

export const logisticsBuildings = [
  {
    id: 'splitter',
    name: 'Splitter',
    type: 'splitter',
    description: 'Splits input into 3 equal outputs',
    powerUsage: 0,
    recipes: []
  },
  {
    id: 'merger',
    name: 'Merger',
    type: 'merger',
    description: 'Combines 3 inputs into 1 output',
    powerUsage: 0,
    recipes: []
  },
  {
    id: 'smart-splitter',
    name: 'Smart Splitter',
    type: 'smart-splitter',
    description: 'Programmable splitter with filters',
    powerUsage: 0,
    recipes: []
  }
];