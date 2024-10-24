import React from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../context/Login/Login";
import ShowItem from "./ShowItem";
import ChangeItems from "./ChangeItems";
import { useLocation } from "react-router-dom";
function Manue() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [addCt, setAddCat] = useState(true);
  const { token, publicId, refresh, setSrefresh, showItems, setPublicId } =
    useContext(LoginContext);
  const [categories, setCategories] = useState([]);
  const [item, setCatchng] = useState([]);
  const [catC, setCatC] = useState(false);
  const location = useLocation();

  function handelShow() {
    setAddCat(true)
    setCatchng([]);
    setPublicId([]);
  }

  const allCato = async () => {
    if (!publicId.name) {
      try {
        const response = await axios.get(`${backendUrl}menu`, {
          headers: {
            token: `resApp ${token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      try {
        const response = await axios.get(
          `${backendUrl}menu/category/${publicId._id}`,
          {
            headers: {
              token: `resApp ${token}`,
            },
          }
        );

        return response.data.Menuitems;
      } catch (error) {
        if (error.message === "Request failed with status code 404") return [];
      }
    }
  };

  useEffect(() => {
    allCato().then((data) => {
      const cond = data.length;

      if ((data && Array.isArray(data.allMenu)) || (data && cond > 0)) {
        if (data.allMenu) setCategories(data.allMenu);
        if (data.length) setCategories(data);
      } else {
      }
    });
  }, [refresh, publicId,item]);

  return (
    <>
      <button
        className=" btn bg-orange-500 text-white  mx-auto py-2 rounded flex items-center justify-center mt-s"
        onClick={handelShow}
      >
        Show all
      </button>
      {addCt ? (
        <div className="container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-between items-center gap-[30px] w-[80%] h-fit m-auto relative
">
          {categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <ShowItem
                key={index}
                category={category}
                setShowCay={setAddCat}
                setCatchng={setCatchng}
              />
            ))
          ) : (
            <p>Loading</p>
          )}
          <div
            className="flex justify-center flex-col self-center text-center w-[100%] h-[90%] relative"
            onClick={() => setAddCat(false)}
          >
            <h2>
              <i className="fa-solid fa-plus text-[200px] self-center"></i>
            </h2>
          </div>
        </div>
      ) : (
        <ChangeItems
          setShowCay={setAddCat}
          catC={catC}
          item={item}
          setCatC={setCatC}
          setSrefresh={setSrefresh}
          refresh={refresh}
          setCatchng={setCatchng}
          publicId={publicId}
        />
      )}
    </>
  );
}

export default Manue;
