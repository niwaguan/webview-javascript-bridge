import UriEncoder from '../typescript/encoder/uri-encoder';
import JSONEncoder from '../typescript/encoder/json-encoder'
import JSONUriEncoder from '../typescript/encoder/json-uri-encoder'
test('UriEncoder', () => {
  const encoder = new UriEncoder("custom");
  expect(encoder.encode({ channel: 'default', action: 'log' })).toBe('custom://default/log');
});

test('UriEncoder with params', () => {
  const encoder = new UriEncoder("custom");
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' } })).toBe(
    'custom://default/log?args=%7B%22foo%22%3A%22bar%22%7D',
  );
});

test('UriEncoder with params and callback', () => {
  const encoder = new UriEncoder("custom");
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' }, callbackId: 'cb_1' })).toBe(
    'custom://default/log?args=%7B%22foo%22%3A%22bar%22%7D&callbackId=cb_1',
  );
});

test('JSONEncoder', () => {
  const encoder = new JSONEncoder();
  expect(encoder.encode({ channel: 'default', action: 'log' })).toBe(
    '{\"channel\":\"default\",\"action\":\"log\"}',
  );
});

test('JSONEncoder with params', () => {
  const encoder = new JSONEncoder();
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' } })).toBe(
    '{\"channel\":\"default\",\"action\":\"log\",\"params\":{\"foo\":\"bar\"}}',
  );
});

test('JSONEncoder with params and callback', () => {
  const encoder = new JSONEncoder();
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' }, callbackId: 'cb_1' })).toBe(
    '{\"channel\":\"default\",\"action\":\"log\",\"params\":{\"foo\":\"bar\"},\"callbackId\":\"cb_1\"}',
  );
});

test('JSONUriEncoder', () => {
  const encoder = new JSONUriEncoder("custom", "domain.com");
  expect(encoder.encode({ channel: 'default', action: 'log' })).toBe(
    'custom://domain.com?args=%7B%22channel%22%3A%22default%22%2C%22action%22%3A%22log%22%7D',
  );
});

test('JSONUriEncoder with params', () => {
  const encoder = new JSONUriEncoder("custom", "domain.com");
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' } })).toBe(
    'custom://domain.com?args=%7B%22channel%22%3A%22default%22%2C%22action%22%3A%22log%22%2C%22params%22%3A%7B%22foo%22%3A%22bar%22%7D%7D',
  );
});

test('JSONUriEncoder with params and callback', () => {
  const encoder = new JSONUriEncoder("custom", "domain.com");
  expect(encoder.encode({ channel: 'default', action: 'log', params: { foo: 'bar' }, callbackId: 'cb_1' })).toBe(
    'custom://domain.com?args=%7B%22channel%22%3A%22default%22%2C%22action%22%3A%22log%22%2C%22params%22%3A%7B%22foo%22%3A%22bar%22%7D%2C%22callbackId%22%3A%22cb_1%22%7D',
  );
});