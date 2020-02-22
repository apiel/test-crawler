const logol = require('./dist');

logol.info('test info', { a: 123 });
logol.log('test log', { a: 123 });
logol.success('test success', { a: 123 });
logol.debug('test debug', { a: 123 });
logol.warn('test warn', { a: 123 });
logol.error('test error', { a: 123 });

logol.logol.log = (...params) => console.log('overwrite', ...params);
logol.log('test log', { a: 123 });
