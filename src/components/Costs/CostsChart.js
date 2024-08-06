import {BarChart} from "@mui/x-charts/BarChart";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";

const CostsChart = ({costs, year, costCategories}) => {
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

        costCategories?.map((costCategory, costCategory_index) => {
            dataset[index]["y"+(costCategory_index+2)] = 0;
        })

        costs.forEach(cost => {
            if (cost.dayOfAccounting?.date?.substring(0, 7) === year+"-"+monthNumber) {
                if (!cost.costCategoryId) {
                    dataset[index].y1 += parseFloat(cost.amount);
                }

                costCategories?.map((costCategory, costCategory_index) => {
                    if (costCategory.id == cost.costCategoryId) {
                        dataset[index]["y"+(costCategory_index+2)] += parseFloat(cost.amount);
                    }
                })
            }
        });
    });

    const series = [];

    costCategories?.map((costCategory, costCategory_index) => {
        let tmp = {
            dataKey: 'y'+(costCategory_index+2),
            label: costCategory.name,
            stack: 'Náklady',
            stackOrder: "reverse",
            valueFormatter: (value) => ((new BudgetCalculator)._numberFormat(value, 2, ".", " ") + " Kč")
        };
        if (costCategory.color != "") {
            tmp.color = costCategory.color;
        }
        series.push(tmp);
    })

    series.push({
        dataKey: 'y1',
        label: "Ostatní",
        stack: 'Náklady',
        stackOrder: "reverse",
        valueFormatter: (value) => ((new BudgetCalculator)._numberFormat(value, 2, ".", " ") + " Kč")
    });

    return (<BarChart
        xAxis={[{ scaleType: 'band', data: locale._months, dataKey: 'x' }]}
        series={series}
        dataset={dataset}
        height={500}
    />);
}

export default CostsChart;