import { useAuth } from "../AuthContext";

function Index() {
    const { user, isLoading } = useAuth();

    // 💡 Prevent flash of "not authenticated" while the context bootstraps
    if (isLoading) {
        return <h1>Loading profile...</h1>;
    }

    if (!user) {
        return (
            <h1>Not authenticated</h1>
        );
    }

    return (
        // 💡 Fixed casing from 'fullname' to 'fullName'
        <h1>Welcome, {user.fullName || "User"}!</h1>
    );
}

export default Index;