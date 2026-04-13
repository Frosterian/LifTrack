import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Connexion</h1>
      <p className="mb-6 text-sm text-text-muted">
        Reçois un lien magique par email pour te connecter sans mot de passe.
      </p>
      <LoginForm />
    </div>
  );
}
