import { useEffect } from "react";

const usePageTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | My Website`;
    }, [title]);
};

export default usePageTitle;