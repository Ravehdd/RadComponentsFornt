import { addDeviceSlice } from "../../store/addDevice.slice"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../../store/store"
import Button from "../Button/Button";
import { useEffect, useRef, useState } from "react";
import classes from "./AddDevice.module.css"

export default function AddDevice() {

    type comp_list = {
        comp_id: number
        comp_name: string
    }
    const device_input = useRef<HTMLInputElement>(null);
    const amount_input = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const device = useAppSelector(addDeviceSlice.selectors.selectDevice)
    const components = useAppSelector(addDeviceSlice.selectors.selectComponents)
    const [loading, setLoading] = useState(false);
    const [componentsList, setComponentsList] = useState<comp_list[]>([]);
    const [compName, setCompName] = useState("")
    const [compAmount, setCompAmount] = useState<number >(0)

    const storedAuthToken = localStorage.getItem('authToken');

    console.log("components", components)


    async function fetchDevices() {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/v1/add-new-device/", 
        {
            headers: {
                "Authorization": `Token ${storedAuthToken}`
            }
        }
        );
        const components_list = await response.json();
        setComponentsList(components_list["data"]);
        setLoading(false);
    }

    useEffect(() => {
    fetchDevices();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (device_input.current !== null) {
            dispatch(addDeviceSlice.actions.setDevice({device_name: device_input.current.value}));

        }
    };

    const handleCompSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const component = {
            comp_name: compName,
            amount_need: compAmount,
        }
        dispatch(addDeviceSlice.actions.setComponent({component: component}));
    }

    const handleNothing = () => {
    console.log("Nope");
    }

    const handleAmount = () => {
        if (amount_input.current !== null)
        setCompAmount(Number(amount_input.current.value));
    };

    const handleTable = () => {
        // e.preventDefault();
        const deviceData = { device_name: device, comp_data: components };

        fetch("http://127.0.0.1:8000/api/v1/add-new-device/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${storedAuthToken}`
         },
        body: JSON.stringify(deviceData),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
            }
            return response.json(); // Получаем ответ сервера в формате JSON
        })
        .then((data) => {
            if (data.status === 400) {
                console.log(data.response)
            // Обработка ошибок
            } else if (data.status === 200) {
            console.log(data.response)
            }
            // Здесь вы можете обработать полученные данные
        })
        .catch((error) => {
            console.error("There was an error!", error);
            // Обработка ошибок
        });
    };

    const handleClick = (comp_name: string) => {
        dispatch(addDeviceSlice.actions.removeComponent({comp_name: comp_name}));
    }
    
    
    return (
        <div className="flex ">
            <div className="flex w-[100%] mx-[2rem] mt-[1rem]">
                {!device ? 
                <div className="w-[50%]">
                    <h1 className="text-3xl mt-[1rem] mb-[1rem]">Добавить прибор</h1>
                    <div className="">
                        <form onSubmit={handleSubmit}>
                            {/* <p className="text-[1.2rem] mb-[0.5rem]">Укажите название</p> */}
                            <input
                            type="text"
                            className="control mb-3 shadow-lg"
                            ref={device_input}
                            placeholder="Название прибора"
                            />
                            <div>
                                <Button isActive={true} onClick={handleNothing}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    
                    </div>
                
                </div> :  
                <div>
                <h1 className="text-3xl  mt-[1rem] ">Добавить прибор</h1>
                <form onSubmit={handleCompSubmit}>
                    {loading ? <p>Loading...</p> :
                    <select
                    id="comp_name"
                    className="control mb-3 mt-[2rem] shadow-lg"
                    value={compName}
                    onChange={(event) => setCompName(event.target.value)}
                    >
                            <option value="" disabled>
                                Выберите компонент
                            </option>
                            {componentsList.map((comp) => (
                                <option key={comp.comp_id} value={comp.comp_name}>
                                {comp.comp_name}
                                </option>
                            ))}
                    </select>}
                    <input
                    type="number"
                    className="control mb-3 shadow-lg"
                    ref={amount_input}
                    placeholder="Выберите количество"
                    onChange={handleAmount}
                    />
                    <div>
                        <Button isActive={true} onClick={handleNothing}>
                            Submit
                        </Button>
                    </div>
                </form>
                </div>}
            
                <div className="w-[50%] mt-[52px] ml-[2rem]">
                    {device &&
                    <form onSubmit={handleTable}>
                        <h1 className="text-xl mb-1">Устройство: {device}</h1>
                        <section className={classes.tableContainer}>
                            <table className="w-full shadow-lg">
                            <thead>
                                <tr>
                                <th className="">Название</th>
                                <th className="">Колличество</th>
                                </tr>
                            </thead>
                            <tbody>
                                {components.length > 0 && components
                                .map((component) => (
                                    <tr
                                    key={component.comp_name.toLowerCase()}
                                    onClick={() => handleClick(component.comp_name)}
                                    >
                                    <td>{component.comp_name}</td>
                                    <td>{component.amount_need}
                                    </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                        <div className="mt-[1rem]">
                            <Button isActive={true} onClick={handleNothing}>Download to database</Button>
                        </div>
                    </form>}
                </div>
            </div>
        </div>
)}