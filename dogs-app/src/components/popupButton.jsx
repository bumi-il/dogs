import { useContext, useEffect, useState } from "react";
import "./css/popupButton.css";
import profile from '../assets/profile.jpg'
import { Context } from "./context";

export default function PopupButton() {
  const [open, setOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const { users, user, setUser } = useContext(Context);

  useEffect(() => {
    setProfilePic(users.find((user_obj) => user_obj._id == user)?.profilePic)
  }, [user]);

  return (
    <div className="popup-cont">
      <div onClick={() => setOpen((prev) => !prev)} className="popup-btn">
        <img src={profilePic || profile} className="popup-img"/>
      </div>
      {open && (
        <div className="popup-window">
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="popup-closer"
          >
            ✖️
          </div>
          <div>
            <img src={profile} className="profile-img" />
          </div>
          <h3>Hello {user ? users.find((user_obj) => user_obj._id == user)?.name : "guest"}</h3>
          {users.map((user, i) => (
              <div key={i} onClick={() => {
                setOpen((prev) => !prev)
                setUser(user._id)
              }}
              className="popup-user">{user.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
      
