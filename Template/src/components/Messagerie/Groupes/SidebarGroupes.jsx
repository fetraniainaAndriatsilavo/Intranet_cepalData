import { useState } from "react";
import GroupCard from "./GroupCard";

export default function SidebarGroupes({ setSelectedGroupChat, setSelectedConversation, setSelectedNewConversation, allGroup }) {
    const [searchGroup, setSearchGroup] = useState('')

    const filteredGroup = allGroup.filter((group) => {
        const groupName = group.name?.toLowerCase() || "";
        return (
            groupName.includes(searchGroup.toLowerCase())
        );
    });

    return <>
        <div className="flex items-center justify-center">
            <div className="relative w-full">
                <input
                    className="pl-10 pr-4 border-0 bg-gray-50 text-sm text-center h-[50px] w-full"
                    placeholder="Recherchez des groupes"
                    value={searchGroup}
                    onChange={(e) => {
                        setSearchGroup(e.target.value)
                    }}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </span>
            </div>

        </div>
        {
            searchGroup && <span className="text-center flex items-center justify-center mt-1 mb-1 italic text-sm"> Nous avons trouvé : {filteredGroup ? filteredGroup.length : ''} groupe(s) </span>
        }
        <ul>
            {(() => {
                if (!allGroup || allGroup.length === 0) return null;

                const groupsToRender =
                    searchGroup && filteredGroup.length > 0 ? filteredGroup : !searchGroup ? allGroup : [];

                if (searchGroup && groupsToRender.length === 0) {
                    return null;
                }

                if (!searchGroup && groupsToRender.length === 0) {
                    return (
                        <li className="flex text-sm text-center items-center justify-center mt-3">
                            Aucune discussion de groupe n’est disponible pour le moment.
                        </li>
                    )
                }

                return groupsToRender.map((group) => (
                    <li
                        key={group.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between"
                    >
                        <GroupCard
                            data={group}
                            setSelectedConversation={setSelectedConversation}
                            setSelectedGroupChat={setSelectedGroupChat}
                            setSelectedNewConversation={setSelectedNewConversation}
                        />
                    </li>
                ));
            })()}
        </ul>
    </>
}