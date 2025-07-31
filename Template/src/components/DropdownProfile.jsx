import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Avatar } from '@mui/material';
import api from './axios';

function DropdownProfile({
  align
}) {
  const { user } = useContext(AppContext)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('')


  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });


  function splitName(firstname, lastname) {
    return firstname.charAt(0).toUpperCase() + "" + lastname.charAt(0).toUpperCase()
  }

  const Deconnecter = async () => {
    try {
      await api.post('/logout');
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      const message = error?.response?.data?.message || 'Erreur lors de la déconnexion';
      console.error(message);
      setError(message);
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <Avatar> {user ? splitName(user.first_name, user.last_name) : splitName('Utilisateur', '1')} </Avatar>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white"> {user ? user.last_name + " " + user.first_name : 'Utilisateur'} </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100"> {user ? user.first_name : 'Utilisateur'} </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">Administrator</div>
          </div>
          {
            user && <ul>
              <li>
                <Link
                  className="font-medium text-sm text-sky-500 hover:text-sky-600 dark:hover:text-sky-600 flex items-center py-1 px-3"
                  to="/reinit"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Paramètres
                </Link>
              </li>
              <li>
                <Link
                  className="font-medium text-sm text-sky-500 hover:text-sky-600 dark:hover:text-sky-600 flex items-center py-1 px-3"
                  // to="/"
                  onClick={(e) => {
                    e.preventDefault()
                    setDropdownOpen(!dropdownOpen)
                    Deconnecter()
                  }}
                >
                  Se Déconnecter
                </Link>
              </li>
            </ul>
          }
        </div>
      </Transition>
    </div>
  )
}

export default DropdownProfile;