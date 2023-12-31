const {sqrt, PI} = Math;
const notFinite = n => !Number.isFinite(n);

function getExactLength(phi0, phi1, h) {
	let length;
	length = (phi1 / 2) * sqrt((phi1 * phi1) + 1);
	length += (1 / 2) * Math.log(phi1 + sqrt((phi1 * phi1) + 1));
	length -= (phi0 / 2) * sqrt((phi0 * phi0) + 1);
	length -= (1 / 2) * Math.log(phi0 + sqrt((phi0 * phi0) + 1));
	length *= h / (2 * PI);
	return length;
}

function getExactDeltaLengthDeltaPhi(phi, h) {
	let delta;
	const phi2 = phi * phi;
	delta = ((2 * phi2) + 1) / (2 * sqrt(phi2 + 1));
	delta += (phi + sqrt(phi2 + 1)) / ((2 * phi * sqrt(phi2 + 1)) + (2 * phi2) + 2);
	delta *= h / (2 * PI);
	return delta;
}

export function rollLength(h, d0, d1) {
	if (notFinite(h)
		|| notFinite(d0)
		|| notFinite(d1)
		|| h <= 0
		|| d0 <= 0
		|| d1 <= 0
		|| h > d0
		|| d0 >= d1
	) {
		return;
	}

	const phi0 = PI * d0 / h;
	const phi1 = PI * d1 / h;
	return getExactLength(phi0, phi1, h);
}

export function rollOuterDiameter(h, d0, l, maxIter = 10) {
	if (notFinite(h)
		|| notFinite(d0)
		|| notFinite(l)
		|| h <= 0
		|| d0 <= 0
		|| h > d0
		|| l < PI * d0
	) {
		return;
	}

	/* To find "phi1" from L(phi1)=(h/2pi)(...) we have to numerically solve
	* (h/2pi)(...)-L=0, so we have f(phi1)=(h/2pi)(...)-L=0
	* The approximate formula is used to find a starting point, from which we
	* use Newton's method to find a more accurate numerical solution as follows:
	*
	* phi_n+1 = phi_n - (f(phi_n)/f'(phi_n))
	*
	* Whith this method, there is no need to invert the function, it's only
	* necessary to find it's derivative. It converges quite quickly and only a
	* few iterations are required for the precision of the floating point
	* variable used.
	*/
	const n = (h - d0 + sqrt((((d0 - h) * (d0 - h)) + (4 * h * l)) / PI)) / (2 * h);
	let d1 = (2 * n * h) + d0;
	const phi0 = PI * d0 / h;
	let phi1 = PI * d1 / h;
	let deltaPhi;
	// This is the starting approximation.
	for (let i = 0; i <= maxIter; i++) {
		deltaPhi = (getExactLength(phi0, phi1, h) - l) / getExactDeltaLengthDeltaPhi(phi1, h);
		phi1 -= deltaPhi;
		// Stop looping if solution already found.
		if (deltaPhi === 0) {
			break;
		}
	}

	// Now we have phi1 and we find d1.
	d1 = phi1 * h / PI;
	// Note we could find a more accurate n if needed with:
	// n = (d1 - d0) / (2 * h);
	return d1;
}

export function rollInnerDiameter(h, d1, l) {
	if (notFinite(h)
		|| notFinite(d1)
		|| notFinite(l)
		|| h <= 0
		|| d1 <= h
		|| l < PI * d1
	) {
		return;
	}

	const minOuterDia = rollOuterDiameter(h, h, l);
	const length = rollLength(h, minOuterDia, d1);
	return rollOuterDiameter(h, h, length);
}

export function rollMaterialHeight(d0, d1, l) {
	if (notFinite(d0)
		|| notFinite(d1)
		|| notFinite(l)
		|| d0 <= 0
		|| d1 <= d0
		|| l < PI * d1
	) {
		return;
	}

	return (PI / (4 * l)) * ((d1 ** 2) - (d0 ** 2));
}

export function rollSolve(h, d0, d1, l) {
	if (h && d0 && d1 && l) {
		// Nothing to solve.
		return;
	}

	if (h && d0 && d1 && !l) {
		return rollLength(h, d0, d1);
	}

	if (h && d0 && l && !d1) {
		return rollOuterDiameter(h, d0, l);
	}

	if (h && d1 && l && !d0) {
		return rollInnerDiameter(h, d1, l);
	}

	if (d0 && d1 && l && !h) {
		return rollMaterialHeight(d0, d1, l);
	}
}
