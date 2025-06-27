import { BoardState } from "../models/board-state";
import { CardModel } from "../models/card-model";
import { ColumnModel } from "../models/column-model";
import { Rect } from "../models/rect";

export class BoardTools {
  static SCROLL_TRESHOLD = 100;

  static validateAndMeasureBoard<T>(
    boardState: BoardState<T>,
    column: ColumnModel | undefined = undefined
  ) {
    let columns = column
      ? [column]
      : Array.from(boardState.columnsMap.values());

    columns.forEach((col) => {
      col.measure();

      const cards = boardState.columnCardsMap.get(col.id);
      if (!cards) {
        return;
      }

      cards.forEach((card) => {
        card.validateAndMeasure();
      });
    });
  }

  static getScrollingDirection(
    column: ColumnModel,
    scrollY: number | undefined
  ): { offset: number; scrolling: boolean } | undefined {
    const layout = column.dimensions;
    if (!layout) {
      return undefined;
    }

    if (!scrollY) scrollY = 0;

    const upperEnd = layout.y;
    const upper =
      scrollY > upperEnd - this.SCROLL_TRESHOLD &&
      scrollY < upperEnd + this.SCROLL_TRESHOLD;

    const lowerEnd = layout.y + layout.height;
    const lower =
      scrollY > lowerEnd - this.SCROLL_TRESHOLD &&
      scrollY < lowerEnd + this.SCROLL_TRESHOLD;

    const offset = lower ? 1 : upper ? -1 : 0;

    return {
      offset,
      scrolling: lower || upper,
    };
  }

  static findColumn<T>(
    boardState: BoardState<T>,
    x: number
  ): ColumnModel | undefined {
    let visibleColumns = this.getVisibleColumns(boardState);
    let column = visibleColumns.filter(
      (col) =>
        col.dimensions &&
        x >= col.dimensions.x &&
        x <= col.dimensions.x + col.dimensions.width
    );

    if (column.length > 0) {
      return column[0];
    }

    return undefined;
  }

  static findCardInColumn<T>(
    column: ColumnModel,
    boardState: BoardState<T>,
    y: number
  ): CardModel<T> | undefined {
    const visibleItems = this.getVisibleCards(column, boardState);
    if (!visibleItems || visibleItems.length == 0) {
      return undefined;
    }

    let dimensions = visibleItems[0]!.dimensions!; //just get height of first dimension as 'template'
    dimensions = { ...dimensions, y: y };

    return this.getCardAtPosition(visibleItems, y, dimensions);
  }

  static getCardAtPosition<T>(
    items: CardModel<T>[],
    y: number,
    dimensions: Rect | undefined
  ): CardModel<T> | undefined {
    if (items.length == 0) {
      return undefined;
    }
    let item = items.find((i) => this.isItemWithinY(y, dimensions, i));

    //if Y higher than first item, then select 1 item
    const firstItem = items[0];
    if (
      !item &&
      firstItem &&
      firstItem.dimensions &&
      y <= firstItem.dimensions.y
    ) {
      item = firstItem;
    }

    //if Y lower than last item, then select last item
    const lastItem = items[items.length - 1];
    if (
      !item &&
      lastItem &&
      lastItem.dimensions &&
      y >= lastItem.dimensions.y
    ) {
      item = lastItem;
    }

    return item;
  }

  static isItemWithinY<T>(
    y: number,
    dimensions: Rect | undefined,
    item: CardModel<T>
  ): boolean {
    if (!item.dimensions || !dimensions) {
      return false;
    }

    const itemDimensions = item.dimensions;
    const heightDiff = Math.abs(dimensions.height - itemDimensions.height);

    let isUp;
    let isDown;

    if (heightDiff > itemDimensions.height) {
      isUp = y > itemDimensions.y;
      isDown = y < itemDimensions.y + itemDimensions.height;
    } else if (y < dimensions.y) {
      isUp = y > itemDimensions.y;
      isDown = y < itemDimensions.y + itemDimensions.height - heightDiff;
    } else {
      isUp = y > itemDimensions.y + heightDiff;
      isDown = y < itemDimensions.y + itemDimensions.height;
    }

    return isUp && isDown;
  }

  static getVisibleCards<T>(
    column: ColumnModel,
    boardState: BoardState<T>
  ): CardModel<T>[] {
    var cards = boardState.columnCardsMap.get(column.id);
    if (!cards) {
      return [];
    }

    const visibleCards = cards.filter((x) => x.isRenderedAndVisible);
    return visibleCards;
  }

  static getVisibleColumns<T>(boardState: BoardState<T>): ColumnModel[] {
    return Array.from(boardState.columnsMap.values()).filter(
      (column) => column.isRenderedAndVisible
    );
  }
}
