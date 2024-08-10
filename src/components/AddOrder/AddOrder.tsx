import { useEffect, useState, useRef } from "react";
import Button from "../Button/Button";
import { replaceSlice } from "../../store/replace.slice";
import { useDispatch} from "react-redux";
import Replace from "../Replace/Replace";
import OrderData from "../OrderData/OrderData";
import { orderDataSlice } from "../../store/orderdata.slice";


export default function AddOrder() {
  const [loading, setLoading] = useState(false);
  const [deviceName, setDeviceName] = useState(""); // to redux
  const [devices, setDevices] = useState<string[]>([]);
  const [amount, setAmount] = useState<string | undefined>(); // to redux
  const dispatch = useDispatch();

  const input = useRef<HTMLInputElement>(null);

  const storedAuthToken = localStorage.getItem('authToken');

  async function fetchDevices() {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/v1/add",
      {
      headers: { 
        "Authorization": `Token ${storedAuthToken}` },
    }
    );
    const devices_list = await response.json();
    setDevices(devices_list["device_names"]);
    setLoading(false);
  }

  const handleAmount = () => {
    if (input.current !== null)
        setAmount(input.current.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const deviceData = { device_name: deviceName, device_need: amount };

    fetch("http://127.0.0.1:8000/api/v1/add/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${storedAuthToken}` },
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
          dispatch(replaceSlice.actions.removeReplace())
          dispatch(replaceSlice.actions.removeReplaceList())
          dispatch(replaceSlice.actions.stored({ replaces: data.comp_data }));
          dispatch(replaceSlice.actions.setReplaceComponent({replaceComponent: data.comp_to_replace}));
          dispatch(replaceSlice.actions.setNotEnough({isNotEnough: true}));
        } else if (data.status === 200) {
          dispatch(orderDataSlice.actions.addOrderData({orderdata: data.order_data}));
        }
        // Здесь вы можете обработать полученные данные
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Обработка ошибок
      });
  };


  function handleNothing() {
    console.log("Nope");
  }

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <>
    <h1 className="text-3xl mt-[2rem] ml-[2rem]">Добавить заказ</h1>
    <div className="flex w-[90%] ml-[2rem] mt-[2rem]">
        <div className=" w-1/2">
        <form onSubmit={handleSubmit}>
            {/* <div className="mb-1">
                <label className="">Select device</label>
            </div> */}

            {loading ? <p>Loading...</p> :
            <select
            id="device_name"
            className="control mb-3 shadow-lg"
            value={deviceName}
            onChange={(event) => setDeviceName(event.target.value)}
            >
            <option value="" disabled>
                Выберите устройство
            </option>
            {devices.map((device) => (
                <option key={device.toLowerCase()} value={device}>
                {device}
                </option>
            ))}
            </select>}
            <input
            type="number"
            className="control mb-3 shadow-lg"
            ref={input}
            placeholder="Выберите количество"
            onChange={handleAmount}
            />
            <div>
                <Button isActive={true} onClick={handleNothing}>
                    Submit
                </Button>
            </div>
        </form>
        <Replace />
        </div>
        <div className="">
            <OrderData />
        </div>
    </div>
    </>
  );
}
