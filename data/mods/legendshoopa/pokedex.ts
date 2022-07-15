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
		evos: [""],
		types: [""],
		baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
		abilities: {0: ""},
		weightkg: ,
		prevo: "",
	},
	*/

	larvitar: {
		inherit: true,
		evos: ["Pupitar", "Pupitar-Hoenn"],
	},

	pupitar: {
		inherit: true,
		otherFormes: ["Pupitar-Hoenn"],
		formeOrder: ["Pupitar", "Pupitar-Hoenn"],
	},

	pupitarhoenn: {
		num: 247,
		name: "Pupitar-Hoenn",
		baseSpecies: "Pupitar",
		forme: "Hoenn",
		evos: ["Tyranitar-Hoenn"],
		types: ["Fire" , "Rock"],
		baseStats: {hp: 70, atk: 84, def: 70, spa: 65, spd: 70, spe: 51},
		abilities: {0: "Magma Armor"},
		weightkg: 188,
		prevo: "Larvitar",
	},

	tyranitar: {
		inherit: true,
		otherFormes: ["Tyranitar-Hoenn"],
		formeOrder: ["Tyranitar", "Tyranitar-Hoenn"],
	},

	tyranitarhoenn: {
		num: 248,
		name: "Tyranitar-Hoenn",
		baseSpecies: "Tyranitar",
		forme: "Hoenn",
		types: ["Fire", "Rock"],
		baseStats: {hp: 100, atk: 124, def: 110, spa: 85, spd: 80, spe: 91},
		abilities: {0: "Grassy Surge", H: "Ripen"},
		weightkg: 408,
		prevo: "Pupitar-Hoenn",
	},

	slugma: {
		inherit: true,
		evos: ["Magcargo", "Magcargo-Hoenn"],
	},

	magcargo: {
		inherit: true,
		otherFormes: ["Magcargo-Hoenn"],
		formeOrder: ["Magcargo", "Magcargo-Hoenn"],
	},

	magcargohoenn: {
		num: 219,
		name: "Magcargo-Hoenn",
		baseSpecies: "Magcargo",
		forme: "Hoenn",
		types: ["Steel", "Ghost"],
		baseStats: {hp: 70, atk: 50, def: 90, spa: 90, spd: 120, spe: 10},
		abilities: {0: "Magma Armor", 1: "Mirror Armor", H: "Shell Armor"},
		weightkg: 55,
		prevo: "Slugma",
	},

	gloom: {
		inherit: true,
		evos: ["Bellossom", "Bellossom-Hoenn"],
	},

	bellossom: {
		inherit: true,
		otherFormes: ["Bellossom-Hoenn"],
		formeOrder: ["Bellossom", "Bellossom-Hoenn"],
	},

	bellossomhoenn: {
		num: 182,
		name: "Bellossom-Hoenn",
		baseSpecies: "Bellossom",
		forme: "Hoenn",
		types: ["Grass", "Fire"],
		baseStats: {hp: 85, atk: 50, def: 75, spa: 100, spd: 90, spe: 80},
		abilities: {0: "Chlorophyll", H: "Remaining Hope"},
		weightkg: 5.8,
		prevo: "Gloom",
	},
};