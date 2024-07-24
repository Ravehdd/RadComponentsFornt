import { useDispatch } from "react-redux";
import { replaceSlice } from "../../store/replace.slice";
import { useAppSelector } from "../../store/store";
import Button from "../Button/Button";
import { orderDataSlice } from "../../store/orderdata.slice";


// let replaceList: any [] = [];
export default function Replace() {
    const dispatch = useDispatch();
    const isNotEnough = useAppSelector(replaceSlice.selectors.selectNotEnough);
    const replaceComponent = useAppSelector(replaceSlice.selectors.selectReplaceComponent);
    const components = useAppSelector(replaceSlice.selectors.selectAllReplaces); 
    const forReplaceComponent = useAppSelector(replaceSlice.selectors.selectForReplaceComponent);
    const replaceList = useAppSelector(replaceSlice.selectors.selectReplaceList);

    console.log("replaceList", replaceList);
    const handleSubmitReplace = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const componentForReplace = { replacement_choice: forReplaceComponent };
        dispatch(replaceSlice.actions.setReplaceList({replaceObject: {"replaceComponent": replaceComponent, "forReplaceComponent": forReplaceComponent}}));
        // replaceList.push({"replaceComponent": replaceComponent, "forReplaceComponent": forReplaceComponent})
        // console.log("replaceList", replaceList[0]);
        dispatch(replaceSlice.actions.setNotEnough({isNotEnough: false}));

        fetch("http://127.0.0.1:8000/api/v1/replace/", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('authToken')}`,},
        body: JSON.stringify(componentForReplace),
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
            }
            return response.json(); // Получаем ответ сервера в формате JSON
        })
        .then((data) => {
            if (data.status === 400) {
                dispatch(replaceSlice.actions.setNotEnough({isNotEnough: true}));
                dispatch(replaceSlice.actions.removeReplace())
                dispatch(replaceSlice.actions.stored({ replaces: data.comp_data }));
                dispatch(replaceSlice.actions.setReplaceComponent({replaceComponent: data.comp_to_replace}));
            } else if (data.status === 200) {
               dispatch(orderDataSlice.actions.addOrderData({orderdata: data.order_data}));
            }
            console.log(data);
            // Здесь вы можете обработать полученные данные
        })
        .catch((error) => {
            console.error("There was an error!", error);
            // Обработка ошибок
            })
    }

    function handleNothing() {
        console.log("Nope");
    }
    


    return (
        <>
            {replaceList.length > 0 ?
                replaceList.map(replaceObject => 
                (<div className="mt-10" key={replaceObject.replaceComponent}>
                    <h1 className="font-bold">Component {replaceObject.replaceComponent} was replaced with component {replaceObject.forReplaceComponent}.</h1>
                </div>)
                )
            : null}
            {isNotEnough ? (
            <form className="mt-10" onSubmit={handleSubmitReplace}>

            <div className="mb-1">
                <label>Replace not enough component: {replaceComponent}</label>
            </div>

            <select
                id="replaceComponent"
                className="control mb-3"
                value={forReplaceComponent}
                onChange={(event) => dispatch(replaceSlice.actions.setForReplaceComponent({forReplaceComponent: event.target.value}))}
            >
                <option value="">
                Выберите компонент на замену
                </option>
                {Object.values(components).map((component) => (
                <option key={component.id} value={component.comp_name}>
                    {component.comp_name + " - in stock: " + component.in_stock + " pcs"}
                </option>
                ))}
                </select>
                <div>   
                    <Button isActive={true} onClick={handleNothing}>
                        Submit
                    </Button>
                </div>
            </form>
      ) : null}
        </>
    )
}