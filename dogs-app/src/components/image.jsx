import { isLiked, removeFromLiked, addToLiked } from "../util/liked_util";
import { useEffect, useState, useContext } from "react";
import { Context } from "./context";
import FavoriteImg from "./favoriteImage";

function Img({ src }) {
  const { favorites, addToFavorites, removeFromFavorites, user } = useContext(Context);

  const [favId, setFavId] = useState(undefined);

  useEffect(() => {
    setFavId(favorites.find((favorite) => favorite.imgSrc == src)?._id)
  }, [src, favorites]);

  const handleLike = () => {
    if (!user) {
      return;
    }
    if (favId) {
      removeFromFavorites(favId);
    } else {
      addToFavorites(src);
    }
  };

  return (
    <div className="image-cont" onDoubleClick={handleLike}>
      <img className="dog" src={src} alt="dog" />
      <div className="like" onClick={handleLike}>
        {favId ? "❤️" : "🤍"}
      </div>
    </div>
  );
}

export default Img;

