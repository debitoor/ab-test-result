const BigNumber = require('bignumber.js');
const simpleStatistics = require('simple-statistics');

module.exports = {
	calcResult
};

function calcResult(test, confidence) {
	validateInput(test, confidence);
	confidence = confidence || 0.95;

	const A_visits = new BigNumber(test.controlVisits);
	const A_conversions = new BigNumber(test.controlConversions);
	const B_visits = new BigNumber(test.challengerVisits);
	const B_conversions = new BigNumber(test.challengerConversions);

	const A_rate = calcConversionRate(A_visits, A_conversions);
	const B_rate = calcConversionRate(B_visits, B_conversions);
	const B_improvement = B_rate.sub(A_rate).div(A_rate);

	const A_stdErr = calcStandardError(A_visits, A_conversions);
	const B_stdErr = calcStandardError(B_visits, B_conversions);

	const zScore = calcZScore(A_rate, B_rate, A_stdErr, B_stdErr);
	const pValue = calcPValue(A_rate, B_rate, zScore);
	const isSignificant = determineSignificance(zScore, pValue, confidence);

	return {
		controlConversionRate: A_rate.toNumber(),
		challengerConversionRate: B_rate.toNumber(),
		challengerImprovement: B_improvement.toNumber(),
		isSignificant,
		statistics: {
			controlStandardError: A_stdErr.toNumber(),
			challengerStandardError: B_stdErr.toNumber(),
			zScore: zScore.toNumber(),
			pValue
		}
	};
}

function calcConversionRate(visits, conversions) {
	return conversions.div(visits);
}

function calcStandardError(visits, conversions) {
	const rate = calcConversionRate(visits, conversions);
	const dividend = rate.mul( new BigNumber(1).sub(rate) );
	return dividend.div(visits).sqrt();
}

function calcZScore(A_rate, B_rate, A_stdErr, B_stdErr) {
	const rateDiff = B_rate.sub(A_rate);
	const stdErrOfDiff = A_stdErr.pow(2).add(B_stdErr.pow(2)).sqrt();
	return (rateDiff).div(stdErrOfDiff);
}

function calcPValue(A_rate, B_rate, zScore) {
	const zScoreAbs = zScore.abs().toNumber();
	const csnp = simpleStatistics.cumulativeStdNormalProbability(zScoreAbs);
	if (A_rate.gt(B_rate)) {
		return csnp;
	}
	return 1 - csnp;
}

function determineSignificance(zScore, pValue, confidence) {
	if (zScore.gte(new BigNumber(0))) {
		return pValue < 1 - confidence;
	}
	//else use two-sided hypothesis
	return pValue > confidence + ( (1 - confidence) / 2 );
}

function validateInput(test, confidence) {
	validateInputNumber(test, 'controlVisits');
	validateInputNumber(test, 'controlConversions');
	validateInputNumber(test, 'challengerVisits');
	validateInputNumber(test, 'challengerConversions');
	if (test.controlVisits < test.controlConversions) {
		throw new Error('controlVisits must be greater than or equal to controlConversions');
	}
	if (test.challengerVisits < test.challengerConversions) {
		throw new Error('challengerVisits must be greater than or equal to challengerConversions');
	}
	if (confidence && (confidence < 0 || confidence > 1 )) {
		throw new Error('confidence must be a number between 0 and 1');
	}
}

function validateInputNumber(test, propName) {
	if (!Number.isInteger(test[propName])) {
		throw new TypeError(propName + ' must be a number');
	}
	if (test[propName] < 0) {
		throw new Error(propName + ' cannot be negative');
	}
}
