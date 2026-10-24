declare module 'virtual:example-descriptions' {
  /** The leading <!-- … --> comment of each example, by "<Component>/<file>.vue". */
  const descriptions: Record<string, string>;
  export default descriptions;
}
