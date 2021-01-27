type cbOrigin = (error: Error, allow: boolean) => any;
type req = Request<
  ParamsDictionary,
  any,
  any,
  qs.ParsedQs,
  Record<string, any>
>;
