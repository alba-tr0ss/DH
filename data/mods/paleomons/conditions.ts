export const Conditions: {[k: string]: ConditionData} = {	
	tarterrain: {
		name: "Tar Terrain",
		effectType: 'Terrain',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('terrainextender')) {
				return 8;
			}
			return 5;
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.hasItem('heavydutyboots') || attacker.hasAbility('thunderstruck') || defender.hasAbility('thunderstruck')) return;
			if (move.type === 'Poison' && attacker.isGrounded()) {
				this.debug('tar terrain boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
			if (move.type === 'Fire' && attacker.isGrounded()) {
				this.debug('tar terrain debug');
				return this.chainModify(0.5);
			}
		},

		onStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				this.add('-fieldstart', 'move: Tar Terrain', '[from] ability: ' + effect, '[of] ' + source);
				this.add('-message', "The battlefield became coated in tar!");
				this.hint(`Tar Terrain increases the power of Poison-type moves by 1.3x and applies Powder to all Pokemon on the field.`);
				this.hint(`Doesn't affect non-grounded Pokemon nor Pokemon holding Heavy-Duty Boots.`);
			} else {
				this.add('-fieldstart', 'move: Tar Terrain');
			}
		},

		onTryMove(pokemon, target, move) {
			if (pokemon.hasAbility('thunderstruck')) return;
			if (move.type === 'Fire') {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable() && !pokemon.hasItem('heavydutyboots')) {
					this.add('-message', "When the flame touched the sticky tar on the Pokemon, it combusted!");
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
				}
			}
		},
		
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd() {
			this.add('-fieldend', 'move: Tar Terrain');
		},
	},

	fanglock: {
		name: 'fanglock',
		onStart(target) {
			this.add('-activate', target, 'trapped');
		},
	},

	absorption: {
		name: 'absorption',
		onSwitchIn(pokemon) {
			this.effectData.switchingIn = true;
		},
		onStart(pokemon) { //i have 0 idea if this will activate when i want it to but whatever lol
			if (!this.effectData.switchingIn || this.field.isTerrain('')) {
				this.add('-message', `piss`);
				return;
			}
			let type;
				switch (this.field.terrain) {
				case 'electricterrain':
					type = 'Electric';
					break;
				case 'grassyterrain':
					type = 'Grass';
					break;
				case 'mistyterrain':
					type = 'Fairy';
					break;
				case 'psychicterrain':
					type = 'Psychic';
					break;
				case 'tarterrain':
					type = 'Psychic';
					break;
				default:
					break;
				}
			this.add('-message', `${type} is the current type`);
			return type;
		},
		onTryHit(target, source, move) {
			this.add('-message', `Target: ${target.name}, Source: ${target.name}, terrain type: ${!target.volatiles['absorption'].type}`);
			if (!target.volatiles['absorption'].type) return;
			if (target !== source && move.type === target.volatiles['absorption'].type) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Absorption');
				}
				return null;
			}
		},
	},
};