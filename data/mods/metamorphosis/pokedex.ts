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
	archeops: {
		inherit: true,
		types: ["Flying", "Rock"],
		otherFormes: ["Archeops-Airborne"],
		formeOrder: ["Archeops", "Archeops-Airborne"],
	},

	archeopsairborne: {
		num: -100,
		name: "Archeops-Airborne",
		baseSpecies: "Archeops",
		forme: "Airborne",
		types: ["Flying"],
		baseStats: {hp: 75, atk: 115, def: 70, spa: 112, spd: 65, spe: 130},
		abilities: {0: "Defeatist"},
		weightkg: 32,
		requiredAbility: "Defeatist",
		battleOnly: "Archeops"
	},

	regigigas: {
		inherit: true,
		num: -101,
		name: "Regigigas",
		baseSpecies: "Regigigas",
		forme: "Slumber",
		types: ["Normal", "Ghost"],
		baseStats: {hp: 110, atk: 100, def: 80, spa: 100, spd: 80, spe: 50},
		abilities: {0: "Slow Start"},
		otherFormes: ["Regigigas-Unleashed"],
		formeOrder: ["Regigigas", "Regigigas-Unleashed"],
	},

	regigigasunleashed: {
		num: -101,
		name: "Regigigas-Unleashed",
		baseSpecies: "Regigigas",
		forme: "Unleashed",
		types: ["Normal"],
		baseStats: {hp: 110, atk: 160, def: 110, spa: 100, spd: 110, spe: 100},
		abilities: {0: "Slow Start"},
		weightkg: 420,
		requiredAbility: "Slow Start",
		battleOnly: "Regigigas"
	},

	golurk: {
		inherit: true,
		otherFormes: ["Golurk-Unsealed"],
		formeOrder: ["Golurk", "Golurk-Unsealed"],
	},

	golurkunsealed: {
		num: -102,
		name: "Golurk-Unsealed",
		baseSpecies: "Golurk",
		forme: "Unsealed",
		types: ["Ground", "Fighting"],
		baseStats: {hp: 58, atk: 130, def: 90, spa: 55, spd: 90, spe: 100},
		abilities: {0: "No Guard", 1: "Iron Fist", H: "Reckless"},
		weightkg: 330,
	},
};