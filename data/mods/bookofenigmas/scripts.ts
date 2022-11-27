export const Scripts: {[k: string]: ModdedBattleScriptsData} = {
	// Terastal
	// taken from SV Speculative

	canMegaEvo(pokemon) {
		if (pokemon.species.isMega) return null;
		return pokemon.hpType || "Normal";
	},
	runMegaEvo(pokemon) {
		if (pokemon.species.isMega || !pokemon.canMegaEvo) return false;
		if (pokemon.illusion) {
			this.singleEvent('End', this.dex.getAbility('Illusion'), pokemon.abilityData, pokemon);
		}
		let species = this.dex.deepClone(pokemon.species);
		species.teraBoost = pokemon.species.types;
		species.teraType = pokemon.canMegaEvo; // remember that the species is Terastal
		species.types = [species.teraType];
		species.nonTeraForm = pokemon.species;
		
		// Pokémon affected by Sky Drop cannot Terastallize
		const side = pokemon.side;
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(species, "Terastal", true);
		this.add('-anim', pokemon, "Cosmic Power", pokemon);
		this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		this.add('-message', `${pokemon.name} Terastallized to become ${species.types[0]}-type!`);
		pokemon.addVolatile('terastal');

		// Limit one Terastal
		for (const ally of side.pokemon) ally.canMegaEvo = null;
		return true;
	},
	runSwitch(pokemon: Pokemon) { // modified for Terastal
		if (pokemon.illusion ? pokemon.illusion.species.teraType : pokemon.species.teraType) this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		this.runEvent('Swap', pokemon);
		this.runEvent('SwitchIn', pokemon);
		if (this.gen <= 2 && !pokemon.side.faintedThisTurn && pokemon.draggedIn !== this.turn) {
			this.runEvent('AfterSwitchInSelf', pokemon);
		}
		if (!pokemon.hp) return false;
		pokemon.isStarted = true;
		if (!pokemon.fainted) {
			this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityData, pokemon);
			pokemon.abilityOrder = this.abilityOrder++;
			this.singleEvent('Start', pokemon.getItem(), pokemon.itemData, pokemon);
		}
		if (this.gen === 4) {
			for (const foeActive of pokemon.side.foe.active) {
				foeActive.removeVolatile('substitutebroken');
			}
		}
		pokemon.draggedIn = null;
		return true;
	},

	pokemon: {

		setType(newType: string | string[], enforce = false) { // modded for Terastal
			// First type of Arceus, Silvally cannot be normally changed
			if (!enforce) {
				if (this.species.teraType || (this.battle.gen >= 5 && (this.species.num === 493 || this.species.num === 773)) ||
					 (this.battle.gen === 4 && this.hasAbility('multitype'))) {
					return false;
				}
			}

			if (!newType) throw new Error("Must pass type to setType");
			this.types = (typeof newType === 'string' ? [newType] : newType);
			this.addedType = '';
			this.knownType = true;
			this.apparentType = this.types.join('/');

			return true;
		},

		formeChange( // modded for Terastal
		speciesId: string | Species, source: Effect = this.battle.effect,
		 isPermanent?: boolean, message?: string
		) {
			if (this.species.teraType) console.log("teraType: " + this.species.teraType);
			let baseForm = this.battle.dex.getSpecies(speciesId);
			let teraSpecies = null;
			if (this.species.teraType) {
				teraSpecies = this.battle.dex.deepClone(baseForm);
				teraSpecies.teraType = this.species.teraType;
				teraSpecies.types = [teraSpecies.teraType];
				teraSpecies.teraBoost = this.battle.dex.getSpecies(speciesId).types;
				teraSpecies.nonTeraForm = baseForm;
			}
			const rawSpecies = teraSpecies || baseForm;
			const species = this.setSpecies(rawSpecies, source);
			if (!species) return false;

			if (this.battle.gen <= 2) return true;

			// The species the opponent sees
			const apparentSpecies =
					this.illusion ? this.illusion.species.name : species.baseSpecies;
			if (isPermanent) {
				this.baseSpecies = rawSpecies;
				this.details = species.name + (this.level === 100 ? '' : ', L' + this.level) +
					(this.gender === '' ? '' : ', ' + this.gender) + (this.set.shiny ? ', shiny' : '');
				this.battle.add('detailschange', this, (this.illusion || this).details);
				if (source.effectType === 'Item') {
					if (source.zMove) {
						this.battle.add('-burst', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Ultra Burst counts as an action for Truant
					} else if (source.onPrimal) {
						if (this.illusion) {
							this.ability = '';
							this.battle.add('-primal', this.illusion);
						} else {
							this.battle.add('-primal', this);
						}
					} else {
						this.battle.add('-mega', this, apparentSpecies, species.requiredItem);
						this.moveThisTurnResult = true; // Mega Evolution counts as an action for Truant
					}
				} else if (source.effectType === 'Status') {
					// Shaymin-Sky -> Shaymin
					this.battle.add('-formechange', this, species.name, message);
				}
			} else {
				if (source.effectType === 'Ability') {
					this.battle.add('-formechange', this, species.name, message, `[from] ability: ${source.name}`);
				} else {
					this.battle.add('-formechange', this, this.illusion ? this.illusion.species.name : species.name, message);
				}
			}
			
			if (source === "Terastal") return true;
			if (isPermanent && !['disguise', 'iceface'].includes(source.id)) {
				if (this.illusion) {
					this.ability = ''; // Don't allow Illusion to wear off
				}
				this.setAbility(species.abilities['0'], null, true);
				this.baseAbility = this.ability;
			}
			if (teraSpecies) this.battle.add('-start', this, 'typechange', this.types.join('/'), '[silent]');
			return true;
		}
	},

	// modifyDamage added for the Terastal Adaptability boost

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
		if (move.forceSTAB || (type !== '???' && (pokemon.hasType(type) || pokemon.species.teraBoost?.includes(type)))) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			let stabBoost = 1.5;
			if (move.stab) stabBoost = move.stab;
			if (pokemon.species.teraBoost?.includes(type)) {
				if (pokemon.hasType(type)) {
					if (!suppressMessages) this.add('-message', `Terastal boosts moves of the ${type} type!`);
					stabBoost = 2;
				} else {
					this.hint(`Terastal keeps STAB on the user's original type, ${type}!`, true, pokemon.side);
					// don't reveal to the opponent (in case of Illusion)
				}
			}
			baseDamage = this.modify(baseDamage, stabBoost);
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
};