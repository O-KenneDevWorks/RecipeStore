import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { updateProfile } from '../api/authAPI';
import RecipeSelect from '../components/RecipeSelect';
import '../Styling/Profile.css';

const SORT_OPTIONS = [
    { value: 'alpha-asc',  label: 'A → Z' },
    { value: 'alpha-desc', label: 'Z → A' },
    { value: 'newest',     label: 'Newest first' },
    { value: 'oldest',     label: 'Oldest first' },
];

const DENSITY_OPTIONS = [
    { value: 'normal',  label: 'Normal' },
    { value: 'compact', label: 'Compact' },
];

const loadPref = (key: string, fallback: string) =>
    localStorage.getItem(`pref_${key}`) ?? fallback;

const savePref = (key: string, value: string) =>
    localStorage.setItem(`pref_${key}`, value);

const Profile = () => {
    const { user, accessToken } = useAuth();
    const { theme, setTheme } = useTheme();

    // ── Account info ──────────────────────────────────────────────────────
    const [info, setInfo] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
    const [infoMsg, setInfoMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [infoLoading, setInfoLoading] = useState(false);

    const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleInfoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setInfoLoading(true);
        setInfoMsg(null);
        try {
            const updated = await updateProfile({ name: info.name, email: info.email }, accessToken!);
            localStorage.setItem('user', JSON.stringify(updated));
            setInfoMsg({ text: 'Profile updated.', ok: true });
        } catch (err: any) {
            setInfoMsg({ text: err.message ?? 'Update failed.', ok: false });
        } finally {
            setInfoLoading(false);
        }
    };

    // ── Password ──────────────────────────────────────────────────────────
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [pwLoading, setPwLoading] = useState(false);

    const handlePwChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPw(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePwSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPwMsg(null);
        if (pw.next !== pw.confirm) {
            setPwMsg({ text: 'New passwords do not match.', ok: false });
            return;
        }
        if (pw.next.length < 6) {
            setPwMsg({ text: 'New password must be at least 6 characters.', ok: false });
            return;
        }
        setPwLoading(true);
        try {
            await updateProfile({ currentPassword: pw.current, newPassword: pw.next }, accessToken!);
            setPw({ current: '', next: '', confirm: '' });
            setPwMsg({ text: 'Password changed.', ok: true });
        } catch (err: any) {
            setPwMsg({ text: err.message ?? 'Password change failed.', ok: false });
        } finally {
            setPwLoading(false);
        }
    };

    // ── Preferences ───────────────────────────────────────────────────────
    const [sortOrder, setSortOrder] = useState(() => loadPref('sortOrder', 'alpha-asc'));
    const [density, setDensity] = useState(() => loadPref('density', 'normal'));

    const handleSortOrder = (val: string) => { setSortOrder(val); savePref('sortOrder', val); };
    const handleDensity = (val: string) => { setDensity(val); savePref('density', val); };
    const handleTheme = (val: string) => { setTheme(val === '__default__' ? '' : val); };

    return (
        <div className="profile-page">
            <h1>Profile</h1>

            {/* ── Account Info ── */}
            <section className="profile-section">
                <h2>Account Info</h2>
                <form onSubmit={handleInfoSubmit} className="profile-form">
                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={info.name}
                            onChange={handleInfoChange}
                            required
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={info.email}
                            onChange={handleInfoChange}
                            required
                        />
                    </label>
                    {infoMsg && (
                        <p className={`profile-msg ${infoMsg.ok ? 'ok' : 'err'}`}>{infoMsg.text}</p>
                    )}
                    <button type="submit" disabled={infoLoading}>
                        {infoLoading ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>
            </section>

            {/* ── Change Password ── */}
            <section className="profile-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePwSubmit} className="profile-form">
                    <label>
                        Current Password
                        <input
                            type="password"
                            name="current"
                            value={pw.current}
                            onChange={handlePwChange}
                            required
                        />
                    </label>
                    <label>
                        New Password
                        <input
                            type="password"
                            name="next"
                            value={pw.next}
                            onChange={handlePwChange}
                            required
                        />
                    </label>
                    <label>
                        Confirm New Password
                        <input
                            type="password"
                            name="confirm"
                            value={pw.confirm}
                            onChange={handlePwChange}
                            required
                        />
                    </label>
                    {pwMsg && (
                        <p className={`profile-msg ${pwMsg.ok ? 'ok' : 'err'}`}>{pwMsg.text}</p>
                    )}
                    <button type="submit" disabled={pwLoading}>
                        {pwLoading ? 'Saving…' : 'Change Password'}
                    </button>
                </form>
            </section>

            {/* ── Preferences ── */}
            <section className="profile-section">
                <h2>Preferences</h2>
                <div className="profile-prefs">
                    <div className="pref-row">
                        <label>Theme</label>
                        <RecipeSelect
                            value={theme || '__default__'}
                            onChange={handleTheme}
                            options={THEMES.map(t => ({
                                value: t.value || '__default__',
                                label: t.label,
                            }))}
                        />
                    </div>

                    <div className="pref-row">
                        <label>Default Recipe Sort</label>
                        <RecipeSelect
                            value={sortOrder}
                            onChange={handleSortOrder}
                            options={SORT_OPTIONS}
                        />
                    </div>

                    <div className="pref-row">
                        <label>Recipe Card Density</label>
                        <RecipeSelect
                            value={density}
                            onChange={handleDensity}
                            options={DENSITY_OPTIONS}
                        />
                    </div>
                </div>
            </section>

            {/* ── Account Details ── */}
            <section className="profile-section profile-meta">
                <h2>Account Details</h2>
                <dl>
                    <dt>Member since</dt>
                    <dd>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd>
                </dl>
            </section>
        </div>
    );
};

export default Profile;
