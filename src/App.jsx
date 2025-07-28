import { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import { ref as dbRef, onValue, set, push } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null);
  const [dogs, setDogs] = useState({});
const
 [showVerifyEmailNotice, setShowVerifyEmailNotice] = 
useState
(
false
);
  const [dogName, setDogName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  // Controle do login persistente e redirecionamento
  useEffect
(
() =>
 {
  
const
 unsubscribe = 
onAuthStateChanged
(auth, 
async
 (user) => {
    
if
 (user) {
      
await
 user.
reload
(); 
// força atualização dos dados

      
const
 refreshedUser = auth.
currentUser
;
      
setUser
(refreshedUser);

      
if
 (!refreshedUser.
emailVerified
) {
        
setShowVerifyEmailNotice
(
true
); 
// mostra aviso se não verificado

      }
    } 
else
 {
      
navigate
(
"/login"
);
    }
  });

  
return
 
() =>
 
unsubscribe
();
}, [navigate]);

  // Busca os dogs do usuário logado
  useEffect(() => {
    if (!user) return;
    const dogsRef = dbRef(db, `users/${user.uid}/dogs`);
    return onValue(dogsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDogs(data);
    });
  }, [user]);

  const addDog = () => {
    if (!dogName.trim()) return;
    const newDogRef = push(dbRef(db, `users/${user.uid}/dogs`));
    set(newDogRef, {
      name: dogName.trim(),
      lastFed: null,
    });
    setDogName("");
  };

  const feedDog = (dogId) => {
    const dogRef = dbRef(db, `users/${user.uid}/dogs/${dogId}`);
    set(dogRef, {
      ...dogs[dogId],
      lastFed: new Date().toISOString(),
    });
  };

  const timeSince = (dateString) => {
    const now = new Date();
    const last = new Date(dateString);
    const diff = Math.floor((now - last) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    if (hours >= 1) return `há ${hours}h`;
    if (minutes >= 1) return `há ${minutes}min`;
    return "agora mesmo";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold">Carregando doguinhos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-pink-500 flex flex-col items-center justify-start text-white px-4 py-6 sm:px-6 md:px-10 relative">
      
      {/* Botão sair discreto no topo direito */}
      <button
        onClick={handleLogout}
        title="Sair"
        className="absolute top-4 right-4 text-white hover:text-red-400 transition transform hover:scale-110 text-2xl sm:text-xl"
      >
        🚪
      </button>

{showVerifyEmailNotice && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md w-full text-center">
    <strong className="block font-bold mb-1">Confirmação pendente 📬</strong>
    <span>
      Verifique seu email para ativar todas as funcionalidades do Dogfood Tracker.
    </span>
    <button
      onClick={() => setShowVerifyEmailNotice(false)}
      className="mt-3 text-sm underline text-yellow-700 hover:text-yellow-900"
    >
      Fechar aviso
    </button>
  </div>
)}


      <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl px-6 py-8 sm:p-10 shadow-xl mt-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
          🐶 Controle de Ração
        </h1>

        {/* Input + botão adicionar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            className="flex-1 rounded-lg p-3 text-gray-900 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            type="text"
            placeholder="Nome do doguinho/gatinho"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
          />
          <button
            onClick={addDog}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg px-6 py-3 shadow-md transition duration-200 w-full sm:w-auto"
          >
            Adicionar
          </button>
        </div>

        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-yellow-300">
          {Object.entries(dogs).map(([id, dog]) => (
            <li
              key={id}
              className="bg-white bg-opacity-20 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-bold">{dog.name}</h2>
                <p className="text-sm text-yellow-100">
                  Última refeição: {dog.lastFed ? timeSince(dog.lastFed) : "Nunca"}
                </p>
              </div>
              <button
                onClick={() => feedDog(id)}
                className="bg-green-400 hover:bg-green-300 text-gray-900 font-bold px-5 py-2 rounded-lg shadow transition transform hover:scale-105"
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
