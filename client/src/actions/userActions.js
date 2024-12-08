export async function register(formData) {
    try {
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        const res = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to register');
        }

        return { success: data, error: null };
    } catch (error) {
        return { success: null, error: error.message };
    }
}


export async function login(formData) {
    try {
        const email = formData.get('email');
        const password = formData.get('password');


        const res = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();


        if (!res.ok) {
            throw new Error(data.error || 'Failed to log in');
        }


        localStorage.setItem('token', data.token);


        return { success: data, error: null };
    } catch (error) {

        return { success: null, error: error.message };
    }
}





