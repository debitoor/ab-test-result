const abTestResult = require('..');

describe('calculations', () => {

	describe('when no min confidense is provided', () => {

		describe('when confidense is greater than 95%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 490,
					controlConversions: 10,
					challengerVisits: 500,
					challengerConversions: 19
				});
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.02040816326530612,
					challengerConversionRate: 0.038,
					challengerImprovement: 0.862,
					isSignificant: true,
					statistics: {
						controlStandardError: 0.006387435072946544,
						challengerStandardError: 0.00855055553750749,
						zScore: 1.6482676333612458,
						pValue: 0.04949999999999999
					}
				});
			});
		});

		describe('when confidense is lower than 95%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 490,
					controlConversions: 10,
					challengerVisits: 500,
					challengerConversions: 18
				});
			});

			it('should return isSignificant false', () => {
				expect(result).to.eql({
					controlConversionRate: 0.02040816326530612,
					challengerConversionRate: 0.036,
					challengerImprovement: 0.764,
					isSignificant: false,
					statistics: {
						controlStandardError: 0.006387435072946544,
						challengerStandardError: 0.008331146379700696,
						zScore: 1.485224293965855,
						pValue: 0.06810000000000005
					}
				});
			});
		});
	});

	describe('when min confidense provided is 0.9', () => {

		describe('when confidense is greater than 90%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 490,
					controlConversions: 10,
					challengerVisits: 500,
					challengerConversions: 17
				}, 0.9);
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.02040816326530612,
					challengerConversionRate: 0.034,
					challengerImprovement: 0.666,
					isSignificant: true,
					statistics: {
						controlStandardError: 0.006387435072946544,
						challengerStandardError: 0.008104813384649889,
						zScore: 1.317131652811523,
						pValue: 0.09340000000000004
					}
				});
			});
		});

		describe('when confidense is lower than 90%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 490,
					controlConversions: 10,
					challengerVisits: 500,
					challengerConversions: 16
				}, 0.9);
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.02040816326530612,
					challengerConversionRate: 0.032,
					challengerImprovement: 0.568,
					isSignificant: false,
					statistics: {
						controlStandardError: 0.006387435072946544,
						challengerStandardError: 0.00787095928079926,
						zScore: 1.1435588951760849,
						pValue: 0.1271
					}
				});
			});
		});
	});

	describe('when challenger performs worse than control', () => {

		describe('when confidense is greater than 95%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 800,
					controlConversions: 75,
					challengerVisits: 800,
					challengerConversions: 55
				});
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.09375,
					challengerConversionRate: 0.06875,
					challengerImprovement: -0.26666666666666666,
					isSignificant: false,
					statistics: {
						controlStandardError: 0.010305395279900717,
						challengerStandardError: 0.008945909505187272,
						zScore: -1.8319543207885096,
						pValue: 0.9664
					}
				});
			});
		});

		describe('when confidense is smaller than 95%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 800,
					controlConversions: 75,
					challengerVisits: 800,
					challengerConversions: 74
				});
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.09375,
					challengerConversionRate: 0.0925,
					challengerImprovement: -0.013333333333333334,
					isSignificant: true,
					statistics: {
						controlStandardError: 0.010305395279900717,
						challengerStandardError: 0.010243519292704046,
						zScore: -0.08602687662893549,
						pValue: 0.5359
					}
				});
			});
		});

	});

});
