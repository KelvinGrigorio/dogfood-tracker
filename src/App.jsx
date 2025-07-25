import { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import { ref, onValue, set, push } from "firebase/database";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function App() {
  const [user, setUser] = useState(null);
  const [dogs, setDogs] = useState({});
  const [dogName, setDogName] = useState("");
const navigate = useNavigate();

const handleLogout = () => {
  signOut(auth).then(() => {
    navigate("/login");
  });
};


  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const dogsRef = ref(db, `users/${user.uid}/dogs`);
      onValue(dogsRef, (snapshot) => {
        const data = snapshot.val() || {};
        setDogs(data);
      });
    }
  }, [user]);

  const addDog = () => {
    if (!dogName) return;
    const newDogRef = push(ref(db, `users/${user.uid}/dogs`));
    set(newDogRef, {
      name: dogName,
      lastFed: null,
    });
    setDogName("");
  };

  const feedDog = (dogId) => {
    const dogRef = ref(db, `users/${user.uid}/dogs/${dogId}`);
    set(dogRef, {
      ...dogs[dogId],
      lastFed: new Date().toISOString(),
    });
  };

  return (
    <div className=
"min-h-screen bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white p-6"
>
      <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
<button
  onClick={handleLogout}
  className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
>
  Sair
</button>
	    🐶 Controle de Ração
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            className="flex-1 rounded-lg p-3 text-gray-900 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="text"
            placeholder="Nome do doguinho"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
          />
          <button
            onClick={addDog}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg px-6 py-3 shadow-md transition duration-200"
          >
            Adicionar
          </button>
        </div>

        <ul className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300">
          {Object.entries(dogs).map(([id, dog]) => (
            <li
              key={id}
              className="bg-white bg-opacity-20 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-bold">{dog.name}</h2>
                <p className="text-sm text-yellow-100">
                  Última refeição:{" "}
                  {dog.lastFed
                    ? new Date(dog.lastFed).toLocaleString()
                    : "Nunca"}
                </p>
              </div>
              <button
                onClick={() => feedDog(id)}
                className="bg-green-400 hover:bg-green-300 text-gray-900 font-bold px-5 py-2 rounded-lg shadow transition"
              >
                Alimentar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
