import t from "tcomb";

export const GameHeader = t.struct({
  whiteName: t.String,
  blackName: t.String,
  id: t.Number
})
export const DbDetails = t.struct({
  name: t.String,
  id: t.Number,
  gameHeaders: t.list(GameHeader)
})
