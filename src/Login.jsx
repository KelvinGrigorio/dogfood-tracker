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

  // ... resto do componente
 
