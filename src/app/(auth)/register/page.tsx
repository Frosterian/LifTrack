import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Créer un compte</h1>
      <p className="mb-6 text-sm text-text-muted">
        Rejoins LifTrack pour suivre tes séances et progresser.
      </p>
      <RegisterForm />
    </div>
  );
}
