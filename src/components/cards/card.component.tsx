import React, { Component } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { CardModel } from "../../models/card-model";
import { KanbanContext, withKanbanContext } from "../kanban-context.provider";
import { Tags } from "./tags.component";

export type CardExternalProps<T> = {
  /**
   * Callback function invoked when the card is pressed.
   * @param {CardModel} model - The card model representing the pressed card.
   */
  onCardPress?: (model: CardModel<T>) => void;

  /**
   * Function that renders the content of the card.
   * @param {CardModel} model - The card model to render the content for.
   * @returns {JSX.Element | null} - The JSX element representing the card content, or null to render the default content.
   */
  renderCardContent?(model: CardModel<T>): JSX.Element | null;

  /**
   * Custom style for the card container.
   */
  cardContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Custom style for the card title text.
   */
  cardTitleTextStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the card subtitle text.
   */
  cardSubtitleTextStyle?: StyleProp<TextStyle>;

  /**
   * Custom style for the card content text.
   */
  cardContentTextStyle?: StyleProp<TextStyle>;
};

type Props<T> = CardExternalProps<T> &
  KanbanContext & {
    model: CardModel<T>;
    hidden: boolean;
  };

class Card<T> extends Component<Props<T>> {
  onPress = () => {
    const { onCardPress, model } = this.props;

    if (!onCardPress) {
      return;
    }

    onCardPress(model);
  };

  render() {
    const {
      model,
      hidden,
      renderCardContent,
      cardContainerStyle,
      cardTitleTextStyle,
      cardSubtitleTextStyle,
      cardContentTextStyle,
    } = this.props;

    return (
      <View
        style={[styles.container, cardContainerStyle, hidden && { opacity: 0 }]}
      >
        <TouchableOpacity onPress={this.onPress}>
          {renderCardContent && renderCardContent(model)}

          {!renderCardContent && (
            <React.Fragment>
              <View style={styles.cardHeaderContainer}>
                <View style={styles.cardTitleContainer}>
                  <Text style={[cardTitleTextStyle, styles.cardTitleText]}>
                    {model.title}
                  </Text>
                </View>
                <Text style={[cardSubtitleTextStyle, styles.cardSubtitleText]}>
                  {model.subtitle}
                </Text>
              </View>
              <View style={styles.cardContentContainer}>
                <Text style={[cardContentTextStyle, styles.cardContentText]}>
                  {model.description}
                </Text>
              </View>
              {model.tags && model.tags.length > 0 && (
                <Tags items={model.tags} />
              )}
            </React.Fragment>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const WrappedCard = withKanbanContext(Card as any);
// Create a generic wrapper function that preserves the type
function CardWithContext<T>(
  props: CardExternalProps<T> & { model: CardModel<T>; hidden: boolean }
) {
  return React.createElement(WrappedCard, props);
}

export default CardWithContext;

const styles = StyleSheet.create({
  container: {
    borderColor: "#E3E3E3",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    elevation: 3,
  },
  cardHeaderContainer: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    marginBottom: 8,
  },
  cardTitleText: {
    fontWeight: "bold",
  },
  cardSubtitleText: {},
  cardContentContainer: {
    marginBottom: 16,
  },
  cardContentText: {
    fontWeight: "bold",
  },
});
