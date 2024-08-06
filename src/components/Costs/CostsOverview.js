import {BarChart} from "@mui/x-charts/BarChart";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";

const CostsOverview = ({costs, year, costCategories}) => {
    if (!year) {
        year = new Date().getFullYear();
    }
    const actualDate = new Date().toISOString().substring(0, 10);

    let amountPayed = 0;
    let amountByCategory = {};
    let countPayed = 0;
    let countByCategory = {};

    costs.forEach(cost => {
        if (cost.dayOfAccounting?.date?.substring(0, 4) == year) {
            amountPayed += parseFloat(cost.amount);
            countPayed++;

            if (!cost.costCategoryId) {
                cost.costCategoryId = 0;
            }

            if (!(cost.costCategoryId in amountByCategory)) {
                amountByCategory[cost.costCategoryId] = 0;
                countByCategory[cost.costCategoryId] = 0;
            }

            amountByCategory[cost.costCategoryId] += parseFloat(cost.amount);
            countByCategory[cost.costCategoryId]++;
        }
    });

    return (<>
        <div className="table-responsive">
            <table className="table">
                <tbody>
                {costCategories?.map(costCategory => (
                    (costCategory.id in amountByCategory) && (
                        <tr key={costCategory.id}>
                            <td className="ps-0">{costCategory.name}:</td>
                            <td className="text-center">{countByCategory[costCategory.id]}</td>
                            <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountByCategory[costCategory.id], 2, ".", " ") + " Kč"}</td>
                        </tr>
                    )
                ))}

                {(0 in amountByCategory) && (
                    <tr>
                        <td className="ps-0">Ostatní:</td>
                        <td className="text-center">{countByCategory[0]}</td>
                        <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountByCategory[0], 2, ".", " ") + " Kč"}</td>
                    </tr>
                )}

                <tr className="fw-bold">
                    <td className="ps-0">Celkem:</td>
                    <td className="text-center">{countPayed}</td>
                    <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountPayed, 2, ".", " ") + " Kč"}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </>);
}

export default CostsOverview;