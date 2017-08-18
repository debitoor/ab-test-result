# ab-test-result

[![npm version](https://badge.fury.io/js/ab-test-result.svg)](https://badge.fury.io/js/ab-test-result) [![Build Status](https://travis-ci.org/debitoor/ab-test-result.svg?branch=master)](https://travis-ci.org/debitoor/ab-test-result) [![Dependency Status](https://david-dm.org/debitoor/ab-test-result.svg)](https://david-dm.org/debitoor/ab-test-result) [![devDependency Status](https://david-dm.org/debitoor/ab-test-result/dev-status.svg)](https://david-dm.org/debitoor/ab-test-result#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/debitoor/ab-test-result/badge.svg?branch=master)](https://coveralls.io/github/debitoor/ab-test-result?branch=master)

Returns the improvement rate of your AB-test (```challengerImprovement```) and answers if it's statistically significant (```isSignificant```).

The result returned also contains a ```statistics``` property with calculated statistical values.

	npm install --save ab-test-result

## Usage

```javascript
	var abTestResult = require('ab-test-result');

	var test = {
		controlVisits: 490, // required
		controlConversions: 10, // required
		challengerVisits: 500, // required
		challengerConversions: 17 // required
	};
	var confidence = 0.9; // optional, defaults to 0.95

	var result = abTestResult.calcResult(test, confidence);
	/*
		result = {
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
		}
	*/
```

## License

[MIT](http://opensource.org/licenses/MIT)
