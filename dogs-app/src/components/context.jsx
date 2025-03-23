import { createContext, useEffect, useState } from "react";
import {
    deleteFavorite,
    deleteUser,
    getAllUsers,
    newFavorite,
    newUser,
    updateFavoriteName,
    updateUserProfile,
    userFavorites,
} from "../util/api";

export const Context = createContext();

export function ContextProvider(props) {
    // states
    const [user, setUser] = useState(""); // user._id
    const [favorites, setFavorites] = useState([]);
    const [users, setUsers] = useState([]);

    // handle favorites
    const updateFavorites = () =>
        user && userFavorites(user).then(setFavorites);
    useEffect(() => {
        updateFavorites();
    }, [user]);
    const addToFavorites = (imgSrc) =>
        newFavorite(user, imgSrc).then(updateFavorites);
    const removeFromFavorites = (favId) =>
        deleteFavorite(user, favId).then(updateFavorites);
    const changeFavoriteName = (favId, name) => 
        updateFavoriteName(user, favId, name).then(updateFavorites);
   

    // handle users
    const updateUsers = () => getAllUsers().then(setUsers);
    useEffect(() => {
        updateUsers();
    }, []);
    const addUser = (name) => newUser(name).then(updateUsers);
    const removeUser = (id) => deleteUser(id).then(updateUsers);

    const changeProfilePic = (favId) => 
        updateUserProfile(user, favId).then(updateUsers)

    const value = {
        user,
        setUser,
        favorites,
        addToFavorites,
        changeProfilePic,
        changeFavoriteName,
        removeFromFavorites,
        users,
        addUser,
        removeUser,
    };


    return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
