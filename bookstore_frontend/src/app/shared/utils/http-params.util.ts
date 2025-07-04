export function buildParams(params: Record<string, any>) {
  return Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== 'All')
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
}
