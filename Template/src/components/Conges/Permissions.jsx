import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Alert, Autocomplete, TextField } from "@mui/material";
import { AppContext } from "../../context/AppContext";
import api from "../axios";
export default function Permissions({ radioValue }) {
  const { user } = useContext(AppContext)

  const [request_type, setRequestType] = useState();
  const [start_date, setStartDate] = useState("");
  const [start_half_day, setStart_half_day] = useState("morning");
  const [end_date, setEndDate] = useState("");
  const [end_half_day, setEnd_half_day] = useState("morning");
  const [number_day, setNumber_day] = useState(0);
  const [user_id, setUser_id] = useState(user.id);
  const [commentaire, setCommentaire] = useState('')


  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [permissionType, setPermissionType] = useState([])
  const [autres, setAutres] = useState([])
  const [leave_type_id, setLeave_type_id] = useState(0)

  useEffect(() => {
    setUser_id(user.id);
  }, [user]);

  useEffect(() => {
    if (start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);

      let total = 0;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
          total += 1;
        }
      }
      if (
        start_half_day === "afternoon" &&
        start.getDay() !== 0 &&
        start.getDay() !== 6
      ) {
        total -= 0.5;
      }

      if (
        end_half_day === "morning" &&
        end.getDay() !== 0 &&
        end.getDay() !== 6
      ) {
        total -= 0.5;
      }

      setNumber_day(total);
    }
  }, [start_date, end_date, start_half_day, end_half_day]); 

  // les types de permissions et autres
  const excludedNames = [
    'Congé payé',
    "Congé sans solde",
    "Hospitalisation d'un enfant",
    "Hospitalisation de conjoint",
    "Mises à pieds"
  ];

  useEffect(() => {
    api.get('/type/leave')
      .then((response) => {
        setPermissionType(response.data.filter(data => !excludedNames.includes(data.name)));
        setAutres(response.data.filter(data =>
          data.name === "Congé sans solde" ||
          data.name === "Hospitalisation d'un enfant" ||
          data.name === "Hospitalisation de conjoint" ||
          data.name === "Mises à pieds"
        ));
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(start_date) > new Date(end_date)) {
      alert("La date que vous aviez saisi est invalide !");
      return;
    } else {
      try {
        const payload = {
          user_id,
          request_type,
          start_date,
          start_half_day,
          end_date,
          end_half_day,
          number_day,
          commentaire,
          leave_type_id
        };

        const response = await api.post(
          '/leave-requests',
          payload
        );
        setEndDate("");
        setEnd_half_day("");
        setNumber_day(null);
        setRequestType("");
        setStartDate("");
        setStart_half_day("");
        setCommentaire('');
        setSuccess('Demande envoyée avec succès')
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  useEffect(() => {
    setRequestType(radioValue);
  }, [radioValue]);

  return (
    <div className="bg-white p-5 rounded-lg">
      <form onSubmit={handleSubmit}>
        {radioValue && (
          <div className="flex items-center justify-center">
            <span className="font-semibold text-center text-2xl">
              {
                radioValue === "leave"
                  ? "Congés"
                  : radioValue === "permission"
                    ? "Permissions"
                    : radioValue === "other"
                      ? "Autres"
                      : radioValue // fallback if no match
              }
            </span>
            <input type="text" value={radioValue} hidden readOnly />
          </div>
        )}

        {radioValue === "autres" && (
          <div>
            <label htmlFor="reason" className="mb-3">Type de permissions</label>
            <Autocomplete
              id="reason"
              disablePortal
              options={autres || []}
              getOptionLabel={(option) => option.name || ""}
              value={autres.find((opt) => opt.id)}
              onChange={(e, newValue) => setLeave_type_id(newValue?.id || null)}
              size="small"
              className="w-1/3 mt-3"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="classification"
                  variant="outlined"
                  label="Type de permission"
                />
              )}
            />
          </div>
        )}

        {radioValue === "permission" && (
          <div>
            <label htmlFor="reason" className="mb-3">Type de permissions</label>
            <Autocomplete
              id="reason"
              disablePortal
              options={permissionType || []}
              getOptionLabel={(option) => option.name || ""}
              value={permissionType.find((opt) => opt.id)}
              onChange={(e, newValue) => setLeave_type_id(newValue?.id || null)}
              size="small"
              className="w-1/3 mt-3"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="classification"
                  variant="outlined"
                  label="Type de permission"
                />
              )}
            />
          </div>
        )}
        <div className="flex lg:flex-row md:flex-col gap-5 justify-center xs:flex-col sm:flex-col sm:gap-5">
          <div className="mt-3 mb-3">
            <label
              htmlFor="date_debut"
              className="block mb-2 text-sm font-medium"
            >
              Date de Début
            </label>
            <div className="flex items-center justify-start gap-4">
              <input
                type="date"
                id="date_debut"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5"
              />
              <select
                value={start_half_day}
                onChange={(e) => setStart_half_day(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-[150px] p-2.5"
              >
                <option value="morning">Matin</option>
                <option value="afternoon">Après-midi</option>
              </select>
            </div>
          </div>

          <div className="mt-3 mb-3">
            <label htmlFor="date_fin" className="block mb-2 text-sm font-medium">
              Date de Fin
            </label>
            <div className="flex items-center justify-start gap-4">
              <input
                type="date"
                id="date_fin"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5"
              />
              <select
                value={end_half_day}
                onChange={(e) => setEnd_half_day(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-[150px] p-2.5"
              >
                <option value="morning">Matin</option>
                <option value="afternoon"> Après-midi</option>
              </select>
            </div>
          </div>

        </div>

        <div className="mt-3">
          <span> Nombre de Jours : </span>{" "}
          <span className="font-semibold"> {number_day} </span>
        </div>

        <div className="mt-4 mb-4 flex flex-col ">
          <label htmlFor="reason" className="mb-2">
            Motif / Commentaire
          </label>
          <textarea
            name="reason"
            id="reason"
            rows="2"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="block p-2.5 w-2/3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-3"
            placeholder="Ajoutez un commentaire pour appuyer votre demande..."
          ></textarea>
        </div>

        <div className="mt-2 mb-2">
          {
            success && <Alert severity="success">T {success}</Alert>
          }
          {
            error && <Alert severity="error">{error}</Alert>
          }
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="p-3 text-white text-lg rounded-lg bg-sky-500 hover:bg-sky-600 cursor-pointer"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
}
