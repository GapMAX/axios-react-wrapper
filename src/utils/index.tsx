export const createSymbol = (symbol : string) => {
  const hasSymbol = !!typeof Symbol;
  if(hasSymbol) return Symbol(symbol);
  return symbol + new Date().getTime() + Math.random();
}

export * from "./Axios";