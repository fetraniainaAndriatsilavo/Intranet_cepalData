import { useContext, useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";
import { PulseLoader } from "react-spinners";
import CreateTask from "../../components/Projets/create/CreateTask";

export default function Projets() {
    const { user } = useContext(AppContext)
    const [projectList, setProjectList] = useState([])

    const [activeProject, setActiveProject] = useState(0)

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const [columns, setColumns] = useState([]);


    const fetchProjectList = (userId) => {
        setLoading(true)
        api.get('/getProject/' + userId)
            .then((response) => {
                setLoading(false)
                setProjectList(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchProjectUserList = (userId) => {
        setLoading(true)
        api.get('/users/' + userId + '/tasks')
            .then((response) => {
                setLoading(false)
                setProjectList(response.data.projects)
            })
            .catch((error) => {
                console.log(error)
            })
    } 

    const fetchTaskProject = (projectId) => {
        api.get('/getTaches/' + projectId)
            .then((response) => {
                const tasks = response.data.tasks;

                // Define fixed columns
                const fixedColumns = [
                    { title: "To-Do", cards: [] },
                    { title: "In-Progress", cards: [] },
                    { title: "Review", cards: [] },
                    { title: "Deploy", cards: [] },
                    { title: "Done", cards: [] }
                ];

                // Distribute tasks into columns
                tasks.forEach(task => {
                    const status = task.status || "To-Do";
                    const column = fixedColumns.find(c => c.title === status);
                    if (column) {
                        column.cards.push(task);
                    }
                });

                setColumns(fixedColumns);
            })
            .catch((error) => {
                console.log(error.response?.data?.message || error.message);
            });
    };

    useEffect(() => {
        if (user && user.role != 'user') {
            fetchProjectList(user.id)
        }else {
            fetchProjectUserList(user.id) 
        }
    }, [user])

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center w-full p-6 h-full">
        <div className="mb-4 sm:mb-0 w-full">
            <div className="items-center justify-between flex flex-row mb-1">
                <div className="flex flex-row gap-3">
                    {/* <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-3"> Mes Projets </h1>  */}
                    {
                        projectList && projectList.length > 0 && <select className="transparent border-none rounded-lg" value={activeProject} onChange={(e) => {
                            setActiveProject(Number(e.target.value))
                        }} >
                            <option value={0}> Mes Projets </option>
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
                <div>
                    {
                        user.role != 'user' && (activeProject || activeProject != 0) && <button className='p-2 border flex justify-center cursor-pointer rounded-lg bg-sky-600 text-white' onClick={() => {
                            setOpen(true);
                        }}>
                            Ajouter une tâche
                        </button>
                    }
                </div>
            </div>
            <hr />
        </div>

        <div className="w-full">
            {
                loading ? (
                    <div className="flex items-center justify-center">
                        <PulseLoader
                            color="#1a497f"
                            loading={loading}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : activeProject !== 0 ? (
                    <KanbanBoard project={activeProject} columns={columns || []} setColumns={setColumns} />
                ) : (
                    <span className="flex italic text-xl items-center justify-center">
                        Aucun projet n’est disponible pour le moment. Sélectionnez un projet pour accéder aux fonctionnalités.
                    </span>
                )
            }
        </div>
        {/* Modals */}
        <CreateTask
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            projectId={activeProject}
            fetchTaskProject={fetchTaskProject}
            setColumns={setColumns}
        />
    </div>
}