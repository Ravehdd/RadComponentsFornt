import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { orderSlice } from "../../store/orders.slice";
import { useAppSelector } from "../../store/store";
import classes from "./Orders.module.css"

export default function Orders() {
    const [loading, setLoading] = useState(false);
    const [isOpenId, setIsOpenId] = useState<number | undefined>(undefined);
    const dispatch = useDispatch();
    const orders = useAppSelector(orderSlice.selectors.selectOrders);

    const storedAuthToken = localStorage.getItem("authToken");

    async function fetchOrders() {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/v1/orders/", 
        {
            headers: {
                "Authorization": `Token ${storedAuthToken}`
            }
        }
    );
    const ordersList = await response.json();
    console.log(ordersList);
    dispatch(orderSlice.actions.storeOrders({ ordersList }));
    setLoading(false);
    }

    useEffect(() => {
    fetchOrders();
    }, []);

    const handleClick = (orderId: number) => {
        if (isOpenId === orderId) {
            setIsOpenId(undefined)
        } else {

            setIsOpenId(orderId)
        }
    }


    return (
        <>
        <h1 className="text-3xl mt-[2rem] ml-[2rem] mb-[2rem]">Заказы</h1>
        <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
            {orders && 
                (Object.values(orders)).reverse().map((order) => (
                    <>
                        <div id={order.order_id.toString()} className={isOpenId?.toString() === order.order_id.toString() ? classes.openContent : classes.contentContainer} onClick={() => handleClick(order.order_id)}>
                            <div className={classes.content}>
                                <div>
                                    <h3 className="text-xl">Заказ от {order.creation_date}</h3>
                                    <p>№0000{order.order_id}</p>
                                </div>

                                <div>
                                    <p className="">Прибор: {order.device_name}</p>
                                    <p className="flex justify-end">{order.amount_devices} штук</p>
                                </div>
                            </div>
                        </div>

                        {isOpenId === order.order_id &&
                                <div className={classes.fullInfo}>
                                    <div>
                                    <h1 className="font-bold">Компоненты</h1>
                                    {order.comp_data.map((comp) => (
                                        <p>{comp.comp_name}: {comp.amount_need} штук</p>
                                    ))}
                                    </div>
                                  
                                </div>
                        }
                    </>
                ))
            }
            </div>
        </div>
        </>
    )
}   