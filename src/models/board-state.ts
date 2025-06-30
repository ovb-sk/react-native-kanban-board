import { CardModel } from "./card-model";
import { ColumnModel } from "./column-model";

export interface BoardState<T> {
  columnCardsMap: Map<string, CardModel<T>[]>;
  columnsMap: Map<string, ColumnModel>;
}
