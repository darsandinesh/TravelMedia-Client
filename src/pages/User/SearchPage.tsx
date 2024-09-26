import React from 'react'
import Navbar from '../../components/User/Home/NavBar/NavBar'
import Search from '../../components/User/Home/Search/Search'

const SearchPage = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <Search />
                </main>
            </div>      
        </div>
    )
}

export default SearchPage
