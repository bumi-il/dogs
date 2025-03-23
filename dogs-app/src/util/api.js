const BASE_URL = "http://localhost:3000/api";

function APICall(url, method, body) {
    const options = { method };
    if (body) {
        options.body = JSON.stringify(body);
        options.headers = { "Content-Type": "application/json" };
    }
    return fetch(BASE_URL + url, options)
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                return res.data;
            } else {
                throw new Error(res.error);
            }
        });
}

export const newUser = (name) => APICall("/user", "POST", { name });

export const getAllUsers = () => APICall("/user", "GET");

export const getUserById = (id) => APICall("/user/" + id, "GET");

export const updateUserName = (id, name) =>
    APICall("/user/" + id + "/name", "PATCH", { name });

export const updateUserProfile = (id, profilePic) =>
    APICall("/user/" + id + "/profile", "PATCH", { profilePic });

export const deleteUser = (id) => APICall("/user/" + id, "DELETE");

export const userFavorites = (id, queries) => {
    let query = "";
    if (queries) {
        query =
            "?" +
            Object.entries(queries)
                .map((entry) => entry.join("="))
                .join("&");
    }
    return APICall("/user/" + id + "/favorite" + query, "GET");
};

export const newFavorite = (id, imgSrc) =>
    APICall("/user/" + id + "/favorite", "POST", { imgSrc });

export const updateFavoriteName = (id, favId, name) =>
    APICall("/user/" + id + "/favorite/" + favId + "/name", "PATCH", { name });

export const deleteFavorite = (id, favId) =>
    APICall("/user/" + id + "/favorite/" + favId, "DELETE");
