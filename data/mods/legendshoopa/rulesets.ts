export const Formats: {[k: string]: FormatData} = {
	legendsboostsmod: {
		effectType: 'Rule',
		name: 'Legends Boosts Mod',
		desc: "Applies Legends: Arceus' stat boost mechanics; ",
		//banlist: [],
		onBegin() {
			this.add('rule', "Legends Boost Mod: Stat changes imitate Legends: Arceus's !");
		},
		onAfterBoost(boost) {
			let activated = false;
			let boostName: BoostName;
			const LegendsBoost : SparseBoostsTable = {};
			if(activated === false && this.effectData.legendsBoosted === true) {
				if (boost.spa) {
					LegendsBoost.atk = 1 * boost.spa;
					activated = true;
				}
				if (boost.spd) {
					LegendsBoost.def = 1 * boost.spd;
					activated = true;
				}
				if (boost.atk) {
					LegendsBoost.spa = 1 * boost.atk;
					activated = true;
				}
				if (boost.def) {
					LegendsBoost.spd = 1 * boost.def;
					activated = true;
				}
				this.effectData.legendsBoosted = false;
			} 
			if (activated === true) {
				this.effectData.legendsBoosted = true;
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