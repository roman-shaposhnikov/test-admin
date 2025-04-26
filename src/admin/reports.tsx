import { query, where, getDocs, collection } from "firebase/firestore";
import { Datagrid, FunctionField, NumberField } from "react-admin";
import { firestore } from "../firebase";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Title } from "react-admin";

const countSumRevenueForMonth = async (month: number, year: number) => {
  const startOfMonth = new Date(year, month, 1);
  console.log("startOfMonth", startOfMonth);

  const endOfMonth = new Date(year, month + 1, 0);
  console.log("endOfMonth", endOfMonth);

  const docs = await getDocs(
    query(
      collection(firestore, "reports"),
      where("date", "<=", endOfMonth),
      where("date", ">=", startOfMonth)
    )
  );

  let sumRevenue = 0;
  console.log(docs.docs);

  docs.docs.forEach((doc) => {
    console.log(doc);
    sumRevenue += doc.data().revenue as number;
  });

  return sumRevenue;
};

const countSumRevenueForEachMonth = (year: number) =>
  Promise.all(
    Array(12)
      .fill(0)
      .map((_, idx) => idx)
      .map(async (month) => ({
        revenue: await countSumRevenueForMonth(month, year),
        month,
      }))
  );

const sort = { field: "id", order: "ASC" } as const;

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

type SummaryRecord = {
  revenue: number;
  month: number;
};

export const AdminReportList = () => {
  const [data, setData] = useState<SummaryRecord[]>([]);
  const [year, setYear] = useState(new Date());

  useEffect(() => {
    (async () => {
      setData(await countSumRevenueForEachMonth(year.getFullYear()));
    })();
  }, [year]);

  return (
    <div>
      <Title title={"Сводный отчет"} />
      <DatePicker
        label={"Year"}
        views={["year"]}
        openTo="year"
        value={year}
        onChange={(year) => year && setYear(year)}
        sx={{ marginBottom: "20px" }}
      />

      <Datagrid data={data} sort={sort}>
        <NumberField
          source="revenue"
          label={"Выручка"}
          locales="ru-RU"
          textAlign="left"
          options={{ style: "currency", currency: "RUB" }}
        />
        <FunctionField
          label="Месяц"
          render={(record: SummaryRecord) => months[record.month]}
        />
      </Datagrid>
    </div>
  );
};
