export const Formats: {[k: string]: FormatData} = {
	legendsboostsmod: {
		effectType: 'Rule',
		name: 'Legends Boosts Mod',
		desc: "Applies Legends: Arceus' stat boost mechanics; ",
		//banlist: [],
		onBegin() {
			this.add('rule', "Legends Boost Mod: Stat changes imitate Legends: Arceus's !");
		},
		onBoost(this, boost, target, source, effect) {
			let i: BoostName;
			for (i in boost) {
				let LegendsBoost : SparseBoostsTable = {};
				this.add('-message', `i (BoostName) is ${i}`);
				if(boost[i]! === 1 || boost[i]! === 3) { //idk lol
					//let altBoost: boost | undefined = stats.length ? this.sample(stats) : undefined;
					//let altBoost : SparseBoostsTable = {};
					const altBoost = boost === 'atk' ? 'atk' : 'spa';
					if (altBoost) LegendsBoost[altBoost] = 2;
				}
				this.boost(LegendsBoost);
				return;
			}
		},
		/*
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusData.source || pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause Mod activated.');
							return false;
						}
					}
				}
			}
		},
		*/
	},
};