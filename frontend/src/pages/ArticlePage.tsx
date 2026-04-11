import { Loader, SlidersHorizontal } from 'lucide-react';
import { NavBar } from "../components/NavBar"
import { ArticleCard } from '../components/ArticleCard';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Article } from '../types';
import { SideBar } from '../components/SideBar';
import { X } from 'lucide-react';
import { Footer } from '../components/Footer';
import heroImage from './../../assets/knowlegde_final.jpg'

export function ArticlePage() {

    const [articles, setArticles]= useState<Article[]>([])
    const [search, setSearch]= useState("");
    const [category, setCategory]= useState("");
    const [sortBy, setSortBy]= useState("created_at");
    const [order, setOrder]= useState("asc");
    const [error, setError]= useState("");
    const [loading, setLoading]= useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    useEffect(() => {

            const fetchedArticle= async () => {
                setLoading(true);
                try{
                    const response= await api.get("/api/v1/article/all_articles", {
                        params: { 
                            ...(debouncedSearch && {title: debouncedSearch, author_name: debouncedSearch }),
                            ...(category && {category}),
                            sort_by: sortBy, 
                            order
                        }
                    });
                    setArticles(response.data);
                    setLoading(false);
                }
                catch (error) {
                    setLoading(false)
                    setError("Failed to fetch articles");
                }
            }
            fetchedArticle();


    }, [debouncedSearch, category, sortBy, order])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])



    return (
        <div style={{backgroundColor: "#FFFFFF"}} className='flex flex-col min-h-screen mx-auto overflow-x-hidden'>
            <NavBar />
            <div style={{backgroundColor: "#F0F7FF", position: "relative"}} className='py-20 w-screen'>
                <div className='flex lg:grid lg:grid-cols-2 lg:gap-30 mx-auto w-11/12 lg:w-10/12'>
                    <div className='flex flex-col justify-start'>
                        <div className='px-2 w-fit rounded-3xl border text-center block mx-auto text-sm lg:mx-0 lg:text-start font-bold' 
                            style={{color: "#3899FA", backgroundColor: "#E7F2FF", borderColor: "#C4E1FE"}}>
                            Knowledge Base Platform
                        </div>
                        <div className=' py-4 font-bold text-4xl text-center lg:text-start'>
                            Unlock the Collective <span style={{color: "#3899FA"}}>Intelligence</span> of Your Team
                        </div>
                        <div className='text-lg text-center lg:text-start mb-8' style={{color: "#4f545e", fontWeight: "400"}}>
                            Explore deep-dives, engineering post-mortems, and design patterns from the industry's leading contributors.
                        </div>
                        <div className='grid grid-cols-[1fr_3fr] md:grid-cols-[2fr_1fr] gap-3 mb-9'>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Search articles..." 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='px-2 w-52 h-10 md:w-full'
                                    style={{ borderRadius: "10px", backgroundColor: "#fff"}}
                                    />
                            </div>
                            <div style={{color: "#fff", backgroundColor: "#3899FA"}} className='p-1 text-base lg:px-1 rounded-xl items-center justify-center flex'>
                                Browse
                            </div>
                        </div>
                        <div className='flex justify-between w-full md:w-7/12'>
                            <div>
                                <div className='text-3xl font-bold'>2.4k+</div>
                                <div className='text-sm opacity-70'  style={{color: "#5A5F68"}}>ARTICLES</div>
                            </div>
                            <div  style={{borderRight: ".4px solid #5A5F68"}}></div>
                            <div>
                                <div className='text-3xl font-bold'>120</div>
                                <div className='text-sm opacity-70' style={{color: "#5A5F68"}}>AUTHORS</div>
                            </div>
                            <div  style={{borderRight: ".4px solid #5A5F68"}}></div>
                            <div>
                                <div className='text-3xl font-bold flex justify-center'>16</div>
                                <div className='text-sm opacity-70'  style={{color: "#5A5F68"}}>CATEGORIES</div>
                            </div>
                        </div>
                    </div>
                    <div className='relative hidden lg:block'>
                        <div className=''>
                            <img src={heroImage} alt="Knowledge base image" className='rounded-3xl w-full h-full object-cover'/>
                        </div>
                        <div className='absolute bottom-20 lg:bottom-8 left-10' style={{color: "#fff"}}>
                            <div className='opacity-70 font-semibold' style={{fontSize: "15px"}}>
                                Featured Today
                            </div>
                            <div className='text-2xl font-bold'>
                                Scaling Distributed Systems at Velocity
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && <Loader /> }
            <div className='flex justify-end gap-4 mr-4 mt-6 items-center md:w-11/12 lg:w-10/12 md:mx-auto'>
                <div className='flex text-xl items-center'>
                    <div className='flex gap-4'> 
                        <div className='text-lg flex item-center hidden lg:block'>Sort by: </div>
                        <select onChange={(e) => setSortBy(e.target.value)}>
                            <option className='text-sms' value="created_at">date</option>
                            <option className='text-sm' value="title">title</option>
                        </select>
                    </div>
                    <select onChange={(e) => setOrder(e.target.value)}>
                        <option className='text-sm' value="asc">asc</option>
                        <option className='text-sm' value="desc">desc</option>
                    </select>
                </div>
                <div className='flex items-center md:hidden lg:hidden'>
                    {isFilterOpen? < X onClick={() => setIsFilterOpen(false)}/> : <button className='' onClick={() => setIsFilterOpen(true)}><SlidersHorizontal /></button>}
                </div>
            </div>
            <div className='md:grid md:grid-cols-[1fr_3fr] mt-12 mx-auto md:gap-1 w-11/12 lg:w-10/12'>
                <div className={`
                    md:block
                    transition-all    
                    duration-300
                    ease-in-out 
                    shadow-xl
                    rounded-xl
                    h-fit
                    mb-9
                    w-11/12
                    mx-auto
                    will-change-transform
                    lg:min-h-[600px]
                    ${isFilterOpen ? "max-h-[500px] opacity-100 py-5 md:max-h-none md:w-full md:p-3 md:py-5 md: md:opacity-100 p-0 m-0" : "max-h-0 opacity-0 md:max-h-none md:w-full md:p-3 md:py-5  md:opacity-100 p-0 m-0"}
                `}
                style={{border: "1px solid #c5c5c5"}}
                >
                    <SideBar category={category} setCategory={setCategory} onClose={() => setIsFilterOpen(false)}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-fit gap-7 md:gap-5 mx-auto w-11/12 mb-12">
                    { error ? <div>{error}</div> : articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
            <div className='mt-auto overflow-x-hidden'>
                < Footer />
            </div>
        </div>
    )
}