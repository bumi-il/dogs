import { useEffect, useState, useContext } from "react";
import { Context } from "./context";

function FavoriteImg({ src }) {
  const { favorites, removeFromFavorites, user, changeFavoriteName, changeProfilePic } = useContext(Context);

  const [favId, setFavId] = useState(undefined);
  const [editMod, setEditMod] = useState(false);
  const [favoriteName, setFavoriteName] = useState("");

  useEffect(() => {
    setFavId(favorites.find((favorite) => favorite.imgSrc == src)?._id)
  }, [src, favorites]);

  const handleLike = () => {
    removeFromFavorites(src);
  };

  return (
    <div className="image-cont" onDoubleClick={handleLike}>
      <img className="dog" src={src} alt="dog" />
      <div className="info">
        <div className="like" onClick={handleLike}>
            ❤️
        </div>
        <div onClick={() => editMod || setEditMod((prev) => !prev)}>
            {editMod ? (
                <>
                    <input onChange={(e) => setFavoriteName(e.target.value)}/>
                    <button onClick={() => {
                        changeFavoriteName(user, favId, favoriteName)
                        setEditMod((prev) => !prev)
                    }}>Save</button>
                </> )
                    : (
                favorites.find((favorite_obj) => favorite_obj._id == favId)?.name) || "name"}
        </div>
        <button onClick={() => changeProfilePic(favId)}>Make Profile</button>
      </div>
    </div>
  );
}

export default FavoriteImg;
