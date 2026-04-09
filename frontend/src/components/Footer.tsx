import { Diamond } from "lucide-react"


export function Footer() {
    return (
        <footer className="bg-white py-10 text-center border mt-40" style={{marginInline: "auto", backgroundColor: "#FCFCFC", borderColor: "#cfcfcf"}}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-11/12 lg:w-10/12 mx-auto lg:py-8">
                <div className="mx-auto">
                    <div className="flex justify-center mb-4 gap-2 md:gap-0 lg:gap-3">
                        <div style={{backgroundColor: "#3899FA", padding: "3px", borderRadius: "6px"}} className="h-fit">
                            <Diamond color="white" size={24}/>
                        </div>
                        <div className="text-base items-center flex font-bold justify-between " style={{color: "#3899FA"}}>Knowledge Base</div>
                    </div>
                    <div className="opacity-50 text-sm font-semibold">
                        The ultimate knowledge sharing platform for teams and individuals to grow together.
                    </div>
                    <div className="flex gap-5 mt-5 justify-center">
                        <div>
                            <img src="./../../assets/icons/twitter.svg" alt=""  className="h-6"/>
                        </div>
                        <div>
                            <img src="./../../assets/icons/git.svg" alt="" className="h-6"/>
                        </div>
                        <div>
                            <img src="./../../assets/icons/linkedin.svg" alt="" className="h-6"/>
                        </div>
                    </div>
                </div>
                <div className="opacity-50 flex flex-col justify-center text-sm">
                    <div className="mb-3 opacity-100 font-bold text-base">Platform</div>
                    <div>Latest Articles</div>
                    <div>Top Authors</div>
                    <div>Reading List</div>
                </div>
                <div className="opacity-50 flex flex-col justify-center text-sm">
                    <div  className="mb-3 opacity-100 font-bold text-base">Support</div>
                    <div>Latest Articles</div>
                    <div>Guidelines</div>
                    <div>Reading List</div>
                </div>
                <div className="opacity-50 flex flex-col justify-center text-sm">
                    <div  className="mb-3 opacity-100 font-bold text-base">Platform</div>
                    <div>Help Center</div>
                    <div>Top Authors</div>
                    <div>API Docs</div>
                </div>
            </div>
        </footer>
    )
}