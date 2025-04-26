import {
  Admin,
  Resource,
  CustomRoutes,
  LayoutProps,
  Menu,
  Layout,
  usePermissions,
} from "react-admin";
import { Route } from "react-router-dom";
import { Groups, Summarize } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";

import { Resources } from "./resources";
import { firestoreDataProvider } from "./firebase";
import { customAuthProvider, LoginPage } from "./auth";
import { AdminReportList } from "./admin/reports";
import { ManagerList, ManagerReportShow } from "./admin/managers";
import { ReportCreate, ReportEdit, ReportList } from "./manager/reports";

const CustomMenu = () => {
  const { permissions } = usePermissions();

  return (
    <Menu>
      <Menu.ResourceItems />
      {permissions === "admin" && (
        <Menu.Item
          to="/admin-report"
          primaryText="Сводный отчет"
          leftIcon={<Summarize />}
        />
      )}
    </Menu>
  );
};

const CustomLayout = (props: LayoutProps) => (
  <Layout {...props} menu={CustomMenu} />
);

export const App = () => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
    <Admin
      loginPage={LoginPage}
      authProvider={customAuthProvider}
      dataProvider={firestoreDataProvider}
      layout={CustomLayout}
    >
      {(permisssion) => (
        <>
          <Resource name={Resources.Branches} recordRepresentation="address" />

          {permisssion === "manager" && (
            <>
              <Resource
                name={Resources.Reports}
                list={ReportList}
                edit={ReportEdit}
                create={ReportCreate}
                options={{ label: "Ежедневные отчеты" }}
              />
            </>
          )}

          {permisssion === "admin" && (
            <>
              <Resource name={Resources.Reports} />

              <Resource
                name={Resources.Users}
                list={ManagerList}
                show={ManagerReportShow}
                recordRepresentation={"fullName"}
                options={{ label: "Менеджеры" }}
                icon={Groups}
              />
              <CustomRoutes>
                <Route path="/admin-report" element={<AdminReportList />} />
              </CustomRoutes>
            </>
          )}
        </>
      )}
    </Admin>
  </LocalizationProvider>
);
