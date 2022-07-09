export const Conditions: {[k: string]: ConditionData} = {	
	legendsBoost: {
		name: 'altBoost',
		onStart(pokemon) {
			this.add('-message', 'altBoost is here !');
		},
		onBoost(this, boost, target, source, effect) {
			let i: BoostName;
			for (i in boost) {
				let LegendsBoost : SparseBoostsTable = {};
				this.add('-message', `i (BoostName) is ${i}`);
				if(boost[i]! === 1 || boost[i]! === 3) { //idk lol
					//let altBoost: boost | undefined = stats.length ? this.sample(stats) : undefined;
					//let altBoost : SparseBoostsTable = {};
					const altBoost = boost === 'atk' ? 'spa' : 'atk';
					if (altBoost) LegendsBoost[altBoost] = 2;
				}
				this.boost(LegendsBoost);
			}
		},
	},


	fixated: {
		name: 'fixated',
		onStart(target, source, effect) {
			this.add('-start', source, 'fixated', '[silent]');
			this.effectData.move = effect.id;
			this.add('-message', `${source.name} is fixated on ${this.effectData.move}!`);
		},

		onTryMovePriority: -2,
		onTryMove(pokemon, target, move) {
			//this.add('-message', `effectdata is: ${this.effectData.move} and move.id is: ${move.id}`);
			if(this.effectData.move === move.id) return;
			pokemon.removeVolatile('fixated');
		},

		onModifyDamage(damage, source, target, move) {
			//this.add('-message', 'fixated boost !');
			return this.chainModify(1.5);
		},

		onFoeBasePowerPriority: 17,
		onFoeBasePower(basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			return this.chainModify(1.33);
		},

		onEnd(pokemon) { //idk how to properly do messages and stuff so this is the next best thing x
			this.add('-end', pokemon, 'fixated', '[silent]');
			this.add('-message', `${pokemon.name} is no longer fixated!`);
		},
	},

	primed: {
		name: 'primed',
		duration: 5,

		onStart(target, source, effect) {
			this.add('-start', source, 'primed', '[silent]');
			this.add('-message', `${source.name} is primed!`);
		},

		onModifyDamage(damage, source, target, move) {
			this.add('-message', 'primed boost !');
			return this.chainModify(1.5);
		},

		onEnd(pokemon) {
			this.add('-end', pokemon, 'primed', '[silent]');
			this.add('-message', `${pokemon.name} is no longer primed!`);
		},
	},


	/// Canon Conditions ///



	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'brn');
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'brn');
				pokemon.setStatus('');
				return;
			}
		},

		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('quickfeet')) {
				return this.chainModify(0.5);
			}
		},
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'par');
				pokemon.setStatus('');
				return;
			}
		}
	},

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
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},
		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},
		onHit(target, source, move) {
			if (move.thawsTarget || (move.id === 'flamewheel' || move.id === 'flareblitz') && move.category !== 'Status') {
				target.cureStatus();
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.hint(`${this.effectData.target.name} is afflicted with frostbite!`);
			this.damage(pokemon.baseMaxhp / 16);
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'frz');
				pokemon.setStatus('');
				return;
			}
		},
	},

	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},

		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if(this.field.isWeather('hail')) {
				if (this.randomChance(1, 1.5)) {
					this.add('cant', pokemon, 'slp');
					return false;
				}
			} else {
				if (this.randomChance(1, 3)) {
					this.add('cant', pokemon, 'slp');
					return false;
				}
			}
		},
		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},

		onFoeBasePowerPriority: 17,
		onFoeBasePower(basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			return this.chainModify(1.33);
		},

		onResidualOrder: 9,
		onResidual(pokemon) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'slp');
				pokemon.setStatus('');

				return;
			}
		}
	},

	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'psn');
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'psn');
				pokemon.setStatus('');
				return;
			}
		},
		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},
	},
	tox: {
		name: 'tox',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectData.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') {
				this.add('-status', target, 'tox', '[from] item: Toxic Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'tox');
			}
			this.effectData.startTime = 6;
			this.effectData.time = this.effectData.startTime;
		},
		onSwitchIn() {
			this.effectData.stage = 0;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectData.stage);
			if (pokemon.statusData.time <= 0) {
				this.add('-curestatus', pokemon, 'tox');
				pokemon.setStatus('');
				return;
			}
		},
		onAnyTryMove(this, source, target, move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== ('brn' || 'par' || 'tox' || 'psn' || 'frz')) return;
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent');
					target.setStatus('');
				}
			}	else if (move.status) {
					this.add('-message', 'cleared Status');
					this.add('-curestatus', target, 'brn', '[Silent]');
					target.setStatus('');
			}
		},
	},

	hail: {
		name: 'Hail',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (const secondary of move.secondaries) {
					if (secondary.status !== 'frz') return;
					this.add('-message', 'doubling secondary chance');
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},
};