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
		sideCondition: 'jaggedsplinters',
		condition: {
			onStart(side) {
				this.add('-sidestart', side, 'Jagged Splinters');
			},
	
			onResidual(pokemon) {
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('Stealth Rock')));
				const damage = this.getDamage(pokemon, pokemon, 25);
				if (typeof damage !== 'number') throw new Error("Jagged Splinters damage not dealt");
				this.damage(damage * typeMod);
			},
		}
	},
};