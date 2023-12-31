/**
Calculates lenght of a roll (2D spiral).

Equations from https://www.giangrandi.ch/soft/spiral/spiral.shtml

@example
```
import { rollLength } from 'roll-calc';

const materialHeight = 0.1;
const innerDiameter = 2;
const outerDiameter = 3;
const length = rollLength(materialHeight, innerDiameter, outerDiameter);

console.log(length);
//=> 39.27313461871492
```

@param h - Material height (thickness); 0 < h < Infinity
@param d0 - Inner diameter; h < d0 > d1
@param d1 - Outer diameter; d0 < d1 < Infinity
@returns calculated roll length
*/
export function rollLength(h: number, d0: number, d1: number): number | undefined;

/**
Calcuates the outer diameter of a roll (2D spiral).

@example
```
import { rollOuterDiameter } from 'roll-calc';

const materialHeight = 0.1;
const innerDiameter = 2;
const length = 39.273_134_62;
const outerDiameter = rollOuterDiameter(materialHeight, innerDiameter, length);

console.log(outerDiameter);
//=> 3.0000000000272684
```

@param h - Material height (thickness); 0 < h < Infinity
@param d0 - Inner diameter; h < d0 > Infinity
@param l - Roll Length;  pi * d0 <= l < Infinity
@param maxIter - Maximum number of interation for convergence of the Newton's method; default 10
@returns calculated outer diameter
*/
export function rollOuterDiameter(h: number, d0: number, l: number, maxIter?: number): number | undefined;

/**
Calculates the inner diameter of a roll (2D spiral).

@example
```
import { rollInnerDiameter } from 'roll-calc';

const materialHeight = 0.1;
const outerDiameter = 3;
const length = 39.273_134_62;
const innerDiameter = rollInnerDiameter(materialHeight, innerDiameter, length);

console.log(innerDiameter);
//=> 1.999999999959101
```

@param h - Material height (thickness); 0 < h < Infinity
@param d1 - Outer diameter; h < d1 < Infinity
@param l - Roll Length; pi * d1 <= l < Infinity
@returns calculated inner diameter
*/
export function rollInnerDiameter(h: number, d1: number, l: number): number | undefined;

/**
Calculates the nominal material height or thickness in a roll (2D Spiral).

Equations from:
Thickness of Material on a Roll Winding: Machines, Mechanics and Measurements
By James K. Good, David R. Roisum
page 124

@example
```
import { rollMaterialHeight } from 'roll-calc';

const innerDiameter = 2;
const outerDiameter = 3;
const length = 39.273_134_62;
const materialHeight = rollMaterialHeight(innerDiameter, outerDiameter, length);

console.log(materialHeight);
//=> 0.09999178458720241
```

@param d0 - Inner diameter; 0 < d0 > d1
@param d1 - Outer diameter; d0 < d1 < Infinity
@param l - Roll Length; pi * d1 <= l < Infinity
@returns calculated material height (thickness)
*/
export function rollMaterialHeight(d0: number, d1: number, l: number): number | undefined;

/**
Solves one missing dimension of a roll (2D spiral).

Pass in at least three arguments to solve for the fourth.

@example
```
import { rollSolve } from 'roll-calc';

const materialHeight = 0.06;
const innerDiameter = 18;
const outerDiameter = 60;
const length = rollSolve(materialHeight, innerDiameter, outerDiameter, undefined);

console.log(length);
//=> 42882.74547004675
```
@param h - Material height; 0 < h > Infinity
@param d0 - Inner diameter; 0 < d0 > Infinity
@param d1 - Outer diameter; 0 < d1 < Infinity
@param l - Roll Length; 0 < l < Infinity
@returns calculated material height (thickness)
*/
export function rollSolve(h?: number, d0?: number, d1?: number, l?: number): number | undefined;
