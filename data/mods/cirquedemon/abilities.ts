export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	ghastlytrill: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit || !move.flags['sound']) return;
			if (!move.flags['charge'] && !move.spreadHit && !move.isZ && !move.isMax) {
				move.multihit = 5;
				move.multihitType = 'ghastlytrill';
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'ghastlytrill') return this.chainModify(0.25);
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'ghastlytrill' && move.id === 'secretpower' && move.hit < 5) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Ghost';
			}
		},

		name: "Ghastly Trill",
		shortDesc: "Sound-based damaging moves hit 5 times at 0.25x its damage and become Ghost-type",
		desc: "The user's sound-based damaging moves become multi-hit moves that hit 5 times for a quarter of its damage. Sound-based damaging moves become Ghost-type.",
		rating: 4,
		num: -100,
	}
};