import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Component, componentsSlice } from "../../store/components.slice";
import { useAppSelector } from "../../store/store";
import classes from "./MainTable.module.css"
import Modal from "../Modal/Modal";
import { ModalContext } from "../../context/ModalContext";
import UpdateComponent from "../UpdateComponent/UpdateComponent";
import { updateComponentSlice } from "../../store/updateComponent.slice";


// const selectCounter = (state: AppState, counterId: CounterId) => state.counters[counterId]?.counter ?? 0

export function MainTable() {
    const dispatch = useDispatch();
    const [category, setCategory] = useState("all");
    const {modal, open: openModal, close: closeModal} = useContext(ModalContext)
    const component = useAppSelector(updateComponentSlice.selectors.selectComponent)
    // const auth_token = useAppSelector(authenticationSlice.selectors.selectAuthorizationToken)
    // const isAuthenticated = useAppSelector(authenticationSlice.selectors.selectIsAuthenticated)
    const storedAuthToken = localStorage.getItem('authToken');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated')

    const handleChange = (event: any) => {
      setCategory(event.target.value)
    }


    useEffect(() => {
        const fetchComponents = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/v1/complist", {
                headers: {
                    "Authorization": `Token ${storedAuthToken}`
                }
            });
            const components: Component[] = await response.json();
            dispatch(componentsSlice.actions.stored({ components }));
        };

        fetchComponents();
    }, [dispatch]);

    const selectComponents = useAppSelector(componentsSlice.selectors.selectAllComponents)
    // console.log("selectComponents", selectComponents)

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
      <div className="flex width-full justify-center">
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

        <div className="flex w-full justify-center">
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
                .map((component: Component) => (
                  <tr
                    key={component.comp_id}
                    className={component.amount < 20 ? classes.red : component.amount < 50 ? classes.yellow : ""}
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