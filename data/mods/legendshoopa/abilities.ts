export const Abilities: {[k: string]: ModdedAbilityData} = {

	//canon abilities




	synchronize: {
		inherit: true,
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			this.add('-activate', target, 'ability: Synchronize');
			this.add('-curestatus', target, {status: status.id, id: 'synchronize'} as Effect, '[Silent]');
			target.setStatus('');
			// Hack to make status-prevention abilities think Synchronize is a status move
			// and show messages when activating against it.
			source.trySetStatus(status, target, {status: status.id, id: 'synchronize'} as Effect);
		},
	},
};