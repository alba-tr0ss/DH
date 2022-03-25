export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*

	name: {
		inherit: true,
		otherFormes: [""],
		formeOrder: [""],
	},

	name: {
		num: -x,
		name: "Name",
		baseSpecies: "",
		forme: "",
		types: [""],
		baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
		abilities: {0: ""},
		weightkg: ,
	},
	*/

	serperior: {
		inherit: true,
		otherFormes: ["Serperior-Cirque"],
		formeOrder: ["Serperior", "Serperior-Cirque"],
	},

	serperiorcirque: {
		num: -100,
		name: "Serperior-Cirque",
		baseSpecies: "Serperior",
		forme: "Cirque",
		types: ["Steel"],
		baseStats: {hp: 75, atk: 75, def: 95, spa: 75, spd: 95, spe: 113},
		abilities: {0: "Overgrow", H: "Skill Link"},
		weightkg: 63,
	},

	infernape: {
		inherit: true,
		otherFormes: ["Infernape-Cirque"],
		formeOrder: ["Infernape", "Infernape-Cirque"],
	},

	infernapecirque: {
		num: -102,
		name: "Infernape-Cirque",
		baseSpecies: "Infernape",
		forme: "Cirque",
		types: ["Fighting", "Flying"],
		baseStats: {hp: 76, atk: 104, def: 71, spa: 104, spd: 71, spe: 108},
		abilities: {0: "Blaze", H: "Aerial Combatant"},
		weightkg: 55,
	},

	primarina: {
		inherit: true,
		otherFormes: ["Primarina-Cirque"],
		formeOrder: ["Primarina", "Primarina-Cirque"],
	},
	
	primarinacirque: {
		num: -103,
		name: "Primarina-Cirque",
		baseSpecies: "Primarina",
		forme: "Cirque",
		types: ["Fairy", "Ghost"],
		baseStats: {hp: 80, atk: 74, def: 116, spa: 126, spd: 74, spe: 60},
		abilities: {0: "Torrent", H: "Ghastly Trill"},
	},
};