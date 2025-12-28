import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import CustomDrawerContent from "../../../components/CustomDrawerContent";
import { routes } from "../../constant";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={routes.home}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
        headerBackground: 'red',
      }}
    >
      <Drawer.Screen name={routes.home} component={BottomTabs} />
    </Drawer.Navigator>
  );
}