export const Moves: {[k: string]: ModdedMoveData} = {



	/// canon moves ///

	rest: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.setStatus('slp', source, move)) return false;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
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
		onHit(this, target, source, move) {
			this.effectData.isSpikes = true;
		},
	},
};