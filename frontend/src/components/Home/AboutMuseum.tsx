import React from 'react';

// Static "O muzeju" copy. Describes what the archive holds.
const AboutMuseum: React.FC = () => (
	<section className="bg-court text-white">
		<div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
			<p className="font-mono text-xs uppercase tracking-[0.3em] text-record">O muzeju</p>
			<h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Čuvamo priču zadarske košarke</h2>
			<p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
				Muzej zadarske košarke digitalni je arhiv posvećen povijesti KK Zadar — jednog od najtrofejnijih i
				najvoljenijih klubova hrvatske košarke. Na jednom mjestu prikupljamo i čuvamo podatke o igračima,
				trenerima, timovima, utakmicama, sucima, natjecanjima i dvoranama kroz desetljeća.
			</p>
			<p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
				Svaki profil, rezultat i statistika dio su šire slike — nasljeđa koje želimo sačuvati i učiniti dostupnim
				svima koji vole zadarsku košarku.
			</p>
		</div>
	</section>
);

export default AboutMuseum;
