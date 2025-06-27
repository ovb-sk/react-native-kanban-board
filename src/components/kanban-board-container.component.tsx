import React from "react";

import KanbanBoard, { KanbanBoardProps } from "./kanban-board.component";
import { KanbanContextProvider } from "./kanban-context.provider";

class KanbanBoardContainer<T> extends React.Component<KanbanBoardProps<T>> {
  render() {
    return (
      <KanbanContextProvider>
        <KanbanBoard {...this.props} />
      </KanbanContextProvider>
    );
  }
}

export default KanbanBoardContainer;
