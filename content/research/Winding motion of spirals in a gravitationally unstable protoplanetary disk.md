---
tags:
  - review
  - planet-disk-interactions
  - protoplanetary-disks
  - hydrodynamics
  - ALMA
  - observations
  - physics
  - disk-dynamics
authors:
  - T. C. Yoshida
  - H. Nomura
  - K. Doi
  - M. Barraza-Alfaro
  - R. Teague
  - K. Furuya
  - Y. Yamato
  - T. Tsukagoshi
volume: "9"
issue: pp. 1672–1679
published: September 2025
doi: 10.1038/s41550-025-02639-y
abstract: The discovery of wide-orbit giant exoplanets has posed a challenge to our conventional understanding of planet formation through the coagulation of dust grains and planetesimals and the subsequent accretion of protoplanetary disk gas. As an alternative mechanism, the direct in situ formation of planets or planetary cores by gravitational instability (GI) in protoplanetary disks has been proposed. However, observational evidence for GI in regions where wide-orbit planets form is still lacking. Theoretical studies predict that GI induces spiral arms moving at the local Keplerian speed in a disk. Based on several high-angular-resolution observations over a 7-year time baseline using the Atacama Large Millimeter/submillimeter Array, here we report the evidence for spiral arms following the Keplerian rotation in the dust continuum disk around the young star IM Lup. This demonstrates that GI can operate in wide-orbit planet-forming regions, establishing it as a plausible formation mechanism for such planets.
journal_logo: natastro.svg
---
The work presents evidence of [[Gravitational Instability|gravitational instability]] (GI) in the protoplanetary disk around [[IM Lup|IM Lup]] and posits it as a plausible formation mechanism of wide-orbit giant planets (planets at around 20 AU to 70 AU from their star) in situ.

The work is solely concerned with the *in situ* formation of giant planets and thus its scope must be considered limited to explaining how could some planets, that we see today from our telescopes, have formed at the locations where they are right now, without the involvement of [[Planetary Migration|migration]] or planet-planet/star [[Gravitational Scattering|scattering]]. 

When it comes to in situ [[Giant Planet Formation|formation of giant planets]] that far out, there are a few problems. The most accepted formation pathway for giant planets is through [[Core accretion|core accretion]]. We can estimate this as follows:

$$
t_{\text{grow}} \sim \dfrac{M}{\dot{M}}
$$

Safronov (1969) gives the expression of solid core growth $\dot{M}$:

$$
\dot{M} = \pi R_c^2 \sigma_p \Omega F_g
$$

where $R_c$ is the effective (or capture) radius, $\Omega$ is the angular frequency, $\sigma_p$ is the local surface density of [[Planetesimal Formation|planetesimals]], and $F_g$ is a constant factor accounting for gravitational enhancement[^1] due to Greenzweig & Lissauer (1992). One can assume the [[Minimum Mass Solar Nebula|minimum mass solar nebula scaling (MMSN)]] scaling for the surface density:

$$
\sigma_p \propto r^{-3/2} 
$$

Rice and Armitage (2003) provide reference values for a giant planet at the current location of Jupiter to estimate the growth time scale. A similar treatment can be found in Armitage (2020)[^2] which derives a very slow growth rate at the location of Jupiter. In any case, we can do some algebra and derive how does this rate vary with radius:

$$
\begin{split}
\dot{M} \propto \sigma_p \Omega R_c^2 F_g, \quad t_{\text{grow}} \propto \dfrac{M}{\sigma_p \Omega R_c^2}
\end{split}
$$

if we assume $F_g$ remains constant with radius. Now with mass radius relation under constant density ($M \propto r^3$), MMSN scaling ($\sigma_p \propto r^{-3/2}$) and [[Kepler's Laws|Kepler's law]]  ($\Omega \propto r^{-3/2}$), we can conclude 

$$
t_{\text{grow}} \propto r^3
$$

which implies the timescale of growth will be even larger at larger radii. Thus, it is not possible to form giant planets at wide orbits *in situ* through core accretion and we must look for alternate mechanisms. GI is one such proposition. This makes observational evidence of GI in disks very critical. 

One of most evident signatures of GI is [[Disk Substructures#Wakes and Spirals|spiral arms]], however because these substructures can also be produced through alternate pathways (planet-disk interactions, stellar fly-bys and even shadows cast by the inner disk), it is essential to categorically devise a way to distinguish between these possibilities. 



[^1]: todo: What is this?

[^2]: *Astrophysics of Planet Formation, Equation 5.32*
