import {
    BreedImages,
    FavoriteImages,
    RandomImages,
} from "./components/images_collection";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import { ContextProvider } from "./components/context";
import "./App.css";

function App() {
    return (
        <ContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<RandomImages />} />
                        <Route path="/favorite" element={<FavoriteImages />} />
                        <Route
                            path="breeds/:breed?"
                            element={<BreedImages />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ContextProvider>
    );
}

export default App;
