import test from 'ava';
import {
	rollLength,
	rollOuterDiameter,
	rollInnerDiameter,
	rollMaterialHeight,
	rollSolve,
} from './index.js';

const round = (n, precision = 0) => Math.round(n * (10 ** precision)) / (10 ** precision);

const rolls = [
	{
		h: 0.1,
		d0: 2,
		d1: 3,
		l: 39.273_134_62,
	},
	{
		h: 0.06,
		d0: 18,
		d1: 60,
		l: 42_882.745_470_05,
	},
	{
		h: 0.008,
		d0: 4,
		d1: 48.5,
		l: 229_360.808_993_2,
	},
];

test('roll length', t => {
	for (const roll of rolls) {
		const length = rollLength(roll.h, roll.d0, roll.d1);
		t.is(round(length, 8), roll.l);
	}

	// Guard
	t.is(rollLength(0, 99, 99), undefined);
	t.is(rollLength(2, 1, 99), undefined);
	t.is(rollLength(1, 2, 1), undefined);
	t.is(rollLength(1, 2, 2), undefined);
});

test('roll outer diameter', t => {
	for (const roll of rolls) {
		const dia = rollOuterDiameter(roll.h, roll.d0, roll.l);
		t.is(round(dia, 8), roll.d1);
	}

	// Guard
	t.is(rollOuterDiameter(0, 1, 99), undefined);
	t.is(rollOuterDiameter(2, 1, 99), undefined);
	t.is(rollOuterDiameter(2, 2, 1), undefined);
	t.is(rollOuterDiameter(1, 2, (2 * Math.PI) - 0.001), undefined);
});

test('roll inner diameter', t => {
	for (const roll of rolls) {
		const dia = rollInnerDiameter(roll.h, roll.d1, roll.l);
		t.is(round(dia, 8), roll.d0);
	}

	// Guard
	t.is(rollInnerDiameter(0, 1, 99), undefined);
	t.is(rollInnerDiameter(2, 1, 5), undefined);
	t.is(rollInnerDiameter(2, 2, 1), undefined);
	t.is(rollInnerDiameter(2, 4, 99), undefined);
	t.is(rollInnerDiameter(1, 8, (8 * Math.PI) - 0.001), undefined);
});

test('roll material height', t => {
	for (const roll of rolls) {
		const h = rollMaterialHeight(roll.d0, roll.d1, roll.l);
		t.is(round(h, 4), roll.h);
	}

	// Guard
	t.is(rollMaterialHeight(2, 1, 99), undefined);
	t.is(rollMaterialHeight(1, 1, Math.PI), undefined);
	t.is(rollMaterialHeight(1, 2, (2 * Math.PI) - 0.001), undefined);
});

test('roll solve', t => {
	const [roll] = rolls;
	t.is(round(rollSolve(roll.h, roll.d0, roll.d1, undefined), 8), roll.l);
	t.is(round(rollSolve(roll.h, roll.d0, undefined, roll.l), 8), roll.d1);
	t.is(round(rollSolve(roll.h, undefined, roll.d1, roll.l), 8), roll.d0);
	t.is(round(rollSolve(undefined, roll.d0, roll.d1, roll.l), 4), roll.h);

	// Guard
	t.is(rollSolve(1, 2, 3, 4), undefined);
});
