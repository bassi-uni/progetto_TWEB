//the pages must lazy load
import {Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";

import Loading from "./components/animations/Loading";
import Gallery from "./pages/gallery/Gallery";
import Background from "./components/Background";
import {ROUTES} from "./constants/constants";
import PlayerSmartGallery from "./pages/gallery/PlayerSmartGallery";
import {TeamSmartGallery} from "./pages/gallery/TeamSmartGallery";
import ProtectedRoute from "./auth/ProtectedRoute";
import {PlayerInfoPage} from "./pages/playerinfo/PlayerInfoPage";

const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const Chat = lazy(() => import("./pages/chat/Chat"));

function App() {

  return (
    <>
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path={ROUTES.AUTH} element={<AuthPage />}/>
                <Route path={ROUTES.GALLERY} element={<Gallery />}>
                    <Route path="players" element={<PlayerSmartGallery />} />
                    <Route path="clubs" element={<TeamSmartGallery />} />
                </Route>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.CHAT} element={<ProtectedRoute>
                    <Chat />
                </ProtectedRoute>} />
                <Route path={ROUTES.PLAYER_INFO} element={<PlayerInfoPage />}/>
                <Route path={ROUTES.DEFAULT} element={<h1 style={{color:"white"}}>Not Found</h1>} />
            </Routes>
        </Suspense>
    </>
  );
}

export default App;
