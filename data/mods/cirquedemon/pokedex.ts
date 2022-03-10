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

	primarina: {
		inherit: true,
		otherFormes: ["Primarina-Cirque"],
		formeOrder: ["Primarina", "Primarina-Cirque"],
	},
	
	primarinacirque: {
		name: "Primarina-Cirque",
		baseSpecies: "Primarina",
		forme: "Cirque",
		types: ["Ghost", "Fairy"],
		baseStats: {hp: 80, atk: 74, def: 116, spa: 126, spd: 74, spe: 60},
		abilities: {0: "Torrent", H: "Liquid Voice"},
	},

};