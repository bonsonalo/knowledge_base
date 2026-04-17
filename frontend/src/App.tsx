import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPages";
import { AuthInitializer } from "./components/AuthInitializer";
import { ArticlePage } from "./pages/ArticlePage";
import { ArticleDetail } from "./pages/ArticleDetail";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";


export default function App(){
  return (
    <>
    <AuthInitializer />
    <NavBar />
    <Routes>
      <Route path="/login" element= {<LoginPage />}/>
      <Route path="/signup" element= {<SignUpPage />} />
      <Route index path="/articles" element= {<ArticlePage />} />
      <Route path= "/:article_id" element= {<ArticleDetail />} />
    </Routes>
    < Footer />
    </>
  )
}