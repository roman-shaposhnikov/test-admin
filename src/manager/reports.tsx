import {
  Datagrid,
  DateField,
  EditButton,
  FieldProps,
  List,
  NumberField,
  ReferenceInput,
  useRecordContext,
  DateInput,
  Edit,
  NumberInput,
  SimpleForm,
  TransformData,
  Create,
  TopToolbar,
  ListButton,
  AutocompleteInput,
} from "react-admin";
import { Resources } from "../resources";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { FC, useEffect, useState } from "react";

type Report = {
  branchRef: string;
  date: Date;
  managerRef: string;
  revenue: number;
};

export const BranchAddressField: FC<FieldProps> = (props) => {
  const record = useRecordContext(props);
  const branchId = record.branchRef;
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      const branchRef = doc(firestore, Resources.Branches, branchId);
      const branchSnap = await getDoc(branchRef);

      if (branchSnap.exists()) {
        setAddress(branchSnap.data().address);
      }
    })();
  }, [branchId]);

  return <span>{address}</span>;
};
BranchAddressField.defaultProps = { label: "Адрес точки" };

const ReportEditButton = () => {
  const record = useRecordContext();
  const recordDate = record.date as Date;

  const recordMonth = recordDate.getMonth();
  const recordYear = recordDate.getFullYear();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const editable = recordMonth === currentMonth && recordYear === currentYear;

  return editable ? <EditButton /> : null;
};

const sort = { field: "date", order: "DESC" } as const;

export const ReportList = () => {
  return (
    <List
      filter={{ managerRef: auth.currentUser?.uid }}
      sort={sort}
      title={"Ежедневные отчеты"}
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
        <ReportEditButton />
      </Datagrid>
    </List>
  );
};

const transformReportEditToServer: TransformData = (data) => {
  const report = data as Report;
  const date = report.date as unknown as string;

  return {
    ...report,
    date: new Date(date),
  };
};

export const PostActions = (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

export const ReportEdit = () => (
  <Edit transform={transformReportEditToServer} actions={PostActions}>
    <SimpleForm>
      <ReferenceInput source="branchRef" reference="branches" />
      <NumberInput source="revenue" />
      <DateInput source="date" />
    </SimpleForm>
  </Edit>
);

const transformReportCreateToServer: TransformData = (data) => {
  console.log(data);
  const report = data as Report;
  const date = report.date as unknown as string;

  return {
    ...report,
    date: new Date(date),
    managerRef: auth.currentUser?.uid!,
  };
};

export const ReportCreate = () => {
  return (
    <Create
      transform={transformReportCreateToServer}
      actions={PostActions}
      redirect={"list"}
      title={"Создание отчета"}
    >
      <SimpleForm>
        <ReferenceInput source="branchRef" reference="branches">
          <AutocompleteInput label="Адрес точки" />
        </ReferenceInput>

        <NumberInput source="revenue" label={"Выручка, ₽"} />

        <DateInput
          source="date"
          label={"Дата"}
          lang="ru-RU"
          defaultValue={new Date()}
        />
      </SimpleForm>
    </Create>
  );
};
