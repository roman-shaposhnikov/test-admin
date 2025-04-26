import {
  Datagrid,
  DateField,
  EmailField,
  List,
  NumberField,
  ReferenceManyField,
  Show,
  SimpleShowLayout,
  TextField,
  Title,
  useRecordContext,
} from "react-admin";
import { Resources } from "../resources";
import { BranchAddressField, PostActions } from "../manager/reports";
import { Pagination } from "react-admin";

export const ManagerList = () => (
  <List filter={{ role: "manager" }}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="fullName" label="ФИО" />
      <EmailField source="email" label="Почта" />
    </Datagrid>
  </List>
);

const ShowPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

const ShowLayout = () => {
  const record = useRecordContext();

  return (
    <SimpleShowLayout>
      <Title title={": " + record.fullName} />
      <ReferenceManyField
        reference={Resources.Reports}
        target="managerRef"
        pagination={<ShowPagination />}
      >
        <Datagrid bulkActionButtons={false}>
          <DateField source="date" locales={"ru-RU"} label="Дата" />
          <NumberField
            source="revenue"
            label={"Выручка"}
            locales="ru-RU"
            textAlign="left"
            options={{ style: "currency", currency: "RUB" }}
          />
          <BranchAddressField />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  );
};

export const ManagerReportShow = () => (
  <Show actions={PostActions} title={"Отчеты менеджера"}>
    <ShowLayout />
  </Show>
);
