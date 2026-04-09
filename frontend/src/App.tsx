import { Route, Routes } from "react-router-dom";
// import { LoginPage } from "./pages/LoginPage";
import { AuthInitializer } from "./components/AuthInitializer";
import { ArticlePage } from "./pages/ArticlePage";


export default function App(){
  return (
    <>
    <AuthInitializer />
    <Routes>
      {/* <Route path="/login" element= {<LoginPage />}/> */}
      <Route path="/" element= {<ArticlePage />} />
    </Routes>
    </>
  )
}