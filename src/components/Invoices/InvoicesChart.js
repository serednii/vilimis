import {BarChart} from "@mui/x-charts/BarChart";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";

const InvoicesChart = ({invoices, year}) => {
    const {locale} = useRootContext();
    if (!year) {
        year = new Date().getFullYear();
    }

    const dataset = [];
    const actualDate = new Date().toISOString().substring(0, 10);
    locale._months_numbers.forEach((monthNumber, index) => {
        dataset[index] = {
            x: index,
            y1: 0,
            y2: 0,
            y3: 0
        };

        invoices.forEach(invoice => {
            console.log(invoice.createdDate)
            if (invoice.createdDate?.date?.substring(0, 7) === year+"-"+monthNumber) {
                if (invoice.payed) {
                    dataset[index].y1 += parseFloat(invoice.amount);
                } else if (invoice.dueDate?.date?.substring(0, 10) < actualDate) {
                    dataset[index].y3 += parseFloat(invoice.amount);
                } else {
                    dataset[index].y2 += parseFloat(invoice.amount);
                }
            }
        });
    });

    return (<BarChart
        xAxis={[{ scaleType: 'band', data: locale._months, dataKey: 'x' }]}
        series={[
            {
                dataKey: 'y1',
                label: "Zaplaceno",
                valueFormatter: (value) => ((new BudgetCalculator)._numberFormat(value, 2, ".", " ") + " Kč")
            },
            {
                dataKey: 'y2',
                label: "K zaplacení",
                valueFormatter: (value) => ((new BudgetCalculator)._numberFormat(value, 2, ".", " ") + " Kč")
            },
            {
                dataKey: 'y3',
                label: "Po splatnosti",
                valueFormatter: (value) => ((new BudgetCalculator)._numberFormat(value, 2, ".", " ") + " Kč")
            }
        ]}
        dataset={dataset}
        height={300}
    />);
}

export default InvoicesChart;