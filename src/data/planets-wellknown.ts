// curated-known-planets.ts
//
// A small, hand-picked list of "famous" real exoplanets, meant to sit
// alongside (or override entries in) your bulk-generated realPlanets list.
// Unlike the bulk generator, every field here is labeled:
//   REAL     — an actual published measurement or well-established fact
//   derived  — procedurally chosen, same conventions as generate-planets.ts,
//              because no real data exists for that trait
//   flagged  — a real *hypothesis* under active scientific debate; treat
//              the value as illustrative of the hypothesis, not settled fact
//
// Ages given in Myr (matching your `age` field convention: Gyr * 1000).
// Several host-star ages are genuinely uncertain in the literature (noted
// per-entry) — treat those numbers as reasonable estimates, not precise facts.

import type { Planet } from "../planet";

export const curatedKnownPlanets: Planet[] = [
    {
        // HD 189733 b — the only exoplanet with a REAL measured color to date.
        // Hubble/STIS albedo measurements (Evans et al. 2013) found high blue
        // reflectivity and low reflectivity at longer wavelengths, implying a
        // deep cobalt/azure blue — caused by high, hazy silicate clouds
        // scattering blue light, not by an ocean. Confirmed a robust hot-Jupiter
        // "iron/silicate cloud" case. Winds up to ~8,700 km/h have been detected
        // via Doppler measurements (Louden & Wheatley 2015).
        name: "HD 189733 b",
        age: 600, // uncertain: activity-based estimates suggest a relatively young, active star (order of hundreds of Myr); other methods suggest several Gyr. Genuinely disputed in the literature.
        size: 1, // REAL: radius ~1.14 Jupiter radii (inflated hot Jupiter), capped at our max
        terrain: 0.8, // derived, but informed by REAL extreme wind speeds/turbulence
        type: "gas",
        colour: "#1c3f8f", // REAL-informed: approximate hex for the measured "deep cobalt blue"
        water: 0,
        moons: 0, // REAL: no exomoons confirmed
        craters: 0,
    },
    {
        // 51 Pegasi b (Dimidium) — the first exoplanet discovered orbiting a
        // Sun-like star (Mayor & Queloz, 1995), a discovery that won the 2019
        // Nobel Prize in Physics. Non-transiting, so radius is not directly
        // measured; the value below assumes a typical hot-Jupiter radius.
        name: "51 Pegasi b",
        age: 7000, // commonly cited estimate for the host star, ~6-8 Gyr; precise age uncertain
        size: 0.9, // derived: no real radius measurement (non-transiting); assumed typical hot-Jupiter size
        terrain: 0.7, // derived
        type: "gas",
        colour: "#3d4660", // derived: no real colour measurement exists for this planet
        water: 0,
        moons: 0,
        craters: 0,
    },
    {
        // Proxima Centauri b — closest known exoplanet to Earth (4.2 ly),
        // orbiting the Sun's nearest stellar neighbor. Minimum mass and orbit
        // are REAL (radial velocity); radius, atmosphere, and surface are all
        // unknown, since it's non-transiting. Its host star's frequent violent
        // flares are a real, major open question for whether it could retain
        // any atmosphere at all — the water value below is speculative.
        name: "Proxima Centauri b",
        age: 4850, // REAL-ish: Proxima Centauri estimated ~4.8 Gyr, similar to the Sun
        size: 0.09, // derived: no direct radius measurement; assumes Earth-like density from minimum mass (~1.07 M⊕)
        terrain: 0.75, // derived: assumes a barren, heavily irradiated surface (speculative)
        type: "terrestrial",
        colour: "#8a7d6e", // derived: neutral rocky tone — no atmosphere or surface has actually been observed
        water: 0.05, // flagged: highly speculative; the planet may well be airless given the host star's flare activity
        moons: 0,
        craters: 0.6, // derived
    },
    {
        // TRAPPIST-1 e — one of seven Earth-sized planets in the TRAPPIST-1
        // system, sitting in the star's temperate zone. Radius is REAL
        // (well-measured via transit). JWST has already found TRAPPIST-1 b and
        // c to be airless, bare rock (Greene et al. 2023) — e has not yet been
        // ruled out either way and remains one of the best atmosphere-search
        // targets of any known rocky exoplanet.
        name: "TRAPPIST-1 e",
        age: 7600, // REAL: system age estimated 7.6 ± 2.2 Gyr (Burgasser & Mamajek 2017)
        size: 0.082, // REAL: radius ~0.92 Earth radii, transit-measured
        terrain: 0.5, // derived
        type: "terrestrial",
        colour: "#5b7a5f", // derived: aspirational Earth-like tone — no real colour/atmosphere data yet
        water: 0.4, // flagged: unconfirmed; reflects "best current candidate for habitability," not a detection
        moons: 0,
        craters: 0.3, // derived
    },
    {
        // Kepler-452b — dubbed "Earth's cousin" at discovery: orbits a
        // Sun-like G-type star in its habitable zone. Radius is REAL, but at
        // 1.6 Earth radii it sits right at the boundary where planets could be
        // rocky super-Earths OR gas/ice-rich mini-Neptunes — composition is
        // genuinely unconfirmed.
        name: "Kepler-452b",
        age: 6000, // REAL: host star estimated ~6 Gyr, older than the Sun
        size: 0.143, // REAL: radius ~1.6 Earth radii, transit-measured
        terrain: 0.55, // derived
        type: "terrestrial", // ambiguous in reality: could be rocky or a small Neptune-like world; classified here per our <1.75 R⊕ cutoff
        colour: "#6b8e4e", // derived: aspirational Earth-like tone, not a measurement
        water: 0.35, // flagged: unconfirmed, reflects habitable-zone status only
        moons: 0,
        craters: 0.2, // derived
    },
    {
        // 55 Cancri e — a tidally-locked lava-world super-Earth, permanent
        // dayside temperatures over 2,000°C. Radius/mass are REAL. Its
        // atmosphere is an active, unsettled research area: JWST data from
        // 2024-2026 favor a hydrogen-rich atmosphere outgassed from an
        // underlying magma ocean, but as of mid-2026 this is based on a
        // preprint, not a peer-reviewed consensus — treat as a live hypothesis.
        name: "55 Cancri e",
        age: 8000, // uncertain: host star age estimates range roughly 8-10 Gyr depending on method
        size: 0.168, // REAL: radius ~1.88 Earth radii, well-measured via transit
        terrain: 0.9, // derived, informed by REAL extreme dayside temperatures and molten surface
        type: "terrestrial",
        colour: "#4a1508", // derived: illustrative molten/scorched tone, not a measured colour
        water: 0, // REAL-informed: surface temperatures far too high for liquid water
        moons: 0,
        craters: 0, // REAL-informed: an actively molten surface would erase any impact craters
    },
    {
        // WASP-76 b — an ultra-hot Jupiter famous for real "iron rain": iron
        // vapor detected on the scorching dayside condenses and precipitates
        // out on the cooler night side (Ehrenreich et al. 2020, ESPRESSO).
        name: "WASP-76 b",
        age: 4000, // uncertain: host star age is poorly constrained in the literature
        size: 1, // REAL: radius ~1.83 Jupiter radii (inflated), capped at our max
        terrain: 0.85, // derived, informed by REAL extreme day-night chemical gradient
        type: "gas",
        colour: "#4a4d55", // derived: metallic grey-blue nod to the iron-vapor atmosphere, not a measured colour
        water: 0,
        moons: 0,
        craters: 0,
    },
    {
        // TrES-2 b (also Kepler-1b) — the darkest known exoplanet, with a
        // geometric albedo of only ~0.014-0.04% (Kipping & Spiegel, 2011),
        // reflecting less light than coal. Still holds this title as of early
        // 2026. It emits a faint red glow from its own heat rather than
        // reflecting starlight.
        name: "TrES-2 b",
        age: 5000, // uncertain: loosely estimated, roughly solar-age
        size: 1, // REAL: radius ~1.2 Jupiter radii, capped at our max
        terrain: 0.15, // REAL-informed: notably featureless — lacks the reflective cloud bands typical of gas giants
        type: "gas",
        colour: "#170c0c", // REAL: near-black with a faint red tinge, matching its measured near-zero albedo and thermal glow
        water: 0,
        moons: 0,
        craters: 0,
    },
    {
        // GJ 1214 b — archetypal "water world" candidate: a warm mini-Neptune
        // with a thick, hazy atmosphere. Radius is REAL. Whether it's actually
        // water-rich or just a hydrogen/haze-dominated world with no real
        // "surface" at all is still genuinely debated post-JWST (2023-24) —
        // the water value below represents the popular hypothesis, not a
        // confirmed result.
        name: "GJ 1214 b",
        age: 6000, // very uncertain: M-dwarf host stars are notoriously hard to age precisely
        size: 0.24, // REAL: radius ~2.7 Earth radii, well-measured via transit
        terrain: 0.4, // derived
        type: "ice", // sub-Neptune, falls in our 1.75-6 R⊕ bucket
        colour: "#a9c7d6", // derived: hazy pale tone nodding to its thick, obscuring atmosphere
        water: 0.5, // flagged: the most speculative value in this list — "water world" is one hypothesis among several
        moons: 0,
        craters: 0,
    },
    {
        // Kepler-16b — a real circumbinary planet: it orbits TWO stars, making
        // it astronomy's closest real analogue to Star Wars' Tatooine. Radius
        // and orbit are REAL (transit + eclipsing binary timing).
        name: "Kepler-16 b",
        age: 3500, // uncertain: system age not tightly constrained
        size: 0.75, // REAL: radius ~0.75 Jupiter radii (Saturn-like)
        terrain: 0.5, // derived
        type: "gas",
        colour: "#c9a876", // derived: Saturn-like muted tan, no real colour measurement exists
        water: 0,
        moons: 0,
        craters: 0,
    },
];