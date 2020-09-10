export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function splitOnFirst(
  string: string, 
  delim: string, 
  joinDelim?: string,
): [string, string]
export function splitOnFirst(
  string: string, 
  delim: RegExp, 
  joinDelim: string,
): [string, string]
export function splitOnFirst(string: any, delim: any, joinDelim: any) {
  const [first, ...rest] = string.split(delim);
  return [first, rest.join(joinDelim ?? delim)];
}