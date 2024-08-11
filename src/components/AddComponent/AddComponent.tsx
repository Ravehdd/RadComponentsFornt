import Button from "../Button/Button";
// import { addDeviceSlice } from "../../store/addDevice.slice";
import { useAppdispatch, useAppSelector } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { addComponentSlice } from "../../store/addComponent.slice";
import classes from "./AddComponent.module.css";
import { apiBaseUrl } from "../../App";
// import { componentsSlice } from "../../store/components.slice";

export default function AddComponent() {
    const amount_input = useRef<HTMLInputElement>(null);
    const comp_input = useRef<HTMLInputElement>(null);

    const dispatch = useAppdispatch();

    const [compName, setCompName] = useState("")
    const [compAmount, setCompAmount] = useState<number >(0)
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const storedAuthToken = localStorage.getItem('authToken');

    const components = useAppSelector(addComponentSlice.selectors.selectComponents)
    console.log(components)

    const handleTable = () => {
        // e.preventDefault()
        fetch(apiBaseUrl + "update/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${storedAuthToken}`
         },
        body: JSON.stringify(components),
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




    const fetchCategories = async () => {
        const response = await fetch(apiBaseUrl + "update/", {
                headers: {
                    "Authorization": `Token ${storedAuthToken}`
                }
            });
        const data = await response.json();
        setCategories(data["categories"]);
        console.log(categories);
        // dispatch(componentsSlice.actions.stored({ components }));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCompSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const component = {
            comp_name: compName,
            amount_add: compAmount,
            category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
        }
        console.log(component);
        dispatch(addComponentSlice.actions.setComponent({component: component}));
    }

    const handleNothing = () => {
        console.log("Nope");
    }

    const handleAmount = () => {
        if (amount_input.current !== null)
            setCompAmount(Number(amount_input.current.value));
    };

    const handleComp = () => {
        if (comp_input.current !== null)
            setCompName(comp_input.current.value);
    }

    const handleCategory = (event: any) => {
        if (event.target.value !== "")
            setCategory(event.target.value)
    }

    return(
        <div className="flex ">
            <div className="flex w-[100%] mx-[2rem] mt-[1rem]">  
                <div>
                <h1 className="text-3xl  my-[1rem] ">Добавить компонент</h1>
                <form onSubmit={handleCompSubmit}>
                    <input
                    type="text"
                    className="control mb-3 shadow-lg"
                    ref={comp_input}
                    placeholder="Название компонента"
                    onChange={handleComp}
                    />
                    <input
                        type="number"
                        className="control mb-3 shadow-lg"
                        ref={amount_input}
                        placeholder="Выберите количество"
                        onChange={handleAmount}
                    />
                    <select
                        id="category"
                        className="control shadow-lg"
                        value={category}
                        onChange={(event) => handleCategory(event)}
                    >
                        <option value="" disabled >Выберите категорию</option>
                            {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                            {cat}
                        </option>
                    ))}
                    </select> 
                    <div className="mt-3">
                        <Button isActive={true} onClick={handleNothing}>
                            Submit
                        </Button>
                    </div>
                </form>
                </div>
            
                <div className="w-[50%] ml-[2rem] mt-[4.25rem]">
                    <form onSubmit={handleTable}>
                        <section className={classes.tableContainer}>
                            <table className="w-full shadow-lg`">
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
                                    >
                                    <td>{component.comp_name}</td>
                                    <td>{component.amount_add}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                        <div className="mt-[1rem]">
                            <Button isActive={true} onClick={handleNothing}>Download to database</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
)
}