export const Moves: {[k: string]: ModdedMoveData} = {

	tephraburst: {
		num: -100,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Tephra Burst",
		shortDesc: "Sets Jagged Splinters.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			volatileStatus: 'jaggedsplinters',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},

	eeriereflection: {
		num: -101,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Eerie Reflection",
		shortDesc: "50% chance to lower target's SpA.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, authentic: 1},
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
			volatileStatus: 'confusion',
		},
		target: "allAdjacentFoes",
		type: "Ghost",
	},

	stormin: {
		num: -102,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Storm In",
		shortDesc: "User becomes Fixated.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 100,
			self: {
				volatileStatus: 'fixated',
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},

	/// canon moves ///

	rest: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.setStatus('slp', source, move)) return false;
			this.heal((target.maxhp * 4) / 3); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},

	outrage: {
		inherit: true,
			self: {
				volatileStatus: 'fixated',
			},
	},

	petaldance: {
		inherit: true,
		self: {
			volatileStatus: 'fixated',
		},
	},

	rollout: {
		inherit: true,
		self: {
			volatileStatus: 'fixated',
		},
	},

	iceball: {
		inherit: true,
		self: {
			volatileStatus: 'fixated',
		},
	},

	stealthrock: {
		inherit: true,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		secondary: {
			chance: 100,
			volatileStatus: 'jaggedsplinters',
		},
		sideCondition: undefined,
		shortDesc: "Sets Jagged Splinters.",
	},

	spikes: {
		inherit: true,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		secondary: {
			chance: 100,
			volatileStatus: 'jaggedsplinters',
		},
		shortDesc: "Sets Jagged Splinters.",
	},

	pinmissile: {
		inherit: true,
		secondary: {
			chance: 100,
			volatileStatus: 'jaggedsplinters',
		},
		shortDesc: "Sets Jagged Splinters.",
	},

	focusenergy: {
		inherit: true,
		condition: {
			duration: 5,
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') {
					this.add('-start', target, 'move: Focus Energy', '[zeffect]');
				} else if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Focus Energy', '[silent]');
				} else {
					this.add('-start', target, 'move: Focus Energy');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 2;
			},
		},
	},

	dragonclaw: {
		inherit: true,
		critRatio: 2,
	},

	xscissor: {
		inherit: true,
		critRatio: 2,
	},

	selfdestruct: {
		inherit: true,
		selfdestruct: '',
		onModifyMove(move, target, source) {
			this.damage((source.maxhp * 5) / 4);
		},
	},
};