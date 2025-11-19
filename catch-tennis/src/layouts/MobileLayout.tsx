import {Outlet} from 'react-router-dom';


const MobileLayout = () => {
    return (
        <div className="
            flex justify-center items-center
            w-full h-full
            bg-neutral-200
            ">
            <div className="
                flex flex-col relative
                w-full h-full

                sm:w-[480px]
                sm:h-[calc(100dvh-1rem)]
                bg-background shadow-sm
                py-sm
                px-md
            ">
                <main className="
                    flex-1
                    overflow-y-auto
                    scrollbar-hide
                    min-h-0
                ">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default MobileLayout;