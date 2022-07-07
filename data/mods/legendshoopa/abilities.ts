export const Abilities: {[k: string]: ModdedAbilityData} = {

	//canon abilities



	static: {
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				if (this.randomChance(3, 10)) {
					target.setStatus('');
					source.trySetStatus('par', target);
				}
			}
		},
		name: "Static",
		rating: 2,
		num: 9,
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