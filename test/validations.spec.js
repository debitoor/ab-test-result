const abTestResult = require('..');

describe('input validation', () => {

	describe('required values', () => {
		describe('when controlVisits property is missing', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlConversions: 1,
						challengerVisits: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('controlVisits must be a number');
			});
		});

		describe('when controlConversions property is missing', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						challengerVisits: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('controlConversions must be a number');
			});
		});

		describe('when challengerVisits property is missing', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('challengerVisits must be a number');
			});
		});

		describe('when challengerConversions property is missing', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 1,
						challengerVisits: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('challengerConversions must be a number');
			});
		});

		describe('when controlConversions property is less than zero', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: -1,
						challengerVisits: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('controlConversions cannot be negative');
			});
		});

		describe('when challengerVisits property is less than zero', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 1,
						challengerVisits: -1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('challengerVisits cannot be negative');
			});
		});

		describe('when challengerConversions property is less than zero', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 1,
						challengerVisits: 1,
						challengerConversions: -1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('challengerConversions cannot be negative');
			});
		});

		describe('when controlVisits property is less than zero', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: -1,
						controlConversions: 1,
						challengerVisits: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('controlVisits cannot be negative');
			});
		});
	});

	describe('visits vs. conversions', () => {

		describe('when controlVisits is larger than controlConversions', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 2,
						challengerVisits: 1,
						challengerConversions: 1
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('controlVisits must be greater than or equal to controlConversions');
			});
		});

		describe('when challengerVisits is larger than challengerConversions', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult({
						controlVisits: 1,
						controlConversions: 1,
						challengerVisits: 1,
						challengerConversions: 2
					});
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('challengerVisits must be greater than or equal to challengerConversions');
			});
		});

	});

	describe('confidense interval', () => {
		const test = {
			controlVisits: 1,
			controlConversions: 1,
			challengerVisits: 1,
			challengerConversions: 1
		};

		describe('when confidense is less than zero', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult(test, -1);
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('confidence must be a number between 0 and 1');
			});
		});

		describe('when confidense is more than 1', () => {
			var errorMessage;

			before(() => {
				try {
					abTestResult.calcResult(test, 2);
				} catch (e) {
					errorMessage = e.message;
				}
			});

			it('should throw error', () => {
				expect(errorMessage).to.equal('confidence must be a number between 0 and 1');
			});
		});
	});

});
