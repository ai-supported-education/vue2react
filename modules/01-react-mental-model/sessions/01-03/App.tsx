import { useState } from "react";

interface Profile {
  name: string;
  score: number;
}

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    name: "Ada",
    score: 0
  });

  function handleIncreaseScore() {
    profile.score += 1;
    setProfile(profile);
  }

  return (
    <section className="stack">
      <h1>{profile.name}</h1>
      <output aria-label="Score">{profile.score}</output>
      <button onClick={handleIncreaseScore}>Increase score</button>
    </section>
  );
}
