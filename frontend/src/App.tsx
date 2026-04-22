import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPages";
import { AuthInitializer } from "./components/AuthInitializer";
import { ArticlePage } from "./pages/ArticlePage";
import { ArticleDetail } from "./pages/ArticleDetail";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { MyArticles } from "./pages/MyArticles";
import { DashboardLayout } from "./components/DashboardLayout";
import { Notifications } from "./pages/Notifications";
import { CreateArticle } from "./pages/CreateArticle";
import { EditArticle } from "./pages/EditArticle";
import { Profile } from "./pages/Profile";


export default function App(){
  return (
    <>
    <AuthInitializer />
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/login" element= {<LoginPage />}/>
          <Route path="/signup" element= {<SignUpPage />} />
          <Route path="/" element= {<ArticlePage />} />
          <Route path="/dashboard" element= {< DashboardLayout />}>
            <Route index element= {<MyArticles />} />
            <Route path="notifications" element= {<Notifications />} />
            <Route path="create" element= {<CreateArticle />} />
            <Route path="edit/:article_id" element= {<EditArticle />} />
          </Route>
          <Route path="/profile" element= {<Profile />} />
          <Route path= "/:article_id" element= {<ArticleDetail />} />
        </Routes>
      </div>
      < Footer />
    </div>
    </>
  )
}