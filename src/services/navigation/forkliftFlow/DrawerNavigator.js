import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Forklift from "../../../screens/forkliftFlow";
import CustomDrawerContent from "../../../components/CustomDrawerContent";
import { routes } from "../../constant";
import ForkLifterDrawer from "../../../components/ForkLifterDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={routes.home}
      drawerContent={(props) => <ForkLifterDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
        headerBackground: 'red',
      }}
    >
      <Drawer.Screen name={routes.home} component={Forklift.Home} />
      {/* <Drawer.Screen name={routes.tasks} component={Forklift.Tasks} />
      <Drawer.Screen name={routes.inventory} component={Forklift.Inventory} />
      <Drawer.Screen name={routes.chat} component={Forklift.Chat} /> */}
    </Drawer.Navigator>
  );
}
