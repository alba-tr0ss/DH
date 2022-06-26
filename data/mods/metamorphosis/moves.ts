export const Moves: {[moveid: string]: ModdedMoveData} = {
	sealshatter: {
		num: -100,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Seal Shatter",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		onAfterHit(target, source) {
			const seal = this.dex.getMove('sealstitch');
			const sealIndex = source.moves.indexOf('sealshatter');
			const sealMove = {
				move: seal.name,
				id: seal.id,
				pp: seal.pp,
				maxpp: seal.pp,
				target: seal.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sealIndex] = sealMove;
			source.baseMoveSlots[sealIndex] = sealMove;
			this.add('-activate', source, 'move: Seal Shatter', seal.name);

			if (source.baseSpecies.baseSpecies === 'Golurk') {
				source.formeChange('golurkunsealed')
			}
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},

	sealstitch: {
		num: -101,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Seal Stitch",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		onAfterHit(target, source) {
			const seal = this.dex.getMove('sealshatter');
			const sealIndex = source.moves.indexOf('sealstitch');
			const sealMove = {
				move: seal.name,
				id: seal.id,
				pp: seal.pp,
				maxpp: seal.pp,
				target: seal.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sealIndex] = sealMove;
			source.baseMoveSlots[sealIndex] = sealMove;
			this.add('-activate', source, 'move: Seal Stitch', seal.name);

			if (source.baseSpecies.baseSpecies === 'Golurk') {
				source.formeChange('golurk')
			}
		},
		secondary: null,
		target: "self",
		type: "Ground",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Clever",
	},
};