const abTestResult = require('..');

describe('calculations', () => {

	describe('when challenger performs better than or equal to control', () => {
		describe('when no min confidense is provided', () => {

			describe('when p-value is greater than 95%', () => {
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

			describe('when p-value is lower than 95%', () => {
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

			describe('when p-value is greater than 90%', () => {
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

			describe('when p-value is lower than 90%', () => {
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
	});

	describe('when challenger performs worse than control', () => {

		describe('when p-value is smaller than 95%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 4299,
					controlConversions: 37,
					challengerVisits: 3867,
					challengerConversions: 33
				});
			});

			it('should return isSignificant false', () => {
				expect(result).to.eql({
					controlConversionRate: 0.008606652709932543,
					challengerConversionRate: 0.008533747090768037,
					challengerImprovement: -0.008470844778059672,
					isSignificant: false,
					statistics: {
						controlStandardError: 0.0014088229476923067,
						challengerStandardError: 0.0014791825204212088,
						zScore: -0.03569021316385061,
						pValue: 0.516
					}
				});
			});
		});

		describe('when p-value is greater than 95% but smaller than 97.5%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 800,
					controlConversions: 75,
					challengerVisits: 800,
					challengerConversions: 55
				});
			});

			it('should return isSignificant false', () => {
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

		describe('when p-value is greater than 97.5%', () => {
			var result;

			before(() => {
				result = abTestResult.calcResult({
					controlVisits: 800,
					controlConversions: 75,
					challengerVisits: 800,
					challengerConversions: 44
				});
			});

			it('should return isSignificant true', () => {
				expect(result).to.eql({
					controlConversionRate: 0.09375,
					challengerConversionRate: 0.055,
					challengerImprovement: -0.41333333333333333,
					isSignificant: true,
					statistics: {
						controlStandardError: 0.010305395279900717,
						challengerStandardError: 0.008060319472576754,
						zScore: -2.961815357071009,
						pValue: 0.9984
					}
				});
			});
		});
	});

});
