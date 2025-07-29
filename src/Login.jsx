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
  /* ...seu styles de antes... */
  forgotPassword: {
    fontSize: "0.85rem",
    color: "#2196F3",
    cursor: "pointer",
    textAlign: "right",
    marginTop: "-0.5rem",
    marginBottom: "1rem",
    userSelect: "none",
  },
  resetEmailWrapper: {
    marginBottom: "1rem",
  },
  resetEmailInput: {
    padding: "0.5rem",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  resetButton: {
    padding: "0.5rem",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2196F3",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
  message: {
    color: "green",
    marginTop: "0.5rem",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
    textAlign: "center",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [message, setMessage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showResetEmail, setShowResetEmail] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
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

    if (!resetEmail) {
      setErro("Por favor, insira o email para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.");
      setShowResetEmail(false); // fecha o toggle depois de enviar
      setResetEmail("");
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
            <>
              <p
                style={styles.forgotPassword}
                onClick={() => {
                  setShowResetEmail(!showResetEmail);
                  setErro(null);
                  setMessage(null);
                }}
              >
                Esqueci minha senha
              </p>

              {showResetEmail && (
                <div style={styles.resetEmailWrapper}>
                  <input
                    type="email"
                    placeholder="Digite seu email para recuperar a senha"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    style={styles.resetEmailInput}
                  />
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    style={styles.resetButton}
                  >
                    Enviar recuperação
                  </button>
                </div>
              )}
            </>
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
            setShowResetEmail(false);
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
