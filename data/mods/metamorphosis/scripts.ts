export const Scripts: {[k: string]: ModdedBattleScriptsData} = {

	teambuilderConfig: {
		excludeStandardTiers: true,
		customTiers: ['MMorph'],
	},

	//this.modData('Learnsets', 'poke').learnset.move = ['8L1'];

	init() {
		this.modData('Learnsets', 'Golurk').learnset.sealshatter = ['8L1'];
	}
};