import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./services/firebase";
import { useNavigate } from "react-router-dom";

// ... (estilos permanecem os mesmos)
const styles = {
  // ... mesmo conteúdo de estilos que você já mandou
  container: { /* ... */ },
  card: { /* ... */ },
  title: { /* ... */ },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  inputWrapper: { position: "relative", width: "100%" },
  input: { padding: "0.75rem 2.5rem 0.75rem 0.75rem", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem", width: "100%" },
  togglePassword: { position: "absolute", top: "50%", right: "0.75rem", transform: "translateY(-50%)", cursor: "pointer", fontSize: "1.1rem", color: "#888", userSelect: "none" },
  button: { padding: "0.75rem", borderRadius: "8px", border: "none", backgroundColor: "#4CAF50", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", transition: "background 0.3s ease" },
  error: { color: "red", marginTop: "0.5rem", textAlign: "center" },
  message: { color: "green", marginTop: "0.5rem", textAlign: "center" },
  toggleText: { fontSize: "0.9rem", color: "#4CAF50", textAlign: "center", marginTop: "1rem", cursor: "pointer", textDecoration: "underline" },
  forgotPassword: { fontSize: "0.85rem", color: "#2196F3", cursor: "pointer", textAlign: "right", marginTop: "-0.5rem", marginBottom: "1rem", userSelect: "none" },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [message, setMessage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMessage(null);

    if (!email || (!senha && !isResettingPassword)) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (isResettingPassword) {
        await sendPasswordResetEmail(auth, email);
        setMessage("Email de recuperação enviado!");
        setIsResettingPassword(false);
        return;
      }

      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        await sendEmailVerification(userCredential.user);
        setMessage("Conta criada! Verifique seu email.");
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }

      navigate("/");
    } catch (err) {
      setErro("Erro: " + err.message);
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

          {!isResettingPassword && (
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          )}

          {!isRegistering && !isResettingPassword && (
            <p
              style={styles.forgotPassword}
              onClick={() => {
                setErro(null);
                setMessage(null);
                setIsResettingPassword(true);
              }}
            >
              Esqueci minha senha
            </p>
          )}

          {isResettingPassword && (
            <p
              style={{
                fontSize: "0.85rem",
                color: "#555",
                textAlign: "center",
                marginTop: "-0.5rem",
              }}
            >
              Insira seu e-mail para recuperar a senha.
            </p>
          )}

          <button type="submit" style={styles.button}>
            {isResettingPassword
              ? "Recuperar senha"
              : isRegistering
              ? "Cadastrar"
              : "Entrar"}
          </button>

          {(erro || message) && (
            <p style={erro ? styles.error : styles.message}>
              {erro || message}
            </p>
          )}
        </form>

        {!isResettingPassword && (
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
        )}

        {isResettingPassword && (
          <p
            style={styles.toggleText}
            onClick={() => {
              setErro(null);
              setMessage(null);
              setIsResettingPassword(false);
            }}
          >
            Voltar para login
          </p>
        )}
      </div>
    </div>
  );
}
