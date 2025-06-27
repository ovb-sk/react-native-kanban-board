import {
  CardModel,
  ColumnModel,
  KanbanBoard,
} from "@ovb/react-native-kanban-board";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

interface DataModel {
  id: string;
  title: string;
}

export default function App() {
  const [exampleCardNo, setExampleCardNo] = useState(1);
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [cards, setCards] = useState<CardModel<DataModel>[]>([]);

  useEffect(() => {
    const cols = [
      new ColumnModel("new", "New", 1),
      new ColumnModel("inProgress", "In Progress", 2),
      new ColumnModel("ready", "Ready", 3),
    ];

    const newCards = [
      new CardModel<DataModel>(
        "card1",
        "new",
        "1st Card",
        "Example card",
        "test description",
        [
          {
            text: "Tag1",
            backgroundColor: "#00FF00",
            textColor: "#000000",
          },
        ],
        {
          id: "1",
          title: "Card 1",
        },
        1
      ),
      new CardModel<DataModel>(
        "card2",
        "new",
        "2nd Card",
        "Example card",
        "test description",
        [
          {
            text: "Tag2",
            backgroundColor: "#FFA500",
            textColor: "#000000",
          },
        ],
        {
          id: "2",
          title: "Card 2",
        },
        2
      ),
      new CardModel<DataModel>(
        "card3",
        "inProgress",
        "3rd Card",
        "Example card",
        "test description",
        [],
        {
          id: "3",
          title: "Card 3",
        },
        1
      ),
    ];

    setColumns(cols);
    setCards(newCards);
  }, []);

  const addNewCard = () => {
    const newCard = new CardModel<DataModel>(
      "Generated card",
      "new",
      "New card " + exampleCardNo,
      "Example card",
      "Some description",
      [],
      {
        id: exampleCardNo.toString(),
        title: "Card " + exampleCardNo,
      },
      1
    );
    setExampleCardNo(exampleCardNo + 1);

    let newCards = [...cards, newCard];
    setCards(newCards);
  };

  const onCardDragEnd = (
    srcColumn: ColumnModel,
    destColumn: ColumnModel,
    item: CardModel<DataModel>,
    cardIdx: number
  ) => {
    Alert.alert(
      "Card finished dragging",
      `Item: ${item.title} \nFrom column: ${srcColumn.id} \nTo column: ${destColumn.id} \nCard index: ${cardIdx}`
    );
  };

  const onCardPress = (card: CardModel<DataModel>) => {
    Alert.alert(`Card '${card.title}' pressed`);
  };

  return (
    <View style={styles.container}>
      <Text>Example kanban board</Text>

      <View style={styles.actionsContainer}>
        <Button onPress={addNewCard} title="Add new card" />
      </View>

      <KanbanBoard
        columns={columns}
        cards={cards}
        onDragEnd={(srcColumn, destColumn, item, targetIdx) =>
          onCardDragEnd(srcColumn, destColumn, item, targetIdx)
        }
        onCardPress={(item) => onCardPress(item)}
        style={styles.kanbanStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    marginTop: 20,
  },
  kanbanStyle: {
    marginTop: 20,
    flex: 1,
  },
});
