import { useContext, useEffect, useState } from 'react';
import { apiBaseUrl } from '../../App';
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import { devicesSpecsSlice } from '../../store/devicesSepcs.slice';
import classes from "./DeviceSpecs.module.css"
import { ModalContext } from '../../context/ModalContext';
import Modal from '../Modal/Modal';
import { componentsSlice } from '../../store/components.slice';
import Button from '../Button/Button';

const storedAuthToken = localStorage.getItem("authToken");


const DevicesSpecs = () => {
    const [loading, setLoading] = useState(false);
    const [isOpenId, setIsOpenId] = useState<number | undefined>(undefined);
    const [isNewField, setIsNewField] = useState(false);
    const [newComonent, setNewComponent] = useState<string | undefined>();
    const [amount, setAmount] = useState<number | undefined>();
    const dispatch = useDispatch();
    const specs = useAppSelector(devicesSpecsSlice.selectors.selectDevicesSpecs);
    const {modal, open: openModal, close: closeModal} = useContext(ModalContext)
    const updateDevice = useAppSelector(devicesSpecsSlice.selectors.selectSelectedDevice);
    const a = ". "
    const components = useAppSelector(componentsSlice.selectors.selectAllComponents);
    // let foundDevice = {}

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
    console.log(updateDevice);
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


    const handleUpdateClick = (device_id: number) => {
        openModal()
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Добавляет плавное прокручивание
        });
        const foundDevice = Object.values(specs).find(spec => spec.device_id === device_id);
        if (foundDevice) {
            dispatch(devicesSpecsSlice.actions.selectDevice({device: foundDevice}));
        }
        // console.log(foundDevice)
    }

    const handleDelete = (comp_id: number) => {
        dispatch(devicesSpecsSlice.actions.removeComponent({comp_id: comp_id}));
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newComp = Object.values(components).find(comp => comp.comp_name === newComonent)
        const newCompData = {
            comp_id: newComp!.comp_id,
            comp_name: newComp!.comp_name,
            amount_need: amount
        }
        dispatch(devicesSpecsSlice.actions.addComponnent({component: newCompData}));
        setIsNewField(false);

        // dispatch(devicesSpecsSlice.actions.addComponnent)
        // console.log(newCompData, amount)

    }

    const handleUpdateForm = async () => {
        // e.preventDefault();
        if (updateDevice) {
        fetch(apiBaseUrl + "add-new-device/", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${storedAuthToken}` },
        body: JSON.stringify(updateDevice),
        })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json(); // Получаем ответ сервера в формате JSON
      })
      .then((data) => {
        if (data.status === 400) {
          console.log(data.response);
        } else if (data.status === 200) {

        }
        // Здесь вы можете обработать полученные данные
      })
      .catch((error) => {
        console.error("There was an error!", error);
        // Обработка ошибок
      });
  };

    }

    const handleNothing = () => {
        console.log("Nope")
    }


    const handleAmount = (comp_id: number, comp_name: string, amount_need: number) => {
        const component = {
            comp_id: comp_id,
            comp_name: comp_name,
            amount_need: amount_need
        }
        dispatch(devicesSpecsSlice.actions.updateComponent({component: component}));

    }

    
    
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
                        <div id={spec.device_id.toString()} key={spec.device_id} className={isOpenId?.toString() === spec.device_id.toString() ? classes.openContent : classes.contentContainer} onClick={() => handleClick(spec.device_id)}>
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
                                <div className={classes.fullInfo} onClick={() => handleUpdateClick(spec.device_id)}>
                                    <div>
                                    <h1 className=" text-lg">Компоненты</h1>
                                    {spec.comp_data.map((comp) => (
                                        <p key={comp.comp_id} className="flex mb-2"><p className="font-bold">{comp.comp_name}</p> <p>{a.repeat(30 - (comp.comp_name).length)}</p> {comp.amount_need} шт.</p>
                                    ))}
                                    </div>
                                  
                                </div>
                        }
                    </>
                ))
            }
            </div>
            {modal &&
              <Modal text={<div className='flex justify-between items-center'>
                            <p className='font-bold'>{updateDevice?.device_name}</p>
                            
                            </div>} 
                            onClick={closeModal}>
                  <div className='w-full'>
                    <form action="" onSubmit={handleUpdateForm}>
                        <div className='flex '>
                        <button className='m-0 p-0 max-h-[42px] w-[100%] mb-4 shadow-lg'>
                                    <div className={classes.btn} onClick={() => setIsNewField(true)}>
                                     Submit
                        </div>
                                </button>
                    </div>      
                    {updateDevice?.comp_data.map((comp) => (
                        
                            <div key={comp.comp_id} className='flex mb-4 items-center w-[100%]'>
                                <p className='min-w-[50%] font-bold'>{comp.comp_name}</p>
                                {/* <input type="text" id={comp.comp_id.toString()} defaultValue={comp.comp_name} className='control shadow-lg'/> */}
                                <input type="number" id={comp.comp_id.toString()} defaultValue={comp.amount_need} className='control ml-2 shadow-lg ' onChange={(e) => handleAmount( comp.comp_id, comp.comp_name, +e.target.value)}/>
                                <img src="/Cross.svg" alt="cross.svg" className='max-h-[42px] max-w-[42px] ml-2 shadow-lg' onClick={() => handleDelete(comp.comp_id)}/>
                                
                            </div>
                    ))
                    
                    } 
                    
                    </form>
                    
                    {isNewField &&
                        <form action="" onSubmit={handleForm}>
                        <div className='flex  w-[100%]'>
                                <select
                                    id="device_name"
                                    className="control mb-4 shadow-lg w-[50%]"
                                    value={newComonent}
                                    onChange={(event) => setNewComponent(event.target.value)}
                                    >
                                    <option value="" >
                                        Выберите компонент
                                    </option>
                                    {Object.values(components).map((component) => (
                                        <option key={component.comp_id} value={component.comp_name}>
                                        {component.comp_name}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" className='control mb-4 ml-2 shadow-lg ' onChange={(e) => setAmount(+e.target.value)}/>
                                <button className='m-0 p-0 max-h-[42px] max-w-[42px] ml-2'>
                                    <img src="/SubmitCross.svg" alt="cross.svg" className='max-h-[42px] max-w-[42px] ' />
                                </button>

                        </div>
                            </form>
                        }
                    <div className='flex '>
                        <div className={classes.btn} onClick={() => setIsNewField(true)}>
                            <img src="/WhiteCross.svg" alt="" />
                        </div>
                    </div>
                    {/* <img src="/AddCross.svg" alt="AddCross.svg" className='shadow-lg w-100' onClick={() => setIsNewField(true)}/> */}
                    
                    
                  </div>
              </Modal>}
        </div>
        )}
        </>
    );
};

export default DevicesSpecs;