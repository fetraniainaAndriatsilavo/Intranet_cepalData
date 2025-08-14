import KanbanBoard from "./KanbanBoard";

export default function Projets() {
    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 w-full ">
            <div className="items-center justify-between flex flex-row mb-1">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-3"> Mes Projets </h1>
                <select className="rounded-lg border border-none"> 
                    <option value=""> Projets 1</option>
                    <option value=""> Projets 2</option>
                    <option value=""> Projets 3</option>
                    <option value=""> Projets 4</option>
                </select>
            </div>
            <hr />
        </div>
        <div className="w-full p-1">
            <KanbanBoard> </KanbanBoard>
        </div>
    </div>
}