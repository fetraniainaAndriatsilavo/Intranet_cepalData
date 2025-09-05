import React, { useState, useContext, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { matchPath, useLocation } from 'react-router-dom';
import TermsOfUse from './Parametres/TermOfUse';
import Reinitialisation from './Parametres/Reinitialisation';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import Informations from './Ma Fiche/Informations';
import Conges from './Mes Conges/Conges';
import Validation from './Mes Conges/Validation';
import ListeConges from './OGC/ListeConges';
import Etats from './OGC/Etats';
import Collaborateur from './Collaborateur/Collaborateur';
import ListesUtilisateurs from './Collaborateur/ListesUtilisateurs';
import ModifCollaborateurs from './Collaborateur/ModifCollaborateurs';
import UploadDocument from './Collaborateur/UploadDocument';
import Createprojet from '../components/Projets/create/Createprojet';
import Notifications from './Mes Notifications/Notifications';
import ListTimeSheet from './Mes Feuilles de Temps/ListTimesheet';
import TeamTimesheet from './Mes Feuilles de Temps/TeamTimesheet';
import AllTimesheet from './Admin Feuille de Temps/AllTimesheet';
import ListSessions from './Admin Feuille de Temps/ListSessions';
import Projets from './Mes Projets/Projets';
import Social from './Social/Social';
import Group from './Social/Groups/Group';
import ListEvent from './Social/Events/ListEvent';
import MessagesPage from './Messagerie/MessagePage';

import { PulseLoader } from "react-spinners";
import api from '../components/axios';
import { AppContext } from '../context/AppContext';
import { Snackbar } from '@mui/material';
import ProfilUitlisateur from './Ma Fiche/ProfilUtilisateur';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { pathname } = location;

  const [instantNotif, setInstantNotif] = useState(null)


  // data user 
  const [isLoaded, setIsLoaded] = useState(true)
  const [project, setProject] = useState(null);
  const [contracts, setContracts] = useState({ label: [], value: [] });
  const [departements, setDepartements] = useState({ label: [], value: [] });
  const [roles, setRoles] = useState({ label: [], value: [] });
  const [leaveBalance, setLeaveBalance] = useState(0)
  const [permBalance, setPermBalance] = useState(0)



  const fetchUser = (id) => {
    api.get('/dashboard/overview/' + id)
      .then((response) => {
        setIsLoaded(true)
        const { by_role, by_department, by_contract, projects } = response.data.data;

        setLeaveBalance(response.data.data.user.ogc_leav_bal ? response.data.data.user.ogc_leav_bal : 0)
        setPermBalance(response.data.data.user.ogc_perm_bal ? response.data.data.user.ogc_perm_bal : 0)

        setRoles({
          label: by_role.map(item => item.code),
          value: by_role.map(item => item.users_count)
        });

        setDepartements({
          label: by_department.map(item => item.departement_name),
          value: by_department.map(item => item.total)
        });

        setContracts({
          label: by_contract.map(item => item.code),
          value: by_contract.map(item => item.users_count)
        });

        setProject(projects);

        console.log("Success:", response.data.success);
        console.log("Projects:", projects);
        setIsLoaded(false)
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchUserInformation = (id) => {
    api.get('/user/' + id + '/info')
      .then((response) => {
        setLeaveBalance(response.data.user.ogc_leav_bal)
        setPermBalance(response.data.user.ogv_perm_bal)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (user?.id) {
      fetchUserInformation(user.id)
      fetchUser(user.id);
    }
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setLoading={setLoading} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {pathname === '/accueil' && (
              <>
                {/* Dashboard actions */}
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                  {/* Left: Title */}
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
                  </div>

                  {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <FilterButton align="right" />
                    <Datepicker align="right" />
                    <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                      <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="max-xs:sr-only">Add View</span>
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-8 gap-6">
                  <DashboardCard01 title={'Soldes Congés'} soldes={leaveBalance} />
                  <DashboardCard01 title={'Soldes Permissions'} soldes={permBalance} />
                  <DashboardCard07 title={'Projet en cours'} tasks={project || []} />
                </div>
              </>
            )}

            {pathname === '/cgu' && <TermsOfUse />}
            {pathname === '/reinit' && <Reinitialisation />}
            {pathname === '/mesconges' && <Conges />}
            {pathname === '/mesvalidations' && <Validation />}
            {pathname === '/listeconges' && <ListeConges />}
            {pathname === '/etats' && <Etats />}
            {pathname === '/ajout-utilisateur' && <Collaborateur />}
            {pathname === '/liste-utilisateur' && <ListesUtilisateurs />}
            {pathname === '/mesinformations' && <Informations />}
            {matchPath('/modif-utilisateur/:id', pathname) && <ModifCollaborateurs />}
            {matchPath('/profil-utilisateur/:UserId', pathname) && <ProfilUitlisateur />}
            {pathname === '/documents-utilisateurs' && <UploadDocument />}
            {pathname === '/list-timesheet' && <ListTimeSheet />}
            {pathname === '/equipe-timesheet' && <TeamTimesheet />}
            {pathname === '/all-timesheet' && <AllTimesheet />}
            {pathname === '/messessions' && <ListSessions />}
            {pathname === '/mesnotifications' && <Notifications />}
            {pathname === '/creer-projet' && <Createprojet />}
            {pathname === '/mesprojets' && <Projets />}
            {pathname === '/social' && <Social />}
            {matchPath('/social/groups/:id', pathname) && <Group />}
            {pathname === '/calendar' && <ListEvent />}
            {pathname === '/messagerie' && <MessagesPage setInstantNotif={setInstantNotif} />}

            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
                <PulseLoader color="#0369a1" size={15} aria-label="Loading Spinner" data-testid="loader" />
              </div>
            )}


            {
              instantNotif && <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={!!instantNotif}
                message={
                  '@' + instantNotif.sender_name + " vous a envoyé une message :" + instantNotif.content
                }
                autoHideDuration={4000}
              />
            }
          </div>
        </main>
      </div >
    </div >
  );
}

export default Dashboard;
