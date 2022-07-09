export const Scripts: {[k: string]: ModdedBattleScriptsData} = {
	teambuilderConfig: {
		excludeStandardTiers: true,
		customTiers: ['ANL OU', 'ANL NFE', 'ANL LC'],
	},

	pokemon: {
		calculateStat(statName: StatNameExceptHP, boost: number, modifier?: number) {
			statName = toID(statName) as StatNameExceptHP;
			// @ts-ignore - type checking prevents 'hp' from being passed, but we're paranoid
			if (statName === 'hp') throw new Error("Please read `maxhp` directly");
	
			// base stat
			let stat = this.storedStats[statName];
	
			// Wonder Room swaps defenses before calculating anything else
			if ('wonderroom' in this.battle.field.pseudoWeather) {
				if (statName === 'def') {
					stat = this.storedStats['spd'];
				} else if (statName === 'spd') {
					stat = this.storedStats['def'];
				}
			}
	
			// stat boosts
			let boosts: SparseBoostsTable = {};
			const boostName = statName as BoostName;
			boosts[boostName] = boost;
			boosts = this.battle.runEvent('ModifyBoost', this, null, null, boosts);
			boost = boosts[boostName]!;
			const boostTable = [1, 1.5];
			if (boost > 1) boost = 1;
			if (boost < -1) boost = -1;
			if (boost >= 0) {
				stat = Math.floor(stat * boostTable[boost]);
			} else {
				stat = Math.floor(stat / boostTable[-boost]);
			}
	
			// stat modifier
			return this.battle.modify(stat, (modifier || 1));
		},

		boostBy(boosts: SparseBoostsTable) {
			let delta = 0;
			let boostName: BoostName;
			for (boostName in boosts) {
				delta = boosts[boostName]!;
				this.boosts[boostName] += delta;
				if (this.boosts[boostName] > 1) {
					delta -= this.boosts[boostName] - 1;
					this.boosts[boostName] = 1;
					if (boostName === 'atk' || boostName === 'spa') {
						const altBoost = boostName === 'atk' ? 'atk' : 'spa';
						delta -= this.boosts[altBoost] - 1;
						this.boosts[altBoost] = 1;
					}
				}
				if (this.boosts[boostName] < -1) {
					delta -= this.boosts[boostName] - (-1);
					this.boosts[boostName] = -1;
				}
			}
			return delta;
		},

		boost(
			boost: SparseBoostsTable, target: Pokemon | null = null, source: Pokemon | null = null,
			effect: Effect | null = null, isSecondary = false, isSelf = false
		) {
			if (this.event) {
				if (!target) target = this.event.target;
				if (!source) source = this.event.source;
				if (!effect) effect = this.effect;
			}
			if (!target || !target.hp) return 0;
			if (!target.isActive) return false;
			if (this.gen > 5 && !target.side.foe.pokemonLeft) return false;
			boost = this.runEvent('Boost', target, source, effect, {...boost});
			let success = null;
			let boosted = isSecondary;
			let boostName: BoostName;
			for (boostName in boost) {
				const currentBoost: SparseBoostsTable = {};
				currentBoost[boostName] = boost[boostName];

				if ((boostName === 'atk' || boostName === 'spa')) {
					this.add('-message', 'Attacke booste helle yeahe')
				}

				let boostBy = target.boostBy(currentBoost);
				let msg = '-boost';
				if (boost[boostName]! < 0) {
					msg = '-unboost';
					boostBy = -boostBy;
				}
				if (boostBy) {
					success = true;
					switch (effect?.id) {
					case 'bellydrum':
						this.add('-setboost', target, 'atk', target.boosts['atk'], '[from] move: Belly Drum');
						break;
					case 'bellydrum2':
						this.add(msg, target, boostName, boostBy, '[silent]');
						this.hint("In Gen 2, Belly Drum boosts by 2 when it fails.");
						break;
					case 'zpower':
						this.add(msg, target, boostName, boostBy, '[zeffect]');
						break;
					default:
						if (!effect) break;
						if (effect.effectType === 'Move') {
							this.add(msg, target, boostName, boostBy);
						} else if (effect.effectType === 'Item') {
							this.add(msg, target, boostName, boostBy, '[from] item: ' + effect.name);
						} else {
							if (effect.effectType === 'Ability' && !boosted) {
								this.add('-ability', target, effect.name, 'boost');
								boosted = true;
							}
							this.add(msg, target, boostName, boostBy);
						}
						break;
					}
					this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
				} else if (effect && effect.effectType === 'Ability') {
					if (isSecondary) this.add(msg, target, boostName, boostBy);
				} else if (!isSecondary && !isSelf) {
					this.add(msg, target, boostName, boostBy);
				}
			}
			this.runEvent('AfterBoost', target, source, effect, boost);
			if (success && Object.values(boost).some(x => x! > 0)) target.statsRaisedThisTurn = true;
			if (success && Object.values(boost).some(x => x! < 0)) target.statsLoweredThisTurn = true;
			return success;
		},

		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;
	
			baseDamage += 2;
	
			// multi-target modifier (doubles only)
			if (move.spreadHit) {
				const spreadModifier = move.spreadModifier || (this.gameType === 'free-for-all' ? 0.5 : 0.75);
				this.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.modify(baseDamage, spreadModifier);
			}
	
			// weather modifier
			baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);
	
			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.gen >= 6 ? 1.5 : 2)));
			}
	
			// random factor - also not a modifier
			baseDamage = this.randomizer(baseDamage);
	
			// STAB
			if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a MissingNo.)
				baseDamage = this.modify(baseDamage, move.stab || 1.5);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.add('-supereffective', target);
	
				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.add('-resisted', target);
	
				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}
	
			if (isCrit && !suppressMessages) this.add('-crit', target);
	
			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				if (this.gen < 6 || move.id !== 'facade') {
					baseDamage = this.modify(baseDamage, 0.5);
				}
			}

			if (pokemon.status === 'frz' && move.category === 'Special') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
	
			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.gen === 5 && !baseDamage) baseDamage = 1;
	
			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);
	
			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.modify(baseDamage, 0.25);
				this.add('-zbroken', target);
			}
	
			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.gen !== 5 && !baseDamage) return 1;
	
			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
	},
};