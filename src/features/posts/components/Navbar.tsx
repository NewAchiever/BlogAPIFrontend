import { useEffect, useState } from 'react';
import { Heart,Bookmark } from 'lucide-react';
interface NavbarProps{
    handleSave: () => void;
    handleLike: () => void;
    title: string;
    isSaved: boolean | undefined;
    isLiked: boolean | undefined;
    likes: number;
    author: string;
}


export function Navbar({handleSave, handleLike, title, isSaved, isLiked, likes, author}:NavbarProps) {
    const [showFixedNavbar, setShowFixedNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowFixedNavbar(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* New Fixed Navbar */}
            {showFixedNavbar && (
                <nav className="fixed top-0 left-0 z-50 w-full  bg-white p-2 px-6 shadow-lg">
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row items-end'>
                            <span className="text-xl sm:text-4xl font-extrabold text-slate-900  leading-tight">
                            {title}
                            </span>
                            <div>
                                <sub className=''> by 
                                <span className='italic capitalize'> {author}</span>
                            </sub>
                            </div>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <button
                                onClick={handleSave}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                                isSaved
                                    ? 'bg-rose-50 text-rose-600 font-medium'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                <span>{isSaved ? 'Saved' : 'Save' }</span>
                            </button>
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
                                isLiked
                                    ? 'bg-rose-50 text-rose-600 font-medium'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span>{likes} Likes</span>
                            </button>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}