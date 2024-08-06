import {BarChart} from "@mui/x-charts/BarChart";
import {useRootContext} from "../../contexts/RootContext";
import BudgetCalculator from "../../utils/BudgetCalculator";

const InvoicesOverview = ({invoices, year}) => {
    if (!year) {
        year = new Date().getFullYear();
    }
    const actualDate = new Date().toISOString().substring(0, 10);

    let amountPayed = 0;
    let amountNotPayed = 0;
    let amountOverDue = 0;
    let countPayed = 0;
    let countNotPayed = 0;
    let countOverDue = 0;

    invoices.forEach(invoice => {
        if (invoice.createdDate?.date?.substring(0, 4) == year) {
            if (invoice.payed) {
                amountPayed += parseFloat(invoice.amount);
                countPayed++;
            } else if (invoice.dueDate?.date?.substring(0, 10) < actualDate) {
                amountOverDue += parseFloat(invoice.amount);
                countOverDue++;
            } else {
                amountNotPayed += parseFloat(invoice.amount);
                countNotPayed++;
            }
        }
    });

    return (<>
        <div className="table-responsive">
            <table className="table">
                <tbody>
                <tr className="fw-bold">
                    <td className="ps-0">Zaplaceno:</td>
                    <td className="text-center">{countPayed}</td>
                    <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountPayed, 2, ".", " ") + " Kč"}</td>
                </tr>
                <tr>
                    <td className="ps-0">Nezaplaceno:</td>
                    <td className="text-center">{countNotPayed}</td>
                    <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountNotPayed, 2, ".", " ") + " Kč"}</td>
                </tr>
                <tr>
                    <td className="ps-0">Po splatnosti:</td>
                    <td className="text-center">{countOverDue}</td>
                    <td className="pe-0 text-end">{(new BudgetCalculator)._numberFormat(amountOverDue, 2, ".", " ") + " Kč"}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </>);
}

export default InvoicesOverview;