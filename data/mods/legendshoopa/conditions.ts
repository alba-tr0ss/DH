export const Conditions: {[k: string]: ConditionData} = {	
	// code stolen from M4A's Sandbox x
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'frz');
			}
			this.hint(`${this.effectData.target.name} is frostbitten! It can still use moves, but its special moves will be half as strong.`);
			this.hint(`Like a burn, frostbite will damage the afflicted Pokémon at the end of each turn.`);
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		/*
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', '[from] move: ' + move);
				pokemon.setStatus('');
			}
		},
		*/
		onHit(target, source, move) {
			if (move.thawsTarget || (move.id === 'flamewheel' || move.id === 'flareblitz') && move.category !== 'Status') {
				target.cureStatus();
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.hint(`${this.effectData.target.name} is afflicted with frostbite!`);
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
};