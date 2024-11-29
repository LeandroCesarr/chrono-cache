export const consoleColors = {
  text: {
    red: (val: string) => `\x1b[31m${val}\x1b[0m`,
    green: (val: string) => `\x1b[32m${val}\x1b[0m`,
    yellow: (val: string) => `\x1b[33m${val}\x1b[0m`,
    blue: (val: string) => `\x1b[34m${val}\x1b[0m`,
  },
  background: {
    red: (val: string) => `\x1b[41m${val}\x1b[0m`,
    green: (val: string) => `\x1b[42m${val}\x1b[0m`,
    yellow: (val: string) => `\x1b[43m${val}\x1b[0m`,
    blue: (val: string) => `\x1b[44m${val}\x1b[0m`,
  },
};
