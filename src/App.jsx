import { useState, useEffect } from "react";
import { db, auth } from "./services/firebase";
import { ref as dbRef, onValue, set } from "firebase/database";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null);
  const [dogs, setDogs] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  // Garante que o login anônimo seja persistente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Erro no login anônimo:", error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Busca os dogs fixos após o login
  useEffect(() => {
    if (!user) return;
    const dogsRef = dbRef(db, `dogs`);
    onValue(dogsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDogs(data);
    });
  }, [user]);

  const feedDog = (dogId) => {
    const dogRef = dbRef(db, `dogs/${dogId}`);
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

  // Enquanto o user não estiver disponível, exibe tela de loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg font-semibold">Carregando doguinhos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white px-4 py-6 sm:px-6 md:px-10 relative">
      
      {/* BOTÃO SAIR */}
      <button
        onClick={handleLogout}
        title="Sair"
        className="absolute top-4 right-4 text-white hover:text-red-400 transition transform hover:scale-110 text-2xl sm:text-xl"
      >
        🚪
      </button>

      <div className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl px-6 py-8 sm:p-10 shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
          🐶 Controle de Ração
        </h1>

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
