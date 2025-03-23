import { NavLink, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getUsers } from "../util/user_util";
import PopupButton from "./popupButton";
import { Context } from "./context";
import "./css/layout.css";

function Header() {
  const { user, users } = useContext(Context);

  return (
    <header className="header">
      <div><nav>
        <NavLink to="/" className="link">
          <button className="btn-cont">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Random</span>
          </button>
        </NavLink>
        <NavLink to="/favorite" className="link">
          <button className="btn-cont">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Favorites</span>
          </button>
        </NavLink>
        <NavLink to="/breeds/akita" className="link">
          <button className="btn-cont">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Breeds</span>
          </button>
        </NavLink>
      </nav>
      </div>
      <PopupButton/>
      <div className="user-name">{user ? users.find((user_obj) => user_obj._id == user)?.name : "guest"}</div>
    </header>
  );
}

function SideBar() {
  const [breedsNames, setBreedsNames] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("akita");

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((res) => res.json())
      .then((obj) => setBreedsNames(Object.keys(obj.message)));
  }, []);
  if (!breedsNames.length) {
    return <span>Loading...</span>;
  } else {
    return (
      <div className="side-bar">
        <h2 className="breeds-title">Breeds</h2>
        {breedsNames.map((breed, i) => (
          <NavLink
            to={"/breeds/" + breed}
            onClick={() => setSelectedBreed(breed)}
            key={i}
            className={
              breed == selectedBreed
                ? "breed-name-cont selected-breed"
                : "breed-name-cont"
            }
          >
            <div
              className={breed == selectedBreed ? "selected-border" : "border"}
            ></div>
            <div className="breed-name">{breed}</div>
          </NavLink>
        ))}
      </div>
    );
  }
}

export default function Layout() {
  return (
    <div className="cont">
      <SideBar />
      <Header />
      <Outlet />
    </div>
  );
}
