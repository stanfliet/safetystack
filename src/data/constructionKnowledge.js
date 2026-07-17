export const MATERIAL_PRICES = {
  concrete: { categories: [ { strength: '20MPa', price_per_m3: 1600 }, { strength: '25MPa', price_per_m3: 1750 }, { strength: '30MPa', price_per_m3: 1950 }, { strength: '40MPa', price_per_m3: 2400 } ], wastage_factor: 0.05 },
  bricks_blocks: { maxi_brick: { price_per_unit: 4.50, units_per_m2: 12 }, face_brick: { price_per_unit: 6.50, units_per_m2: 50 }, concrete_block_100: { price_per_unit: 8.50, units_per_m2: 10 }, paving_brick_60: { price_per_unit: 7.50, units_per_m2: 45 }, kerb_150: { price_per_unit: 55.00 } },
  cement: { opc_50kg: { price_per_bag: 95.00 } },
  aggregate: { '13mm_stone': { price_per_ton: 295 }, '19mm_stone': { price_per_ton: 290 }, crusher_run: { price_per_ton: 195 }, sand_river: { price_per_ton: 320 }, sand_plaster: { price_per_ton: 300 } },
  steel: { rebar_10mm: { price_per_ton: 15800, weight_per_m: 0.617 }, rebar_12mm: { price_per_ton: 15500, weight_per_m: 0.888 }, rebar_16mm: { price_per_ton: 15200, weight_per_m: 1.579 }, mesh_a142: { price_per_sheet: 180 }, mesh_a252: { price_per_sheet: 320 }, structural_steel: { price_per_ton: 18500 } },
  timber: { sa_pine_38x114: { price_per_m: 22 }, sa_pine_50x76: { price_per_m: 28 }, meranti_skirting: { price_per_m: 45 }, plywood_18mm: { price_per_sheet: 580 }, laminate_flooring: { price_per_m2: 180 } },
  roofing: { concrete_tile: { price_per_m2: 95 }, clay_tile: { price_per_m2: 145 }, chromadek_0_47: { price_per_m2: 115 }, insulation_foil: { price_per_m2: 35 }, roof_trusses: { price_per_unit: 2800 } },
  painting: { wall_acrylic: { price_per_litre: 95, coverage_m2: 8 }, enamel_gloss: { price_per_litre: 120, coverage_m2: 12 }, plaster_primer: { price_per_litre: 85, coverage_m2: 10 }, roof_paint: { price_per_litre: 160, coverage_m2: 6 } },
  tiling: { ceramic_tile: { price_per_m2: 145 }, porcelain_tile: { price_per_m2: 250 }, tile_cement: { price_per_kg: 20, coverage_kg_m2: 4 } },
  paving: { concrete_paver_60: { price_per_m2: 85 }, concrete_paver_80: { price_per_m2: 110 }, clay_paver: { price_per_m2: 140 }, grass_block: { price_per_m2: 120 } },
  kerblaying: { concrete_kerb_150: { price_per_m: 125 }, concrete_kerb_250: { price_per_m: 195 }, dropped_kerb: { price_per_unit: 380 } },
  electrical: { cable_1_5mm: { price_per_m: 18 }, cable_2_5mm: { price_per_m: 28 }, cable_4mm: { price_per_m: 42 }, db_board_6way: { price_per_unit: 450 }, earth_leakage: { price_per_unit: 280 }, circuit_breaker: { price_per_unit: 65 }, led_batten: { price_per_unit: 185 }, led_downlight: { price_per_unit: 145 }, socket_outlet: { price_per_unit: 55 }, light_switch: { price_per_unit: 45 } },
  plumbing: { pvc_pipe_50: { price_per_m: 35 }, pvc_pipe_100: { price_per_m: 75 }, copper_pipe_15mm: { price_per_m: 55 }, copper_pipe_22mm: { price_per_m: 85 }, geyser_150l: { price_per_unit: 3450 }, toilet_suite: { price_per_unit: 1800 }, basin_mixer: { price_per_unit: 450 }, water_tank_5000l: { price_per_unit: 4500 } },
  cabinetry: { melamine_board: { price_per_sheet: 320 }, mdf_board: { price_per_sheet: 380 }, hinges: { price_per_pair: 65 }, kitchen_doors: { price_per_set: 3500 }, quartz_worktop: { price_per_m: 1800 } },
  welding: { mild_steel_rod: { price_per_kg: 28 }, mig_wire: { price_per_kg: 45 }, welding_helmet: { price_per_unit: 350 }, angle_grinder: { price_per_unit: 450 } },
  foundations: { waterproofing_slurry: { price_per_litre: 95 }, damp_proof_membrane: { price_per_m2: 55 }, concrete_blinding: { price_per_m3: 1200 } },
};
export const LABOUR_RATES = {
  skilled: { bricklayer: 320, carpenter: 340, steel_fixer: 310, concrete_finisher: 290, plumber: 380, electrician: 400, painter: 280, tiler: 310, paver: 280, kerblayer: 290, cabinet_maker: 340, welder: 350, roofer: 320, plasterer: 310, scaffolder: 290, plant_operator: 300, foreman: 420 },
  semi_skilled: { machine_helper: 180, concrete_team: 195, bricklayer_helper: 190, painting_helper: 170, driver_light: 165, flagman: 160 },
  labourer: { general_worker: 135, cleaner: 125, material_handler: 130, excavation_helper: 140 },
  supervisory: { site_agent: 520, project_manager: 580, quantity_surveyor: 550, safety_officer: 420, engineer: 600 },
};
export const PLANT_RATES = {
  excavator_7ton: 3800, excavator_20ton: 6000, tlb: 3500, dozer_d6: 7500, grader: 6500, roller_8ton: 3200,
  front_loader_1m3: 4200, dump_truck_10ton: 3500, water_truck: 3800, compactor_plate: 350, concrete_mixer: 280,
  concrete_pump: 3500, generator_10kva: 550, generator_50kva: 1500, lighting_tower: 450, welding_machine: 250,
};
export const P_AND_G_TYPICAL = { typical_percent: 12, min_percent: 8, max_percent: 15 };
export const OVERHEAD_PROFIT = { typical_percent: 15, min_percent: 12, max_percent: 22 };
