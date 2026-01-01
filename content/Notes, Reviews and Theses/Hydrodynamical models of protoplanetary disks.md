---
tags:
  - physics
  - hydrodynamics
  - modeling
  - numerical-methods
---
>[!Note]
>*This page will act as a living document to gather my learnings on the spiral arms project. It will be remain as it is after the completion of the project but learnings from it may be repurposed into new entries elsewhere in the knowledge base.*

# Understanding generic hydrodynamical setups of disk-planet systems in Athena++

The biggest problem I have had is to develop a better understanding of frames of reference in which the equations are needed to be implemented in the code, say for example, in the `MeshBlock::ProblemGenerator`. The basic structure of a file looks like as follows

```cpp
// Define initial conditions
void MeshBlock::ProblemGenerator(ParameterInput *pin) {
	// The idea now is to set the initial conditions at each grid-point
	// in the simulation domain. Initial conditions refer to the initial
	// density and momentum of the constituent fluids that make up the disk
	// In case of disk-planet interactions, the "planet" itself is not part of
	// initial conditions (even if it is assumed to start exerting its
	// gravitational influence at t=0), but rather in a separate source
	// function.
	
	// Assume the program has been configured for spherical coordinates.
	for (int k = ks; k <= ke; ++k) {
		// Notice the order of loops, the first index is `x3`, or in the case
		// of spherical coordinates, φ.
		Real x3 = pcoord->x3v(k); // φ
		// Also note the special variables offered by the `MeshBlock` class
		// in the form of `ks`, `ke`, `js`.. etc, providing the start and
		// end indices for us to loop over. Later when setting boundary conditions
		// we will see how handy they are when ghost cells also
		// get involved.
		for (int j = js; j <= je; ++j) {
			Real x2 = pcoord->x2v(j); // θ
			for (int i = is; i <= ie; ++i) {
				Real x3 = pcoord->x1v(i); // r
				
				// Now goes the logic to set the conditions. Again,
				// one must set the initial density and momentum at least.
				// Depending on the EOS, energy and pressure also need to be
				// set. One important thing to note is often in these problems
				// we assume locally isothermal or vertically isothermal EOS.
				// This needs to be set by the user explicitly as the 
				// `--eos=isothermal` configuration option while compiling the code
				// is only applicable to globally isothermal EOS. 
				
				// A simple way to understand this is through sound speed.
				// Globally isothermal implies `c_s` is constant everywhere.
				// Vertically isothermal implies `c_s` has some dependence in
				// radial direction.
			}
		}
	}
}

```

