import { getFavoriteImages } from "../util/liked_util";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Img from "./image";
import './css/images_collection.css'
import { Context } from "./context";
import FavoriteImg from "./favoriteImage";

function ImageCollection({arr, err}){

  if (!arr) {
    return <span>{err || 'Loading...'}</span>
  }
  return (
    <div className='dogs'>
      <div className='col'>
        {arr.filter((_, i) => i % 4 == 0).map((img, i) => <Img src={img} key={i}/>)}
      </div>
      <div className='col'>
        {arr.filter((_, i) => i % 4 == 1).map((img, i) => <Img src={img} key={i}/>)}
      </div>
      <div className='col'>
        {arr.filter((_, i) => i % 4 == 2).map((img, i) => <Img src={img} key={i}/>)}
      </div>
      <div className='col'>
        {arr.filter((_, i) => i % 4 == 3).map((img, i) => <Img src={img} key={i}/>)}
      </div>
    </div>
)};

export function FavoriteImages() {
  const { favorites} = useContext(Context);
  return  <div className='dogs'>
  <div className='col'>
    {favorites.filter((_, i) => i % 4 == 0).map((img, i) => <FavoriteImg src={img.imgSrc} key={i}/>)}
  </div>
  <div className='col'>
    {favorites.filter((_, i) => i % 4 == 1).map((img, i) => <FavoriteImg src={img.imgSrc} key={i}/>)}
  </div>
  <div className='col'>
    {favorites.filter((_, i) => i % 4 == 2).map((img, i) => <FavoriteImg src={img.imgSrc} key={i}/>)}
  </div>
  <div className='col'>
    {favorites.filter((_, i) => i % 4 == 3).map((img, i) => <FavoriteImg src={img.imgSrc} key={i}/>)}
  </div>
</div>;
}

export function RandomImages() {
  const [imagesUrl, setImagesUrl] = useState([]);
  useEffect(() => {
    fetch(`https://dog.ceo/api/breeds/image/random/50`)
      .then((res) => res.json())
      .then((obj) => setImagesUrl(obj.message));
  }, []);
  return <ImageCollection arr={imagesUrl} />;
}

export function BreedImages() {
  const { breed } = useParams();
  const [imagesUrl, setImagesUrl] = useState([]);
  const [err, setErr] = useState();

  useEffect(() => {
    setErr();
    fetch(`https://dog.ceo/api/breed/${breed}/images`)
      .then((res) => res.json())
      .then((obj) => {
        if (obj.status == "success") {
          setImagesUrl(obj.message);
        } else {
          setImagesUrl();
          setErr(obj.message);
        }
      });
  }, [breed]);
  return <ImageCollection arr={imagesUrl} err={err} />;
}