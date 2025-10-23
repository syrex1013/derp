import { execSync } from 'child_process';

export function which(command: string): string | null {
  try {
    return execSync(`which ${command}`, { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

export function quote(arg: string): string {
  if (/[\s'"$`\\|&;<>()[\]{}*?~]/.test(arg)) {
    return `'${arg.replace(/'/g, "'\\''")}'`;
  }
  return arg;
}

export function isProbablyNaturalLanguage(query: string): boolean {
  const patterns = [
    /\b(find|search|show|get|list|display)\b/i,
    /\b(files?|lines?|containing|with|in|that|have)\b/i,
    /\b(emails?|urls?|ips?|dates?|numbers?|phone)\b/i,
  ];
  return patterns.some(pattern => pattern.test(query));
}
