export const Abilities: {[k: string]: ModdedAbilityData} = {
	slowstart: {
		onStart(pokemon) {
			if (pokemon.species.id === 'regigigasunleashed') return;
			pokemon.addVolatile('slowstart');
		},
		onResidual(pokemon) {
			if (pokemon.volatiles['slowstart'] && pokemon.species.baseSpecies === 'Regigigas') {
				this.add('-activate', pokemon, 'ability: Slow Start');
				pokemon.formeChange('Regigigas-Unleashed', this.effect, true);
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		condition: {
			duration: 5,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		name: "Slow Start",
		rating: -1,
		num: 112,
	},

	defeatist: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if(pokemon.species.baseSpecies === 'Archeops') {
				const targetForme = (pokemon.hp <= pokemon.maxhp / 2 ? 'Archeops-Airborne' : 'Archeops');
				if (pokemon.species.name !== targetForme) pokemon.formeChange(targetForme);
			}
		},
		name: "Defeatist",
		rating: -1,
		num: 129,
	},

	vaporflux: {
		onUpdate(pokemon) {
			if(!pokemon.isActive || pokemon.species.baseSpecies !== 'Cryogonal' || pokemon.transformed) return;
			if(['raindance', 'primordialsea', 'sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if(pokemon.species.id !== 'cryogonalvapor') {
					pokemon.formeChange('Cryogonal-Vapor', this.effect, false, '[msg]');
				}
			} else {
				if(pokemon.species.id === 'cryogonalvapor') {
					pokemon.formeChange('Cryogonal', this.effect, false, '[msg]');
				}
			}
		},
		name: "Vapor Flux",
	},

	intelligencereport: {
			onStart(pokemon) {
				for (const target of pokemon.side.foe.active) {
					if (!target || target.fainted) continue;
					for (const moveSlot of target.moveSlots) {
						const move = this.dex.getMove(moveSlot.move);
						if (move.category === 'Status') continue;
						const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
						if (
							this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
							move.ohko
						) {
							if (pokemon.species.baseSpecies !== 'Falinks' || pokemon.transformed) return;
							this.add('-activate', pokemon, 'ability: Intelligence Report');
							const targetForme = pokemon.species.name === 'Falinks' ? 'Falinks-Stratagem' : 'Falinks';
							pokemon.formeChange(targetForme, this.effect, true);
							return;
						}
					}
				}
			},
		isPermanent: true,
		name: "Intelligence Report",
	},

	rainmaker: {
		onDamagingHit(damage, target, source, move) {
			if (this.field.getWeather().id !== 'raindance') {
				this.field.setWeather('raindance');
			}
		},
		onUpdate(pokemon) {
			if (pokemon.species.baseSpecies !== "Bronzong" || pokemon.transformed) return;
			const targetForme = ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())
			? 'Bronzong-Rain' : 'Bronzong';
			pokemon.formeChange(targetForme);
		},
		isPermanent: true,
		name: "Rainmaker",
	}
};