export const Moves: {[k: string]: ModdedMoveData} = {



	/// canon moves ///

	rest: {
		inherit: true,
		onHit(target, source, move) {
			if (!target.setStatus('slp', source, move)) return false;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},


	icebeam: {
		inherit: true,
		secondary: {
			chance: 50,
			status: 'frz',
		},
	}
};