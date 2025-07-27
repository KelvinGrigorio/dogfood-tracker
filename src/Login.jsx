import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./services/firebase";
import { useNavigate } from "react-router-dom";

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
  },
  message: {
    color: "green",
    marginTop: "0.5rem",
    textAlign: "center",
  },
  toggleText: {
    fontSize: "0.9rem",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: "1rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
  forgotPassword: {
    fontSize: "0.85rem",
    color: "#2196F3",
    cursor: "pointer",
    textAlign: "right",
    marginTop: "-0.5rem",
    marginBottom: "1rem",
    userSelect: "none",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [message, setMessage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMessage(null);

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        await sendEmailVerification(userCredential.user);
        setMessage("Conta criada com sucesso! Verifique seu email.");
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      navigate("/");
    } catch (err) {
      setErro(
        isRegistering
          ? "Erro ao criar conta: " + err.message
          : "Email ou senha incorretos."
      );
    }
  };

  const handleResetPassword = async () => {
    setErro(null);
    setMessage(null);

    if (!email) {
      setErro("Por favor, insira o email para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err) {
      setErro("Erro ao enviar email: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dogfood Tracker 🐾</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
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
          {!isRegistering && (
            <p style={styles.forgotPassword} onClick={handleResetPassword}>
              Esqueci minha senha
            </p>
          )}
          <button type="submit" style={styles.button}>
            {isRegistering ? "Cadastrar" : "Entrar"}
          </button>
          {erro && <p style={styles.error}>{erro}</p>}
          {message && <p style={styles.message}>{message}</p>}
        </form>
        <p
          style={styles.toggleText}
          onClick={() => {
            setErro(null);
            setMessage(null);
            setIsRegistering(!isRegistering);
          }}
        >
          {isRegistering
            ? "Já tem conta? Faça login aqui"
            : "Ainda não tem conta? Crie uma aqui"}
        </p>
      </div>
    </div>
  );
}
