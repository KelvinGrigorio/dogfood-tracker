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

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f4f4",
    padding: "1rem",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "1.5rem",
    textAlign: "center",
    fontSize: "1.8rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.3s ease",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
    textAlign: "center",
  }
};


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
  <div style={styles.container}>
    <div style={styles.card}>
      <h1 style={styles.title}>Dogfood Tracker 🐾</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Entrar</button>
        {erro && <p style={styles.error}>{erro}</p>}
      </form>
    </div>
  </div>
);

}
