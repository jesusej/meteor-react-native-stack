import { Button } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { defaultColors } from "../styles/defaultStyles"

export const NavigateButton = ({ title, route }) => {
  const navigation = useNavigation()

  return (
    <Button
      title={title}
      testID="navigateButton"
      color={defaultColors.primary}
      onPress={() => navigation.navigate(route)}
    />
  )
}