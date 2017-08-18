var BigNumber = require('bignumber.js');
var simpleStatistics = require('simple-statistics');

module.exports = {
	calcResult
};

function calcResult(test, confidence) {
	validateInput(test, confidence);
	confidence = confidence || 0.95;

	var A_visits = new BigNumber(test.controlVisits);
	var A_conversions = new BigNumber(test.controlConversions);
	var B_visits = new BigNumber(test.challengerVisits);
	var B_conversions = new BigNumber(test.challengerConversions);

	var A_rate = calcConversionRate(A_visits, A_conversions);
	var B_rate = calcConversionRate(B_visits, B_conversions);
	var B_improvement = B_rate.sub(A_rate).div(A_rate);

	var A_stdErr = calcStandardError(A_visits, A_conversions);
	var B_stdErr = calcStandardError(B_visits, B_conversions);

	var zScore = calcZScore(A_rate, B_rate, A_stdErr, B_stdErr);
	var pValue = calcPValue(A_rate, B_rate, zScore);
	var isSignificant = determineSignificance(zScore, pValue, confidence);

	return {
		controlConversionRate: A_rate.toNumber(),
		challengerConversionRate: B_rate.toNumber(),
		challengerImprovement: B_improvement.toNumber(),
		isSignificant: isSignificant,
		statistics: {
			controlStandardError: A_stdErr.toNumber(),
			challengerStandardError: B_stdErr.toNumber(),
			zScore: zScore.toNumber(),
			pValue: pValue
		}
	};
}

function calcConversionRate(visits, conversions) {
	return conversions.div(visits);
}

function calcStandardError(visits, conversions) {
	var rate = calcConversionRate(visits, conversions);
	var dividend = rate.mul( new BigNumber(1).sub(rate) );
	return dividend.div(visits).sqrt();
}

function calcZScore(A_rate, B_rate, A_stdErr, B_stdErr) {
	if (A_rate < 0 || B_rate < 0) {
		return new BigNumber(0);
	}
	var rateDiff = B_rate.sub(A_rate);
	var stdErrOfDiff = A_stdErr.pow(2).add(B_stdErr.pow(2)).sqrt();
	return (rateDiff).div(stdErrOfDiff);
}

function calcPValue(A_rate, B_rate, zScore) {
	var zScoreAbs = zScore.abs().toNumber();
	var csnp = simpleStatistics.cumulativeStdNormalProbability(zScoreAbs);
	if (A_rate > B_rate) {
		return csnp;
	}
	return 1 - csnp;
}

function determineSignificance(zScore, pValue, confidence) {
	if (zScore.gte(new BigNumber(0))) {
		return pValue < 1 - confidence;
	}
	return pValue < confidence;
}

function validateInput(test, confidence) {
	validatePropertyDefined(test, 'controlVisits');
	validatePropertyDefined(test, 'controlConversions');
	validatePropertyDefined(test, 'challengerVisits');
	validatePropertyDefined(test, 'challengerConversions');
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

function validatePropertyDefined(test, propName) {
	if (!test[propName]) {
		throw new Error(propName + ' must be defined in test');
	}
}
