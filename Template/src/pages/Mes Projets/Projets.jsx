import { useContext, useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";

export default function Projets() {
    const { user } = useContext(AppContext)
    const [projectList, setProjectList] = useState([])
    const [activeProject, setActiveProject] = useState(0)

    const fetchProjectList = (userId) => {
        api.get('/getProject/' + userId)
            .then((response) => {
                setProjectList(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchProjectList(user.id)
    }, [user])

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 w-full ">
            <div className="items-center justify-between flex flex-row mb-1">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-3"> Mes Projets </h1>
                {
                    projectList && projectList.length > 0 && <select className="rounded-lg border border-none" value={activeProject} onChange={(e) => {
                        setActiveProject(Number(e.target.value))
                        // if (e.target.value != 0) {
                        //     alert(Number(e.target.value))
                        // }
                    }} >
                        <option value={0}>  Aucune </option>
                        {
                            projectList && projectList.map((project) => {
                                return (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                );
                            })
                        }
                    </select>
                }
            </div>
            <hr />
        </div>
        <div className="w-full p-1">
            {
                activeProject != 0 ? <KanbanBoard project={activeProject}> </KanbanBoard>
                    : <span className="flex italic text-xl items-center justify-center "> Aucun projet n’est disponible pour le moment. Sélectionnez un projet pour accéder aux fonctionnalités.  </span>
            }
        </div>
    </div>
}