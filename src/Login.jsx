import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./services/firebase";
import { useNavigate } from "react-router-dom";

// ⬇️ AQUI VAI A LISTA DOS EMAILS PERMITIDOS
const authorizedEmails = [
  "kelvingrigorio@gmail.com",
  "familia_grigorio@hotmail.com",
  "null",
  "null",
  "null"
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!authorizedEmails.includes(email)) {
      setErro("Acesso não autorizado.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/"); // redireciona pra home ou dashboard
    } catch (err) {
      setErro("Email ou senha incorretos.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
