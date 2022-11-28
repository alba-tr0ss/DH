export const Moves: {[k: string]: ModdedMoveData} = {
	ragingfury: {
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		num: -1001,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Raging Fury",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Inferno Overdrive", target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: null,
		target: "randomNormal",
		type: "Fire",
		contestType: "Cool",
	},
	direclaw: {
		shortDesc: "50% chance to paralyze or poison or sleep target. High critical hit ratio.",
		num: -1005,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Dire Claw",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Crush Claw", target);
		},
		critRatio: 2,
		secondary: {
			chance: 50,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('psn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('slp', source);
				}
			},
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},

	psyshieldbash: {
		shortDesc: "100% chance to raise the user's Defense by 1.",
		num: -1013,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		name: "Psyshield Bash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Zen Headbutt", target);
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	stoneaxe: {
		shortDesc: "Sets Stealth Rock after damage. High critical hit ratio.",
		num: -1014,
		accuracy: 90,
		basePower: 65,
		category: "Physical",
		name: "Stone Axe",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Stone Edge", target);
		},
		critRatio: 2,
		sideCondition: 'stealthrock',
		secondary: null,
		target: "adjacentFoe",
		type: "Rock",
		contestType: "Tough",
	},
	headlongrush: {
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
		num: -1015,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Headlong Rush",
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Tectonic Rage", target);
		},
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	powershift: {
		shortDesc: "Switches user's Attack with Defense and Sp. Atk with Sp. Def.",
		num: -1017,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Power Shift",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Topsy-Turvy", target);
		},
		volatileStatus: 'powershift',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				const newspa = pokemon.storedStats.spd;
				const newspd = pokemon.storedStats.spa;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
				pokemon.storedStats.spa = newspa;
				pokemon.storedStats.spd = newspd;
			},
			onCopy(pokemon) {
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				const newspa = pokemon.storedStats.spd;
				const newspd = pokemon.storedStats.spa;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
				pokemon.storedStats.spa = newspa;
				pokemon.storedStats.spd = newspd;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				const newspa = pokemon.storedStats.spd;
				const newspd = pokemon.storedStats.spa;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
				pokemon.storedStats.spa = newspa;
				pokemon.storedStats.spd = newspd;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('Power Shift');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: {boost: {atk: 1}},
		contestType: "Clever",
	},
	mysticalpower: {
		shortDesc: "100% chance to raise the user's spa by 1.",
		num: -1018,
		accuracy: 90,
		basePower: 70,
		category: "Special",
		name: "Mystical Power",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	wavecrash: {
		shortDesc: "Usually goes first. Has 33% recoil.",
		num: -1008,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Wave Crash",
		pp: 10,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Waterfall", target);
		},
		recoil: [1, 3],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	chloroblast: {
		shortDesc: "User loses 50% max HP.",
		num: -1002,
		accuracy: 95,
		basePower: 150,
		category: "Special",
		name: "Chloroblast",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Bloom Doom", target);
		},
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.getEffect('Steel Beam'), true);
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	infernalparade: {
		shortDesc: "Power doubles if the target has a status ailment; 30% chance to burn.",
		num: -1003,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		name: "Infernal Parade",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Will-o-Wisp", target);
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Ghost",
		zMove: {basePower: 160},
		contestType: "Clever",
	},
	barbbarrage: {
		shortDesc: "Power doubles if the target has a status ailment; 30% chance to poison.",
		num: -1004,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Physical",
		name: "Barb Barrage",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit(target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Poison Sting", target);
		},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		zMove: {basePower: 160},
		contestType: "Clever",
	},
	terablast: {
		num: -1024,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or Trick-or-Treat. This move is typeless if the user's type is typeless alone. Additionally, this move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
		shortDesc: "In Terastal, type matches Tera Type; phys if Atk > SpA.",
		name: "Tera Blast",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyType(move, pokemon) {
			if (pokemon.species.teraType) move.type = pokemon.species.teraType;
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onPrepareHit: function(target, source) {	
			this.attrLastMove('[still]');
			this.add('-anim', source, "Hidden Power", target);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	icespinner: {
		num: -1025,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "",
		shortDesc: "",
		name: "Ice Spinner",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onHit(target, source, move) {
			this.field.clearTerrain();
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},

	ragingbull: {
		num: -1026,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "",
		shortDesc: "",
		name: "Raging Bull",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		onModifyType(move, pokemon) {
			switch (pokemon.baseSpecies.name) {
			case 'Tauros-Paldea':
				move.type = 'Fighting';
				break;
			case 'Tauros-Paldea-Fire':
				move.type = 'Fire';
				break;
			case 'Tauros-Paldea-Water':
				move.type = 'Water';
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal"
	},
	trailblaze: {
		num: -1027,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Trailblaze",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Grass",
	},
	chillingwater: {
		num: -1027,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Chilling Water",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: -1,
				},
			},
		},
		target: "normal",
		type: "Water",
	},
	hyperdrill: {
		num: -1028,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Hyper Drill",
		pp: 5,
		priority: 0,
		flags: {contact: 1, mirror: 1},
		// breaking protect implemented in scripts.ts
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	twinbeam: {
		num: -1029,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Twin Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	ragefist: {
		num: -1030,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rage Fist",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'ragefist',
		},
		condition: {
			onStart(pokemon) {

			},
			onHit(target, source, move) {
				if (target !== source && move.category !== 'Status') {
					return Math.min(350, 50 + 50 * pokemon.timesAttacked);
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
};