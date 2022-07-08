export const Abilities: {[k: string]: ModdedAbilityData} = {

	//canon abilities



	static: {
		onStart(pokemon) {
			this.effectData.active = false;
		},
		onTryHit(this, source, target, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					this.effectData.active = true;
					target.setStatus('');
				}
				
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.effectData.active === true) {
					source.trySetStatus('par', target);
					this.effectData.active = false;
					return;
				}
			}
		},
		name: "Static",
		rating: 2,
		num: 9,
	},
	
	effectspore: {
		onStart(pokemon) {
			this.effectData.active = false;
		},
		onTryHit(this, source, target, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					this.effectData.active = true;
					target.setStatus('');
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact'] && !source.status && source.runStatusImmunity('powder') && this.effectData.active === true) {
				const r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
					this.effectData.active = false;
					return;
				} else if (r < 21) {
					source.setStatus('par', target);
					this.effectData.active = false;
					return;
				} else if (r < 30) {
					source.setStatus('psn', target);
					this.effectData.active = false;
					return;
				}
			}
		},
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},

	flamebody: {
		onStart(pokemon) {
			this.effectData.active = false;
		},
		onTryHit(this, source, target, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					this.effectData.active = true;
					target.setStatus('');
				}
				
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.effectData.active === true) {
					source.trySetStatus('brn', target);
					this.effectData.active = false;
					return;
				}
			}
		},
		name: "Flame Body",
		rating: 2,
		num: 49,
	},

	poisonpoint: {
		onStart(pokemon) {
			this.effectData.active = false;
		},
		onTryHit(this, source, target, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					this.effectData.active = true;
					target.setStatus('');
				}
				
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.effectData.active === true) {
					source.trySetStatus('psn', target);
					this.effectData.active = false;
					return;
				}
			}
		},
		name: "Poison Point",
		rating: 1.5,
		num: 38,
	},

	//just gonna leave this as is bc who the fuck cares about synchronoize
	//(i am so tired please forgive me)
	synchronize: {
		inherit: true,
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			this.add('-activate', target, 'ability: Synchronize');
			this.add('-curestatus', source, {status: status.id, id: 'synchronize'} as Effect, '[Silent]');
			target.setStatus('');
			// Hack to make status-prevention abilities think Synchronize is a status move
			// and show messages when activating against it.
			source.trySetStatus(status, target, {status: status.id, id: 'synchronize'} as Effect);
		},
	},
};