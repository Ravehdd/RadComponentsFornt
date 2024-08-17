import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../App';
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import { devicesSpecsSlice } from '../../store/devicesSepcs.slice';
import classes from "./DeviceSpecs.module.css"

const storedAuthToken = localStorage.getItem("authToken");


const DevicesSpecs = () => {
    const [loading, setLoading] = useState(false);
    const [isOpenId, setIsOpenId] = useState<number | undefined>(undefined);
    const dispatch = useDispatch();
    const specs = useAppSelector(devicesSpecsSlice.selectors.selectDevicesSpecs);
    async function fetchOrders() {
    setLoading(true);
    const response = await fetch(apiBaseUrl + "devices-specs/", 
        {
            headers: {
                "Authorization": `Token ${storedAuthToken}`
            }
        }
    );
    const deviceList = await response.json();
    console.log(deviceList);
    dispatch(devicesSpecsSlice.actions.storeDevicesSpecs({ specsList: deviceList }));
    setLoading(false);
    }

    useEffect(() => {
    fetchOrders();
    }, []);

    const handleClick = (device_id: number) => {
    if (isOpenId === device_id) {
         setIsOpenId(undefined)
    } else {
        setIsOpenId(device_id)
        }
    }

    const a = ". "
    console.log(a.repeat(10))
    
    return (
                <>
        <h1 className="text-3xl mt-[2rem] ml-[2rem] mb-[2rem]">Спецификация</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
        <div className={classes.outerContainer}>
            <div className={classes.innerContainer}>
            {specs && 
                (Object.values(specs)).map((spec) => (
                    <>
                        <div id={spec.device_id.toString()} className={isOpenId?.toString() === spec.device_id.toString() ? classes.openContent : classes.contentContainer} onClick={() => handleClick(spec.device_id)}>
                            <div className={classes.content}>
                                <div>
                                    <h3 className="text-xl">{spec.device_name}</h3>
                                    {/* <p>№0000{spec.order_id}</p> */}
                                </div>

                                {/* <div>
                                    <p className="">Прибор: {spec.device_name}</p>
                                    <p className="flex justify-end">{spec.amount_devices} штук</p>
                                </div> */}
                            </div>
                        </div>

                        {isOpenId === spec.device_id &&
                                <div className={classes.fullInfo}>
                                    <div>
                                    <h1 className=" text-lg">Компоненты</h1>
                                    {spec.comp_data.map((comp) => (
                                        <p className="flex mb-2"><p className="font-bold">{comp.comp_name}</p> <p>{a.repeat(30 - (comp.comp_name).length)}</p> {comp.amount_need} шт.</p>
                                    ))}
                                    </div>
                                  
                                </div>
                        }
                    </>
                ))
            }
            </div>
        </div>)}
        </>
    );
};

export default DevicesSpecs;