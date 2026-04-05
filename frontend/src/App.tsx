import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AuthInitializer } from "./components/AuthInitializer";


export default function App(){
  return (
    <>
    <AuthInitializer />
    <Routes>
      <Route path="/login" element= {<LoginPage />}/>
    </Routes>
    </>
  )
}