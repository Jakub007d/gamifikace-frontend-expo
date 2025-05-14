import { Pressable, View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

interface NavigationPanelInterface {
  course_name: string | string[];
}
const NavigationPanel = (props: NavigationPanelInterface) => {
  return (
    <View style={styles.score_item}>
      <Pressable onPress={() => router.back()}>
        <Text style={{ fontSize: 30 }}>{"<"}</Text>
      </Pressable>
      <Text style={{ fontSize: 30 }}>{props.course_name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  score_item: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between", // Vertikálne vycentrovanie
    alignItems: "center", // Horizontálne vycentrovanie
    paddingHorizontal: 10,
    backgroundColor: "gray",
  },
});
export default NavigationPanel;
