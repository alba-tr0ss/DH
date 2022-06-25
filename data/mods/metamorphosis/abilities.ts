export const Abilities: {[k: string]: ModdedAbilityData} = {
	slowstart: {
		onStart(pokemon) {
			if (pokemon.species.id === 'regigigasunleashed') return;
			pokemon.addVolatile('slowstart');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		condition: {
			duration: 1,
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
				if (target.species.baseSpecies === 'Regigigas') {
					target.formeChange('Regigigas-Unleashed', this.effect, true);
				}
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
};