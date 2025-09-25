import React, { useState, useContext, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { matchPath, useLocation } from 'react-router-dom';
import TermsOfUse from './Parametres/TermOfUse';
import Reinitialisation from './Parametres/Reinitialisation';
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
import MesDemandes from './Mes Conges/MesDemandes';
import MesDocuments from './Ma Fiche/MesDocuments';
import Changeprofil from './Parametres/Changeprofil';


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { pathname } = location;

  const [instantNotif, setInstantNotif] = useState(null)


  // data user 
  const [isLoaded, setIsLoaded] = useState(null)
  const [project, setProject] = useState(null);
  const [contracts, setContracts] = useState({ label: [], value: [] });
  const [departements, setDepartements] = useState({ label: [], value: [] });
  const [roles, setRoles] = useState({ label: [], value: [] });
  const [leaveBalance, setLeaveBalance] = useState(0)
  const [permBalance, setPermBalance] = useState(0)
  const [person, setPerson] = useState({
    label: [],
    value: []
  })

  const fetchUser = (id) => {
    setIsLoaded(true)
    api.get('/dashboard/overview/' + id)
      .then((response) => {
        console.log(response.data)
        const by_role = response.data.data.by_role;
        const by_department = response.data.data.by_department;
        const by_contract = response.data.data.by_contract;
        const projects = response.data.data.projects

        const value = []

        setLeaveBalance(response.data.data.user.ogc_leav_bal !== null ? response.data.data.user.ogc_leav_bal : 0)
        setPermBalance(response.data.data.user.ogc_perm_bal !== null ? response.data.data.user.ogc_perm_bal : 0)

        setRoles({
          label: by_role.map(item => item.role),
          value: by_role.map(item => item.total_users)
        });

        setDepartements({
          label: by_department.map(item => item.department_name),
          value: by_department.map(item => item.total)
        });

        setContracts({
          label: by_contract.map(item => item.code),
          value: by_contract.map(item => item.users_count)
        });

        setProject(projects);

        value.push(by_department.reduce((sum, item) => sum + item.male, 0))
        value.push(by_department.reduce((sum, item) => sum + item.female, 0))

        setPerson({
          label: ['Homme', 'Femme'],
          value: value ? value : []
        })
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => {
        setIsLoaded(false)
      });
  };

  useEffect(() => {
    if (user?.id) {
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

                {/* Dashboard Layout */}
                <div className="grid grid-cols-12 gap-4">
                  <DashboardCard01 className="col-span-6 lg:col-span-3" title={'Solde de congés'} soldes={leaveBalance} />
                  <DashboardCard01 className="col-span-6 lg:col-span-3" title={'Solde de permissions'} soldes={permBalance} />
                  <DashboardCard01 className="col-span-6 lg:col-span-3" title={'Autres'} soldes={permBalance} />

                  {isLoaded === false && (
                    <>
                      <DashboardCard06 className="col-span-3 lg:col-span-3" title={'Répartition par rôles'} labels={roles.label} value={roles.value} />
                      <DashboardCard06 className="col-span-3 lg:col-span-3" title={'Répartition par services'} labels={departements.label} value={departements.value} />
                      <DashboardCard06 className="col-span-3 lg:col-span-3" title={'Status contractuels'} labels={contracts.label} value={contracts.value} />
                      <DashboardCard06 className="col-span-3 lg:col-span-3" title={'Identités de genre'} labels={person.label} value={person.value} />
                    </>
                  )}
                  {
                    project && project.length > 0 && <DashboardCard07 className="col-span-12" title={'Projets actifs'} tasks={project || []} />
                  }
                </div>
              </>
            )}

            {pathname === '/cgu' && <TermsOfUse />}
            {pathname === '/reinit' && <Reinitialisation />}
            {pathname == '/changeprofile' && <Changeprofil />}
            {pathname === '/mesconges' && <Conges />}
            {pathname === '/mesvalidations' && <Validation />}
            {pathname === '/meslists' && <MesDemandes />}
            {pathname === '/listeconges' && <ListeConges />}
            {pathname === '/etats' && <Etats />}
            {pathname === '/ajout-utilisateur' && <Collaborateur />}
            {pathname === '/liste-utilisateur' && <ListesUtilisateurs />}
            {pathname === '/mesinformations' && <Informations />}
            {pathname === '/mesdocuments' && <MesDocuments />}
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
