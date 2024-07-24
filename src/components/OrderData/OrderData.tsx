import { OrderData, orderDataSlice } from "../../store/orderdata.slice"
import { useAppSelector } from "../../store/store"
import classes from "./OrderData.module.css"

export default function OrderDataTable() {
    const orderdata = useAppSelector(orderDataSlice.selectors.selectOrderData)
    console.log(orderdata)

    return (
        <div>
            {orderdata && 
            <section className={classes.tableContainer}>
                <table className="w-full">
                <thead>
                    <tr>
                    <th className="px-[1.5rem]">Название</th>
                    <th className="px-[1.5rem]">Нужно для заказа</th>
                    <th className="px-[1.5rem]">На складе</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(orderdata)
                    .map((orderComp: OrderData) => (
                        <tr
                        key={orderComp.id}
                        // className={orderComp.id % 2 === 0 ? "bg-gray-100" : ""}
                        >
                        <td>{orderComp.comp_name}</td>
                        <td>{orderComp.amount_need}</td>
                        <td>{orderComp.in_stock}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </section>}
        </div>
    )
}