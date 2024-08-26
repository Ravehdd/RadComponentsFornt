import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Component, componentsSlice} from "../../store/components.slice";
import { useAppSelector } from "../../store/store";
import classes from "./MainTable.module.css"
import Modal from "../Modal/Modal";
import { ModalContext } from "../../context/ModalContext";
import UpdateComponent from "../UpdateComponent/UpdateComponent";
import { updateComponentSlice } from "../../store/updateComponent.slice";
import { apiBaseUrl } from "../../App";
// import { devicesSpecsSlice } from "../../store/devicesSepcs.slice";


// const selectCounter = (state: AppState, counterId: CounterId) => state.counters[counterId]?.counter ?? 0

export function MainTable() {
    const dispatch = useDispatch();
    const [category, setCategory] = useState("all");
    const {modal, open: openModal, close: closeModal} = useContext(ModalContext)
    const component = useAppSelector(updateComponentSlice.selectors.selectComponent)
    // const selectedDevice = useAppSelector(devicesSpecsSlice.selectors.selectSelectedDevice) // selectedDevice
    // const auth_token = useAppSelector(authenticationSlice.selectors.selectAuthorizationToken)
    // const isAuthenticated = useAppSelector(authenticationSlice.selectors.selectIsAuthenticated)
    const storedAuthToken = localStorage.getItem('authToken');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated')
    // console.log(stor)

    const handleChange = (event: any) => {
      setCategory(event.target.value)
    }


    useEffect(() => {
        const fetchComponents = async () => {
            const response_comp = await fetch(apiBaseUrl +"complist/", {
                headers: {
                    "Authorization": `Token ${storedAuthToken}`
                }
            });
            // const response_cons = await fetch(apiBaseUrl +"consumlist/", {
            //     headers: {
            //         "Authorization": `Token ${storedAuthToken}`
            //     }
            // });
            
            const components: Component[] = await response_comp.json();
           
            // const consumables: Consumables[] =[];
            
            // const consumables: Consumables[] = await response_cons.json();
            // const consumables: Consumables[] = resp["consumables"];
            console.log("components", components)
            // dispatch(consumablesSlice.actions.stored({ consumables }));
            dispatch(componentsSlice.actions.stored({ components }));
            
        };

        fetchComponents();
    }, [dispatch]);

    const selectComponents = useAppSelector(componentsSlice.selectors.selectAllComponents)
    // const selectConsumables = useAppSelector(consumablesSlice.selectors.selectAllConsumables)
    console.log("selectComponents", selectComponents)

    const uniqueCats = Array.from(
    new Set(Object.values(selectComponents).map((component) => component.category_name)));

    let filteredComponents = Object.values(selectComponents)
    if (category !== "all") {
      filteredComponents = Object.values(selectComponents)
              .filter((component) =>
                category
                  .toLowerCase()
                  .includes(component.category_name.toLowerCase())
              )
        
    }

    const handleClick = (comp_name: string) => {
        dispatch(updateComponentSlice.actions.setComponent({component: comp_name}))
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Добавляет плавное прокручивание
  });
        openModal()
    }

    return (

      <>
      {storedIsAuthenticated === "false" ? null : 
      <>
      <h1 className="text-3xl mt-[2rem] ml-[2rem]">Список компонентов</h1>
      <div className="flex width-full ml-[2rem]">
        <div className="width-[60%] min-w-[60%] flex items-center mt-[1rem]">
        {/* <Filter /> */}
          <label className="" >Select category</label>
          <select
            id="category"
            className="control shadow-lg"
            value={category}
            onChange={(event) => handleChange(event)}
          >
            <option value={"all"}>Все компоненты</option>
            {uniqueCats.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>  
        </div>
      </div>

        <div className="flex w-60% max-w-60% ml-[2rem]">
          <section className={classes.mainTableContainer}>
          <table className="w-full shadow-lg">
            <thead>
              <tr>
                <th>Название</th>
                <th>Колличество на складе</th>
                <th>Категория</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(filteredComponents)
                // .filter((component) =>
                //   category
                //     .toLowerCase()
                //     .includes(component.category_name.toLowerCase())
                // )
                .map((component: Component) => (component.category_name != "Расходники" &&
                  <tr
                    key={component.comp_id}
                    className={component.amount < 30 ? classes.red : component.amount < 60 ? classes.yellow : ""}
                    onClick={() => handleClick(component.comp_name)}
                  >
                    <td>{component.comp_name}</td>
                    <td>{component.amount}</td>
                    <td>{component.category_name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section className={classes.consTableContainer}>
          <table className="w-full shadow-lg">
            <thead>
              <tr>
                <th>Название</th>
                {/* <th>Колличество на складе</th>
                <th>Категория</th> */}
              </tr>
            </thead>
            <tbody>
              {Object.values(selectComponents)
                // .filter((component) =>
                //   category
                //     .toLowerCase()
                //     .includes(component.category_name.toLowerCase())
                // )
                .map((consume: Component) => (consume.category_name === "Расходники" &&
                  <tr
                    key={consume.comp_id}
                    // className={consume.amount < 20 ? classes.red : consume.amount < 50 ? classes.yellow : ""}
                    // onClick={() => handleClick(consume.comp_name)}
                  >
                    <td>{consume.comp_name}</td>
                    {/* <td>{consume.amount}</td>
                    <td>{consume.category_name}</td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        </div>

        {modal &&
          <Modal text={"Добавить компонент " + component} onClick={closeModal}>
              <UpdateComponent />
          </Modal>}
      
      </>
      }
      </>
    )
}

// function getComponents() {
//   const selectComponents = useAppSelector(componentsSlice.selectors.selectAllComponents)
//   return selectComponents

// }

// function Filter() {
//     const components = getComponents()
//     const [category, setCategory] = useState("all")

//     const dispatch = useAppdispatch()

//     const uniqueCats = Array.from(
//     new Set(Object.values(components).map((component) => component.category_name)));

//     const handleChange = (event: any) => {
//       setCategory(event.target.value)
//       dispatch(componentsSlice.actions.selectByCategory({category}))
      
//     }
//     const filteredComponents = useAppSelector(componentsSlice.selectors.selectByCategory)
//     console.log("filteredComponents", filteredComponents)
//     const selectedCategory = useAppSelector(componentsSlice.selectors.selectedCategory)
//     console.log("selectedCategory", selectedCategory)
//     return (
//         <div className="mt-20">
//         <label style={{ marginBottom: "1rem" }}>Select category</label>
//         <select
//           id="category"
//           className="control"
//           value={category}
//           onChange={(event) => handleChange(event)}
//         >
//           <option value={uniqueCats.join(" ")}>Все компоненты</option>
//           {uniqueCats.map((cat) => (
//             <option key={cat} value={cat.toLowerCase()}>
//               {cat}
//             </option>
//           ))}
//         </select>  
//         </div>
//     )
// }