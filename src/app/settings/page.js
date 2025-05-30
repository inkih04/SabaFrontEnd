import { cookies } from 'next/headers';
import SettingsSection from "@/components/SettingsSection/SettingsSection";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <div>
      <h1 className="settings__title">Settings</h1>
      <SettingsSection model="status" type="Status" token={token} />
      <SettingsSection model="priorities" type="Priority" token={token} />
      <SettingsSection model="types" type="Type" token={token} />
      <SettingsSection model="severities" type="Severity" token={token} />
    </div>
  );
}