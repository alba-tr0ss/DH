export const Scripts: {[k: string]: ModdedBattleScriptsData} = {

	teambuilderConfig: {
		excludeStandardTiers: true,
		customTiers: ['MMorph'],
	},

	init() {
		// code "borrowed" from Optimons
		const addNewMoves = (pokemonid: string, moveids: string[]) => {
			for (const moveid of moveids) {
				this.modData('Learnsets', pokemonid).learnset[moveid] = [moveid === 'dracometeor' || moveid === 'steelbeam' ? '8T' : '8M'];
			}
		};
		addNewMoves('golurk', ['sealshatter']);
	}
};