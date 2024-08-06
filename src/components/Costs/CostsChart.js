import {BarChart} from "@mui/x-charts/BarChart";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";

const CostsChart = ({costs, year}) => {
    const {locale} = useRootContext();
    if (!year) {
        year = new Date().getFullYear();
    }

    const dataset = [];
    const actualDate = new Date().toISOString().substring(0, 10);
    locale._months_numbers.forEach((monthNumber, index) => {
        dataset[index] = {
            x: index,
            y1: 0
        };

        costs.forEach(cost => {
            if (cost.dayOfAccounting?.date?.substring(0, 7) === year+"-"+monthNumber) {
                dataset[index].y1 += parseFloat(cost.amount);
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
            }
        ]}
        dataset={dataset}
        height={300}
    />);
}

export default CostsChart;