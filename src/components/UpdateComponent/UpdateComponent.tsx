import { useRef } from "react"
import Button from "../Button/Button"
import { useAppSelector } from "../../store/store";
import { updateComponentSlice } from "../../store/updateComponent.slice";

export default function UpdateComponent() {

    const input = useRef<HTMLInputElement>(null)
    const component = useAppSelector(updateComponentSlice.selectors.selectComponent)


    const submitHandler = () => {
        // event.preventDefault()
        const comp_data = {comp_name: component, amount_add: Number(input.current?.value)}
        console.log(comp_data)
        fetch("http://127.0.0.1:8000/api/v1/add-comp-amount/", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('authToken')}` 
         },
        body: JSON.stringify(comp_data),
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
    

    const handleNothing = () => {
        console.log("Nope")
    }

    return (
        <form onSubmit={submitHandler}>
            <input
            type="number"
            className="control mb-3"
            ref={input}
            placeholder="Колличество"
            />

            <Button isActive={true} onClick={handleNothing}>Submit</Button>
        </form>

    )


}